import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

enum MESSAGE_TYPES {
  userId = "userId",
  label= "label",
  imageUrl= "imageUrl",
  billboardId = "billboardId",
  storeByUserId = "storeByUserId",
  error="error"
}
const MESSAGES_ERROR = {
  userId : {
    msg: "Unauthenticated",
    status: 401
  },
  label : {
    msg: "Name is required",
    status: 400
  },
  imageUrl : {
    msg: "image URL is required",
    status: 400
  },
  billboardId:{
    msg: "billboard ID is required",
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


const throwAnError = (errorType : MESSAGE_TYPES) => {
  const {msg, status} = MESSAGES_ERROR[errorType];
  return new NextResponse(msg, {status})
}





export async function GET(req: Request ,{params} : {params: { billboardId: string}}){
  try {
    const {billboardId} = params
    
    if(!billboardId) return throwAnError(MESSAGE_TYPES.billboardId)
   
      const billboard = await prismadb.billboard.findUnique({
        where: {
          id: billboardId,
        }
      })
      return NextResponse.json(billboard)
  } catch (error) {
    console.log('[BILLBOARD_GET]', error);
    return throwAnError(MESSAGE_TYPES.error)
  }
}


export async function PATCH(req: Request ,{params} : {params: {storeId: string, billboardId: string}}){
  try {
    const {userId} = auth();
    const {billboardId, storeId} = params
    const {label , imageUrl} = await req.json();

    if(!userId) return throwAnError(MESSAGE_TYPES.userId)
    if(!label) return throwAnError(MESSAGE_TYPES.label)
    if(!imageUrl) return throwAnError(MESSAGE_TYPES.imageUrl)
    if(!billboardId) return throwAnError(MESSAGE_TYPES.billboardId)
    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: storeId,
        userId
      }
    })
    if(!storeByUserId){
      return new NextResponse("Unauthorized", { status: 403 })
    }
      const billboard = await prismadb.billboard.updateMany({
        where: {
          id: billboardId,
        },
        data:{
          label,
          imageUrl
        }
      })
      return NextResponse.json(billboard)
  } catch (error) {
    console.log('[BILLBOARD_PATCH]', error);
    return throwAnError(MESSAGE_TYPES.error)
  }
}


export async function DELETE(req: Request ,{params} : {params: {storeId: string, billboardId: string}}){
  try {
    const {userId} = auth();
    const {billboardId, storeId} = params
    
    if(!userId) return throwAnError(MESSAGE_TYPES.userId)
    if(!billboardId) return throwAnError(MESSAGE_TYPES.billboardId)
    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: storeId,
        userId
      }
    })
    if(!storeByUserId) return throwAnError(MESSAGE_TYPES.storeByUserId)
      const billboard = await prismadb.billboard.deleteMany({
        where: {
          id: billboardId,
        }
      })
      return NextResponse.json(billboard)
  } catch (error) {
    console.log('[BILLBOARD_DELETE]', error);
    return throwAnError(MESSAGE_TYPES.error)
  }
}