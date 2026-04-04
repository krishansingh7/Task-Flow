'use client';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Loader2 } from 'lucide-react';
import { Task } from '@/types';

const schema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']),
  status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED']),
  dueDate: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

interface Props {
  task?: Task | null;
  onClose: () => void;
  onSubmit: (data: Partial<Task>) => Promise<void>;
  isSubmitting?: boolean;
}

export default function TaskModal({ task, onClose, onSubmit, isSubmitting }: Props) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      description: '',
      priority: 'MEDIUM',
      status: 'PENDING',
      dueDate: '',
    },
  });

  useEffect(() => {
    if (task) {
      reset({
        title: task.title,
        description: task.description ?? '',
        priority: task.priority,
        status: task.status,
        dueDate: task.dueDate ? task.dueDate.slice(0, 10) : '',
      });
    } else {
      reset({ title: '', description: '', priority: 'MEDIUM', status: 'PENDING', dueDate: '' });
    }
  }, [task, reset]);

  const handleFormSubmit = async (data: FormData) => {
    await onSubmit({
      ...data,
      dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : null,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-lg card p-6 animate-slide-up shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-xl font-700 text-white">
            {task ? 'Edit Task' : 'New Task'}
          </h2>
          <button onClick={onClose} className="btn-ghost p-2 !px-2">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div>
            <label className="label">Title <span className="text-coral-500">*</span></label>
            <input {...register('title')} placeholder="What needs to be done?" className="input" />
            {errors.title && <p className="text-coral-500 text-xs mt-1.5">{errors.title.message}</p>}
          </div>

          <div>
            <label className="label">Description</label>
            <textarea
              {...register('description')}
              placeholder="Add more details (optional)"
              className="input resize-none"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Priority</label>
              <select {...register('priority')} className="input">
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>
            <div>
              <label className="label">Status</label>
              <select {...register('status')} className="input">
                <option value="PENDING">Pending</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>
          </div>

          <div>
            <label className="label">Due Date</label>
            <input {...register('dueDate')} type="date" className="input" />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="btn-primary flex-1 flex items-center justify-center gap-2">
              {isSubmitting
                ? <><Loader2 size={15} className="animate-spin" /> Saving...</>
                : task ? 'Save changes' : 'Create task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
