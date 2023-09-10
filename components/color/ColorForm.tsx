"use client"
import * as z from 'zod'
import { Color } from "@prisma/client"
import { FC, useState } from "react"
import Heading from "@/components/ui/Heading"
import { Button } from "@/components/ui/Button"
import { Trash } from "lucide-react"
import { Separator } from "@/components/ui/Separator"
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/Form'
import toast from 'react-hot-toast'
import axios from 'axios'
import { useParams, useRouter } from 'next/navigation'
import AlertModal from '../modals/AlertModal'
import ImageUpload from '../ui/ImageUpload'
import { Input } from '../ui/Input'

interface IProps {
  initialData: Color | null
}

const formSchema = z.object({
  name: z.string().min(1),
  value: z.string().min(1),
})

type ColorFormValues = z.infer<typeof formSchema>

const ColorForm: FC<IProps> = ({ initialData }) => {
  const params = useParams();
  const router = useRouter();
  const [open, setOpen] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  const form = useForm<ColorFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: '',
      value: ''
    }
  });
  const formType = initialData ? 'update' : 'create'
  const FORM_TEXTS = {
    create: {
      title: 'Create color',
      description: "Add a new color",
      toastMessage: "Color created.",
      action: 'Create'
    },
    update: {
      title: 'Edit color',
      description: "Edit a color",
      toastMessage: "Color updated.",
      action: 'Save changes'
    }
  }
  const { action, description, title, toastMessage } = FORM_TEXTS[formType]

  const onSubmit = async (data: ColorFormValues) => {
    try {
      setLoading(true)
      if (initialData) {
        await axios.patch(`/api/${params.storeId}/colors/${params.colorId}`, data);
      } else {
        await axios.post(`/api/${params.storeId}/colors`, data);
      }
      router.refresh();
      router.push(`/${params.storeId}/colors`)
      toast.success(toastMessage)
    } catch (error) {
      toast.error("Something went wrong.")
    } finally {
      setLoading(false)
    }
  }
  const onDelete = async () => {
    try {
      setLoading(true)
      await axios.delete(`/api/${params.storeId}/colors/${params.colorId}`);
      router.refresh();
      router.push(`/${params.storeId}/colors`)
      toast.success("Color deleted.");
    } catch (error) {
      toast.error("Make sure you removed all products using this color first.")
    } finally {
      setLoading(false)
    }
  }
  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {
          initialData ? <Button disabled={loading} variant='destructive' color='icon' onClick={() => setOpen(true)}>
            <Trash className="w-4 h-4" />
          </Button> : null
        }
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='w-full space-y-8'>

          <div className='grid grid-cols-1 gap-4 md:gap-8 md:grid-cols-2 lg:grid-cols-3'>
            <FormField control={form.control} name='name' render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input disabled={loading} placeholder='Color name' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name='value' render={({ field }) => (
              <FormItem>
                <FormLabel>Value</FormLabel>
                <FormControl>
                  <div className='flex items-center gap-x-4'>
                    <Input disabled={loading} placeholder='Color Value' {...field} />
                    <div className='p-4 border rounded-full' style={{ backgroundColor: field.value }} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

          </div>
          <Button disabled={loading} type='submit' className='w-full ml-auto md:w-fit'>{action}</Button>
        </form>
      </Form>
      <Separator />
    </>
  )
}

export default ColorForm