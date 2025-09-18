# Veterinary Appointments Manager

A modern Next.js application for managing veterinary clinic appointments with conflict detection, real-time updates, and a clean, professional interface.

## Features

- ✅ **Appointments Management**: View, add, edit, and delete appointments
- ✅ **Conflict Detection**: Prevents overlapping appointments for vets and rooms and time.
- ✅ **No Past Dates**:  Only future appointments allowed
- ✅ **Real-time Status Updates**: Mark appointments as pending, completed, or cancelled
- ✅ **Search & Filter**: Filter by status, type, or search by pet/owner names
- ✅ **Professional UI**: Clean Tailwind CSS design suitable for veterinary clinics
- ✅ **TypeScript**: Full type safety throughout the application
- ✅ **Error Handling**: Comprehensive error handling with user feedback

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: MySQL with Prisma ORM
- **UI**: Tailwind CSS with custom components
- **Forms**: React Hook Form with Zod validation
- **Language**: TypeScript

## Setup Instructions

### Prerequisites

- Node.js installed
- MySQL database server running
- Git

### 1. Clone and Install

```bash
git clone https://github.com/hafiz153/veterinary_clinic
cd veterinary_clinic
yarn
```

### 2. Database Configuration

1. Create a MySQL database named `veterinary_clinic`
2. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
3. Update the `DATABASE_URL` in `.env` with your MySQL credentials:
   ```
   DATABASE_URL="mysql://username:password@localhost:3306/veterinary_clinic"   (if Authentication ebabled)
   DATABASE_URL="mysql://root:@localhost:3306/veterinary_clinic"   (if Authentication not ebabled)
   ```

### 3. Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Run migrations to create tables
npx prisma db push

# Seed the database with sample data
yarn db:seed
```

### 4. Start Development Server

```bash
yarn dev
```

The application will be available at `http://localhost:3000`

## Database Schema

The application uses the following main entities:

- **Appointment**: Core appointment data with scheduling info
- **Vet**: Veterinarian information
- **Room**: Examination room details

## API Endpoints

- `GET /api/appointments` - List appointments (with date filtering)
- `POST /api/appointments` - Create new appointment
- `GET /api/appointments/[id]` - Get single appointment
- `PATCH /api/appointments/[id]` - Update appointment
- `DELETE /api/appointments/[id]` - Delete appointment
- `GET /api/vets` - List veterinarians
- `GET /api/rooms` - List rooms

## Key Features Implementation

### Conflict Detection

The system prevents scheduling conflicts by checking for overlapping appointments when the same vet or room is assigned at same time. This is implemented in the API layer with comprehensive time range checking.

In a nutshell: 
❌ Conflict cases:


Same Vet + Same Room + Same Time….


Same Vet + Different Room + Same Time…


Different Vet + Same Room + Same Time….
✅ Eligible cases:


Same Vet + Same Room + Different Time…
Same Vet + Different Room + Different Time…
Different Vet + Same Room + Different Time…


Different Vet + Different Room + Same Time


Different Vet + Different Room + Different Time


### Search and Filtering

Users can search appointments by pet name, owner name, or appointment type. Additional filters allow filtering by appointment status and type.

### Status Management

Appointments can be quickly updated between pending, completed, and cancelled states with one-click actions.

## Development Tools Used

This project was developed with assistance from AI tools including:

- **Claude (Anthropic)**: For code generation, architecture planning, and debugging
- **GitHub Copilot**: For code completion and suggestions
- **ChatGPT**: For specific problem-solving and optimization

## Available Scripts

```bash
yarn dev          # Start development server
yarn build        # Build for production
yarn start        # Start production server
yarn lint         # Run ESLint
yarn db:push      # Push schema changes to database
yarn db:migrate   # Run database migrations
yarn db:seed      # Seed database with sample data
yarn db:studio    # Open Prisma Studio
```

## Project Structure

```
├── app/
│   ├── api/              # API routes
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Homepage
├── components/           # React components
│   ├── ui/              # Reusable UI components
│   ├── AppointmentCard.tsx
│   └── AppointmentModal.tsx
├── lib/                 # Utilities and configurations
│   ├── db.ts           # Prisma client
│   ├── types.ts        # TypeScript types
│   └── utils.ts        # Helper functions
├── prisma/
│   ├── schema.prisma   # Database schema
│   └── seed.ts         # Database seeding script
└── ...config files
```

## Production Deployment

1. Set up a production MySQL database
2. Update the `DATABASE_URL` environment variable
3. Run database migrations: `npx prisma db push`
4. Build the application: `yarn build`
5. Start the production server: `yarn start`

## License

This project is created for educational/assessment purposes.
