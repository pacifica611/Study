import { ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & { loading?: boolean };

function BaseButton({ className, loading, children, ...props }: Props) {
  return <button className={clsx('rounded-[14px] px-4 py-2 text-sm font-semibold transition disabled:opacity-50', className)} disabled={loading || props.disabled} {...props}>{loading ? '처리 중...' : children}</button>;
}

export const PrimaryButton = (props: Props) => <BaseButton className="bg-[var(--primary)] text-white hover:brightness-95" {...props} />;
export const SecondaryButton = (props: Props) => <BaseButton className="bg-[var(--surface-emphasis)] text-[var(--primary)] border border-[var(--border)] hover:bg-[#E6EDFF]" {...props} />;
export const GhostButton = (props: Props) => <BaseButton className="bg-transparent text-[var(--text-muted)] hover:bg-[var(--surface-muted)]" {...props} />;
