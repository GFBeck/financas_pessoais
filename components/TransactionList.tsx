'use client';

import { Transaction } from '@/types';

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: number) => void;
  onEdit: (transaction: Transaction) => void;
}

export default function TransactionList({ transactions, onDelete, onEdit }: TransactionListProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <div className="bg-white dark:bg-omni-current rounded-2xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-omni-foreground mb-6 flex items-center">
        <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        Transações
      </h2>
      
      {transactions.length === 0 ? (
        <div className="text-center py-12">
          <svg className="w-16 h-16 mx-auto text-gray-300 dark:text-omni-comment mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <p className="text-gray-500 dark:text-omni-comment text-lg">Nenhuma transação cadastrada</p>
          <p className="text-gray-400 dark:text-omni-comment/70 text-sm mt-2">Clique no botão acima para adicionar sua primeira transação</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-[500px] overflow-y-auto">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className={`flex items-center justify-between p-4 rounded-xl border-l-4 ${
                transaction.type === 'income' 
                  ? 'bg-green-50 dark:bg-omni-green/10 border-omni-green' 
                  : 'bg-red-50 dark:bg-omni-red/10 border-omni-red'
              } hover:shadow-md transition-shadow group cursor-pointer`}
              onClick={() => onEdit(transaction)}
            >
              <div className="flex items-center space-x-4 flex-1">
                <div className={`p-2 rounded-full ${
                  transaction.type === 'income' ? 'bg-green-100 dark:bg-omni-green/20' : 'bg-red-100 dark:bg-omni-red/20'
                }`}>
                  {transaction.type === 'income' ? (
                    <svg className="w-5 h-5 text-omni-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-omni-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
                    </svg>
                  )}
                </div>
                
                <div className="flex-1">
                  <p className="font-semibold text-gray-800 dark:text-omni-foreground">{transaction.description}</p>
                  <div className="flex items-center space-x-3 mt-1">
                    <span className="text-xs bg-white dark:bg-omni-background px-2 py-1 rounded-full text-gray-600 dark:text-omni-comment">
                      {transaction.category}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-omni-comment">{formatDate(transaction.date)}</span>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className={`text-xl font-bold ${
                    transaction.type === 'income' ? 'text-omni-green' : 'text-omni-red'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'} R$ {transaction.amount.toFixed(2)}
                  </p>
                </div>
              </div>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(transaction.id);
                }}
                className="ml-4 p-2 text-gray-400 dark:text-omni-comment hover:text-omni-red hover:bg-red-100 dark:hover:bg-omni-red/20 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                title="Excluir transação"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
