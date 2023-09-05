"use client"

import { trpc } from "@/utils/trpc";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { isDirty, isValid, z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from 'next/image';
import { Separator } from "@/components/ui/separator";
import { DevTool } from "@hookform/devtools";
import { useRouter } from 'next/navigation'
import { useToast } from "@/components/ui/use-toast"
import RegisterSchema from "@/utils/zod-schemas/RegisterSchema";
import { ToastAction } from "@/components/ui/toast";
import { Timer } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox"
import { Mutation } from "@tanstack/react-query";



export type FormValues = {
    name: string;
    description: string;
    price: number;
    imageUrl: string;
};



const AddProductForm = () => {
    const { toast } = useToast()
    const router = useRouter();
    let mutation = trpc.product.add.useMutation({
        onSuccess: () => {
            toast({
                variant: "success",
                title: "Product Added",
            });
            reset();
        },
        onError: (error) => {
            toast({
                variant: "destructive",
                title: error.message,
            });
            if (error.message === "You are not a seller") {
                router.push("/");
            }
        }
    })
        ;


    const form = useForm<FormValues>({
        defaultValues: { //in default values , you can also put here something from an api
            name: "",
            description: "",
            price: 0,
            imageUrl: "https://www.tundralodge.com/integration/tc-theme/public/img/placeholder_4_3.png",
        },
        resolver: zodResolver(z.object({
            name: z.string().min(3, 'minimum length should be 3').max(20).nonempty("name is required"),
            description: z.string().min(3, 'minimum length should be 3').max(50).nonempty('description is required'),
            price: z.number(),
            imageUrl: z.string().url().nonempty('image url is required')
        })),
        mode: "onTouched" // this causes validaiton when u type , there are option to choose 
        //you can also do async validaiton
    });

    const { register, handleSubmit, formState, control, reset } = form;

    //when we are not using zod we use register to register different form feilds 
    // const name = register("name") , now the name is an object with various variables in it lets destructre it
    // const { ref, onChange, onBlur, value } = name;
    //you can add these as input props like this <input id="name" {...register("name")} (if you are doing this you do not need to define it like this const name = register("name") above  /> or you can add them individually like this  <input id="name" ref={ref} onChange={onChange} onBlur={onBlur}  /> this enables react hook form to track the input feilds and validate them

    //form also has a watch object which helps us to watch any feild 

    //there are two methods getvalues and setvalues which can get you values of the specified feilds when some specific action is performed such as clicking 
    const { errors, isDirty, isValid } = formState; // there are also other values we can destructure like isSumbiting , isSumbited , isSumbitSuccessfull , sumbitcount

    //  you can also reset the form with reset funciton , ---> useeffect ke andr , if isSumbitsuccessfull then reset , and watch for [insumbitsuccessfull]

    const onSubmit = async (data: FormValues,) => {


        mutation.mutate(data);





        //you can console log this to see what is the structure of the data being recieved from the form
        //also suppose the api accept the data in some other form or structure then also you can modify data here before sending it to the api with nested objects you can group some properties checkout video 13 , insted of nested objects you can also use arrays to group some properties video 14

        //sometimes you do not how many feilds in array are required , for example in a website we have an option to add as many phone numbers as the user wants by clicking a plus sign for thisw watch video 15
    };
    // you can also disable some feilds , for example disable = "true" or disable = watch("name")==="" ---> in this code if the name is empty then the price feild will be disabled
    return (
        <div className="border-solid border-4 flex flex-col h-screen justify-center items-center">
            <div className="my-8 text-4xl font-bold">Add a Product</div>


            <Separator className="w-[40vh] mt-6" />

            <form onSubmit={handleSubmit(onSubmit)} noValidate> {/* along with onSumbit , handle sumbit also has a function to handle errors which we get while sumbiting the form */}
                <div className="flex flex-col items-center ">
                    <div className="form-control my-4">
                        <Input type="text" id="name" placeholder="name" {...register("name")} />
                        <p className="text-red-600 text-sm">{errors.name?.message}</p>
                    </div>
                    <div className="form-control my-4">
                        <Input type="text" id="name" placeholder="description" {...register("description")} />
                        <p className="text-red-600 text-sm">{errors.description?.message}</p>
                    </div>
                    <div className="form-control my-4">
                        <Input type="text" id="imageUrl" placeholder="imageUrl" {...register("imageUrl")} />
                        <p className="text-red-600 text-sm">{errors.imageUrl?.message}</p>
                    </div>
                    <div className="form-control">
                        <Input type="number" id="price" placeholder="price" {...register("price", { valueAsNumber: true })} />
                        <p className="text-red-600 text-sm">{errors.price?.message}</p>
                    </div>


                    <Button className="my-4" disabled={!isDirty || !isValid} >Submit</Button>
                    {/* here we are using isDirty and isValid to disable the button if the form is not dirty or not valid */}
                </div>
            </form>


            <DevTool control={control} />

        </div>
        // devtool to visualize react hook form , control is a object destructured from useForm hook and these track the state without rerendering the whole conmpnent while if we have used state the whole componenet would have been re rendered


    );
};

export default AddProductForm;


//React form hook notes 

