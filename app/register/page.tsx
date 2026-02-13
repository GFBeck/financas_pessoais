'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Erro ao criar conta');
        return;
      }

      router.push('/login?registered=true');
    } catch (err) {
      setError('Erro de conexão. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-omni-background dark:to-gray-900 p-4">
      <div className="bg-white dark:bg-omni-current rounded-2xl shadow-2xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-omni-foreground mb-2">
            💰 Criar Conta
          </h1>
          <p className="text-gray-600 dark:text-omni-comment">
            Crie sua conta para começar a gerenciar suas finanças
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-omni-red/20 text-omni-red rounded-xl text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-omni-comment mb-2">
              Nome
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-omni-background dark:bg-omni-background dark:text-omni-foreground rounded-xl focus:ring-2 focus:ring-omni-purple focus:border-transparent outline-none transition-all"
              placeholder="Seu nome completo"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-omni-comment mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-omni-background dark:bg-omni-background dark:text-omni-foreground rounded-xl focus:ring-2 focus:ring-omni-purple focus:border-transparent outline-none transition-all"
              placeholder="seu@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-omni-comment mb-2">
              Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-omni-background dark:bg-omni-background dark:text-omni-foreground rounded-xl focus:ring-2 focus:ring-omni-purple focus:border-transparent outline-none transition-all"
              placeholder="Mínimo 6 caracteres"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-omni-comment mb-2">
              Confirmar Senha
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-omni-background dark:bg-omni-background dark:text-omni-foreground rounded-xl focus:ring-2 focus:ring-omni-purple focus:border-transparent outline-none transition-all"
              placeholder="Repita a senha"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-4 bg-omni-purple text-white rounded-xl font-medium shadow-lg hover:bg-omni-purple/90 transition-all transform hover:scale-105 disabled:opacity-50 disabled:transform-none"
          >
            {loading ? 'Criando conta...' : 'Criar Conta'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-omni-comment">
            Já tem uma conta?{' '}
            <Link href="/login" className="text-omni-purple hover:underline font-medium">
              Fazer login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
