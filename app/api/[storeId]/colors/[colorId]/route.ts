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
  colorId:{
    msg: "Color ID is required",
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





export async function GET(req: Request ,{params: {colorId}} : {params: { colorId: string}}){
  try { 
    if(!colorId) return throwAnError('colorId')
   
      const color = await prismadb.color.findUnique({
        where: {
          id: colorId,
        }
      })
      return NextResponse.json(color)
  } catch (error) {
    console.log('[COLOR_GET]', error);
    return throwAnError('error')
  }
}


export async function PATCH(req: Request ,{params:{colorId,storeId}} : {params: {storeId: string, colorId: string}}){
  try {
    const {userId} = auth();
    const {name , value} = await req.json();

    if(!userId) return throwAnError('userId')
    if(!name) return throwAnError('name')
    if(!value) return throwAnError('value')
    if(!colorId) return throwAnError('colorId')
    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: storeId,
        userId
      }
    })
    if(!storeByUserId){
      return new NextResponse("Unauthorized", { status: 403 })
    }
      const color = await prismadb.color.updateMany({
        where: {
          id: colorId,
        },
        data:{
          name,
          value
        }
      })
      return NextResponse.json(color)
  } catch (error) {
    console.log('[COLOR_PATCH]', error);
    return throwAnError('error')
  }
}


export async function DELETE(req: Request ,{params: {colorId,storeId}} : {params: {storeId: string, colorId: string}}){
  try {
    const {userId} = auth();
    
    if(!userId) return throwAnError('userId')
    if(!colorId) return throwAnError('colorId')
    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: storeId,
        userId
      }
    })
    if(!storeByUserId) return throwAnError('storeByUserId')
      const color = await prismadb.color.deleteMany({
        where: {
          id: colorId,
        }
      })
      return NextResponse.json(color)
  } catch (error) {
    console.log('[COLOR_DELETE]', error);
    return throwAnError('error')
  }
}