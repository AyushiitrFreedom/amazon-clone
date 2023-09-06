'use client';
import { ChangeEvent, SetStateAction, useEffect, useState } from 'react';
import io from 'socket.io-client'
import { Input } from './input';
import { trpc } from '@/utils/trpc';
import { toast, useToast } from "@/components/ui/use-toast";
import { useRouter } from 'next/navigation'
import axios from 'axios';
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
    const [file, setFile] = useState<File | null>(null);

    let { data: userId, isLoading, isFetching, } = trpc.auth.getUserId.useQuery(undefined, {
        retry: 0, onError: (error) => {
            toast({
                variant: "destructive",
                title: error.message,
            });
            if (error?.message == "You must be logged in to do this") {
                router.push('/login');
            }
        }
    });
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
    let fileMutation = trpc.file.add.useMutation({
        onSuccess: (data) => {
            toast({
                variant: "success",
                title: data?.status,
            });


        },
        onError: (error) => {
            toast({
                variant: "destructive",
                title: error.message,
            });

        }
    })


    if (isLoading || isFetching) {
        return <Spinner />
    }
    const handleFileChange = (e: any) => {
        console.log("onchange 1");
        e.preventDefault(); //not working
        e.stopPropagation(); //not working

        if (e.target.files) {
            console.log("onchange")
            setFile(e.target.files[0]);
        }
    };
    const handleUploadClick = (event: any) => {
        if (!file) {
            console.error('No file selected');
            return;
        }

        // 👇 Uploading the file using the fetch API to the server
        event.preventDefault();
        event.stopPropagation();
        const url = 'http://localhost:5000/upload';
        const formData = new FormData();
        formData.append('file', file);
        formData.append('fileName', file.name);
        formData.append('reciepentId', sellerId);
        formData.append('userID', userId as string);
        const config = {
            headers: {
                'content-type': 'multipart/form-data',
            },
        };
        axios.post(url, formData, config)
            .then((response) => {
                console.log(response.data);
                fileMutation.mutate({ file_path: response.data, recipient_id: sellerId, file_name: file.name })

            })
            .catch((error) => {
                console.error("Error uploading file: ", error);

            });

    };
    //add product to cart mutation 
    //Getting ID Query Code 




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
            <form onSubmit={handleUploadClick}>
                <div className="flex justify-between items-center">
                    <input type='file' id='file' onChange={e => handleFileChange} className="col-span-3 my-4 mr-2" />
                    <button type='submit' className="text-white bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">upload</button>
                </div>
            </form>
            <Input id="message" placeholder='send text' name='file' value={message} onChange={(e) => {
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