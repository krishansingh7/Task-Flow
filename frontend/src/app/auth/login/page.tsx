'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '@/store/auth.store';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
});
type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading } = useAuthStore();
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setError('');
    try {
      await login(data.email, data.password);
      router.push('/dashboard');
    } catch (err: unknown) {
      const e = err as { response?: { data?: { error?: string } } };
      setError(e?.response?.data?.error || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="animate-slide-up">
      {/* Mobile logo */}
      <div className="flex items-center gap-2.5 mb-8 lg:hidden">
        <div className="w-8 h-8 rounded-xl bg-jade-500 flex items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M9 12l2 2 4-4" stroke="#0A0A0F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            <rect x="3" y="3" width="18" height="18" rx="4" stroke="#0A0A0F" strokeWidth="2.5"/>
          </svg>
        </div>
        <span className="font-display font-700 text-lg text-white">TaskFlow</span>
      </div>

      <div className="mb-8">
        <h2 className="font-display text-3xl font-700 text-white mb-2">Welcome back</h2>
        <p className="text-white/40">Sign in to your account to continue.</p>
      </div>

      {error && (
        <div className="mb-6 px-4 py-3 rounded-xl bg-coral-500/10 border border-coral-500/20 text-coral-500 text-sm animate-fade-in">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="label">Email address</label>
          <input
            {...register('email')}
            type="email"
            placeholder="you@example.com"
            className="input"
            autoComplete="email"
          />
          {errors.email && <p className="text-coral-500 text-xs mt-1.5">{errors.email.message}</p>}
        </div>

        <div>
          <label className="label">Password</label>
          <div className="relative">
            <input
              {...register('password')}
              type={showPw ? 'text' : 'password'}
              placeholder="••••••••"
              className="input pr-12"
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPw(!showPw)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
            >
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password && <p className="text-coral-500 text-xs mt-1.5">{errors.password.message}</p>}
        </div>

        <button type="submit" disabled={isLoading} className="btn-primary w-full mt-2 flex items-center justify-center gap-2">
          {isLoading ? <><Loader2 size={16} className="animate-spin" /> Signing in...</> : 'Sign in'}
        </button>
      </form>

      <p className="text-center text-white/40 text-sm mt-6">
        Don&apos;t have an account?{' '}
        <Link href="/auth/register" className="text-jade-500 hover:text-jade-400 font-medium transition-colors">
          Create one
        </Link>
      </p>

      {/* Demo hint */}
      <div className="mt-8 p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] text-center">
        <p className="text-white/30 text-xs font-mono">Demo: register any account to get started</p>
      </div>
    </div>
  );
}
