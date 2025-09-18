import {
  PrismaClient,
  AppointmentType,
  AppointmentStatus,
} from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Create vets
  const vet1 = await prisma.vet.create({
    data: {
      name: "Dr. Sarah Johnson",
      phone: "+1234567890",
    },
  });

  const vet2 = await prisma.vet.create({
    data: {
      name: "Dr. Mike Chen",
      phone: "+1234567891",
    },
  });

  // Create rooms
  const room1 = await prisma.room.create({
    data: {
      name: "Exam Room 1",
      location: "First Floor",
    },
  });

  const room2 = await prisma.room.create({
    data: {
      name: "Exam Room 2",
      location: "First Floor",
    },
  });

  const room3 = await prisma.room.create({
    data: {
      name: "Surgery Room",
      location: "Second Floor",
    },
  });

  // Create appointments for today
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  await prisma.appointment.create({
    data: {
      petName: "pet1",
      ownerName: "owner1",
      type: AppointmentType.checkup,
      status: AppointmentStatus.pending,
      duration: 30,
      startAt: new Date(today.getTime() + 9 * 60 * 60 * 1000), // 9 AM
      endAt: new Date(today.getTime() + 9.5 * 60 * 60 * 1000), // 9:30 AM
      vetId: vet1.id,
      roomId: room1.id,
      notes: "Annual vaccination checkup",
    },
  });

  await prisma.appointment.create({
    data: {
      petName: "pet2",
      ownerName: "owner2",
      type: AppointmentType.vaccination,
      status: AppointmentStatus.completed,
      duration: 45,
      startAt: new Date(today.getTime() + 10 * 60 * 60 * 1000), // 10 AM
      endAt: new Date(today.getTime() + 10.75 * 60 * 60 * 1000), // 10:45 AM
      vetId: vet2.id,
      roomId: room2.id,
      notes: "Regular health checkup",
    },
  });

  await prisma.appointment.create({
    data: {
      petName: "pet3",
      ownerName: "owner3",
      type: AppointmentType.surgery,
      status: AppointmentStatus.cancelled,
      duration: 120,
      startAt: new Date(today.getTime() + 14 * 60 * 60 * 1000), // 2 PM
      endAt: new Date(today.getTime() + 16 * 60 * 60 * 1000), // 4 PM
      vetId: vet1.id,
      roomId: room3.id,
      notes: "Spay surgery",
    },
  });
  await prisma.appointment.create({
    data: {
      petName: "pet4",
      ownerName: "owner4",
      type: AppointmentType.dental,
      status: AppointmentStatus.pending,
      duration: 120,
      startAt: new Date(today.getTime() + 15 * 60 * 60 * 1000), // 2 PM
      endAt: new Date(today.getTime() + 17 * 60 * 60 * 1000), // 4 PM
      vetId: vet1.id,
      roomId: room3.id,
      notes: "Spay surgery",
    },
  });

  await prisma.appointment.create({
    data: {
      petName: "pet5",
      ownerName: "owner5",
      type: AppointmentType.emergency,
      status: AppointmentStatus.pending,
      duration: 120,
      startAt: new Date(today.getTime() + 16 * 60 * 60 * 1000), // 2 PM
      endAt: new Date(today.getTime() + 17 * 60 * 60 * 1000), // 4 PM
      vetId: vet1.id,
      roomId: room3.id,
      notes: "Spay surgery",
    },
  });
  await prisma.appointment.create({
    data: {
      petName: "pet6",
      ownerName: "owner6",
      type: AppointmentType.grooming,
      status: AppointmentStatus.pending,
      duration: 120,
      startAt: new Date(today.getTime() + 17 * 60 * 60 * 1000), // 2 PM
      endAt: new Date(today.getTime() + 17 * 60 * 60 * 1000 + 30), // 4 PM
      vetId: vet1.id,
      roomId: room3.id,
      notes: "Spay surgery",
    },
  });

  await prisma.appointment.create({
    data: {
      petName: "pet6",
      ownerName: "owner6",
      type: AppointmentType.dental,
      status: AppointmentStatus.pending,
      duration: 120,
      startAt: new Date(today.getTime() + 17 * 60 * 60 * 1000 + 30), // 2 PM
      endAt: new Date(today.getTime() + 18 * 60 * 60 * 1000), // 4 PM
      vetId: vet1.id,
      roomId: room3.id,
      notes: "Spay surgery",
    },
  });
  await prisma.appointment.create({
    data: {
      petName: "pet7",
      ownerName: "owner7",
      type: AppointmentType.surgery,
      status: AppointmentStatus.pending,
      duration: 120,
      startAt: new Date(today.getTime() + 18 * 60 * 60 * 1000), // 2 PM
      endAt: new Date(today.getTime() + 18 * 60 * 60 * 1000 + 30), // 4 PM
      vetId: vet1.id,
      roomId: room3.id,
      notes: "Spay surgery",
    },
  });

  await prisma.appointment.create({
    data: {
      petName: "pet8",
      ownerName: "owner8",
      type: AppointmentType.emergency,
      status: AppointmentStatus.pending,
      duration: 120,
      startAt: new Date(today.getTime() + 18 * 60 * 60 * 1000 + 30), // 2 PM
      endAt: new Date(today.getTime() + 19 * 60 * 60 * 1000), // 4 PM
      vetId: vet1.id,
      roomId: room3.id,
      notes: "Spay surgery",
    },
  });

  await prisma.appointment.create({
    data: {
      petName: "pet8",
      ownerName: "owner8",
      type: AppointmentType.surgery,
      status: AppointmentStatus.pending,
      duration: 120,
      startAt: new Date(today.getTime() + 19 * 60 * 60 * 1000), // 2 PM
      endAt: new Date(today.getTime() + 19 * 60 * 60 * 1000 + 30), // 4 PM
      vetId: vet1.id,
      roomId: room3.id,
      notes: "Spay surgery",
    },
  });
  await prisma.appointment.create({
    data: {
      petName: "pet9",
      ownerName: "owner9",
      type: AppointmentType.vaccination,
      status: AppointmentStatus.pending,
      duration: 120,
      startAt: new Date(today.getTime() + 19 * 60 * 60 * 1000 + 30), // 2 PM
      endAt: new Date(today.getTime() + 20 * 60 * 60 * 1000), // 4 PM
      vetId: vet1.id,
      roomId: room3.id,
      notes: "Spay surgery",
    },
  });
  await prisma.appointment.create({
    data: {
      petName: "pet10",
      ownerName: "owner10",
      type: AppointmentType.surgery,
      status: AppointmentStatus.pending,
      duration: 120,
      startAt: new Date(today.getTime() + 20 * 60 * 60 * 1000), // 2 PM
      endAt: new Date(today.getTime() + 20 * 60 * 60 * 1000 + 30), // 4 PM
      vetId: vet1.id,
      roomId: room3.id,
      notes: "Spay surgery",
    },
  });
  await prisma.appointment.create({
    data: {
      petName: "pet11",
      ownerName: "owner11",
      type: AppointmentType.surgery,
      status: AppointmentStatus.pending,
      duration: 120,
      startAt: new Date(today.getTime() + 20 * 60 * 60 * 1000 + 30), // 2 PM
      endAt: new Date(today.getTime() + 21 * 60 * 60 * 1000), // 4 PM
      vetId: vet1.id,
      roomId: room3.id,
      notes: "Spay surgery",
    },
  });

  console.log("✅ Database seeded successfully!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Seeding error:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
