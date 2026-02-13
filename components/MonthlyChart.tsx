'use client';

import { useMemo } from 'react';
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Transaction } from '@/types';

interface MonthlyChartProps {
  transactions: Transaction[];
  year: number;
}

const MONTHS = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

export default function MonthlyChart({ transactions, year }: MonthlyChartProps) {
  const data = useMemo(() => {
    return MONTHS.map((month, index) => {
      const monthTransactions = transactions.filter(t => {
        const date = new Date(t.date);
        return date.getFullYear() === year && date.getMonth() === index;
      });

      const income = monthTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

      const expense = monthTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

      const balance = income - expense;

      return { month, receitas: income, despesas: expense, saldo: balance };
    });
  }, [transactions, year]);

  return (
    <div className="bg-white dark:bg-omni-current rounded-2xl shadow-lg p-6 mb-6">
      <h3 className="text-xl font-bold text-gray-800 dark:text-omni-foreground mb-4 flex items-center">
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
        </svg>
        Evolução Mensal — {year}
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#6272a4" opacity={0.2} />
          <XAxis dataKey="month" stroke="#6272a4" />
          <YAxis stroke="#6272a4" />
          <Tooltip
            contentStyle={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              color: '#1f2937',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            }}
            formatter={(value: number, name: string) => [`R$ ${value.toFixed(2)}`, name]}
          />
          <Legend />
          <Bar
            dataKey="saldo"
            name="Saldo"
            fill="#78D1E1"
            opacity={0.4}
            radius={[4, 4, 0, 0]}
          />
          <Line
            type="monotone"
            dataKey="receitas"
            name="Receitas"
            stroke="#67E480"
            strokeWidth={3}
            dot={{ fill: '#67E480', r: 5 }}
            activeDot={{ r: 7 }}
          />
          <Line
            type="monotone"
            dataKey="despesas"
            name="Despesas"
            stroke="#E96379"
            strokeWidth={3}
            dot={{ fill: '#E96379', r: 5 }}
            activeDot={{ r: 7 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
