import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const rooms = await prisma.room.findMany({
      orderBy: { name: 'asc' }
    })

    return NextResponse.json({
      success: true,
      data: rooms
    })
  } catch (error) {
    console.error('Error fetching rooms:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch rooms'
      },
      { status: 500 }
    )
  }
}