import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";


const MESSAGES_ERROR = {
  userId : {
    msg: "Unauthenticated",
    status: 401
  },
  name : {
    msg: "Name is required",
    status: 400
  },
  value : {
    msg: "Value is required",
    status: 400
  },
  sizeId:{
    msg: "Size ID is required",
    status: 400
  },
  storeByUserId:{
    msg: "Unauthorized",
    status: 403
  },
  error: {
    msg: "Internal Server Error",
    status: 500,
  }
}

type MESSAGE_TYPES = keyof typeof MESSAGES_ERROR

const throwAnError = (errorType : MESSAGE_TYPES) => {
  const {msg, status} = MESSAGES_ERROR[errorType];
  return new NextResponse(msg, {status})
}





export async function GET(req: Request ,{params: {sizeId}} : {params: { sizeId: string}}){
  try { 
    if(!sizeId) return throwAnError('sizeId')
   
      const size = await prismadb.size.findUnique({
        where: {
          id: sizeId,
        }
      })
      return NextResponse.json(size)
  } catch (error) {
    console.log('[SIZE_GET]', error);
    return throwAnError('error')
  }
}


export async function PATCH(req: Request ,{params:{sizeId,storeId}} : {params: {storeId: string, sizeId: string}}){
  try {
    const {userId} = auth();
    const {name , value} = await req.json();

    if(!userId) return throwAnError('userId')
    if(!name) return throwAnError('name')
    if(!value) return throwAnError('value')
    if(!sizeId) return throwAnError('sizeId')
    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: storeId,
        userId
      }
    })
    if(!storeByUserId){
      return new NextResponse("Unauthorized", { status: 403 })
    }
      const size = await prismadb.size.updateMany({
        where: {
          id: sizeId,
        },
        data:{
          name,
          value
        }
      })
      return NextResponse.json(size)
  } catch (error) {
    console.log('[SIZE_PATCH]', error);
    return throwAnError('error')
  }
}


export async function DELETE(req: Request ,{params: {sizeId,storeId}} : {params: {storeId: string, sizeId: string}}){
  try {
    const {userId} = auth();
    
    if(!userId) return throwAnError('userId')
    if(!sizeId) return throwAnError('sizeId')
    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: storeId,
        userId
      }
    })
    if(!storeByUserId) return throwAnError('storeByUserId')
      const size = await prismadb.size.deleteMany({
        where: {
          id: sizeId,
        }
      })
      return NextResponse.json(size)
  } catch (error) {
    console.log('[SIZE_DELETE]', error);
    return throwAnError('error')
  }
}