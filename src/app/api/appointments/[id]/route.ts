import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { UpdateAppointmentSchema } from '@/lib/types'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const appointment = await prisma.appointment.findUnique({
      where: { id: params.id },
      include: {
        vet: {
          select: { id: true, name: true }
        },
        room: {
          select: { id: true, name: true }
        },
        owner: {
          select: { id: true, name: true }
        },
        pet: {
          select: { id: true, name: true }
        }
      }
    })

    if (!appointment) {
      return NextResponse.json(
        {
          success: false,
          error: 'Appointment not found'
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: appointment
    })
  } catch (error) {
    console.error('Error fetching appointment:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch appointment'
      },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    
    // If we're just updating status, allow partial update
    if (Object.keys(body).length === 1 && body.status) {
      const appointment = await prisma.appointment.update({
        where: { id: params.id },
        data: { status: body.status },
        include: {
          vet: {
            select: { id: true, name: true }
          },
          room: {
            select: { id: true, name: true }
          }
        }
      })

      return NextResponse.json({
        success: true,
        data: appointment
      })
    }

    // For full updates, validate the data
    const validatedData = UpdateAppointmentSchema.parse({ ...body, id: params.id })
    
    let updateData: any = {
      petName: validatedData.petName,
      ownerName: validatedData.ownerName,
      type: validatedData.type,
      status: validatedData.status,
      notes: validatedData.notes,
      duration: validatedData.duration,
    }

    // Handle datetime updates
    if (validatedData.startAt) {
      const startAt = new Date(validatedData.startAt)
      const endAt = new Date(startAt.getTime() + (validatedData.duration || 30) * 60 * 1000)
      
      updateData.startAt = startAt
      updateData.endAt = endAt

      // Check for conflicts if vet or room is specified (excluding current appointment)
      if (validatedData.vetId || validatedData.roomId) {
        const conflicts = await prisma.appointment.findMany({
          where: {
            AND: [
              { id: { not: params.id } }, // Exclude current appointment
              {
                OR: [
                  {
                    AND: [
                      { startAt: { lte: startAt } },
                      { endAt: { gt: startAt } }
                    ]
                  },
                  {
                    AND: [
                      { startAt: { lt: endAt } },
                      { endAt: { gte: endAt } }
                    ]
                  },
                  {
                    AND: [
                      { startAt: { gte: startAt } },
                      { endAt: { lte: endAt } }
                    ]
                  }
                ]
              },
              {
                OR: [
                  validatedData.vetId ? { vetId: validatedData.vetId } : {},
                  validatedData.roomId ? { roomId: validatedData.roomId } : {}
                ]
              },
              {
                status: { not: 'cancelled' }
              }
            ]
          },
          include: {
            vet: true,
            room: true
          }
        })

        if (conflicts.length > 0) {
          const conflict = conflicts[0]
          return NextResponse.json(
            {
              success: false,
              error: `Scheduling conflict detected. ${conflict.vet?.name || 'The selected vet'} or ${conflict.room?.name || 'the selected room'} is already booked from ${conflict.startAt.toLocaleTimeString()} to ${conflict.endAt.toLocaleTimeString()}.`
            },
            { status: 409 }
          )
        }
      }
    }

    // Handle resource assignments
    if (validatedData.vetId !== undefined) {
      updateData.vetId = validatedData.vetId || null
    }
    if (validatedData.roomId !== undefined) {
      updateData.roomId = validatedData.roomId || null
    }

    const appointment = await prisma.appointment.update({
      where: { id: params.id },
      data: updateData,
      include: {
        vet: {
          select: { id: true, name: true }
        },
        room: {
          select: { id: true, name: true }
        },
        owner: {
          select: { id: true, name: true }
        },
        pet: {
          select: { id: true, name: true }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: appointment
    })
  } catch (error) {
    console.error('Error updating appointment:', error)
    
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid appointment data provided'
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update appointment'
      },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.appointment.delete({
      where: { id: params.id }
    })

    return NextResponse.json({
      success: true,
      message: 'Appointment deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting appointment:', error)
    
    if (error instanceof Error && error.message.includes('Record to delete does not exist')) {
      return NextResponse.json(
        {
          success: false,
          error: 'Appointment not found'
        },
        { status: 404 }
      )
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete appointment'
      },
      { status: 500 }
    )
  }
}