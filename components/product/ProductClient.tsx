"use client"

import { Plus } from "lucide-react"
import Heading from "../ui/Heading"
import { Button } from "../ui/Button"
import { Separator } from "../ui/Separator"
import { useParams, useRouter } from "next/navigation"
import { FC } from "react"
import { DataTable } from "../ui/DataTable"
import ApiList from "../ui/ApiList"
import useOrigin from "@/hooks/useOrigin"
import { IApiAlertProps } from "../ui/ApiAlert"
import { ProductColumn, columns } from "./Columns"

interface IClientProps {
  data: ProductColumn[]
}

const ProductClient: FC<IClientProps> = ({ data }) => {
  const router = useRouter();
  const params = useParams();
  const origin = useOrigin();

  const baseUrl = `${origin}/api/${params.storeId}`
  const ENTITY_NAME = "products"
  const ENTITY_ID_NAME = "productId"
  const API_DATA = [
    {
      title: "GET",
      variant: "public",
      description: `${baseUrl}/${ENTITY_NAME}`
    },
    {
      title: "GET",
      variant: "public",
      description: `${baseUrl}/${ENTITY_NAME}/{${ENTITY_ID_NAME}}`
    },
    {
      title: "POST",
      variant: "admin",
      description: `${baseUrl}/${ENTITY_NAME}`
    },
    {
      title: "PATCH",
      variant: "admin",
      description: `${baseUrl}/${ENTITY_NAME}/{${ENTITY_ID_NAME}}`
    },
    {
      title: "DELETE",
      variant: "admin",
      description: `${baseUrl}/${ENTITY_NAME}/{${ENTITY_ID_NAME}}`
    }

  ] as IApiAlertProps[]
  return (
    <>
      <div className="flex items-center justify-between ">
        <Heading title={`Products (${data.length})`} description="Manage products for your store" />
        <Button onClick={() => router.push(`/${params.storeId}/products/new`)}>
          <Plus className="w-4 h-4 mr-2" />
          Add New
        </Button>
      </div>
      <Separator />
      <DataTable columns={columns} data={data} serchKey="name" />
      <Heading title="API" description="API calls for Products" />
      <Separator />
      <ApiList data={API_DATA} />
    </>
  )
}

export default ProductClient