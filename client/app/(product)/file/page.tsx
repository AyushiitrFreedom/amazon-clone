"use client";
import Spinner from '@/components/ui/spinner';
import { useToast } from "@/components/ui/use-toast";
import { trpc } from '@/utils/trpc';
import { useRouter } from 'next/navigation';
import React, { use, useEffect, useState } from 'react'
import io from 'socket.io-client'
import { string } from 'zod';
import { user } from '../../../../server/db/schema/Schema';
import Avatar from '@/components/ui/avatar';
import axios from 'axios';
const socket = io('http://localhost:5050')
function Page() {
    const router = useRouter()

    const { toast } = useToast();
    const queryError = (error: any) => {
        if (error?.message == "You must be logged in to do this") {
            router.push('/login');
        }

        toast({
            variant: "destructive",
            title: error?.message,
        })

    }

    let { data: files, isLoading, isFetching, isError, error } = trpc.file.getall.useQuery(undefined, { retry: 1, onError: queryError, });
    let { data: userId } = trpc.auth.getUserId.useQuery(undefined, { retry: 1 });


    const downloadFile = async (filepath: string, filename: string) => {
        const url = 'http://localhost:5000/upload';
        const formData = new FormData();
        formData.append('file_path', filepath);
        formData.append('file_name', filename);
        formData.append('userID', userId as string);

        axios.post(url, formData)
            .then((response) => {
                console.log(response.data);
            })
            .catch((error) => {
                console.error("Error uploading file: ", error);

            });

    }

    if (isLoading || isFetching) {
        return <Spinner />
    }
    if (files === undefined || files.length === 0 || files === undefined) {
        return <div>No Chats Babes!!</div>
    }




    return (
        <div >
            <h1 className="text-center text-2xl font-bold my-4">Chat</h1>
            <div className='flex  justify-center '>
                <div className="flex flex-col items-start space-y-4  w-[40vw] h-[75vh] border-black-700 border-2 border-solid overflow-scroll bg-[url('https://i.pinimg.com/736x/64/80/8e/64808e7b6c992958ad9b3220cd6bae49.jpg')] rounded-3xl">
                    {files.map((file) => (
                        <div className={`flex ${file.sender_id === userId ? 'flex-row self-start' : 'flex-row-reverse  self-end'}`}>
                            <Avatar />
                            <div
                                key={file.file_id}
                                onClick={() => downloadFile(file.file_path as string, file.file_name as string)}
                                className={`${file.sender_id === userId
                                    ? 'rounded-3xl  bg-blue-500 text-white  my-4 max-w-[200px]'
                                    : ' rounded-3xl  bg-red-300 text-black my-4 min-w-{100px}'
                                    } p-3 m-8 rounded-lg `}
                            >
                                <p className="mb-2">{file.file_name}</p>

                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Page