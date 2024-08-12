'use client'
import Date from "@/components/date";
import { GetStore } from "@/serverFunctions/requests";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function Page({params}) {
    const [store, setStore] = useState({});
    const [isSotoreRequest, setIsSotoreRequest] = useState(true);
    const initialized = useRef(false);

    const requestStore = async () => {
        const {id} = params;
        await GetStore(id)
        .then(result => {
            if(result?.ok){
                setStore({
                    ...result?.store,
                    location: JSON.parse(result?.store?.location )
                });
            }
        });
    }

    useEffect(()=>{
        if(!initialized.current){
            //Call this when mount component and prevent rerender
            initialized.current = true;
            requestStore();
        }
        return () => {
            //Call this on unmount component
            initialized.current = false
        }
    }, []);
    return <>
        <main className="flex min-h-screen flex-col items-center justify-noraal md:p-24 p-4 bg-[#f1f5f9] dark:bg-[rgba(0,0,0,.7)]">
            <div className="z-10 max-w-5xl w-full mx-auto items-center justify-between font-mono text-sm lg:flex">
                <h2 className="text-2xl flex w-full justify-center pb-6 pt-8 backdrop-blur-2xl lg:static lg:w-auto lg:p-4">
                    {!store&&isSotoreRequest ? 'Cargando...': store?.name}
                </h2>
                <div className="flex h-28 w-full items-end justify-center dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto">
                    <Link
                        className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
                        href={"/?href=title"}
                    >
                        <span>By</span>{" "}
                        <span className="text-4xl mt-5 font-bold">
                        <span className="text-[rgb(117,45,146)]">TB-</span><span className="text-[rgb(70,44,145)]">KO</span>
                        </span>
                    </Link>
                </div>
            </div>
            <div className="flex items-center justify-center bg-indigo-50 px-4 mt-32">
                <div className="max-w-sm overflow-hidden rounded-xl bg-white shadow-md duration-200 hover:scale-105 hover:shadow-xl">
                    <img src={store?.photo?`https://tbko.v360.mx${store?.photo}`:'/camera.png'} alt="store-photo" className="h-auto w-full" />
                    <div className="p-5">
                        <div className="flex items-center justify-around mb-5">
                            <p className="text-medium text-gray-700">
                                {!store&&isSotoreRequest ? 'Cargando...': store?.name}
                            </p>
                            <span className="text-sm block text-gray-500 font-bold text-right">
                                <Date dateString={store?.created_at} />
                            </span>
                        </div>
                        <Link
                            href={`https://www.google.com/maps/search/?api=1&query=${store?.location?.latitude},${store?.location?.longitude}&zoom=20`}
                            target="_blank"
                            className="w-full block text-center rounded-md bg-[rgba(70,44,145,.8)]  py-2 text-indigo-100 hover:bg-[rgba(70,44,145,1)] hover:shadow-md duration-75">
                            Ver ubicación
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    </>
}