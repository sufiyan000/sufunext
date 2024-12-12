import { GlobeAltIcon } from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';
import logo from "@/public/logo.png"
import Image from 'next/image';

export default function AcmeLogo() {
  return (
    <div
      className={`${lusitana.className} items-center leading-none text-white`}
    >
      <Image src="/logo.png" width={100} alt='logo' height={100} />
    </div>
  );
}
