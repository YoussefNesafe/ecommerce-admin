"use client"
import { ComponentPropsWithoutRef, useState } from "react"
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/Popover'
import { Store } from "@prisma/client"
import { useStoreModal } from "@/hooks/use-store-modal"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/Button"
import { Check, ChevronsUpDown, PlusCircle, Store as StoreIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem, CommandSeparator } from "@/components/ui/Command"

type PopoverTriggerProps = ComponentPropsWithoutRef<typeof PopoverTrigger>

interface IStoreSwitcherProps extends PopoverTriggerProps {
  items: Store[]
}
const StoreSwitcher = ({ className, items = [] }: IStoreSwitcherProps) => {
  const [open, setOpen] = useState<boolean>(false)

  const storeModal = useStoreModal();
  const params = useParams();
  const router = useRouter();


  const formattedItems = items.map(item => ({
    label: item.name,
    value: item.id
  }))

  const currentStore = formattedItems.find((item) => item.value === params.storeId);

  const onStoreSelect = (value: string) => {
    setOpen(false);
    router.push(`/${value}`);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          size='sm'
          role="combobox"
          aria-expanded={open}
          aria-label="Select a store"
          className={cn('w-[200px] justify-between', className)}
        >
          <StoreIcon className="w-4 h-4 mr-2" />
          {currentStore?.label}
          <ChevronsUpDown className="w-4 h-4 ml-auto opacity-50 shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandList>
            <CommandInput placeholder="Search store..." />
            <CommandEmpty >No store found.</CommandEmpty>
            <CommandGroup heading="Stores">
              {formattedItems.map(({ value, label }) => (
                <CommandItem key={value}
                  onSelect={() => onStoreSelect(value)}
                  className="text-sm"
                >
                  <StoreIcon className="w-4 h-4 mr-2" />
                  {label}
                  <Check className={cn('ml-auto h-4 w-4 opacity-0', currentStore?.value === value && 'opacity-100')} />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
          <CommandSeparator />
          <CommandList>
            <CommandGroup>
              <CommandItem onSelect={() => {
                setOpen(false);
                storeModal.onOpen()
              }} >
                <PlusCircle className="w-5 h-5 mr-2" />
                Create Store
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export default StoreSwitcher