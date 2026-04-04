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
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirm: z.string(),
}).refine((d) => d.password === d.confirm, {
  message: "Passwords don't match",
  path: ['confirm'],
});
type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const router = useRouter();
  const { register: registerUser, isLoading } = useAuthStore();
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setError('');
    try {
      await registerUser(data.name, data.email, data.password);
      router.push('/dashboard');
    } catch (err: unknown) {
      const e = err as { response?: { data?: { error?: string } } };
      setError(e?.response?.data?.error || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="animate-slide-up">
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
        <h2 className="font-display text-3xl font-700 text-white mb-2">Create account</h2>
        <p className="text-white/40">Get started with TaskFlow — free forever.</p>
      </div>

      {error && (
        <div className="mb-6 px-4 py-3 rounded-xl bg-coral-500/10 border border-coral-500/20 text-coral-500 text-sm animate-fade-in">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="label">Full name</label>
          <input {...register('name')} type="text" placeholder="Alex Johnson" className="input" autoComplete="name" />
          {errors.name && <p className="text-coral-500 text-xs mt-1.5">{errors.name.message}</p>}
        </div>

        <div>
          <label className="label">Email address</label>
          <input {...register('email')} type="email" placeholder="you@example.com" className="input" autoComplete="email" />
          {errors.email && <p className="text-coral-500 text-xs mt-1.5">{errors.email.message}</p>}
        </div>

        <div>
          <label className="label">Password</label>
          <div className="relative">
            <input
              {...register('password')}
              type={showPw ? 'text' : 'password'}
              placeholder="At least 8 characters"
              className="input pr-12"
              autoComplete="new-password"
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

        <div>
          <label className="label">Confirm password</label>
          <input {...register('confirm')} type="password" placeholder="••••••••" className="input" autoComplete="new-password" />
          {errors.confirm && <p className="text-coral-500 text-xs mt-1.5">{errors.confirm.message}</p>}
        </div>

        <button type="submit" disabled={isLoading} className="btn-primary w-full mt-2 flex items-center justify-center gap-2">
          {isLoading ? <><Loader2 size={16} className="animate-spin" /> Creating account...</> : 'Create account'}
        </button>
      </form>

      <p className="text-center text-white/40 text-sm mt-6">
        Already have an account?{' '}
        <Link href="/auth/login" className="text-jade-500 hover:text-jade-400 font-medium transition-colors">
          Sign in
        </Link>
      </p>
    </div>
  );
}
