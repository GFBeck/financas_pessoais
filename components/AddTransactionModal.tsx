'use client';

import { useState, useEffect } from 'react';
import { Transaction } from '@/types';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (transaction: Omit<Transaction, 'id' | 'userId'>) => void;
  onUpdate?: (id: number, transaction: Omit<Transaction, 'id' | 'userId'>) => void;
  editingTransaction?: Transaction | null;
}

interface Categories {
  income: string[];
  expense: string[];
}

export default function TransactionModal({ 
  isOpen, 
  onClose, 
  onSave, 
  onUpdate,
  editingTransaction 
}: TransactionModalProps) {
  const [type, setType] = useState<'income' | 'expense' | ''>('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [categories, setCategories] = useState<Categories>({ income: [], expense: [] });

  // Buscar categorias do usuário
  useEffect(() => {
    if (isOpen) {
      fetch('/api/categories')
        .then(res => res.json())
        .then(data => {
          if (data.income && data.expense) {
            setCategories(data);
          }
        })
        .catch(console.error);
    }
  }, [isOpen]);

  // Preencher formulário quando estiver editando
  useEffect(() => {
    if (editingTransaction) {
      setType(editingTransaction.type);
      setDescription(editingTransaction.description);
      setAmount(editingTransaction.amount.toString());
      setCategory(editingTransaction.category);
      setDate(editingTransaction.date);
    } else {
      setType('');
      setDescription('');
      setAmount('');
      setCategory('');
      setDate(new Date().toISOString().split('T')[0]);
    }
    setNewCategory('');
    setShowNewCategoryInput(false);
  }, [editingTransaction, isOpen]);

  const handleAddCategory = async () => {
    if (!newCategory.trim() || !type) return;

    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, category: newCategory.trim() }),
      });

      if (response.ok) {
        const updated = await response.json();
        setCategories(updated);
        setCategory(newCategory.trim());
        setNewCategory('');
        setShowNewCategoryInput(false);
      }
    } catch (error) {
      console.error('Erro ao adicionar categoria:', error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!type || !description || !amount || !category) {
      alert('Preencha todos os campos!');
      return;
    }

    const transactionData = {
      type: type as 'income' | 'expense',
      description,
      amount: parseFloat(amount),
      category,
      date
    };

    if (editingTransaction && onUpdate) {
      onUpdate(editingTransaction.id, transactionData);
    } else {
      onSave(transactionData);
    }

    setDescription('');
    setAmount('');
    setCategory('');
    setType('');
    setDate(new Date().toISOString().split('T')[0]);
    onClose();
  };

  if (!isOpen) return null;

  const isEditing = !!editingTransaction;
  const currentCategories = type ? categories[type] || [] : [];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-omni-current rounded-2xl shadow-2xl max-w-md w-full p-6 transform transition-all max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-omni-foreground">
            {isEditing ? 'Editar Transação' : 'Nova Transação'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 dark:text-omni-comment hover:text-gray-600 dark:hover:text-omni-foreground transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-omni-comment mb-2">Tipo</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => { setType('income'); setCategory(''); }}
                className={`p-3 rounded-xl font-medium transition-all ${
                  type === 'income'
                    ? 'bg-omni-green text-white shadow-lg'
                    : 'bg-gray-100 dark:bg-omni-background text-gray-600 dark:text-omni-comment hover:bg-gray-200 dark:hover:bg-omni-background/80'
                }`}
              >
                💰 Receita
              </button>
              <button
                type="button"
                onClick={() => { setType('expense'); setCategory(''); }}
                className={`p-3 rounded-xl font-medium transition-all ${
                  type === 'expense'
                    ? 'bg-omni-red text-white shadow-lg'
                    : 'bg-gray-100 dark:bg-omni-background text-gray-600 dark:text-omni-comment hover:bg-gray-200 dark:hover:bg-omni-background/80'
                }`}
              >
                💸 Despesa
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-omni-comment mb-2">Descrição</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-omni-background dark:bg-omni-background dark:text-omni-foreground rounded-xl focus:ring-2 focus:ring-omni-purple focus:border-transparent outline-none transition-all"
              placeholder="Ex: Compra no supermercado"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-omni-comment mb-2">Valor (R$)</label>
            <input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-omni-background dark:bg-omni-background dark:text-omni-foreground rounded-xl focus:ring-2 focus:ring-omni-purple focus:border-transparent outline-none transition-all"
              placeholder="0.00"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-omni-comment mb-2">Categoria</label>
            {type ? (
              <>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-omni-background dark:bg-omni-background dark:text-omni-foreground rounded-xl focus:ring-2 focus:ring-omni-purple focus:border-transparent outline-none transition-all"
                  required
                >
                  <option value="">Selecione uma categoria</option>
                  {currentCategories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>

                {!showNewCategoryInput ? (
                  <button
                    type="button"
                    onClick={() => setShowNewCategoryInput(true)}
                    className="mt-2 text-sm text-omni-purple hover:underline flex items-center space-x-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span>Nova categoria</span>
                  </button>
                ) : (
                  <div className="mt-2 flex space-x-2">
                    <input
                      type="text"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-omni-background dark:bg-omni-background dark:text-omni-foreground rounded-lg text-sm focus:ring-2 focus:ring-omni-purple focus:border-transparent outline-none"
                      placeholder="Nome da nova categoria"
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddCategory(); } }}
                    />
                    <button
                      type="button"
                      onClick={handleAddCategory}
                      className="px-3 py-2 bg-omni-purple text-white rounded-lg text-sm hover:bg-omni-purple/90"
                    >
                      +
                    </button>
                    <button
                      type="button"
                      onClick={() => { setShowNewCategoryInput(false); setNewCategory(''); }}
                      className="px-3 py-2 bg-gray-200 dark:bg-omni-background text-gray-600 dark:text-omni-comment rounded-lg text-sm"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </>
            ) : (
              <p className="text-sm text-gray-500 dark:text-omni-comment px-4 py-3 bg-gray-50 dark:bg-omni-background rounded-xl">
                Selecione o tipo (Receita ou Despesa) primeiro
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-omni-comment mb-2">Data</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-omni-background dark:bg-omni-background dark:text-omni-foreground rounded-xl focus:ring-2 focus:ring-omni-purple focus:border-transparent outline-none transition-all"
              required
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-gray-200 dark:bg-omni-background text-gray-700 dark:text-omni-comment rounded-xl font-medium hover:bg-gray-300 dark:hover:bg-omni-background/80 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!type}
              className="flex-1 px-4 py-3 bg-omni-purple text-white rounded-xl font-medium hover:bg-omni-purple/90 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isEditing ? 'Salvar' : 'Adicionar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
