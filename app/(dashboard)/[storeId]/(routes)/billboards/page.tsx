
import { format } from 'date-fns'
import BillboardClient from "@/components/billboard/BillboardClient"
import prismadb from "@/lib/prismadb"
import { BillboardColumn } from '@/components/billboard/Columns'

const Billboards = async ({ params }: {
  params: {
    storeId: string
  }
}) => {
  const billboards = await prismadb.billboard.findMany({
    where: {
      storeId: params.storeId
    },
    orderBy: {
      createdAt: 'desc'
    }
  })
  const formatedBillboards: BillboardColumn[] = billboards.map(item => ({
    id: item.id,
    label: item.label,
    createdAt: format(item.createdAt, "MMMM do, yyyy")
  }))
  return (
    <div className="flex-col">
      <div className="flex-1 p-8 pt-6 space-y-4">
        <BillboardClient data={formatedBillboards} />
      </div>
    </div>
  )
}

export default Billboards