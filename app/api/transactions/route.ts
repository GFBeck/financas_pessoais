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

    const transactions = db.getAllTransactions(userId);
    return NextResponse.json(transactions.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    ));
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar transações' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const userId = await getUserId();
    
    if (!userId) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const { type, description, amount, category, date } = body;
    
    const newTransaction = db.addTransaction(userId, {
      type,
      description,
      amount: parseFloat(amount),
      category,
      date
    });
    
    return NextResponse.json(newTransaction);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao criar transação' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const userId = await getUserId();
    
    if (!userId) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'ID não fornecido' }, { status: 400 });
    }

    const body = await request.json();
    const { type, description, amount, category, date } = body;
    
    const updated = db.updateTransaction(userId, parseInt(id), {
      type,
      description,
      amount: parseFloat(amount),
      category,
      date
    });
    
    if (updated) {
      return NextResponse.json(updated);
    } else {
      return NextResponse.json({ error: 'Transação não encontrada' }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao atualizar transação' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const userId = await getUserId();
    
    if (!userId) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'ID não fornecido' }, { status: 400 });
    }
    
    const success = db.deleteTransaction(userId, parseInt(id));
    return NextResponse.json({ success });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao deletar transação' }, { status: 500 });
  }
}
