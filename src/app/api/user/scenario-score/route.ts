// app/api/user/scenario-score/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { scenarioId, score, timeSpent } = await request.json();

    const progress = await prisma.progress.findUnique({
      where: { userId: session.user.id },
      select: { id: true },
    });

    if (!progress) {
      return NextResponse.json(
        { error: 'Progress not found' },
        { status: 404 }
      );
    }

    const scenarioScore = await prisma.scenarioScore.upsert({
      where: {
        userId_scenarioId: {
          userId: session.user.id,
          scenarioId,
        },
      },
      create: {
        userId: session.user.id,
        progressId: progress.id,
        scenarioId,
        score,
        timeSpent: timeSpent ?? 0,
      },
      update: {
        score,
        timeSpent: timeSpent ?? 0,
        completedAt: new Date(),
      },
    });

    return NextResponse.json(scenarioScore);
  } catch (error) {
    console.error('Error saving scenario score:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
