import { createClient } from '@/supabase/server'
import UserProfile from './user-profile'
import NavbarClient from './navbar-client'

export default async function Navbar() {
  const supabase = createClient()
  const { data: { user } } = await (await supabase).auth.getUser()

  return (
    <NavbarClient 
      user={user} 
      userProfile={user ? <UserProfile /> : null} 
    />
  )
}
