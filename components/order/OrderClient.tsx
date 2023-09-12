"use client"

import Heading from "../ui/Heading"
import { Separator } from "../ui/Separator"
import { FC } from "react"
import { DataTable } from "../ui/DataTable"
import { OrderColumn, columns } from "./Columns"

interface IOrderClientProps {
  data: OrderColumn[]
}

const OrderClient: FC<IOrderClientProps> = ({ data }) => {

  return (
    <>
      <Heading title={`Orders (${data.length})`} description="Manage orders for your store" />
      <Separator />
      <DataTable columns={columns} data={data} serchKey="products" />
    </>
  )
}

export default OrderClient