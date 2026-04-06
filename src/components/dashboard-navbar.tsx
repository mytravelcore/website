'use client'

import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/supabase/client'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { Button } from './ui/button'
import { UserCircle, Home, LogOut, Settings } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function DashboardNavbar() {
  const supabase = createClient()
  const router = useRouter()

  return (
    <nav className="w-full border-b border-tc-purple-light/20 bg-white py-4">
      <div className="container mx-auto px-4 lg:px-20 flex justify-between items-center">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center">
            <Image
              src="https://storage.googleapis.com/msgsndr/PfHZoaIxRooTMHzcnant/media/68a383bbc1a0521588f80864.png"
              alt="TravelCore"
              width={140}
              height={40}
              className="h-10 w-auto"
            />
          </Link>
          <div className="hidden md:flex items-center gap-4">
            <Link href="/" className="text-tc-purple-deep/60 hover:text-tc-purple-deep transition-colors flex items-center gap-1">
              <Home className="w-4 h-4" />
              Inicio
            </Link>
            <Link href="/admin" className="text-tc-purple-deep/60 hover:text-tc-purple-deep transition-colors flex items-center gap-1">
              <Settings className="w-4 h-4" />
              Admin
            </Link>
          </div>
        </div>
        <div className="flex gap-4 items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-tc-purple-deep">
                <UserCircle className="h-6 w-6" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href="/admin" className="flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Administrar Tours
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={async () => {
                await supabase.auth.signOut()
                router.push('/')
                router.refresh()
              }} className="text-red-500">
                <LogOut className="w-4 h-4 mr-2" />
                Cerrar sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  )
}
