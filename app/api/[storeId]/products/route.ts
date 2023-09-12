import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(req: Request, {params: {storeId , ...params}}: {params: {storeId : string}} ) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { name, price, categoryId, sizeId, colorId , isFeatured , isArchived, images } = body
    if (!userId) {
      return new NextResponse("Unauthenticated ", { status: 401 })
    };
    if (!name) {
      return new NextResponse("Name is required", { status: 400 })
    }
    if (!images || !images.length) {
      return new NextResponse("Images are required", { status: 400 })
    }
    if (!categoryId) {
      return new NextResponse("Category ID is required", { status: 400 })
    } 
    if (!sizeId) {
      return new NextResponse("Size ID is required", { status: 400 })
    }
    if (!colorId) {
      return new NextResponse("Color ID is required", { status: 400 })
    }
    if (!price) {
      return new NextResponse("Price is required", { status: 400 })
    }
    if(!storeId){
      return new NextResponse("Store ID is required", { status: 400 })
    }
    
    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: storeId,
        userId
      }
    })
    if(!storeByUserId){
      return new NextResponse("Unauthorized", { status: 403 })
    }
    const product = await prismadb.product.create({
      data:{
        name,
        price,
        categoryId,
        colorId,
        sizeId,
        isArchived,
        isFeatured,
        images: {
          createMany: {
            data: [
              ...images.map((image: {url: string}) => image)
            ]
          }
        },
        storeId
      }
    })
    return NextResponse.json(product)
  } catch (error) {
    console.log('[PRODUCTS_POST]', error);
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}



export async function GET(req: Request, {params: {storeId , ...params}}: {params: {storeId : string}} ) {
  try {
   const  { searchParams } = new URL(req.url);
   const categoryId  = searchParams.get("categoryId") || undefined 
   const sizeId  = searchParams.get("sizeId") || undefined 
   const colorId  = searchParams.get("colorId") || undefined 
   const isFeatured  = searchParams.get("isFeatured") || undefined 
    if(!storeId){
      return new NextResponse("Store ID is required", { status: 400 })
    }
    
  
    const products = await prismadb.product.findMany({
      where:{
        storeId,
        categoryId,
        sizeId,
        colorId,
        isFeatured: isFeatured ? true: undefined,
        isArchived: false
      },
      include: {
        color: true,
        category: true,
        size: true,
        images: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    return NextResponse.json(products)
  } catch (error) {
    console.log('[PRODUCTS_GET]', error);
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}