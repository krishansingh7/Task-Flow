import { Task } from '@/types';
import { CheckCircle2, Clock, Zap, ListTodo } from 'lucide-react';

interface Props { tasks: Task[]; total: number; }

export default function StatsBar({ tasks, total }: Props) {
  const completed = tasks.filter(t => t.status === 'COMPLETED').length;
  const inProgress = tasks.filter(t => t.status === 'IN_PROGRESS').length;
  const pending = tasks.filter(t => t.status === 'PENDING').length;
  const high = tasks.filter(t => t.priority === 'HIGH' && t.status !== 'COMPLETED').length;

  const stats = [
    { label: 'Total', value: total, icon: ListTodo, color: 'text-white/60', bg: 'bg-white/5' },
    { label: 'Pending', value: pending, icon: Clock, color: 'text-amber-400', bg: 'bg-amber-400/10' },
    { label: 'In Progress', value: inProgress, icon: Zap, color: 'text-sky-400', bg: 'bg-sky-400/10' },
    { label: 'Completed', value: completed, icon: CheckCircle2, color: 'text-jade-500', bg: 'bg-jade-500/10' },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
      {stats.map(({ label, value, icon: Icon, color, bg }) => (
        <div key={label} className={`card p-4 flex items-center gap-3`}>
          <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center flex-shrink-0`}>
            <Icon size={16} className={color} />
          </div>
          <div>
            <div className={`text-xl font-display font-700 ${color}`}>{value}</div>
            <div className="text-white/30 text-xs">{label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
