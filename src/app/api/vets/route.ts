import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { VetGetErrorResponse, VetGetResponse } from '@/lib/types'

export async function GET() {
  try {
    const vets = await prisma.vet.findMany({
      orderBy: { name: 'asc' }
    })

    return NextResponse.json<VetGetResponse>({
      success: true,
      data: vets
    })
  } catch (error) {
    console.error('Error fetching vets:', error)
    return NextResponse.json<VetGetErrorResponse>(
      {
        success: false,
        error: 'Failed to fetch veterinarians'
      },
      { status: 500 }
    )
  }
}