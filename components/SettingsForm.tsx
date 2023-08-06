"use client"

import { Store } from "@prisma/client"
import { FC } from "react"
import Heading from "@/components/ui/Heading"
import { Button } from "@/components/ui/Button"
import { Trash } from "lucide-react"
import { Separator } from "@/components/ui/Separator"

interface IProps {
  initialData: Store
}

const SettingsForm: FC<IProps> = ({ initialData }) => {
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title="Settings" description="Manage store preferences" />
        <Button variant='destructive' size='icon' onClick={() => { }}>
          <Trash className="w-4 h-4" />
        </Button>
      </div>
      <Separator />
    </>
  )
}

export default SettingsForm