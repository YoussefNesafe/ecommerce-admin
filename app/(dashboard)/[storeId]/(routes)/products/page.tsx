
import { format } from 'date-fns'
import ProductClient from "@/components/product/ProductClient"
import prismadb from "@/lib/prismadb"
import { ProductColumn } from '@/components/product/Columns'
import { priceFormatter } from '@/lib/utils'

const Products = async ({ params }: {
  params: {
    storeId: string
  }
}) => {
  const products = await prismadb.product.findMany({
    where: {
      storeId: params.storeId
    },
    include: {
      category: true,
      size: true,
      color: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  })
  const formatedProducts: ProductColumn[] = products.map(item => ({
    id: item.id,
    name: item.name,
    isFeatured: item.isFeatured,
    isArchived: item.isArchived,
    price: priceFormatter(item.price),
    category: item.category.name,
    size: item.size.name,
    color: item.color.value,
    createdAt: format(item.createdAt, "MMMM do, yyyy")
  }))
  return (
    <div className="flex-col">
      <div className="flex-1 p-8 pt-6 space-y-4">
        <ProductClient data={formatedProducts} />
      </div>
    </div>
  )
}

export default Products