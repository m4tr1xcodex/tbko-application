'use client'
import { GetStores } from "@/serverFunctions/requests";
import { useEffect, useRef, useState } from "react";
import { DotLoading } from "@/components/icons";
import Link from "next/link";
import Date from "@/components/date";

export default function Page() {
    const [stores, setStores] = useState([]);
    const [isSotoresRequest, setIsSotoresRequest] = useState(true);
    const initialized = useRef(false);

    const loadStores = async () => {
        const session_id = localStorage.getItem('uuid');
        setIsSotoresRequest(true);
        await GetStores(session_id).then(result => {
            if(result?.ok){
                setStores(result?.stores);
            }
            setIsSotoresRequest(false);
        });
    }

    useEffect(()=>{
        if(!initialized.current){
            initialized.current = true;
            loadStores();
        }
        return () => {
            initialized.current = false;
        }
    },[]);

    return <>
        <main className="flex min-h-screen flex-col items-center justify-between md:p-24 p-4 bg-[#f1f5f9] dark:bg-[rgba(0,0,0,.7)]">
            <div className="z-10 max-w-5xl w-full mx-auto items-center justify-between font-mono text-sm lg:flex">
                <h2 className="text-2xl flex w-full justify-center pb-6 pt-8 backdrop-blur-2xl lg:static lg:w-auto lg:p-4">
                    Mis tiendas creadas
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
            <div className="p-4 mx-auto lg:max-w-7xl sm:max-w-full">
                    { 
                        isSotoresRequest ? <>
                            <div className="min-h-screen">
                                <div
                                    style={{
                                        background: "rgba(0,0,0,.8)",
                                        position: "fixed",
                                        zIndex: 100,
                                        top: "0",
                                        right: "0",
                                        bottom: "0",
                                        left: "0",
                                        transition: "all .2s",
                                    }}
                                    className="flex flex-col justify-center items-center">
                                        <DotLoading />
                                    <span className="text-white text-2xl">Obteniendo tiendas</span>
                                </div>
                            </div>
                        </> : stores.length ?
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 max-xl:gap-4 gap-6">
                                {
                                    stores.map(store => {
                                        return <>
                                            <Link href={`/store/${store?.uuid}`} className="bg-white rounded-2xl pt-5 px-4 pb-4 cursor-pointer hover:-translate-y-2 transition-all relative shadow">
                                                {/*<div className="bg-gray-100 w-10 h-10 flex items-center justify-center rounded-full cursor-pointer absolute top-4 right-4">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16px" className="fill-gray-800 inline-block" viewBox="0 0 64 64">
                                                        <path
                                                        d="M45.5 4A18.53 18.53 0 0 0 32 9.86 18.5 18.5 0 0 0 0 22.5C0 40.92 29.71 59 31 59.71a2 2 0 0 0 2.06 0C34.29 59 64 40.92 64 22.5A18.52 18.52 0 0 0 45.5 4ZM32 55.64C26.83 52.34 4 36.92 4 22.5a14.5 14.5 0 0 1 26.36-8.33 2 2 0 0 0 3.27 0A14.5 14.5 0 0 1 60 22.5c0 14.41-22.83 29.83-28 33.14Z"
                                                        data-original="#000000"></path>
                                                    </svg>
                                                </div>*/}

                                                <div className="w-full overflow-hidden mx-auto aspect-w-16 aspect-h-8 md:mb-2 mb-4">
                                                    <img src={`http://tbko.v360.mx${store?.photo}`} alt="Product 1"
                                                    className="h-full w-full object-contain rounded-md" />
                                                </div>

                                                <div>
                                                <h3 className="text-lg font-extrabold text-gray-800">{store.name}</h3>
                                                {/*<p className="text-gray-600 text-sm mt-2">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>*/}
                                                <span className="text-sm block text-gray-500 font-bold mt-4 text-right">
                                                    <Date dateString={store?.created_at} />
                                                </span>
                                                </div>
                                            </Link>
                                        </>
                                    })
                                }
                            </div>
                        : initialized && <>
                            <div className="min-h-screen items-center justify-center w-full">
                                <p className="text-center text-2xl">No tienes tiendas registradas aún</p>
                            </div>
                        </>
                    }
            </div>
        </main>
    </>
}