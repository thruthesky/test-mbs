import { register } from '../actions/action';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function SignupPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect('/myblog');
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      <form className="bg-white p-8 rounded shadow-md w-96 flex flex-col gap-4">
        <h2 className="text-center text-2xl font-bold text-black">Register</h2>
        <label htmlFor="email" className="text-black">Email:</label>
        <input className="p-2 border rounded text-black" type="email" name="email" id="email" required />
        
        <label htmlFor="username" className="text-black">Username:</label>
        <input className="p-2 border rounded text-black" type="text" name="username" id="username" required />
        
        <label htmlFor="password" className="text-black">Password:</label>
        <input className="p-2 border rounded text-black" type="password" name="password" id='password' required />
        
        <button className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700" formAction={register}>Register</button>
        
        <p className="text-center text-sm text-gray-600 mt-2">
          Already have an account? <Link href="/login" className="text-blue-600 hover:underline">Login</Link>
        </p>
      </form>
    </div>
  );
}
