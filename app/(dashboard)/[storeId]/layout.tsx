import { ReactNode } from "react";
import Navbar from "@/components/Navbar";
import { getFirstStoreByID } from "@/utils/getFirstStoreByID";

export default async function DashboardLayout({
  children,
  params
}: { children: ReactNode, params: { storeId: string } }) {
  const store = await getFirstStoreByID({ id: params.storeId })
  return (
    <>
      <Navbar />
      {children}
    </>
  )
}