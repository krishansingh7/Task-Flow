'use client';
import { useRouter } from 'next/navigation';
import { LogOut, CheckSquare, User } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { useToast } from '@/components/ui/Toast';

export default function DashboardHeader() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { showToast } = useToast();

  const handleLogout = async () => {
    await logout();
    showToast('Logged out successfully', 'success');
    router.push('/auth/login');
  };

  const initials = user?.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) ?? '??';

  return (
    <header className="sticky top-0 z-30 bg-[#0A0A0F]/80 backdrop-blur-md border-b border-white/[0.06]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-jade-500 flex items-center justify-center">
              <CheckSquare size={16} strokeWidth={2.5} className="text-ink-900" />
            </div>
            <span className="font-display font-700 text-lg text-white tracking-tight">TaskFlow</span>
          </div>

          {/* User menu */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.06]">
              <div className="w-6 h-6 rounded-lg bg-jade-500/20 border border-jade-500/30 flex items-center justify-center">
                <span className="text-jade-500 text-xs font-mono font-500">{initials}</span>
              </div>
              <span className="text-white/60 text-sm">{user?.name}</span>
            </div>
            <button
              onClick={handleLogout}
              className="btn-ghost flex items-center gap-2 text-sm !px-3"
            >
              <LogOut size={15} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
