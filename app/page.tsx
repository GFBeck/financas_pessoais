'use client';

import { useState, useEffect, useMemo } from 'react';
import Summary from '@/components/Summary';
import TransactionList from '@/components/TransactionList';
import TransactionModal from '@/components/AddTransactionModal';
import ThemeToggle from '@/components/ThemeToggle';
import UserMenu from '@/components/UserMenu';
import DateFilter from '@/components/DateFilter';
import MonthlyChart from '@/components/MonthlyChart';
import CategoryPieChart from '@/components/CategoryPieChart';
import { Transaction } from '@/types';

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Função para obter primeiro e último dia do mês atual
  const getMonthRange = () => {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    
    return {
      start: firstDay.toISOString().split('T')[0],
      end: lastDay.toISOString().split('T')[0]
    };
  };

  // Filtros de data - inicializar com o mês atual
  const [startDate, setStartDate] = useState(getMonthRange().start);
  const [endDate, setEndDate] = useState(getMonthRange().end);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await fetch('/api/transactions');
      const data = await response.json();
      setTransactions(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Erro ao buscar transações:', error);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar transações por período
  const filteredTransactions = useMemo(() => {
    // Garantir que transactions é um array
    if (!Array.isArray(transactions)) {
      return [];
    }

    if (!startDate && !endDate) {
      return transactions;
    }

    return transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;

      if (start && end) {
        return transactionDate >= start && transactionDate <= end;
      } else if (start) {
        return transactionDate >= start;
      } else if (end) {
        return transactionDate <= end;
      }
      return true;
    });
  }, [transactions, startDate, endDate]);

  const handleAddTransaction = async (transaction: Omit<Transaction, 'id' | 'userId'>) => {
    try {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transaction),
      });
      
      if (response.ok) {
        fetchTransactions();
      }
    } catch (error) {
      console.error('Erro ao adicionar transação:', error);
    }
  };

  const handleUpdateTransaction = async (id: number, transaction: Omit<Transaction, 'id' | 'userId'>) => {
    try {
      const response = await fetch(`/api/transactions?id=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transaction),
      });
      
      if (response.ok) {
        fetchTransactions();
        setEditingTransaction(null);
      }
    } catch (error) {
      console.error('Erro ao atualizar transação:', error);
    }
  };

  const handleDeleteTransaction = async (id: number) => {
    if (!confirm('Deseja realmente excluir esta transação?')) return;
    
    try {
      const response = await fetch(`/api/transactions?id=${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        fetchTransactions();
      }
    } catch (error) {
      console.error('Erro ao deletar transação:', error);
    }
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTransaction(null);
  };

  const handleClearFilters = () => {
    setStartDate('');
    setEndDate('');
  };

  const handleResetToCurrentMonth = () => {
    const range = getMonthRange();
    setStartDate(range.start);
    setEndDate(range.end);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-omni-purple"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 dark:text-omni-foreground mb-2">💰 Finanças Pessoais</h1>
            <p className="text-gray-600 dark:text-omni-comment">Gerencie suas receitas e despesas de forma simples</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <UserMenu />
            <ThemeToggle />
            <button
              onClick={() => {
                setEditingTransaction(null);
                setIsModalOpen(true);
              }}
              className="bg-omni-purple hover:bg-omni-purple/90 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all flex items-center space-x-2 transform hover:scale-105"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Nova Transação</span>
            </button>
          </div>
        </div>

        <DateFilter
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
          onClear={handleClearFilters}
          onResetToCurrentMonth={handleResetToCurrentMonth}
        />

        <Summary 
          transactions={transactions} 
          filteredTransactions={filteredTransactions}
          endDate={endDate}
        />

        <MonthlyChart
          transactions={transactions}
          year={startDate ? new Date(startDate).getFullYear() : new Date().getFullYear()}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <CategoryPieChart
            transactions={filteredTransactions}
            type="income"
            title="Receitas por Categoria"
          />
          <CategoryPieChart
            transactions={filteredTransactions}
            type="expense"
            title="Despesas por Categoria"
          />
        </div>
        
        <TransactionList 
          transactions={filteredTransactions} 
          onDelete={handleDeleteTransaction}
          onEdit={handleEditTransaction}
        />
        
        <TransactionModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleAddTransaction}
          onUpdate={handleUpdateTransaction}
          editingTransaction={editingTransaction}
        />
      </div>
    </main>
  );
}
