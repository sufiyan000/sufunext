import '@/app/ui/global.css';
import { inter } from '@/app/ui/fonts';
import Script from 'next/script';
import ReduxProvider from './redux/ReduxProvider';
export const metadata = {
  title: "faydazone.com",
  description: "Welcome to the faydazone official website. Faydey Ki 100% Guarantee",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Google Analytics */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-6V0HP3E28N"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-6V0HP3E28N');
          `}
        </Script>

      </head>
      <body className={`${inter.className} antialiased`}>
        <ReduxProvider>
          {children}
        </ReduxProvider>
      </body>
    </html>
  );
}