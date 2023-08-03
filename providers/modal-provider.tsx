"use client"

import { StoreModal } from "@/components/modals/store-modal"
import { useEffect, useState } from "react"


export const ModalProvider = () => {
  // const [isMounted, setIsMounted] = useState<boolean>(false);
  // useEffect(()=>{
  //   setIsMounted(true)
  // }, [])
  // if(!isMounted) return null;
  // if(window === undefined && typeof window === "undefined") return null;
  return <>
    <StoreModal />
  </>
}