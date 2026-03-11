import { AppShell } from '@/components/AppShell';
import { PageHeader } from '@/components/PageHeader';
import { IdeaNoteCard } from '@/components/domain';
import { EmptyState, SectionPanel } from '@/components/ui/cards';
import { Textarea } from '@/components/ui/forms';
import { notes } from '@/lib/demo-data';

export default function NotesPage() {
  return <AppShell><PageHeader title="인사이트/행동 규칙 노트" description="짧게 기록하고 다음 시험에서 바로 재사용하세요." />
    <SectionPanel title="빠른 기록"><Textarea rows={3} placeholder="비슷한 상황이 나오면 다음에는 어떻게 행동할지 한 줄로 작성"/></SectionPanel>
    <section className="grid gap-4 md:grid-cols-2">{notes.length ? notes.map((n) => <IdeaNoteCard key={n.insight} {...n} />) : <EmptyState title="노트가 아직 없어요" description="세션 종료 후 1줄 행동 규칙부터 남겨보세요." />}</section>
  </AppShell>;
}
