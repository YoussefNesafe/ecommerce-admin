"use client"
import * as z from 'zod'
import { Billboard } from "@prisma/client"
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
  initialData: Billboard | null
}

const formSchema = z.object({
  label: z.string().min(1),
  imageUrl: z.string().min(1),
})

type BillboardFormValues = z.infer<typeof formSchema>

const BillboardForm: FC<IProps> = ({ initialData }) => {
  const params = useParams();
  const router = useRouter();
  const [open, setOpen] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  const form = useForm<BillboardFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      label: '',
      imageUrl: ''
    }
  });
  const formType = initialData ? 'update' : 'create'
  const FORM_TEXTS = {
    create: {
      title: 'Create billboard',
      description: "Add a new billboard",
      toastMessage: "Billboard created.",
      action: 'Create'
    },
    update: {
      title: 'Edit billboard',
      description: "Edit a billboard",
      toastMessage: "Billboard updated.",
      action: 'Save changes'
    }
  }
  const { action, description, title, toastMessage } = FORM_TEXTS[formType]

  const onSubmit = async (data: BillboardFormValues) => {
    try {
      setLoading(true)
      if (initialData) {
        await axios.patch(`/api/${params.storeId}/billboards/${params.billboardId}`, data);
      } else {
        await axios.post(`/api/${params.storeId}/billboards`, data);
      }
      router.refresh();
      router.push(`/${params.storeId}/billboards`)
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
      await axios.delete(`/api/${params.storeId}/billboards/${params.billboardId}`);
      router.refresh();
      router.push(`/${params.storeId}/billboards`)
      toast.success("Billboard deleted.");
    } catch (error) {
      toast.error("Make sure you removed all categories using this billboard first.")
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
          <FormField control={form.control} name='imageUrl' render={({ field }) => (
            <FormItem>
              <FormLabel>Background image</FormLabel>
              <FormControl>
                <ImageUpload
                  value={field.value ? [field.value] : []}
                  disabled={loading}
                  onChange={(url) => field.onChange(url)}
                  onRemove={() => field.onChange("")}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <div className='grid grid-cols-3 gap-8'>
            <FormField control={form.control} name='label' render={({ field }) => (
              <FormItem>
                <FormLabel>Label</FormLabel>
                <FormControl>
                  <Input disabled={loading} placeholder='Store name' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

          </div>
          <Button disabled={loading} type='submit' className='ml-auto'>{action}</Button>
        </form>
      </Form>
      <Separator />
    </>
  )
}

export default BillboardForm