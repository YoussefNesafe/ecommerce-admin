
import { format } from 'date-fns'
import prismadb from "@/lib/prismadb"
import { CategoryColumn } from '@/components/category/Columns'
import CategoryClient from '@/components/category/CategoryClient'

const Categories = async ({ params }: {
  params: {
    storeId: string
  }
}) => {
  const categories = await prismadb.category.findMany({
    where: {
      storeId: params.storeId
    },
    include: {
      billboard: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  })
  const formatedCategories: CategoryColumn[] = categories.map(item => ({
    id: item.id,
    name: item.name,
    billboardLabel: item.billboard.label,
    createdAt: format(item.createdAt, "MMMM do, yyyy")
  }))
  return (
    <div className="flex-col">
      <div className="flex-1 p-8 pt-6 space-y-4">
        <CategoryClient data={formatedCategories} />
      </div>
    </div>
  )
}

export default Categories