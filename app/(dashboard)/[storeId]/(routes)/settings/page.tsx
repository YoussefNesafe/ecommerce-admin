import prismadb from "@/lib/prismadb";
import { getFirstStoreByID } from "@/utils/getFirstStoreByID";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { FC } from "react"

interface IProps {
  params: {
    storeId: string
  }
}
const SettingsPage: FC<IProps> = async ({ params }) => {
  const store = await getFirstStoreByID({ id: params.storeId })
  return (
    <div>{store.name}</div>
  )
}

export default SettingsPage