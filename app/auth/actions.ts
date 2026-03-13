'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient, createAdminClient } from '@/lib/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  // Get user profile to determine role
  const { data: { user } } = await supabase.auth.getUser()
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile) {
      const role = profile.role
      if (role === 'citizen') redirect('/citizen')
      if (role === 'government') redirect('/gov-dashboard')
      if (role === 'media') redirect('/media')
    }
  }

  redirect('/')
}

export async function signup(formData: FormData, role: string) {
  const supabase = await createClient()
  const adminClient = createAdminClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const fullName = formData.get('fullName') as string
  const mobileNumber = formData.get('mobileNumber') as string
  const aadhaarNumber = formData.get('aadhaarNumber') as string
  
  const additionalData: any = {}
  if (role === 'government') {
    additionalData.government_identity = formData.get('governmentIdentity')
  } else if (role === 'media') {
    additionalData.media_organization = formData.get('mediaOrganization')
  }

  // Pre-check for existing user to avoid Supabase rate limits/errors if possible
  // Note: auth.getUserByEmail is only available in admin client
  const { data: existingUser } = await adminClient.auth.admin.listUsers()
  const userExists = existingUser.users.some(u => u.email === email)
  
  if (userExists) {
    return { error: 'Account already exists for this email.' }
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      }
    }
  })

  if (error) {
    return { error: error.message }
  }

  if (data.user) {
    // Use adminClient to bypass RLS for profile insertion
    const { error: profileError } = await adminClient.from('profiles').upsert([
      {
        id: data.user.id,
        full_name: fullName,
        email: email,
        mobile_number: mobileNumber,
        aadhaar_number: aadhaarNumber,
        role: role,
        ...additionalData,
      },
    ])

    if (profileError) {
      console.error('Profile creation error:', profileError)
      
      // CRITICAL: Cleanup Auth user if profile fails to ensure consistent state
      await adminClient.auth.admin.deleteUser(data.user.id)
      
      return { 
        error: `Signup failed: Profile could not be created. Error: ${profileError.message}. Auth account has been rolled back.` 
      }
    }
  }

  revalidatePath('/', 'layout')
  
  if (role === 'citizen') redirect('/citizen')
  if (role === 'government') redirect('/gov-dashboard')
  if (role === 'media') redirect('/media')
  
  redirect('/')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
