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
  categoryId:{
    msg: "Category ID is required",
    status: 400
  },
  billboardId:{
    msg: "Billboard ID is required",
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





export async function GET(req: Request ,{params: {categoryId}} : {params: { categoryId: string}}){
  try {
    
    if(!categoryId) return throwAnError('categoryId')
   
      const category = await prismadb.category.findUnique({
        where: {
          id: categoryId,
        }
      })
      return NextResponse.json(category)
  } catch (error) {
    console.log('[CATEGORY_GET]', error);
    return throwAnError('error')
  }
}


export async function PATCH(req: Request ,{params: {categoryId,storeId}} : {params: {storeId: string, categoryId: string}}){
  try {
    const {userId} = auth();
    const {name , billboardId} = await req.json();

    if(!userId) return throwAnError('userId')
    if(!name) return throwAnError('name')
    if(!categoryId) return throwAnError('categoryId')
    if(!billboardId) return throwAnError('billboardId')
    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: storeId,
        userId
      }
    })
    if(!storeByUserId){
      return new NextResponse("Unauthorized", { status: 403 })
    }
      const category = await prismadb.category.updateMany({
        where: {
          id: categoryId,
        },
        data:{
          name,
          billboardId
        }
      })
      return NextResponse.json(category)
  } catch (error) {
    console.log('[CATEGORY_PATCH]', error);
    return throwAnError('error')
  }
}


export async function DELETE(req: Request ,{params: {storeId,categoryId}} : {params: {storeId: string, categoryId: string}}){
  try {
    const {userId} = auth();

    if(!userId) return throwAnError('userId')
    if(!categoryId) return throwAnError('categoryId')
    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: storeId,
        userId
      }
    })
    if(!storeByUserId) return throwAnError('storeByUserId')
      const category = await prismadb.category.deleteMany({
        where: {
          id: categoryId,
        }
      })
      return NextResponse.json(category)
  } catch (error) {
    console.log('[CATEGORY_DELETE]', error);
    return throwAnError('error')
  }
}