import { NextResponse } from 'next/server';
import { usersDb } from '@/lib/users-db';
import { authConfig } from '@/lib/auth-config';

export async function POST(request: Request) {
  try {
    // Verificar se modo credentials está ativo
    if (authConfig.mode !== 'credentials') {
      return NextResponse.json(
        { error: 'Registro não disponível neste modo' },
        { status: 400 }
      );
    }

    // Verificar se registro está habilitado
    if (!authConfig.allowRegistration) {
      return NextResponse.json(
        { error: 'Novos registros estão desabilitados no momento' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Nome, email e senha são obrigatórios' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'A senha deve ter pelo menos 6 caracteres' },
        { status: 400 }
      );
    }

    const user = await usersDb.createUser(name, email, password);

    return NextResponse.json({
      success: true,
      message: 'Conta criada com sucesso!',
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (error: any) {
    if (error.message === 'Email já cadastrado') {
      return NextResponse.json(
        { error: 'Este email já está cadastrado' },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: 'Erro ao criar conta' },
      { status: 500 }
    );
  }
}
