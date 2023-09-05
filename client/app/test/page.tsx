'use client';
import React from 'react'
import { trpc } from "@/utils/trpc";
import { isError } from '@tanstack/react-query';

function Page() {
    let { data: name, isLoading, isFetching, isError, error } = trpc.message.test.useQuery();

    if (isLoading || isFetching) {
        return <p>Loading...</p>;
    }

    if (isError) {
        return <p>There was an {error?.message}</p>;
    }


    return (
        <div>{name?.status}</div>
    )
}

export default Page