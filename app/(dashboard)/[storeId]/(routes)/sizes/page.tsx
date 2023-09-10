
import { format } from 'date-fns'
import prismadb from "@/lib/prismadb"
import { SizeColumn } from '@/components/size/Columns'
import SizeClient from '@/components/size/SizeClient'

const Sizes = async ({ params }: {
  params: {
    storeId: string
  }
}) => {
  const sizes = await prismadb.size.findMany({
    where: {
      storeId: params.storeId
    },
    orderBy: {
      createdAt: 'desc'
    }
  })
  const formatedSizes: SizeColumn[] = sizes.map(item => ({
    id: item.id,
    name: item.name,
    value: item.value,
    createdAt: format(item.createdAt, "MMMM do, yyyy")
  }))
  return (
    <div className="flex-col">
      <div className="flex-1 p-8 pt-6 space-y-4">
        <SizeClient data={formatedSizes} />
      </div>
    </div>
  )
}

export default Sizes