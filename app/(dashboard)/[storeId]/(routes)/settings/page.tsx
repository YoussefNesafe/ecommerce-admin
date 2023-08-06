import SettingsForm from "@/components/SettingsForm";
import { getFirstStoreByID } from "@/utils/getFirstStoreByID";
import { FC } from "react"

interface IProps {
  params: {
    storeId: string
  }
}
const SettingsPage: FC<IProps> = async ({ params }) => {
  const store = await getFirstStoreByID({ id: params.storeId })
  return (
    <div className="flex-col">
      <div className="flex-1 p-8 pt-6 space-y-4">
        <SettingsForm initialData={store} />
      </div>
    </div>
  )
}

export default SettingsPage