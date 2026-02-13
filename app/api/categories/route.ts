import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { db } from '@/lib/db';
import { isAuthEnabled, getDefaultUserId } from '@/lib/auth-config';

async function getUserId(): Promise<string | null> {
  if (!isAuthEnabled()) {
    return getDefaultUserId();
  }
  const session = await getServerSession(authOptions);
  return session?.user?.id || null;
}

export async function GET() {
  try {
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const categories = db.getCategories(userId);
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar categorias' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const { type, category } = body;

    if (!type || !category) {
      return NextResponse.json({ error: 'Tipo e categoria são obrigatórios' }, { status: 400 });
    }

    const categories = db.addCategory(userId, type, category);
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao adicionar categoria' }, { status: 500 });
  }
}
