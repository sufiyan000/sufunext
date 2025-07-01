import ClientOnlyLayout from './AccountLayout';

export default function Layout({ children }: { children: React.ReactNode }) {
  return <ClientOnlyLayout>{children}</ClientOnlyLayout>;
}
