'use client'
import useOnlineStatus from "@rehooks/online-status";
import { useEffect, useRef } from "react";
import { toast, Flip } from 'react-toastify';
import { Wifi } from '@/components/icons';

export default () => {
    const online = useOnlineStatus();
    const toastId = useRef(null);

    useEffect(()=>{
        if(!online){
            toastId.current = toast('Parece que no tienes conexión.', {
                position: "bottom-left",
                autoClose: false,
                hideProgressBar: true,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: false,
                progress: false,
                theme: "dark",
                draggable: false,
                closeButton: false,
                transition: Flip,
                icon: ({theme, type}) => <Wifi className="fill-red-500" />
            });
        }else{
            if(toastId.current){
                toast.update(toastId.current, {
                    autoClose: 4000,
                    render: 'Se restauro tu coneccion.',
                    icon: ({theme, type}) => <Wifi className="fill-green-500" />
                });
            }
        }
    },[online]);
    return <>
    
    </>
}