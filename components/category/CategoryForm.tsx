"use client"
import * as z from 'zod'
import { Billboard, Category } from "@prisma/client"
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
import { Input } from '../ui/Input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'

interface IProps {
  initialData: Category | null;
  billboards: Billboard[]
}

const formSchema = z.object({
  name: z.string().min(1),
  billboardId: z.string().min(1),
})

type CategoryFormValues = z.infer<typeof formSchema>

const CategoryForm: FC<IProps> = ({ initialData, billboards }) => {
  const params = useParams();
  const router = useRouter();
  const [open, setOpen] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: '',
      billboardId: ''
    }
  });
  const formType = initialData ? 'update' : 'create'
  const FORM_TEXTS = {
    create: {
      title: 'Create category',
      description: "Add a new category",
      toastMessage: "Category created.",
      action: 'Create'
    },
    update: {
      title: 'Edit category',
      description: "Edit a category",
      toastMessage: "Category updated.",
      action: 'Save changes'
    }
  }
  const { action, description, title, toastMessage } = FORM_TEXTS[formType]

  const onSubmit = async (data: CategoryFormValues) => {
    try {
      setLoading(true)
      if (initialData) {
        await axios.patch(`/api/${params.storeId}/category]ies/${params.categoryId}`, data);
      } else {
        await axios.post(`/api/${params.storeId}/categories`, data);
      }
      router.refresh();
      router.push(`/${params.storeId}/categories`)
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
      await axios.delete(`/api/${params.storeId}/categories/${params.categoryId}`);
      router.refresh();
      router.push(`/${params.storeId}/categories`)
      toast.success("Category deleted.");
    } catch (error) {
      toast.error("Make sure you removed all products using this category first.")
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
                  <Input disabled={loading} placeholder='Category name' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name='billboardId' render={({ field }) => (
              <FormItem>
                <FormLabel>Billboard</FormLabel>
                <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value} >
                  <FormControl>
                    <SelectTrigger >
                      <SelectValue defaultValue={field.value} placeholder='Select a billboard' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {billboards.map(({ id, label }) => (<SelectItem key={`${id}`} value={id}>
                      {label}
                    </SelectItem>))}
                  </SelectContent>
                </Select>
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

export default CategoryForm