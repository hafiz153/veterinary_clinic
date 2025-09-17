import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { UpdateAppointmentSchema } from "@/lib/types";
import type {
  AppointmentDetailResponse,
  AppointmentDetailErrorResponse,
  AppointmentUpdateResponse,
  AppointmentUpdateErrorResponse,
  AppointmentDeleteResponse,
  AppointmentDeleteErrorResponse,
  // Appointment,
} from "@/lib/types"; // ⬅️ adjust path if needed
import { Appointment } from "@prisma/client";

// =======================
// GET /appointments/:id
// =======================
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<
  NextResponse<AppointmentDetailResponse | AppointmentDetailErrorResponse>
> {
  try {
    const appointment = await prisma.appointment.findUnique({
      where: { id: params.id },
      include: {
        vet: { select: { id: true, name: true } },
        room: { select: { id: true, name: true } },
      },
    });

    if (!appointment) {
      return NextResponse.json<AppointmentDetailErrorResponse>(
        { success: false, error: "Appointment not found" },
        { status: 404 }
      );
    }

    return NextResponse.json<AppointmentDetailResponse>({
      success: true,
      data: { ...appointment, notes: appointment.notes ?? undefined },
    });
  } catch (error) {
    console.error("Error fetching appointment:", error);
    return NextResponse.json<AppointmentDetailErrorResponse>(
      { success: false, error: "Failed to fetch appointment" },
      { status: 500 }
    );
  }
}

// =======================
// PATCH /appointments/:id
// =======================
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<
  NextResponse<AppointmentUpdateResponse | AppointmentUpdateErrorResponse>
> {
  try {
    const body = await request.json();

    // ✅ Partial update (status only)
    if (Object.keys(body).length === 1 && body.status) {
      const appointment: Appointment = await prisma.appointment.update({
        where: { id: params.id },
        data: { status: body.status },
        include: {
          vet: { select: { id: true, name: true } },
          room: { select: { id: true, name: true } },
        },
      });

      return NextResponse.json<AppointmentUpdateResponse>({
        success: true,
        data: { ...appointment, notes: appointment.notes as string },
      });
    }

    // ✅ Full update with validation
    const validatedData = UpdateAppointmentSchema.parse({
      ...body,
      id: params.id,
    });

    let updateData: Partial<Appointment> = {
      petName: validatedData.petName,
      ownerName: validatedData.ownerName,
      type: validatedData.type,
      status: validatedData.status,
      notes: validatedData.notes,
      duration: validatedData.duration,
    } as Partial<Appointment>;

    // Handle datetime
    if (validatedData.startAt) {
      const startAt = new Date(validatedData.startAt);
      const endAt = new Date(
        startAt.getTime() + (validatedData.duration || 30) * 60 * 1000
      );

      updateData.startAt = startAt;
      updateData.endAt = endAt;

      // Conflict check (excluding current appointment)
      if (validatedData.vetId || validatedData.roomId) {
        const conflicts = await prisma.appointment.findMany({
          where: {
            AND: [
              { id: { not: params.id } },
              {
                OR: [
                  {
                    AND: [
                      { startAt: { lte: startAt } },
                      { endAt: { gt: startAt } },
                    ],
                  },
                  {
                    AND: [
                      { startAt: { lt: endAt } },
                      { endAt: { gte: endAt } },
                    ],
                  },
                  {
                    AND: [
                      { startAt: { gte: startAt } },
                      { endAt: { lte: endAt } },
                    ],
                  },
                ],
              },
              {
                OR: [
                  validatedData.vetId ? { vetId: validatedData.vetId } : {},
                  validatedData.roomId ? { roomId: validatedData.roomId } : {},
                ],
              },
              { status: { not: "cancelled" } },
            ],
          },
          include: { vet: true, room: true },
        });

        if (conflicts.length > 0) {
          const conflict = conflicts[0];
          return NextResponse.json<AppointmentUpdateErrorResponse>(
            {
              success: false,
              error: `Scheduling conflict detected. ${
                conflict.vet?.name || "The selected vet"
              } or ${
                conflict.room?.name || "the selected room"
              } is already booked from ${conflict.startAt.toLocaleTimeString()} to ${conflict.endAt.toLocaleTimeString()}.`,
            },
            { status: 409 }
          );
        }
      }
    }

    // Handle vet/room
    if (validatedData.vetId !== undefined) {
      updateData.vetId = validatedData.vetId;
    }
    if (validatedData.roomId !== undefined) {
      updateData.roomId = validatedData.roomId;
    }

    const appointment: Appointment = await prisma.appointment.update({
      where: { id: params.id },
      data: updateData,
      include: {
        vet: { select: { id: true, name: true } },
        room: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json<AppointmentUpdateResponse>({
      success: true,
      data: { ...appointment, notes: appointment.notes as string },
    });
  } catch (error: any) {
    console.error("Error updating appointment:", error);

    if (error.name === "ZodError") {
      return NextResponse.json<AppointmentUpdateErrorResponse>(
        { success: false, error: "Invalid appointment data provided" },
        { status: 400 }
      );
    }

    return NextResponse.json<AppointmentUpdateErrorResponse>(
      { success: false, error: "Failed to update appointment" },
      { status: 500 }
    );
  }
}

// =======================
// DELETE /appointments/:id
// =======================
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<
  NextResponse<AppointmentDeleteResponse | AppointmentDeleteErrorResponse>
> {
  try {
    await prisma.appointment.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      success: true,
      message: "Appointment deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting appointment:", error);

    if (error.message.includes("Record to delete does not exist")) {
      return NextResponse.json(
        { success: false, error: "Appointment not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Failed to delete appointment" },
      { status: 500 }
    );
  }
}
