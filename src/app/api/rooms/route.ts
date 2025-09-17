import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { RoomGetErrorResponse, RoomGetResponse } from '@/lib/types'

export async function GET() {
  try {
    const rooms = await prisma.room.findMany({
      orderBy: { name: 'asc' }
    })

    return NextResponse.json<RoomGetResponse>({
      success: true,
      data: rooms
    })
  } catch (error) {
    console.error('Error fetching rooms:', error)
    return NextResponse.json<RoomGetErrorResponse>(
      {
        success: false,
        error: 'Failed to fetch rooms'
      },
      { status: 500 }
    )
  }
}