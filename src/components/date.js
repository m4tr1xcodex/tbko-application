import moment from "moment";
import 'moment/locale/es';
import { useEffect, useRef } from 'react';

export default function Date({ className = '', dateString, ...props },) {
    const initialized = useRef(false);
    useEffect(()=>{
        if(!initialized.current){
            initialized.current = true;
            moment.locale('es');
        }
        return () => {
            initialized.current = false;
        }
    },[]);
    return <span {...props} className={
        ' ' +
        className
    }>{moment(dateString).fromNow()}</span>;
}
