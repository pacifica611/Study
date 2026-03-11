'use client';

export default function Error({ reset }: { reset: () => void }) {
  return <div className="mx-auto mt-12 max-w-xl rounded-[14px] border border-[var(--border)] bg-white p-6 text-center"><p className="font-semibold">일시적인 문제가 발생했습니다.</p><p className="mt-2 text-sm text-[var(--text-muted)]">잠시 후 다시 시도해 주세요.</p><button onClick={reset} className="mt-4 rounded bg-[var(--primary)] px-4 py-2 text-sm text-white">다시 시도</button></div>;
}
