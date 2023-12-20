'use client'

import { Badge } from '@/components/ui/badge'
import { useToast } from "@/components/ui/use-toast"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"
import { buttonVariants } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from 'react-hook-form'

import * as z from 'zod'
import { useEffect, useState } from 'react'

const productSchema = z.object({
  productName: z.string(),
  numberInStock: z.string(),
  price: z.string(),
  productImage: z.string()
})


export default function Page() {
  const { toast } = useToast()

  const [products, setProducts] = useState<z.infer<typeof productSchema>[]>([])

  useEffect(() => {
    const storedProducts = getProduct()
    console.log(storedProducts)
    setProducts(storedProducts)
  }, [])

  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      productImage: "",
    },
  })

  function getProduct() {
    try {
      const storedProducts = localStorage.getItem("PRODUCTS")
      if (storedProducts === null) {
        return []
      }
      return JSON.parse(storedProducts) as z.infer<typeof productSchema>[]
    } catch (error) {
      console.log(error)
      return []
    }
  }

  function addProduct(values: z.infer<typeof productSchema>) {
    const newProducts = [...products, values]
    setProducts(newProducts)
    localStorage.setItem("PRODUCTS", JSON.stringify(newProducts))
  }

  function onSubmit(values: z.infer<typeof productSchema>) {
    console.log(values)
    toast({
      title: "Item added",
      description: `${values.numberInStock} ${values.productName}(s) with the price of PHP ${values.price} was added to the products list`,
    })

    addProduct(values)

    form.reset({
      productName: '',
      numberInStock: '',
      price: '',
      productImage: '',
    })
  }

  return (
    <div className='flex flex-col m-4 gap-4 text-center'>
      <div className='flex gap-2'>
        <Input type='text' placeholder='search items' />
        <Button>Search</Button>
      </div>
      <div>
        {AddProductForm(form, onSubmit)}
      </div>
      <div className='grid 2xl:grid-cols-4 xl:grid-cols-3 lg:grid-cols-2 gap-4 m-auto'>
        {
          products.map((item) => {
            return (
              Product(Date.now(), item.productName, item.price, item.numberInStock)
            )
          })
        }
      </div>
    </div>
  )
}

function Product(key: number, itemName: string, itemPrice: string, numberInStock: string) {
  return (
    <>
      <div className='flex flex-col p-4 border border-1 rounded-lg w-max gap-2' key={key}>
        <div className='border border-1 rounded-md h-[200px] w-[200px] m-auto flex flex-col justify-center text-center'>
          <span>Product image...</span>
        </div>
        <div className='grid grid-cols-3 gap-2'>
          <Badge variant="outline">Beverage</Badge>
          <Badge variant="outline">Food</Badge>
          <Badge variant="outline">Produce</Badge>
        </div>
        <div className='flex justify-between'>
          <span>{itemName}</span>
          <span>${itemPrice}</span>
        </div>
        <span>Item in stock: {numberInStock}</span>
      </div>
    </>
  )
}

function AddProductForm(form: any, onSubmit: any) {
  return (
    <>
      <Dialog>
        <DialogTrigger className={buttonVariants({ variant: "default" })}>Add product</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add a product</DialogTitle>
            <DialogDescription>
              Adding a product makes it available to be purchased or added to cart
            </DialogDescription>
          </DialogHeader>
          <div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="productImage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product image</FormLabel>
                      <FormControl>
                        <Input type='file' {...field} />
                      </FormControl>
                      <FormDescription>
                        Item preview image
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="productName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product name</FormLabel>
                      <FormControl>
                        <Input placeholder="product name" required {...field} />
                      </FormControl>
                      <FormDescription>
                        This name will be shown as the item label
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="numberInStock"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number in stock</FormLabel>
                      <FormControl>
                        <Input type='number' placeholder="stock number" required {...field} />
                      </FormControl>
                      <FormDescription>
                        Number available in stock
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Item price</FormLabel>
                      <FormControl>
                        <Input type='number' placeholder="Item price" required {...field} />
                      </FormControl>
                      <FormDescription>
                        Item price
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">Submit</Button>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}