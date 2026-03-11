import { AppShell } from '@/components/AppShell';
import { PageHeader } from '@/components/PageHeader';
import { TaskCard } from '@/components/domain';
import { tasks } from '@/lib/demo-data';

export default function TasksPage() {
  return <AppShell><PageHeader title="과제 관리" description="시간이 아닌 완료 산출물 기준으로 과제를 관리합니다." />
    <section className="grid gap-4 md:grid-cols-2">{tasks.map((t) => <TaskCard key={t.title} {...t} />)}</section>
  </AppShell>;
}
