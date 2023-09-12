
import { format } from 'date-fns'
import OrderClient from "@/components/order/OrderClient"
import prismadb from "@/lib/prismadb"
import { OrderColumn } from '@/components/order/Columns'
import { priceFormatter } from '@/lib/utils'

const Orders = async ({ params }: {
  params: {
    storeId: string
  }
}) => {
  const orders = await prismadb.order.findMany({
    where: {
      storeId: params.storeId
    },
    include: {
      orderItems: {
        include: {
          product: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })
  const formatedOrders: OrderColumn[] = orders.map(item => ({
    id: item.id,
    phone: item.phone,
    address: item.address,
    products: item.orderItems.map(orderItem => orderItem.product.name).join(', '),
    totalPrice: priceFormatter(item.orderItems.reduce((total, item) => total + Number(item.product.price), 0)),
    isPaid: item.isPaid,
    createdAt: format(item.createdAt, "MMMM do, yyyy")
  }))
  return (
    <div className="flex-col">
      <div className="flex-1 p-8 pt-6 space-y-4">
        <OrderClient data={formatedOrders} />
      </div>
    </div>
  )
}

export default Orders