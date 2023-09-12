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
  price : {
    msg: "Price is required",
    status: 400
  },
  colorId:{
    msg: "Color ID is required",
    status: 400
  },
  sizeId:{
    msg: "Size ID is required",
    status: 400
  },
  categoryId:{
    msg: "Category ID is required",
    status: 400
  },
  productId:{
    msg: "Product ID is required",
    status: 400
  },
  images:{
    msg: "Images are required",
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





export async function GET(req: Request ,{params : {productId}} : {params: { productId: string}}){
  try {
    
    if(!productId) return throwAnError("productId")
   
      const product = await prismadb.product.findUnique({
        where: {
          id: productId,
        },
        include: {
          images: true,
          category: true,
          size: true,
          color: true
        }
      })
      return NextResponse.json(product)
  } catch (error) {
    console.log('[PRODUCT_GET]', error);
    return throwAnError("error")
  }
}


export async function PATCH(req: Request ,{params} : {params: {storeId: string, productId: string}}){
  try {
    const {userId} = auth();
    const {productId, storeId} = params
    const {name, price, categoryId, sizeId, colorId , isFeatured , isArchived, images} = await req.json();

    if(!userId) return throwAnError("userId")
    if(!name) return throwAnError('name')
    if(!price) return throwAnError('price')
    if(!productId) return throwAnError("productId")
    if(!categoryId) return throwAnError("categoryId")
    if(!sizeId) return throwAnError("sizeId")
    if(!colorId) return throwAnError("colorId")
    if(!images || !images.length) return throwAnError("images")
    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: storeId,
        userId
      }
    })
    if(!storeByUserId){
      return new NextResponse("Unauthorized", { status: 403 })
    }
      await prismadb.product.update({
        where: {
          id: productId,
        },
        data:{
          name,
          price,
          categoryId,
          colorId,
          sizeId,
          isArchived,
          isFeatured,
          images: {
            deleteMany: {}
          },
        }
      })
      const product = await prismadb.product.update({
        where: {
          id: productId,
        },
        data:{
          images: {
            createMany: {
              data: [
                ...images.map((image: {url: string}) => image)
              ]
            }
          },
        }
      })
      return NextResponse.json(product)
  } catch (error) {
    console.log('[PRODUCT_PATCH]', error);
    return throwAnError("error")
  }
}


export async function DELETE(req: Request ,{params} : {params: {storeId: string, productId: string}}){
  try {
    const {userId} = auth();
    const {productId, storeId} = params
    
    if(!userId) return throwAnError("userId")
    if(!productId) return throwAnError("productId")
    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: storeId,
        userId
      }
    })
    if(!storeByUserId) return throwAnError("storeByUserId")
      const product = await prismadb.product.deleteMany({
        where: {
          id: productId,
        }
      })
      return NextResponse.json(product)
  } catch (error) {
    console.log('[PRODUCT_DELETE]', error);
    return throwAnError("error")
  }
}