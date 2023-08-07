import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

enum MESSAGE_TYPES {
  userId = "userId",
  name= "name",
  storeId = "storeId",
  error="error"
}
const MESSAGES_ERROR = {
  userId : {
    msg: "Unauthenticated",
    status: 401
  },
  name : {
    msg: "Name is required",
    status: 400
  },
  storeId:{
    msg: "Store id is required",
    status: 400
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

export async function PATCH(req: Request ,{params} : {params: {storeId: string}}){
  try {
    const {userId} = auth();
    const {name} = await req.json();

    if(!userId) return throwAnError(MESSAGE_TYPES.userId)
    if(!name) return throwAnError(MESSAGE_TYPES.name)
    if(!params.storeId) return throwAnError(MESSAGE_TYPES.storeId)

      const store = await prismadb.store.updateMany({
        where: {
          id: params.storeId,
          userId,
        },
        data:{
          name
        }
      })
      return NextResponse.json(store)
  } catch (error) {
    console.log('[STORE_PATCH]', error);
    return throwAnError(MESSAGE_TYPES.error)
  }
}


export async function DELETE(req: Request ,{params} : {params: {storeId: string}}){
  try {
    const {userId} = auth();

    if(!userId) return throwAnError(MESSAGE_TYPES.userId)
    if(!params.storeId) return throwAnError(MESSAGE_TYPES.storeId)

      const store = await prismadb.store.deleteMany({
        where: {
          id: params.storeId,
          userId,
        }
      })
      return NextResponse.json(store)
  } catch (error) {
    console.log('[STORE_DELETE]', error);
    return throwAnError(MESSAGE_TYPES.error)
  }
}