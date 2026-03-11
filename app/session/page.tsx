import { AppShell } from '@/components/AppShell';
import { PageHeader } from '@/components/PageHeader';
import { ReflectionForm, SprintTimer } from '@/components/domain';
import { SectionPanel } from '@/components/ui/cards';

export default function SessionPage() {
  return <AppShell><PageHeader title="집중 세션" description="한 번에 하나의 과제에만 몰입하세요." />
    <SectionPanel title="현재 과제"><p className="text-sm">수학 20문항 풀이 + 풀이 로직 구술 설명</p></SectionPanel>
    <SprintTimer />
    <ReflectionForm />
  </AppShell>;
}
