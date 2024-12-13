import { GlobeAltIcon } from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';
import Image from 'next/image';

export default function AcmeLogo() {
  return (
    <div
      className={`${lusitana.className} items-center leading-none text-white`}
    >
      <Image src="/logo.png" width={170} alt='logo' height={170} />
    </div>
  );
}
