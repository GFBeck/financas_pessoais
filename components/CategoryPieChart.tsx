'use client';

import { useMemo } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Transaction } from '@/types';

interface CategoryPieChartProps {
  transactions: Transaction[];
  type: 'income' | 'expense';
  title: string;
}

const COLORS_INCOME = ['#67E480', '#78D1E1', '#988BC7', '#E7DE79', '#E89E64'];
const COLORS_EXPENSE = ['#E96379', '#FF79C6', '#E89E64', '#78D1E1', '#988BC7', '#E7DE79', '#67E480'];

export default function CategoryPieChart({ transactions, type, title }: CategoryPieChartProps) {
  const data = useMemo(() => {
    const filtered = transactions.filter(t => t.type === type);
    const grouped: Record<string, number> = {};

    filtered.forEach(t => {
      grouped[t.category] = (grouped[t.category] || 0) + t.amount;
    });

    return Object.entries(grouped).map(([name, value]) => ({ name, value }));
  }, [transactions, type]);

  const colors = type === 'income' ? COLORS_INCOME : COLORS_EXPENSE;

  if (data.length === 0) {
    return (
      <div className="bg-white dark:bg-omni-current rounded-2xl shadow-lg p-6 flex flex-col items-center justify-center min-h-[300px]">
        <h3 className="text-xl font-bold text-gray-800 dark:text-omni-foreground mb-4">{title}</h3>
        <p className="text-gray-500 dark:text-omni-comment text-sm">Sem dados para o período</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-omni-current rounded-2xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-800 dark:text-omni-foreground mb-4 text-center">{title}</h3>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={90}
            paddingAngle={3}
            dataKey="value"
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              color: '#1f2937',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            }}
            formatter={(value: number) => `R$ ${value.toFixed(2)}`}
          />
          <Legend
            formatter={(value) => (
              <span style={{ color: '#E1E1E6' }}>{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
