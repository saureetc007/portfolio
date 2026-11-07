import type { ActivityStatus, ProjectStatus } from '@/types/content';
import { cx } from '@/lib/cx';

type Status = ProjectStatus | ActivityStatus;

const labels: Record<Status, string> = {
  completed: 'Completed',
  'in-progress': 'In Progress',
  experiment: 'Experiment',
  'learning-project': 'Learning Project',
  building: 'Building',
  learning: 'Learning',
  exploring: 'Exploring',
};

export function StatusBadge({ status, className }: { status: Status; className?: string }) {
  return <span className={cx('badge', `badge--${status}`, className)}>{labels[status]}</span>;
}
