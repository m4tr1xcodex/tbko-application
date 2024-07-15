'use client'
import Image from "next/image";
import {SendStore} from '@/serverFunctions/requests';
import {Close, CameraRotate} from '@/components/icons';
import { useEffect, useRef, useState } from "react";
import { toast } from 'react-toastify';
import {Camera} from "react-camera-pro";
//import Camera from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import {isMobile} from 'react-device-detect';
import { v4 as uuidv4 } from 'uuid';

export default function Home() {
  const [location, setLocation] = useState(null);
  const [photoUri, setPhotoUri] = useState(null);
  const [storeName, setStoreName] = useState('');
  const [showCamera, setShowCamera] = useState(false);
  const [showExampleModal, setShowExampleModal] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false); 
  const refCamera = useRef(null);
  const loaded = useRef(false);

  useEffect(()=>{
    if(!loaded.current){
      if(!localStorage.getItem('uuid')){
        localStorage.setItem('uuid', uuidv4());
      }
      loaded.current = true;
    }
  },[]);

  const getcords = () => {
    if('geolocation' in navigator) {
      setLocationLoading(true)
      // Retrieve latitude & longitude coordinates from `navigator.geolocation` Web API
      navigator.geolocation.getCurrentPosition(({ coords }) => {
          const { latitude, longitude } = coords;
          setLocationLoading(false);
          setLocation({ latitude, longitude });
      }, // Error callback function
      (error) => {
        // Handle errors, e.g. user denied location sharing permissions
        setLocationLoading(false);
        toast(error?.message, {
          type: 'warning',
          hideProgressBar: true
        });

      })
    }else{
      toast("Geolocation is not supported by this browser.", {
        type: 'error',
        hideProgressBar: true
      })
    }
  }

  const handleTakePhoto = (dataUri) => {
    // Do stuff with the photo...
    const photo = refCamera.current.takePhoto()
    setPhotoUri(photo);
    setShowCamera(false);
  }

  const swithCamera = () => {
    refCamera.current.switchCamera()
  }

  const submit = async () => {
    setFormLoading(true);
    const data = {
      location,
      photo: photoUri,
      storeName,
      uid: localStorage.getItem('uuid')
    }
    await SendStore(data)
    .then(result => {
      toast("Tienda tbko guardada", {
        type: 'success',
        hideProgressBar: true
      });
      setLocation(null);
      setPhotoUri('');
      setStoreName('');
      setShowCamera(false);
      setShowExampleModal(false);
      setFormLoading(false);
    })
    .catch(err=>{
      toast("Error al enviar los datos.", {
        type: 'error',
        hideProgressBar: true
      });
      setFormLoading(false);
    });
  }

  return <>
    <main className="flex min-h-screen flex-col items-center justify-between md:p-24 p-4 bg-[#f1f5f9] dark:bg-[rgba(0,0,0,.7)]">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <p className=" text-lg flex w-full justify-center pb-6 pt-8 backdrop-blur-2xl lg:static lg:w-auto lg:p-4">
          Comparte la ubicación de tu tienda
        </p>
        <div className="flex h-28 w-full items-end justify-center dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto">
          <a
            className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
            href="https://vercel.com?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>By</span>{" "}
            <span className="text-4xl mt-5 font-bold">
              <span className="text-[rgb(117,45,146)]">TB-</span><span className="text-[rgb(70,44,145)]">KO</span>
            </span>
          </a>
        </div>
      </div>

      <div className="relative w-full md:w-2/4 flex flex-col place-items-center">
        {
          photoUri && <img src={photoUri} className="rounded-lg shadow-md" />
        }
        {
          showCamera && <>
            <div className="w-full h-auto relative flex items-center justify-center mb-4">
              <Camera aspectRatio={16 / 9} ref={refCamera} facingMode={isMobile?"environment":"user"} />
              <div className="absolute bottom-[10%] flex items-center justify-center border-4 border-[rgba(255,255,255,.6)] p-2 rounded-full">
                <button className="mx-auto bg-[rgba(255,255,255,.6)] focus:bg-[rgba(255,255,255,1)] rounded-full w-12 h-12" onClick={handleTakePhoto}></button>
              </div>
              <div className="absolute bottom-[5%] right-[5%]">
                <button onClick={swithCamera} className="z-50">
                  <CameraRotate className="fill-[rgba(255,255,255,.6)]" />
                </button>
              </div>
            </div>
            
          </>
        }
        {
          !showCamera && 
          <div className="flex items-center gap-2 w-full my-4">
            <button type="" className="border rounded-md w-full h-12 bg-[rgba(117,45,146,.4)] text-[rgb(70,44,145)] dark:text-white" onClick={()=>{
              setPhotoUri(null);
              setShowCamera(true)
            }}>
              { photoUri ? 'Volver a tomar foto' : 'Toma la foto de la tienda'}
              
            </button> 
            <button className="border rounded-full bg-blue-200 h-8 w-8" onClick={()=>setShowExampleModal(true)}>?</button>
          </div>
        }
        <div className="mb-4 w-full">
          <label htmlFor="store-name" className="mb-2 block">Nombre de la tienda</label>
          <input type="text" id="store-name" value={storeName} className="bg-white text-black dark:border-white rounded-md w-full h-10 px-2 border border-[rgb(217,218,224)] shadow-sm" placeholder="Ingresa el nombre de la tienda" onChange={e=>setStoreName(e.target.value)}/>
        </div>
        <div className="flex flex-col gap-4 items-center">
          {
            (location && photoUri && storeName) &&
            <button onClick={submit} className="bg-green-400 focus:text-green-300 rounded-md px-4 py-2 text-white">
              Enviar
            </button>
          }
          {
            !location ?
            <button onClick={getcords} className="bg-gray-400 focus:text-gray-300 rounded-md px-4 py-2 text-white disabled:text-gray-300" disabled={locationLoading}>
              {locationLoading?'Obteniendo...':'Obtener ubicacion'}
            </button> : <>
              <span className="text-gray-400">Ubicación obtenida</span>
            </>
          }
        </div>

      </div>
      <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left">
        
      </div>
      {
        showExampleModal && 
        <div className="min-h-screen w-full absolute top-0 left-0 right-0 flex items-center justify-center z-50">
          <div className="border rounded-md bg-white shadow-lg w-[90%] md:w-2/4 relative">
            <button className="absolute right-3 top-2 bg-gray-300 rounded-full w-6 h-6 p-1 flex justify-center items-center text-white" onClick={()=>setShowExampleModal(false)}>
              <Close className="fill-black" />
            </button>
            <h2 className="text-center py-4">Ejemplo de foto de la tienda</h2>
            <Carousel autoPlay={true} infiniteLoop={true} showArrows={true} swipeable={true}>
                <div>
                    <img src="https://enchulatutienda.com/wp-content/uploads/2023/06/Tienda1.png" />
                </div>
                <div>
                    <img src="https://enchulatutienda.com/wp-content/uploads/2023/06/Tienda4.png" />
                </div>
                <div>
                    <img src="https://enchulatutienda.com/wp-content/uploads/2023/06/Tienda3.png" />
                </div>
                <div>
                    <img src="https://enchulatutienda.com/wp-content/uploads/2023/06/Tienda2.png" />
                </div>
            </Carousel>
          </div>
        </div>
      }
      { 
        formLoading && 
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
        className="flex justify-center items-center">
          <span className="text-white text-2xl">Enviado...</span>
        </div>
      }
    </main>
  </>;
}
