import '@/app/ui/global.css';
import ClientOnlyLayout from './AccountLayout'; // ✅ Client-side layout with useSelector etc.

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ClientOnlyLayout>{children}</ClientOnlyLayout>
    </>
  );
}
