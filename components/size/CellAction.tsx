"use client"

import { FC, useState } from "react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { Button } from "../ui/Button"
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react"
import { copyToClipboard } from "@/utils/copyToClipboard"
import { useParams, useRouter } from "next/navigation"
import axios from "axios"
import toast from "react-hot-toast"
import AlertModal from "../modals/AlertModal"
import { SizeColumn } from "./Columns"


type IProps = {
  data: SizeColumn
}

const CellAction: FC<IProps> = ({ data: { id, createdAt, name, value } }) => {
  const params = useParams();
  const router = useRouter();
  const [open, setOpen] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const updateHandler = () => router.push(`/${params.storeId}/sizes/${id}`);
  const deletehandler = async () => {
    try {
      setLoading(true)
      await axios.delete(`/api/${params.storeId}/sizes/${id}`);
      router.refresh();
      router.push(`/${params.storeId}/sizes`)
      toast.success("Size deleted.");
    } catch (error) {
      toast.error("Make sure you removed all products using this size first.")
    } finally {
      setLoading(false)
    }
  }
  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={deletehandler}
        loading={loading}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' className="w-8 h-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>
            Actions
          </DropdownMenuLabel>
          <DropdownMenuItem onClick={() => copyToClipboard({ text: id })}>
            <Copy className="w-4 h-4 mr-2" />
            Copy ID
          </DropdownMenuItem>
          <DropdownMenuItem onClick={updateHandler}>
            <Edit className="w-4 h-4 mr-2" />
            Update
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Trash className="w-4 h-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

export default CellAction