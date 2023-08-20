"use client"

import { Plus } from "lucide-react"
import Heading from "../ui/Heading"
import { Button } from "../ui/Button"
import { Separator } from "../ui/Separator"
import { useParams, useRouter } from "next/navigation"
import { FC } from "react"
import { BillboardColumn, columns } from "./Columns"
import { DataTable } from "../ui/DataTable"

interface IBillboardClientProps {
  data: BillboardColumn[]
}

const BillboardClient: FC<IBillboardClientProps> = ({ data }) => {
  const router = useRouter();
  const params = useParams();
  return (
    <>
      <div className="flex items-center justify-between ">
        <Heading title={`Billboards (${data.length})`} description="Manage billboards for your store" />
        <Button onClick={() => router.push(`/${params.storeId}/billboards/new`)}>
          <Plus className="w-4 h-4 mr-2" />
          Add New
        </Button>
      </div>
      <Separator />
      <DataTable columns={columns} data={data} serchKey="label" />
    </>
  )
}

export default BillboardClient