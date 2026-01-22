// app/api/auth/register/route.ts
import { NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { name, email, password, newsletter } = await request.json();

    console.log('📝 Tentative d\'inscription pour:', email);

    // Validation des données
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Tous les champs sont requis' },
        { status: 400 }
      );
    }

    // Vérifier la validité de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Adresse email invalide' },
        { status: 400 }
      );
    }

    // Vérifier la force du mot de passe
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Le mot de passe doit contenir au moins 8 caractères' },
        { status: 400 }
      );
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Un utilisateur avec cet email existe déjà' },
        { status: 409 }
      );
    }

    // Hasher le mot de passe
    const hashedPassword = await hash(password, 12);

    // Créer l'utilisateur
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        emailVerified: new Date(),
        role: 'USER',
      },
    });

    console.log('✅ Utilisateur créé:', user.email);

    // Créer la progression initiale
    const progress = await prisma.progress.create({
      data: {
        userId: user.id,
        level: 1,
        xp: 0,
        vigilanceScore: 50,
        completedScenarios: [],
        badges: ['starter'],
        gamesPlayed: 0,
        consecutiveCorrect: 0,
        lastPlayed: null,
      },
    });

    console.log('✅ Progression créée pour:', user.email);

    // Enregistrer la préférence newsletter si demandée
    if (newsletter) {
      console.log(`📧 ${email} a souscrit à la newsletter`);
    }

    return NextResponse.json({
      success: true,
      message: 'Compte créé avec succès',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    }, { status: 201 });

  } catch (error: any) {
    console.error('❌ Erreur lors de l\'inscription:', error);
    
    if (error.code === 'P2002') { // Erreur de contrainte unique Prisma
      return NextResponse.json(
        { error: 'Un utilisateur avec cet email existe déjà' },
        { status: 409 }
      );
    }

    if (error.message.includes('bcrypt')) {
      return NextResponse.json(
        { error: 'Erreur lors du hashage du mot de passe' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        error: 'Une erreur est survenue lors de la création du compte',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}