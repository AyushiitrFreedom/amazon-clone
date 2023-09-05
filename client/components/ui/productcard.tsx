'use client';
import { useEffect, useState } from 'react';
import io from 'socket.io-client'
import { Input } from './input';
import { trpc } from '@/utils/trpc';
import { toast, useToast } from "@/components/ui/use-toast";
import { useRouter } from 'next/navigation'
import Spinner from './spinner';
const socket = io('http://localhost:5050')

interface ProductCardProps {
    name: string; // Properly annotate the type of 'name' prop
    price: number;
    imageUrl: string;
    AddToCart: () => void
    sellerId: string;
}

const Productcard = ({ name, price, imageUrl, AddToCart, sellerId }: ProductCardProps) => {
    const router = useRouter()
    const [message, setMessage] = useState('')

    //add product to cart mutation 
    let mutation = trpc.message.add.useMutation({
        onSuccess: (data) => {
            toast({
                variant: "success",
                title: data?.status,
            });

            socket.emit('chat', data?.res)

        },
        onError: (error) => {
            toast({
                variant: "destructive",
                title: error.message,
            });

        }
    })
    //Getting ID Query Code 
    let { data: userId, isLoading, isFetching, isError, error } = trpc.auth.getUserId.useQuery(undefined, { retry: 0 });

    useEffect(() => {
        if (isError) {
            toast({
                variant: "destructive",
                title: error?.message,


            });
            if (error?.message == "You must be logged in to do this") {
                router.push('/login');
            }

        }

    }
        , [isError, error, toast, router]);

    if (isLoading || isFetching) {
        return <Spinner />
    }
    const sendChat = (e: any) => {
        e.preventDefault()
        mutation.mutate({ message, recipient_id: sellerId })
        setMessage('')
    }
    return <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
        <img className="p-8 rounded-t-lg" src={imageUrl} alt="product image" style={{ maxHeight: "240px", minHeight: '240px' }} />


        <div className="px-5 pb-5">
            <div className="flex justify-around">
                <h5 className="text-xl font-semibold tracking-tight mx-2 pb-4 text-gray-900 dark:text-white">{name}</h5>
                <span className="text-3xl font-bold text-gray-900 dark:text-white">${price}</span>
            </div>
            <Input id="message" placeholder='send text' value={message} onChange={(e) => {
                setMessage(e.target.value)
            }} className="col-span-3 my-4" />

            <div className="flex items-center justify-between">
                <button onClick={sendChat} className="text-white bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Message</button>
                <button onClick={AddToCart} className="text-white bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Add to Cart</button>
            </div>
        </div>


    </div>

}

export default Productcard;