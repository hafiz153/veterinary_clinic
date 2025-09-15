import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const vets = await prisma.vet.findMany({
      orderBy: { name: 'asc' }
    })

    return NextResponse.json({
      success: true,
      data: vets
    })
  } catch (error) {
    console.error('Error fetching vets:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch veterinarians'
      },
      { status: 500 }
    )
  }
}