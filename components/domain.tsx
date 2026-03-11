import { Badge, SectionPanel } from './ui/cards';
import { Input, Textarea } from './ui/forms';

export function EnvironmentBlockCard({ name, task }: { name: string; task: string }) {
  return <div className="rounded-[14px] border border-[var(--border)] p-4"><div className="mb-2 flex items-center justify-between"><p className="font-medium">{name}</p><Badge tone={name.includes('A') ? 'info' : name.includes('B') ? 'success' : 'warning'}>{name[0]}</Badge></div><p className="text-sm text-[var(--text-muted)]">추천: {task}</p></div>;
}

export function TaskCard({ title, deliverable, subject }: { title: string; deliverable: string; subject: string }) {
  return <div className="rounded-[14px] border border-[var(--border)] bg-white p-4"><p className="font-medium">{title}</p><p className="mt-1 text-xs text-[var(--text-muted)]">{subject}</p><p className="mt-2 text-sm">완료 기준: {deliverable}</p></div>;
}

export function SprintTimer() {
  return <SectionPanel title="스프린트 타이머"><div className="grid gap-4"><div className="text-center text-5xl font-bold">60:00</div><div className="grid grid-cols-3 gap-2 text-center text-sm"><div className="rounded bg-[var(--surface-muted)] py-2">40분</div><div className="rounded bg-[var(--surface-emphasis)] py-2">60분</div><div className="rounded bg-[var(--surface-muted)] py-2">80분</div></div></div></SectionPanel>;
}

export function ReflectionForm() {
  return <SectionPanel title="세션 회고"><div className="grid gap-3"><label className="text-sm"><input type="checkbox" className="mr-2"/>백지복습 진행</label><label className="text-sm"><input type="checkbox" className="mr-2"/>소리내 설명 가능</label><Input type="number" min={1} max={5} placeholder="인출 성공도 (1~5)"/><Textarea rows={3} placeholder="다음 세션 행동 규칙을 짧게 남겨보세요"/></div></SectionPanel>;
}

export function IdeaNoteCard({ subject, insight, actionRule }: { subject: string; insight: string; actionRule: string }) {
  return <div className="rounded-[14px] border border-[var(--border)] bg-white p-4"><p className="text-xs text-[var(--text-muted)]">{subject}</p><p className="mt-2 text-sm">{insight}</p><p className="mt-2 rounded bg-[var(--surface-emphasis)] p-2 text-sm font-medium">다음 행동: {actionRule}</p></div>;
}
