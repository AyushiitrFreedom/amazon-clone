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
const socket = io('http://localhost:5050')
type messageType = { message: string | null; message_id: string; sender_id: string | null; recipient_id: string | null; }
function Page() {
    const router = useRouter()

    const { toast } = useToast();
    const [chat, setChat] = useState<messageType[]>([]);
    const queryError = (error: any) => {
        if (error?.message == "You must be logged in to do this") {
            router.push('/login');
        }

        toast({
            variant: "destructive",
            title: error?.message,
        })

    }
    const querySuccess = (data: any) => {
        setChat(data)
    }
    let { data: allChats, isLoading, isFetching, isError, error } = trpc.message.getall.useQuery(undefined, { retry: 1, onError: queryError, onSuccess: querySuccess });
    let { data: userId } = trpc.auth.getUserId.useQuery(undefined, { retry: 1 });



    useEffect(() => {

        socket.on('chat', (data: messageType) => {
            if ((data.sender_id === userId || data.recipient_id === userId)) {
                setChat([...chat, data])
            }

        })


    },);

    if (isLoading || isFetching) {
        return <Spinner />
    }
    if (allChats === undefined || allChats.length === 0 || chat === undefined) {
        return <div>No Chats Babes!!</div>
    }

    // if (allChats) {
    //     setChat(allChats);
    // }
    console.log(chat, "chat")




    console.log(allChats, "all chats")
    console.log(chat, "chat")

    return (
        <div >
            <h1 className="text-center text-2xl font-bold my-4">Chat</h1>
            <div className='flex  justify-center '>
                <div className="flex flex-col items-start space-y-4  w-[40vw] h-[75vh] border-black-700 border-2 border-solid overflow-scroll bg-[url('https://i.pinimg.com/736x/64/80/8e/64808e7b6c992958ad9b3220cd6bae49.jpg')] rounded-3xl">
                    {chat.map((data) => (
                        <div className={`flex ${data.sender_id === userId ? 'flex-row self-start' : 'flex-row-reverse  self-end'}`}>
                            <Avatar />
                            <div
                                key={data.message_id}
                                className={`${data.sender_id === userId
                                    ? 'rounded-3xl  bg-blue-500 text-white  my-4 max-w-[200px]'
                                    : ' rounded-3xl  bg-red-300 text-black my-4 min-w-{100px}'
                                    } p-3 m-8 rounded-lg `}
                            >
                                <p className="mb-2">{data.message}</p>

                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Page