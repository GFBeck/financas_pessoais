export interface Transaction {
  id: number;
  userId: string;
  type: 'income' | 'expense';
  description: string;
  amount: number;
  category: string;
  date: string;
}

export interface Summary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}
