import { ReactNode } from 'react';
import clsx from 'clsx';

export function SectionPanel({ title, children, action }: { title: string; children: ReactNode; action?: ReactNode }) {
  return <section className="rounded-[18px] border border-[var(--border)] bg-white p-6 shadow-sm"><div className="mb-4 flex items-center justify-between"><h2 className="text-lg font-semibold">{title}</h2>{action}</div>{children}</section>;
}

export function MetricCard({ label, value, caption }: { label: string; value: string; caption?: string }) {
  return <div className="rounded-[14px] border border-[var(--border)] bg-[var(--surface)] p-4"><p className="text-xs text-[var(--text-muted)]">{label}</p><p className="mt-1 text-2xl font-semibold">{value}</p>{caption && <p className="mt-1 text-xs text-[var(--text-muted)]">{caption}</p>}</div>;
}

export function EmptyState({ title, description }: { title: string; description: string }) {
  return <div className="rounded-[14px] border border-dashed border-[var(--border)] bg-[var(--surface-muted)] p-8 text-center"><p className="font-medium">{title}</p><p className="mt-2 text-sm text-[var(--text-muted)]">{description}</p></div>;
}

export function Badge({ children, tone='neutral' }: { children: ReactNode; tone?: 'neutral'|'success'|'warning'|'info' }) {
  const map = { neutral: 'bg-[var(--surface-muted)] text-[var(--text-muted)]', success: 'bg-green-50 text-[var(--success)]', warning: 'bg-amber-50 text-[var(--warning)]', info: 'bg-blue-50 text-[var(--info)]' };
  return <span className={clsx('rounded-full px-2.5 py-1 text-xs font-medium', map[tone])}>{children}</span>;
}

export function ChartCard({ title, value }: { title: string; value: number }) {
  return <div className="rounded-[14px] border border-[var(--border)] bg-white p-4"><p className="text-sm">{title}</p><div className="mt-2 h-2 rounded bg-[var(--surface-muted)]"><div style={{ width: `${value}%` }} className="h-2 rounded bg-[var(--primary)]" /></div><p className="mt-1 text-xs text-[var(--text-muted)]">{value}%</p></div>;
}
