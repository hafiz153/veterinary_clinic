import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { CreateAppointmentSchema } from "@/lib/types";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "2");

    // Validate pagination parameters
    const currentPage = Math.max(1, page);
    const pageSize = Math.max(1, Math.min(100, limit)); // Max 100 items per page
    const skip = (currentPage - 1) * pageSize;

    let whereCondition = {};

    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setUTCHours(0, 0, 0, 0);

      const endOfDay = new Date(date);
      endOfDay.setUTCHours(23, 59, 59, 999);

      whereCondition = {
        startAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
      };
      console.log({ date, startOfDay, endOfDay });
    }

    // Get total count for pagination
    const totalCount = await prisma.appointment.count({
      where: whereCondition,
    });

    // Get paginated appointments
    const appointments = await prisma.appointment.findMany({
      where: whereCondition,
      include: {
        vet: {
          select: { id: true, name: true },
        },
        room: {
          select: { id: true, name: true },
        },
        owner: {
          select: { id: true, name: true },
        },
        pet: {
          select: { id: true, name: true },
        },
      },
      orderBy: {
        startAt: "asc",
      },
      skip,
      take: pageSize,
    });

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / pageSize);
    const hasNextPage = currentPage < totalPages;
    const hasPreviousPage = currentPage > 1;

    return NextResponse.json({
      success: true,
      data: appointments,
      pagination: {
        currentPage,
        totalPages,
        totalCount,
        pageSize,
        hasNextPage,
        hasPreviousPage,
      },
    });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch appointments",
      },
      { status: 500 }
    );
  }
}
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = CreateAppointmentSchema.parse(body);

    // Parse the startAt datetime
    const startAt = new Date(validatedData.startAt);
    const endAt = new Date(
      startAt.getTime() + validatedData.duration * 60 * 1000
    );

    // Check if the appointment date is in the past
    const now = new Date();
    if (startAt < now) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Cannot schedule appointments in the past. Please select a future date and time.",
        },
        { status: 400 }
      );
    }

    // Optional: Check if appointment is too far in the future (e.g., 1 year)
    const oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
    if (startAt > oneYearFromNow) {
      return NextResponse.json(
        {
          success: false,
          error: "Cannot schedule appointments more than 1 year in advance.",
        },
        { status: 400 }
      );
    }

    // Check for conflicts if vet or room is specified
    if (validatedData.vetId || validatedData.roomId) {
      const conflicts = await prisma.appointment.findMany({
        where: {
          AND: [
            {
              OR: [
                {
                  AND: [
                    { startAt: { lte: startAt } },
                    { endAt: { gt: startAt } },
                  ],
                },
                {
                  AND: [{ startAt: { lt: endAt } }, { endAt: { gte: endAt } }],
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
            {
              status: { not: "cancelled" },
            },
          ],
        },
        include: {
          vet: true,
          room: true,
        },
      });

      if (conflicts.length > 0) {
        const conflict = conflicts[0];
        return NextResponse.json(
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

    const appointment = await prisma.appointment.create({
      data: {
        petName: validatedData.petName,
        ownerName: validatedData.ownerName,
        type: validatedData.type,
        status: validatedData.status,
        notes: validatedData.notes,
        duration: validatedData.duration,
        startAt,
        endAt,
        vetId: validatedData.vetId || null,
        roomId: validatedData.roomId || null,
      },
      include: {
        vet: {
          select: { id: true, name: true },
        },
        room: {
          select: { id: true, name: true },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: appointment,
    });
  } catch (error) {
    console.error("Error creating appointment:", error);

    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid appointment data provided",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to create appointment",
      },
      { status: 500 }
    );
  }
}
