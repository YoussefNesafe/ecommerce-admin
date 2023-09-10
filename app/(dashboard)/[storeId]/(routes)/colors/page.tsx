
import { format } from 'date-fns'
import prismadb from "@/lib/prismadb"
import { ColorColumn } from '@/components/color/Columns'
import ColorClient from '@/components/color/ColorClient'

const Colors = async ({ params }: {
  params: {
    storeId: string
  }
}) => {
  const colors = await prismadb.color.findMany({
    where: {
      storeId: params.storeId
    },
    orderBy: {
      createdAt: 'desc'
    }
  })
  const formatedColors: ColorColumn[] = colors.map(item => ({
    id: item.id,
    name: item.name,
    value: item.value,
    createdAt: format(item.createdAt, "MMMM do, yyyy")
  }))
  return (
    <div className="flex-col">
      <div className="flex-1 p-8 pt-6 space-y-4">
        <ColorClient data={formatedColors} />
      </div>
    </div>
  )
}

export default Colors