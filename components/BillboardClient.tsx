"use client"

import { Plus } from "lucide-react"
import Heading from "./ui/Heading"
import { Button } from "./ui/Button"
import { Separator } from "./ui/Separator"
import { useParams, useRouter } from "next/navigation"

const BillboardClient = () => {
  const router = useRouter();
  const params = useParams();
  return (
    <>
      <div className="flex items-center justify-between ">
        <Heading title="Billboards (0)" description="Manage billboards for your store" />
        <Button onClick={() => router.push(`/${params.storeId}/billboards/new`)}>
          <Plus className="w-4 h-4 mr-2" />
          Add New
        </Button>
      </div>
      <Separator />
    </>
  )
}

export default BillboardClient