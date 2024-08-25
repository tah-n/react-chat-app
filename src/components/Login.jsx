import React, { useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from "@gsap/react";
import Loading from './loading/Loading';
import { useUserStore } from '../lib/userStore';



const Login = () => {
    const [avatar,setAvatar] = useState({
        file: null,
        url: ''
    })
    const {login,loading,isloading,signin} = useUserStore();
   

    useGSAP(() => {
        gsap.to('#greetings', {
            opacity: 1,
            duration: 0.3,
            delay: 0.3,
            y: -10,
            ease: 'power2.inOut',
            stagger: 0.1,
        })
    },[])


    const handleAvatar = e => {
        setAvatar({
            file: e.target.files[0],
            url: URL.createObjectURL(e.target.files[0])
        })
    }

    const handleLogin = async e => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const { email,password } = Object.fromEntries(formData);

        login(email,password);
    }

    const handleSignUp = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
    
        const { username, email, password } = Object.fromEntries(formData);
        const avatarFile = formData.get('avatar');
        console.log(avatarFile);

        signin(email,username,password,avatarFile);    
    
    };
     
       
  return (
    <div className='w-full flex flex-col md:flex-row relative items-center gap-2 py-5 overflow-y-auto md:overflow-hidden scrollbar-thin scrollbar-webkit'>
      <div className='w-1/2 flex flex-col gap-5 items-center justify-center opacity-0 my-5'  id='greetings'>
        <h1 className='text-2xl font-semibold translate-x-1'>Welcome Back</h1>
        <form className='flex flex-col gap-3' onSubmit={handleLogin}>
            <input className='loginInput w-80' type='email' placeholder='Email' name='email' />
            <input className='loginInput' type='password' placeholder='Password' name='password' />
            <button disabled={loading} className='button w-full min-h-10 flex items-center justify-center'>
                {isloading? <Loading />: "Sign In"}
            </button>
        </form>
      </div>

      <div className='w-[1px] h-[70%] bg-white/15 hidden md:block' />
      <div className='w-[50%] h-[1px] bg-white/15 md:hidden' />

      <div className='w-1/2 flex flex-col gap-5 items-center justify-center opacity-0 mt-8'  id='greetings'>
        <h1 className='text-2xl font-semibold'>Create an Account</h1>
        <form 
            className='flex flex-col gap-3 items-center'
            onSubmit={handleSignUp}
        >
        <label htmlFor='file' className='cursor-pointer text-xs font-semibold text-white/70 text-center flex items-center flex-col gap-3 hover:text-blue-500 underline' >
                <img className='rounded-lg w-[70px] h-[70px]' width={60} height={60} src={avatar.url || 'images/avatar.png'} alt='avatar' />
                Upload an image
            </label>
            <input type='file' id='file' className='hidden' onChange={handleAvatar} name='avatar' accept='image/*' />
            <input className='loginInput w-80' type='text' placeholder='UserName' name='username' />
            <input className='loginInput w-80' type='email' placeholder='Email' name='email' required />
            <input className='loginInput w-80' type='password' placeholder='Password' name='password' required />
            <button disabled={loading} className='button w-full min-h-10 flex items-center justify-center'>
                {loading ?   <Loading /> : "Sign Up"}
            </button>
        </form>
      </div>
      
    </div>
  )
}

export default Login
