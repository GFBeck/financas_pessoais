'use client';

import { signIn, useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';

function LoginContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [authMode, setAuthMode] = useState('');
  const [allowRegistration, setAllowRegistration] = useState(false);
  const registered = searchParams.get('registered');

  useEffect(() => {
    if (session) {
      router.push('/');
    }
  }, [session, router]);

  useEffect(() => {
    fetch('/api/auth/config')
      .then(res => res.json())
      .then(data => {
        setAuthMode(data.mode);
        setAllowRegistration(data.allowRegistration);
      });
  }, []);

  if (status === 'loading' || !authMode) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-omni-background dark:to-gray-900">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-omni-purple"></div>
      </div>
    );
  }

  const isCredentialsMode = authMode === 'credentials';
  const isGoogleMode = authMode === 'public' || authMode === 'whitelist';
  const isWhitelistMode = authMode === 'whitelist';

  const handleCredentialsLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Email ou senha inválidos');
      } else {
        router.push('/');
      }
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
          <h1 className="text-4xl font-bold text-gray-800 dark:text-omni-foreground mb-2">
            💰 Finanças Pessoais
          </h1>
          <p className="text-gray-600 dark:text-omni-comment">
            Faça login para gerenciar suas finanças
          </p>
          {isWhitelistMode && (
            <p className="text-sm text-omni-orange mt-2">
              ⚠️ Acesso restrito a usuários autorizados
            </p>
          )}
        </div>

        {registered && (
          <div className="mb-4 p-3 bg-green-100 dark:bg-omni-green/20 text-omni-green rounded-xl text-sm text-center">
            Conta criada com sucesso! Faça login.
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-omni-red/20 text-omni-red rounded-xl text-sm text-center">
            {error}
          </div>
        )}

        {isCredentialsMode && (
          <>
            <form onSubmit={handleCredentialsLogin} className="space-y-4">
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
                  placeholder="Sua senha"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-4 bg-omni-purple text-white rounded-xl font-medium shadow-lg hover:bg-omni-purple/90 transition-all transform hover:scale-105 disabled:opacity-50 disabled:transform-none"
              >
                {loading ? 'Entrando...' : 'Entrar'}
              </button>
            </form>

            {allowRegistration && (
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600 dark:text-omni-comment">
                  Não tem uma conta?{' '}
                  <Link href="/register" className="text-omni-purple hover:underline font-medium">
                    Criar conta
                  </Link>
                </p>
              </div>
            )}
          </>
        )}

        {isGoogleMode && (
          <button
            onClick={() => signIn('google', { callbackUrl: '/' })}
            className="w-full bg-white dark:bg-omni-background border-2 border-gray-300 dark:border-omni-comment hover:bg-gray-50 dark:hover:bg-omni-background/80 text-gray-700 dark:text-omni-foreground px-6 py-4 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all flex items-center justify-center space-x-3 transform hover:scale-105"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            <span>Entrar com Google</span>
          </button>
        )}

        <div className="mt-8 text-center text-sm text-gray-500 dark:text-omni-comment">
          <p>Seus dados são privados e seguros</p>
          <p className="mt-2">🔒 Acesso protegido</p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-omni-background dark:to-gray-900">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-omni-purple"></div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
