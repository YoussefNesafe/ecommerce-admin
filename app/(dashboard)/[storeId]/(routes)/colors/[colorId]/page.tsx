import ColorForm from "@/components/color/ColorForm"
import prismadb from "@/lib/prismadb"

const BillboardPage = async ({
  params
}: {
  params: { colorId: string }
}) => {

  const color = await prismadb.color.findUnique({
    where: {
      id: params.colorId
    }
  })

  return (
    <div className="flex-col">
      <div className="flex-1 p-8 pt-6 space-y-4">
        <ColorForm initialData={color} />
      </div>
    </div>
  )
}

export default BillboardPage