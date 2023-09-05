'use client';
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from "@/components/ui/toaster"
const inter = Inter({ subsets: ['latin'] })
import { TrpcProvider } from "@/utils/trpc-provider";
import Script from 'next/script'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Provider } from '@radix-ui/react-toast';

// export const metadata: Metadata = {
//   title: 'Create Next App',
//   description: 'Generated by create next app',
// }


const queryClient = new QueryClient();
export default function RootLayout({
  children,

}: {
  children: React.ReactNode;
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <html lang="en">
        <head>
          <Script src="https://kit.fontawesome.com/f0c2f16b90.js" crossOrigin="anonymous"></Script>
        </head>
        <body>

          <TrpcProvider>
            {/* <Provider> //this also not working  */}
            {children}
            {/* </Provider> */}
            <ReactQueryDevtools initialIsOpen={false} />
          </TrpcProvider>

          <Toaster />
        </body>

      </html >
    </QueryClientProvider >

  );
}

