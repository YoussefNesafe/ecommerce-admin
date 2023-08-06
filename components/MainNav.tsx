"use client"
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { useParams, usePathname } from 'next/navigation'
import React, { HTMLAttributes } from 'react'



const MainNav = ({
  className,
  ...props
}: HTMLAttributes<HTMLElement>) => {

  const pathname = usePathname();
  const params = useParams();

  const routes = [
    {
      href: `/${params.storeId}/settings`,
      label: 'Settings',
      active: pathname === `/${params.storeId}/settings`
    },
  ]
  return (
    <nav className={cn('flex items-center space-x-4 lg:space-x-6', className)}>
      {routes.map(({ active, label, href }) => <Link key={label} href={href} className={cn('tetx-sm font-medium transition-colors hover:text-primary text-muted-foreground', active && 'text-black dark:text-white')}>{label}</Link>)}

    </nav>
  )
}

export default MainNav