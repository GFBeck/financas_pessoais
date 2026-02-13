'use client';

import { Transaction } from '@/types';

interface SummaryProps {
  transactions: Transaction[];
  filteredTransactions: Transaction[];
  endDate?: string;
}

export default function Summary({ transactions, filteredTransactions, endDate }: SummaryProps) {
  // Receitas e despesas do período filtrado
  const periodIncome = filteredTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const periodExpense = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  
  // Saldo acumulado até a data final do filtro
  const transactionsUntilEnd = endDate
    ? transactions.filter(t => new Date(t.date) <= new Date(endDate))
    : transactions;

  const balanceIncome = transactionsUntilEnd
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const balanceExpense = transactionsUntilEnd
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const balance = balanceIncome - balanceExpense;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-white dark:bg-omni-current rounded-2xl shadow-lg p-6 border-l-4 border-omni-green transform hover:scale-105 transition-transform">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 dark:text-omni-comment font-medium">Receitas</p>
            <p className="text-xs text-gray-500 dark:text-omni-comment/70 mb-1">(período)</p>
            <p className="text-3xl font-bold text-omni-green mt-1">
              R$ {periodIncome.toFixed(2)}
            </p>
          </div>
          <div className="bg-green-100 dark:bg-omni-green/20 p-3 rounded-full">
            <svg className="w-8 h-8 text-omni-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
            </svg>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-omni-current rounded-2xl shadow-lg p-6 border-l-4 border-omni-red transform hover:scale-105 transition-transform">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 dark:text-omni-comment font-medium">Despesas</p>
            <p className="text-xs text-gray-500 dark:text-omni-comment/70 mb-1">(período)</p>
            <p className="text-3xl font-bold text-omni-red mt-1">
              R$ {periodExpense.toFixed(2)}
            </p>
          </div>
          <div className="bg-red-100 dark:bg-omni-red/20 p-3 rounded-full">
            <svg className="w-8 h-8 text-omni-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
            </svg>
          </div>
        </div>
      </div>

      <div className={`bg-white dark:bg-omni-current rounded-2xl shadow-lg p-6 border-l-4 ${balance >= 0 ? 'border-omni-cyan' : 'border-omni-orange'} transform hover:scale-105 transition-transform`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 dark:text-omni-comment font-medium">Saldo Acumulado</p>
            <p className="text-xs text-gray-500 dark:text-omni-comment/70 mb-1">(até {endDate ? new Date(endDate).toLocaleDateString('pt-BR') : 'hoje'})</p>
            <p className={`text-3xl font-bold mt-1 ${balance >= 0 ? 'text-omni-cyan' : 'text-omni-orange'}`}>
              R$ {balance.toFixed(2)}
            </p>
          </div>
          <div className={`${balance >= 0 ? 'bg-blue-100 dark:bg-omni-cyan/20' : 'bg-orange-100 dark:bg-omni-orange/20'} p-3 rounded-full`}>
            <svg className={`w-8 h-8 ${balance >= 0 ? 'text-omni-cyan' : 'text-omni-orange'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
