
import { lusitana } from '@/app/ui/fonts';
import Image from 'next/image';
import Link from 'next/link'; 
export default function AcmeLogo() {
  return (
    <div
      className={`${lusitana.className} items-center leading-none text-white`}
    >
      <Link href="/">
      <Image src="/logo.png" width={170} alt='logo' height={170} />
      </Link>
    </div>
  );
}
