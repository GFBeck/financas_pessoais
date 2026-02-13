import fs from 'fs';
import path from 'path';
import { Transaction } from '@/types';

const dbPath = path.join(process.cwd(), 'data.json');

export interface UserCategories {
  income: string[];
  expense: string[];
}

interface Database {
  transactions: Transaction[];
  categories: Record<string, UserCategories>;
  nextId: number;
}

const DEFAULT_CATEGORIES: UserCategories = {
  income: ['Salário', 'Freelance', 'Investimentos', 'Outros'],
  expense: ['Alimentação', 'Transporte', 'Moradia', 'Lazer', 'Saúde', 'Educação', 'Outros'],
};

function readDB(): Database {
  try {
    if (fs.existsSync(dbPath)) {
      const data = fs.readFileSync(dbPath, 'utf-8');
      const parsed = JSON.parse(data);
      return { categories: {}, ...parsed };
    }
  } catch (error) {
    console.error('Erro ao ler banco de dados:', error);
  }
  return { transactions: [], categories: {}, nextId: 1 };
}

function writeDB(data: Database): void {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf-8');
}

export const db = {
  getAllTransactions(userId: string): Transaction[] {
    const data = readDB();
    return data.transactions.filter(t => t.userId === userId);
  },

  addTransaction(userId: string, transaction: Omit<Transaction, 'id' | 'userId'>): Transaction {
    const data = readDB();
    const newTransaction: Transaction = {
      ...transaction,
      id: data.nextId,
      userId,
    };
    data.transactions.push(newTransaction);
    data.nextId++;
    writeDB(data);
    return newTransaction;
  },

  updateTransaction(userId: string, id: number, transaction: Omit<Transaction, 'id' | 'userId'>): Transaction | null {
    const data = readDB();
    const index = data.transactions.findIndex(t => t.id === id && t.userId === userId);
    
    if (index === -1) {
      return null;
    }
    
    const updatedTransaction: Transaction = {
      ...transaction,
      id,
      userId,
    };
    
    data.transactions[index] = updatedTransaction;
    writeDB(data);
    return updatedTransaction;
  },

  deleteTransaction(userId: string, id: number): boolean {
    const data = readDB();
    const initialLength = data.transactions.length;
    data.transactions = data.transactions.filter(t => !(t.id === id && t.userId === userId));
    if (data.transactions.length < initialLength) {
      writeDB(data);
      return true;
    }
    return false;
  },

  getCategories(userId: string): UserCategories {
    const data = readDB();
    if (!data.categories[userId]) {
      // Primeira vez: copiar categorias padrão para o usuário
      data.categories[userId] = { ...DEFAULT_CATEGORIES };
      writeDB(data);
    }
    return data.categories[userId];
  },

  saveCategories(userId: string, categories: UserCategories): UserCategories {
    const data = readDB();
    data.categories[userId] = categories;
    writeDB(data);
    return categories;
  },

  addCategory(userId: string, type: 'income' | 'expense', category: string): UserCategories {
    const data = readDB();
    if (!data.categories[userId]) {
      data.categories[userId] = { ...DEFAULT_CATEGORIES };
    }
    if (!data.categories[userId][type].includes(category)) {
      data.categories[userId][type].push(category);
      writeDB(data);
    }
    return data.categories[userId];
  },
};
