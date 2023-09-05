"use client";
import Spinner from "@/components/ui/spinner";
import { useToast } from "@/components/ui/use-toast";
import { trpc } from "@/utils/trpc";
import { useEffect, useState } from "react";
import { Product } from "../../server/db/schema/Schema";
import Productcard from "@/components/ui/productcard";
import Navbar from "@/components/ui/Navbar";
import Search from "@/components/ui/search";
import { useRouter } from 'next/navigation'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'


const AllProducts = () => {
  const router = useRouter()

  const queryError = (error: any) => {
    if (error?.message == "You must be logged in to do this") {
      router.push('/login');
    }

    toast({
      variant: "destructive",
      title: error?.message,
    })

  }
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState(""); // Search query state
  let { data: name, isLoading, isFetching, isError, error } = trpc.product.getall.useQuery(undefined, { retry: 1, onError: queryError, staleTime: 0 });

  //add product to cart mutation 
  let mutation = trpc.order.add.useMutation({
    onSuccess: () => {
      toast({
        variant: "success",
        title: "Product Added to cart",
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
  // Add to Cart Logic 
  const addToCart = (id: string) => {
    mutation.mutate({ id });
  }
  const productList = name as Product[];
  const filteredProducts = searchQuery
    ? productList.filter(product =>
      product.name?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : productList;

  if (productList === undefined || productList.length === 0) {
    return <div className="flex justify-center mt-8">
      <Search value={searchQuery} onChange={(newValue) => setSearchQuery(newValue)}
        placeholder="Search products..." />
    </div>
  }

  return <>

    <Navbar />
    <div className="flex justify-center mt-8">
      <Search value={searchQuery} onChange={(newValue) => setSearchQuery(newValue)}
        placeholder="Search products..." />
    </div>
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <div key={product.product_id} className="mx-8 my-6">
            <Productcard
              name={product.name as string}
              price={product.price as number}
              imageUrl={product.imageUrl as string}
              AddToCart={() => addToCart(product.product_id as string)}
              sellerId={product.seller_id as string}
            />
          </div>
        ))}
      </div>
    </div>
  </>
};

export default AllProducts;