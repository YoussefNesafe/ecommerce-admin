"use client"
import * as z from 'zod'
import { Store } from "@prisma/client"
import { FC, useState } from "react"
import Heading from "@/components/ui/Heading"
import { Button } from "@/components/ui/Button"
import { Trash } from "lucide-react"
import { Separator } from "@/components/ui/Separator"
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/Form'
import { Input } from './ui/Input'

interface IProps {
  initialData: Store
}

const formSchema = z.object({
  name: z.string().min(1),
})

type SettingFormValues = z.infer<typeof formSchema>

const SettingsForm: FC<IProps> = ({ initialData }) => {

  const [open, setOpen] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  const form = useForm<SettingFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
  });

  const onSubmit = async (data: SettingFormValues) => {
    console.log(data)
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title="Settings" description="Manage store preferences" />
        <Button disabled={loading} variant='destructive' size='icon' onClick={() => { }}>
          <Trash className="w-4 h-4" />
        </Button>
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='w-full space-y-8'>
          <div className='grid grid-cols-3 gap-8'>
            <FormField control={form.control} name='name' render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input disabled={loading} placeholder='Store name' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>
          <Button disabled={loading} type='submit' className='ml-auto'>Save changes</Button>
        </form>
      </Form>
    </>
  )
}

export default SettingsForm