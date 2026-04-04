export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* Left brand panel */}
      <div className="hidden lg:flex flex-col justify-between w-[480px] bg-[#0D0D20] border-r border-white/[0.05] p-12 relative overflow-hidden">
        {/* Background grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(0,200,150,1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(0,200,150,1) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />
        {/* Glow orb */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-jade-500/10 blur-3xl" />

        <div className="relative">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-jade-500 flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M9 12l2 2 4-4" stroke="#0A0A0F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <rect x="3" y="3" width="18" height="18" rx="4" stroke="#0A0A0F" strokeWidth="2.5"/>
              </svg>
            </div>
            <span className="font-display font-700 text-xl text-white tracking-tight">TaskFlow</span>
          </div>
        </div>

        <div className="relative space-y-6">
          <h1 className="font-display text-4xl font-800 text-white leading-tight">
            Organize your<br />
            <span className="text-jade-500">work smarter.</span>
          </h1>
          <p className="text-white/40 text-lg leading-relaxed">
            A focused task management system that keeps you in flow — not in meetings about meetings.
          </p>

          <div className="space-y-3 pt-2">
            {[
              'JWT-secured authentication with auto-refresh',
              'Full CRUD with real-time status updates',
              'Filtering, search & pagination built-in',
            ].map((f) => (
              <div key={f} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-jade-500/15 border border-jade-500/30 flex items-center justify-center flex-shrink-0">
                  <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-5" stroke="#00C896" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span className="text-white/50 text-sm">{f}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative text-white/20 text-sm font-mono">
          © 2024 TaskFlow
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
