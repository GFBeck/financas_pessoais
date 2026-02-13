'use client';

import { signOut, useSession } from 'next-auth/react';
import { useState } from 'react';
import { isAuthEnabled } from '@/lib/auth-config';

export default function UserMenu() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  // Se autenticação desabilitada, não mostrar menu
  if (!isAuthEnabled()) return null;
  
  if (!session?.user) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-omni-background transition-colors"
      >
        {session.user.image ? (
          <img
            src={session.user.image}
            alt={session.user.name || 'User'}
            className="w-10 h-10 rounded-full"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-omni-purple text-white flex items-center justify-center font-bold">
            {session.user.name?.charAt(0) || 'U'}
          </div>
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-omni-current rounded-xl shadow-2xl z-20 overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-omni-background">
              <p className="font-semibold text-gray-800 dark:text-omni-foreground">
                {session.user.name}
              </p>
              <p className="text-sm text-gray-600 dark:text-omni-comment">
                {session.user.email}
              </p>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="w-full p-4 text-left hover:bg-gray-100 dark:hover:bg-omni-background transition-colors flex items-center space-x-2 text-omni-red"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Sair</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
