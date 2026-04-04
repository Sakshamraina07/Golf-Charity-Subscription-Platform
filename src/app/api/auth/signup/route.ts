import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  // Use createClient from @supabase/supabase-js for the Admin API to work
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
  
  try {
    const { email, password, fullName } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    // Create user through Admin API with email_confirm: true
    // This totally bypasses the Supabase email verification requirement
    const { data: newUser, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: fullName }
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Explicitly create the profile record since they bypassed standard auth
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({ 
        id: newUser.user.id, 
        full_name: fullName, 
        role: 'user' 
      })

    if (profileError) {
      console.error('Profile creation error during bypass auth:', profileError)
    }

    return NextResponse.json({ 
      success: true, 
      user: newUser.user 
    })

  } catch (err: any) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
