"use client";
import { trpc } from "@/utils/trpc";
import Link from "next/link";
import { toast } from "./use-toast";

import { useRouter } from 'next/navigation'
import { useQueryClient } from "@tanstack/react-query";


const Navbar = () => {
    const queryClient = useQueryClient();
    const router = useRouter()
    let mutation = trpc.auth.logout.useMutation({
        onSuccess: (data) => {
            toast({
                variant: "success",
                title: "Logged out successfully",
            });



        },
        onError: (error) => {
            toast({
                variant: "destructive",
                title: error.message,
            });

        }
    })
    const logout = () => {
        // localStorage.removeItem('token');
        document.cookie = 'token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        mutation.mutate();

    }

    return <>
        <nav className="bg-gray-800 py-4">
            <div className="container mx-auto flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="mr-12">
                    <i className="fa-solid fa-house" style={{ color: '#ffffff' }}></i>
                </Link>


                {/* Icons */}
                <div className="flex items-center space-x-6 ">
                    <Link className="text-white mx-4" href={'/add-product'}>
                        <i className="fa-solid fa-plus" style={{ color: '#ffffff' }}></i>
                    </Link>
                    <Link className="text-white mx-4" href={'/cart'}>
                        <i className="fa-solid fa-cart-shopping" style={{ color: "#ffffff" }}></i>
                    </Link>
                    <Link href={'/orders'} className="text-white mx-4">
                        <i className="fa-solid fa-check" style={{ color: "#ffffff" }}></i>
                    </Link>
                    <Link href={'/chat'} className="text-white mx-4">
                        <i className="fa-solid fa-comment" style={{ color: "#ffffff" }}></i>
                    </Link>

                    <button onClick={() => {
                        logout();


                        // queryClient.invalidateQueries(["order", "getallcart"]);
                        router.push('/login');

                    }} className="text-white mx-4">
                        <i className="fa-solid fa-right-from-bracket" style={{ color: "#ffffff" }}></i>
                    </button>

                    {/* Add your logout button here */}
                </div>
            </div>
        </nav >






    </>
};
export default Navbar;