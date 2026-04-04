'use client';
import { Loader2, AlertTriangle } from 'lucide-react';

interface Props {
  title: string;
  onConfirm: () => Promise<void> | void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function ConfirmModal({ title, onConfirm, onCancel, isLoading }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative w-full max-w-sm card p-6 animate-slide-up shadow-2xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-coral-500/10 border border-coral-500/20 flex items-center justify-center flex-shrink-0">
            <AlertTriangle size={18} className="text-coral-500" />
          </div>
          <div>
            <h2 className="font-display font-700 text-white text-lg">Delete Task</h2>
            <p className="text-white/40 text-sm">This action cannot be undone.</p>
          </div>
        </div>

        <p className="text-white/60 text-sm mb-6 pl-13">
          Are you sure you want to delete <span className="text-white font-medium">&ldquo;{title}&rdquo;</span>?
        </p>

        <div className="flex gap-3">
          <button onClick={onCancel} className="btn-secondary flex-1">Cancel</button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="btn-danger flex-1 flex items-center justify-center gap-2"
          >
            {isLoading ? <><Loader2 size={15} className="animate-spin" /> Deleting...</> : 'Delete task'}
          </button>
        </div>
      </div>
    </div>
  );
}
