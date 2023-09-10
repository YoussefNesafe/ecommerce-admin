"use client"
import * as z from 'zod'
import { Size } from "@prisma/client"
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
  initialData: Size | null
}

const formSchema = z.object({
  name: z.string().min(1),
  value: z.string().min(1),
})

type SizeFormValues = z.infer<typeof formSchema>

const SizeForm: FC<IProps> = ({ initialData }) => {
  const params = useParams();
  const router = useRouter();
  const [open, setOpen] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  const form = useForm<SizeFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: '',
      value: ''
    }
  });
  const formType = initialData ? 'update' : 'create'
  const FORM_TEXTS = {
    create: {
      title: 'Create size',
      description: "Add a new size",
      toastMessage: "Size created.",
      action: 'Create'
    },
    update: {
      title: 'Edit size',
      description: "Edit a size",
      toastMessage: "Size updated.",
      action: 'Save changes'
    }
  }
  const { action, description, title, toastMessage } = FORM_TEXTS[formType]

  const onSubmit = async (data: SizeFormValues) => {
    try {
      setLoading(true)
      if (initialData) {
        await axios.patch(`/api/${params.storeId}/sizes/${params.sizeId}`, data);
      } else {
        await axios.post(`/api/${params.storeId}/sizes`, data);
      }
      router.refresh();
      router.push(`/${params.storeId}/sizes`)
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
      await axios.delete(`/api/${params.storeId}/sizes/${params.sizeId}`);
      router.refresh();
      router.push(`/${params.storeId}/sizes`)
      toast.success("Size deleted.");
    } catch (error) {
      toast.error("Make sure you removed all categories using this size first.")
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
          initialData ? <Button disabled={loading} variant='destructive' size='icon' onClick={() => setOpen(true)}>
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
                  <Input disabled={loading} placeholder='Size name' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name='value' render={({ field }) => (
              <FormItem>
                <FormLabel>Value</FormLabel>
                <FormControl>
                  <Input disabled={loading} placeholder='Size Value' {...field} />
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

export default SizeForm