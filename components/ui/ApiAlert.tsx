"use client"

import { FC } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/Alert";
import { Copy, Server } from "lucide-react";
import { Badge, BadgeProps } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import toast from "react-hot-toast";
import { copyToClipboard } from "@/utils/copyToClipboard";

interface IProps {
  title: string;
  description: string;
  variant: 'public' | 'admin'
}

const textMap: Record<IProps['variant'], string> = {
  public: 'Public',
  admin: 'Admin',
}

const variantMap: Record<IProps['variant'], BadgeProps['variant']> = {
  public: 'secondary',
  admin: 'destructive',
}

const ApiAlert: FC<IProps> = ({ title, description, variant = "public" }) => {
  return (
    <Alert>

      <Server className="w-4 h-4" />
      <AlertTitle className="flex items-center gap-x-2"  >
        {title}
        <Badge variant={variantMap[variant]}>{textMap[variant]}</Badge>
      </AlertTitle>
      <AlertDescription className="flex items-center justify-between mt-4">
        <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
          {description}
        </code>
        <Button variant="outline" size='icon' onClick={() => copyToClipboard({ text: description })}>
          <Copy className="w-4 h-4" />
        </Button>
      </AlertDescription>

    </Alert>
  )
}

export default ApiAlert