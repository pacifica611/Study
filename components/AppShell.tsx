import Link from 'next/link';
import { ReactNode } from 'react';

const nav = [
  ['/', '대시보드'], ['/planner', '플래너'], ['/session', '세션'], ['/tasks', '과제'], ['/notes', '노트'], ['/mocks', '모의고사'], ['/reports', '리포트'], ['/settings', '설정'],
];

export function AppShell({ children }: { children: ReactNode }) {
  return <div className="mx-auto grid min-h-screen max-w-[1280px] grid-cols-1 gap-6 px-4 py-6 lg:grid-cols-[220px_1fr]">
    <aside className="rounded-[18px] border border-[var(--border)] bg-white p-4 shadow-sm">
      <h1 className="mb-4 text-lg font-bold">수능 몰입 플래너</h1>
      <nav className="space-y-1">{nav.map(([href, label]) => <Link key={href} href={href} className="block rounded-[10px] px-3 py-2 text-sm text-[var(--text-muted)] hover:bg-[var(--surface-muted)] hover:text-[var(--text)]">{label}</Link>)}</nav>
    </aside>
    <main className="space-y-6">{children}</main>
  </div>;
}
