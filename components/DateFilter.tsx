'use client';

interface DateFilterProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  onClear: () => void;
  onResetToCurrentMonth: () => void;
}

export default function DateFilter({ 
  startDate, 
  endDate, 
  onStartDateChange, 
  onEndDateChange,
  onClear,
  onResetToCurrentMonth
}: DateFilterProps) {
  return (
    <div className="bg-white dark:bg-omni-current rounded-2xl shadow-lg p-6 mb-6">
      <div className="flex flex-col md:flex-row items-start md:items-end gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-omni-comment mb-2">
            Data Inicial
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 dark:border-omni-background dark:bg-omni-background dark:text-omni-foreground rounded-xl focus:ring-2 focus:ring-omni-purple focus:border-transparent outline-none transition-all"
          />
        </div>

        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-omni-comment mb-2">
            Data Final
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 dark:border-omni-background dark:bg-omni-background dark:text-omni-foreground rounded-xl focus:ring-2 focus:ring-omni-purple focus:border-transparent outline-none transition-all"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={onResetToCurrentMonth}
            className="px-6 py-3 bg-omni-purple text-white rounded-xl font-medium hover:bg-omni-purple/90 transition-colors flex items-center space-x-2"
            title="Mês atual"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>Mês Atual</span>
          </button>

          <button
            onClick={onClear}
            className="px-6 py-3 bg-gray-200 dark:bg-omni-background text-gray-700 dark:text-omni-comment rounded-xl font-medium hover:bg-gray-300 dark:hover:bg-omni-background/80 transition-colors flex items-center space-x-2"
            title="Limpar filtros"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span>Limpar</span>
          </button>
        </div>
      </div>

      <div className="mt-4 flex items-center space-x-2 text-sm text-gray-600 dark:text-omni-comment">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>O saldo total considera todas as transações, independente do período filtrado</span>
      </div>
    </div>
  );
}
