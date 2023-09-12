"use client"
import * as z from 'zod'
import { Category, Color, Image, Product, Size } from "@prisma/client"
import { FC, useState } from "react"
import Heading from "@/components/ui/Heading"
import { Button } from "@/components/ui/Button"
import { Trash } from "lucide-react"
import { Separator } from "@/components/ui/Separator"
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/Form'
import toast from 'react-hot-toast'
import axios from 'axios'
import { useParams, useRouter } from 'next/navigation'
import AlertModal from '../modals/AlertModal'
import ImageUpload from '../ui/ImageUpload'
import { Input } from '../ui/Input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Checkbox } from '../ui/checkbox'

interface IProps {
  initialData: Product & { images: Image[] } | null;
  categories: Category[];
  sizes: Size[];
  colors: Color[];
}

const formSchema = z.object({
  name: z.string().min(1),
  images: z.object({ url: z.string() }).array(),
  price: z.coerce.number().min(1),
  categoryId: z.string().min(1),
  colorId: z.string().min(1),
  sizeId: z.string().min(1),
  isFeatured: z.boolean().default(false).optional(),
  isArchived: z.boolean().default(false).optional(),
})

type ProductFormValues = z.infer<typeof formSchema>

const ProductForm: FC<IProps> = ({ initialData, categories, sizes, colors }) => {
  const params = useParams();
  const router = useRouter();
  const [open, setOpen] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ? {
      ...initialData,
      price: parseFloat(String(initialData?.price))
    } : {
      name: '',
      images: [],
      price: 0,
      categoryId: '',
      colorId: '',
      sizeId: '',
      isFeatured: false,
      isArchived: false,
    }
  });
  const formType = initialData ? 'update' : 'create'
  const FORM_TEXTS = {
    create: {
      title: 'Create product',
      description: "Add a new product",
      toastMessage: "Product created.",
      action: 'Create'
    },
    update: {
      title: 'Edit product',
      description: "Edit a product",
      toastMessage: "Product updated.",
      action: 'Save changes'
    }
  }
  const { action, description, title, toastMessage } = FORM_TEXTS[formType]

  const onSubmit = async (data: ProductFormValues) => {
    try {
      setLoading(true)
      if (initialData) {
        await axios.patch(`/api/${params.storeId}/products/${params.productId}`, data);
      } else {
        await axios.post(`/api/${params.storeId}/products`, data);
      }
      router.refresh();
      router.push(`/${params.storeId}/products`)
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
      await axios.delete(`/api/${params.storeId}/products/${params.productId}`);
      router.refresh();
      router.push(`/${params.storeId}/products`)
      toast.success("Product deleted.");
    } catch (error) {
      toast.error("Something went wrong.")
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
          <FormField control={form.control} name='images' render={({ field }) => (
            <FormItem>
              <FormLabel>Images</FormLabel>
              <FormControl>
                <ImageUpload
                  value={field.value.map((image) => image.url)}
                  disabled={loading}
                  onChange={(url) => field.onChange([...field.value, { url }])}
                  onRemove={(url) => field.onChange([...field.value.filter(current => current.url !== url)])}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <div className='grid grid-cols-1 gap-4 md:gap-8 md:grid-cols-2 lg:grid-cols-3'>
            <FormField control={form.control} name='name' render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input disabled={loading} placeholder='Product name' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name='price' render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input type='number' disabled={loading} placeholder='9.99' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name='categoryId' render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value} >
                  <FormControl>
                    <SelectTrigger >
                      <SelectValue defaultValue={field.value} placeholder='Select a category' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map(({ id, name }) => (<SelectItem key={`${id}`} value={id}>
                      {name}
                    </SelectItem>))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name='sizeId' render={({ field }) => (
              <FormItem>
                <FormLabel>Size</FormLabel>
                <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value} >
                  <FormControl>
                    <SelectTrigger >
                      <SelectValue defaultValue={field.value} placeholder='Select a size' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {sizes.map(({ id, value, name }) => (<SelectItem key={`${id}`} value={id}>
                      {value} ({name})
                    </SelectItem>))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name='colorId' render={({ field }) => (
              <FormItem>
                <FormLabel>Color</FormLabel>
                <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value} >
                  <FormControl>
                    <SelectTrigger >
                      <SelectValue defaultValue={field.value} placeholder='Select a color' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {colors.map(({ id, name, value }) => (<SelectItem key={`${id}`} value={id}>
                      <div className='flex items-center gap-x-2'>
                        <div className='p-2 border rounded-full' style={{ backgroundColor: value }} />
                        {name}
                      </div>
                    </SelectItem>))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            <div />
            <FormField control={form.control} name='isFeatured' render={({ field }) => (
              <FormItem className='flex items-start p-4 space-x-3 space-y-0 border rounded-md'>
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    //@ts-ignore
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className='space-y-1 leading-none'>
                  <FormLabel>
                    Featured
                  </FormLabel>
                  <FormDescription>
                    This product will appear on the home page
                  </FormDescription>
                </div>
              </FormItem>
            )} />
            <FormField control={form.control} name='isArchived' render={({ field }) => (
              <FormItem className='flex items-start p-4 space-x-3 space-y-0 border rounded-md'>
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    //@ts-ignore
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className='space-y-1 leading-none'>
                  <FormLabel>
                    Archived
                  </FormLabel>
                  <FormDescription>
                    This product will not appear anywhere in the store
                  </FormDescription>
                </div>
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

export default ProductForm