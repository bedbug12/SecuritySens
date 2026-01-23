// import { NextResponse } from 'next/server';
// import { getServerSession } from 'next-auth';
// import { authOptions } from '@/lib/auth';
// import { prisma } from '@/lib/prisma';

// export async function POST(request: Request) {
//   try {
//     const session = await getServerSession(authOptions);

//     if (!session?.user?.id) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//     }

//     const { 
//       gameId, 
//       score, 
//       questionsAnswered, 
//       correctAnswers, 
//       hintsUsed, 
//       timeSpent 
//     } = await request.json();

//     const progress = await prisma.progress.findUnique({
//       where: { userId: session.user.id },
//       select: { id: true },
//     });

//     if (!progress) {
//       return NextResponse.json(
//         { error: 'Progress not found' },
//         { status: 404 }
//       );
//     }

//     const gameScore = await prisma.gameScore.upsert({
//       where: {
//         userId_gameId: {
//           userId: session.user.id,
//           gameId,
//         },
//       },
//       create: {
//         userId: session.user.id,
//         progressId: progress.id,
//         gameId,
//         score,
//         questionsAnswered,
//         correctAnswers,
//         hintsUsed,
//         timeSpent: timeSpent ?? 0,
//       },
//       update: {
//         score,
//         questionsAnswered,
//         correctAnswers,
//         hintsUsed,
//         timeSpent: timeSpent ?? 0,
//         completedAt: new Date(),
//       },
//     });

//     return NextResponse.json(gameScore);
//   } catch (error) {
//     console.error('Error saving game score:', error);
//     return NextResponse.json(
//       { error: 'Internal server error' },
//       { status: 500 }
//     );
//   }
// }

// export async function GET(request: Request) {
//   try {
//     const session = await getServerSession(authOptions);

//     if (!session?.user?.id) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//     }

//     const { searchParams } = new URL(request.url);
//     const gameId = searchParams.get('gameId');

//     if (!gameId) {
//       return NextResponse.json(
//         { error: 'Game ID is required' },
//         { status: 400 }
//       );
//     }

//     const gameScore = await prisma.gameScore.findUnique({
//       where: {
//         userId_gameId: {
//           userId: session.user.id,
//           gameId,
//         },
//       },
//     });

//     return NextResponse.json(gameScore || { score: null });
//   } catch (error) {
//     console.error('Error fetching game score:', error);
//     return NextResponse.json(
//       { error: 'Internal server error' },
//       { status: 500 }
//     );
//   }
// }