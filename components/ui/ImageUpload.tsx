"use client"

import { FC } from "react"
import { Button } from "./Button"
import { ImagePlus, Trash } from "lucide-react"
import { CldUploadWidget } from "next-cloudinary"
import Image from "next/image"



interface IProps {
  disabled?: boolean,
  onChange: (value: string) => void
  onRemove: (value: string) => void
  value: string[]
}

const ImageUpload: FC<IProps> = ({ disabled, onChange, onRemove, value }) => {
  const onUpload = (result: any) => {
    onChange(result.info.secure_url)
  }
  return (
    <div>
      <div className="flex flex-col flex-wrap items-center gap-2 mb-4 md:gap-4 md:flex-row">{value.map((url) => (
        <div key={url} className="relative w-[300px] h-[300px] md:w-[250px] md:h-[250px] lg:w-[300px] lg:h-[300px] rounded-md overflow-hidden">
          <div className="absolute z-10 top-2 right-2">
            <Button type="button" variant='destructive' size='icon' onClick={() => onRemove(url)}>
              <Trash className="w-4 h-4" />
            </Button>
          </div>
          <Image fill className="object-cover" alt="Image" src={url} />
        </div>
      ))}</div>
      <CldUploadWidget onUpload={onUpload} uploadPreset="cgn8qtap">
        {({ open }) => {
          const onClick = () => {
            open();
          }
          return (
            <Button type="button" disabled={disabled} variant='secondary' onClick={onClick}>
              <ImagePlus className="w-4 h-4 mr-2" />
              Upload an image
            </Button>
          )
        }}
      </CldUploadWidget>
    </div>
  )
}

export default ImageUpload