'use client';
import { format } from 'date-fns';
import { Calendar, Edit2, Trash2, CheckCircle2, Circle, Clock } from 'lucide-react';
import { Task } from '@/types';
import { StatusBadge, PriorityBadge } from '@/components/ui/Badges';

interface Props {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onToggle: (task: Task) => void;
}

export default function TaskCard({ task, onEdit, onDelete, onToggle }: Props) {
  const isCompleted = task.status === 'COMPLETED';
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !isCompleted;

  return (
    <div className={`card card-hover p-5 group transition-all duration-200 ${isCompleted ? 'opacity-60' : ''}`}>
      <div className="flex items-start gap-3">
        {/* Toggle button */}
        <button
          onClick={() => onToggle(task)}
          className={`mt-0.5 flex-shrink-0 transition-colors duration-200 ${
            isCompleted ? 'text-jade-500' : 'text-white/20 hover:text-jade-500'
          }`}
        >
          {isCompleted
            ? <CheckCircle2 size={20} />
            : <Circle size={20} />
          }
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className={`font-medium text-white leading-snug ${isCompleted ? 'line-through text-white/40' : ''}`}>
              {task.title}
            </h3>

            {/* Actions — show on hover */}
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex-shrink-0">
              <button
                onClick={() => onEdit(task)}
                className="p-1.5 rounded-lg text-white/30 hover:text-white hover:bg-white/[0.08] transition-all"
              >
                <Edit2 size={13} />
              </button>
              <button
                onClick={() => onDelete(task)}
                className="p-1.5 rounded-lg text-white/30 hover:text-coral-500 hover:bg-coral-500/10 transition-all"
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>

          {task.description && (
            <p className="text-white/40 text-sm leading-relaxed mb-3 line-clamp-2">
              {task.description}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-2 mt-2">
            <StatusBadge status={task.status} />
            <PriorityBadge priority={task.priority} />

            {task.dueDate && (
              <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border
                ${isOverdue
                  ? 'text-coral-500 bg-coral-500/10 border-coral-500/20'
                  : 'text-white/40 bg-white/5 border-white/10'
                }`}
              >
                {isOverdue ? <Clock size={10} /> : <Calendar size={10} />}
                {format(new Date(task.dueDate), 'MMM d, yyyy')}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
