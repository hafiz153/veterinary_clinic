import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Create vets
  const vet1 = await prisma.vet.create({
    data: {
      name: "Dr. Sarah Johnson",
      email: "sarah.johnson@vetclinic.com",
      phone: "+1234567890",
    },
  });

  const vet2 = await prisma.vet.create({
    data: {
      name: "Dr. Mike Chen",
      email: "mike.chen@vetclinic.com",
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

  // Create owners
  const owner1 = await prisma.owner.create({
    data: {
      name: "John Smith",
      email: "john.smith@email.com",
      phone: "+1987654321",
    },
  });

  const owner2 = await prisma.owner.create({
    data: {
      name: "Emily Davis",
      email: "emily.davis@email.com",
      phone: "+1987654322",
    },
  });

  const owner3 = await prisma.owner.create({
    data: {
      name: "Robert Wilson",
      email: "robert.wilson@email.com",
      phone: "+1987654323",
    },
  });

  // Create pets
  const pet1 = await prisma.pet.create({
    data: {
      name: "Buddy",
      species: "Dog",
      breed: "Golden Retriever",
      ownerId: owner1.id,
    },
  });

  const pet2 = await prisma.pet.create({
    data: {
      name: "Whiskers",
      species: "Cat",
      breed: "Persian",
      ownerId: owner2.id,
    },
  });

  const pet3 = await prisma.pet.create({
    data: {
      name: "Max",
      species: "Dog",
      breed: "German Shepherd",
      ownerId: owner3.id,
    },
  });

  // Create appointments for today
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const appointment1 = await prisma.appointment.create({
    data: {
      petName: pet1.name,
      ownerName: owner1.name,
      type: "Vaccination",
      status: "pending",
      duration: 30,
      startAt: new Date(today.getTime() + 9 * 60 * 60 * 1000), // 9 AM
      endAt: new Date(today.getTime() + 9.5 * 60 * 60 * 1000), // 9:30 AM
      vetId: vet1.id,
      roomId: room1.id,
      ownerId: owner1.id,
      petId: pet1.id,
      notes: "Annual vaccination checkup",
    },
  });

  const appointment2 = await prisma.appointment.create({
    data: {
      petName: pet2.name,
      ownerName: owner2.name,
      type: "Checkup",
      status: "completed",
      duration: 45,
      startAt: new Date(today.getTime() + 10 * 60 * 60 * 1000), // 10 AM
      endAt: new Date(today.getTime() + 10.75 * 60 * 60 * 1000), // 10:45 AM
      vetId: vet2.id,
      roomId: room2.id,
      ownerId: owner2.id,
      petId: pet2.id,
      notes: "Regular health checkup",
    },
  });

  const appointment3 = await prisma.appointment.create({
    data: {
      petName: pet3.name,
      ownerName: owner3.name,
      type: "Surgery",
      status: "pending",
      duration: 120,
      startAt: new Date(today.getTime() + 14 * 60 * 60 * 1000), // 2 PM
      endAt: new Date(today.getTime() + 16 * 60 * 60 * 1000), // 4 PM
      vetId: vet1.id,
      roomId: room3.id,
      ownerId: owner3.id,
      petId: pet3.id,
      notes: "Spay surgery",
    },
  });

  console.log("Database seeded successfully!");
  console.log({
    vet1,
    vet2,
    room1,
    room2,
    room3,
    owner1,
    owner2,
    owner3,
    pet1,
    pet2,
    pet3,
    appointment1,
    appointment2,
    appointment3,
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
