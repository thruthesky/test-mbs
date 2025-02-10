'use server'

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import {createClient} from "@/utils/supabase/server"

export async function login(formdata:FormData){
    const supabase = await createClient()

    const data = {
        email : formdata.get('email') as string,
        password : formdata.get('password') as string,
    }
    const {error} = await supabase.auth.signInWithPassword(data)
    if (error){
        redirect('/error')
    }
    revalidatePath('/', 'layout')
    redirect('/myblog')
}   
export async function register(formdata:FormData){
    const supabase = await createClient()
    const data = {
        email: formdata.get('email') as string,
        password: formdata.get('password') as string,
        options: {
            data: {
                username: formdata.get('username') as string
            }
        }
    }
    
    const {error} = await supabase.auth.signUp(data)
    if(error){
        redirect('/error')
    }
    revalidatePath('/','layout')
    redirect('/myblog')
}