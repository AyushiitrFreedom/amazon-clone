"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink, getFetch, loggerLink, createTRPCProxyClient } from "@trpc/client";
import { useEffect, useState } from "react";
import superjson from "superjson";
import { trpc } from './trpc';
import { AppRouter } from "../../server/routes";
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
export const TrpcProvider: React.FC<{ children: React.ReactNode; token?: string }> = ({
    children,
}) => {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: { queries: { staleTime: 5000 } },
            })
    );

    const url = process.env.NEXT_PUBLIC_VERCEL_URL
        ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
        : "http://localhost:5000";

    // const token = localStorage.getItem('token');


    const [trpcClient] = useState(() =>
        trpc.createClient({
            links: [
                loggerLink({
                    enabled: () => true,
                }),
                httpBatchLink({
                    url,
                    fetch: async (input, init?) => {
                        const fetch = getFetch();
                        return fetch(input, {
                            ...init,
                            credentials: "include",
                        });
                    },
                    headers: {
                        // Authorization: typeof window !== 'undefined' ? localStorage.getItem('token') as string : " ",
                        // Credentials: "include",

                    }
                }),
            ],
            transformer: superjson,
        })
    );
    return (
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
            <QueryClientProvider client={queryClient}>
                {children}
                {/* <ReactQueryDevtools /> */}
            </QueryClientProvider>
        </trpc.Provider>
    );
};
