import React from "react";
import { Button } from "./button";

interface BlogCardProps {
    imageUrl: string;
    title: string;
    content: string;
    onDelete: (orderId: string) => void;
    Buy: (orderId: string) => void;
    orderId: string;

}



const BlogCard = ({ imageUrl, title, content, onDelete, orderId, Buy }: BlogCardProps) => {
    return (

        <div className="flex flex-col my-8 items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-xl dark:border-gray-700 dark:bg-gray-800">
            <img
                className="object-cover w-full rounded-t-lg h-96 md:h-auto md:w-48 md:rounded-none md:rounded-l-lg"
                src={imageUrl}
                alt=""
            />
            <div className="flex flex-col justify-between p-4 leading-normal">
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                    {title}
                </h5>
                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                    {content}
                </p>
                <div className="flex justify-between">
                    <button onClick={() => onDelete(orderId)}> <i className="fa-solid fa-trash"></i></button>
                    <Button className="px-8" onClick={() =>
                        Buy(orderId)

                    } >Buy</Button>
                </div>

            </div>
        </div>
    );
};

export default BlogCard;
