import './components/init';
import Bg from './components/Bg';
import { useEffect, useState } from 'react';
import Login from './components/Login';
import List from './components/List';
import Chat from './components/Chat';
import Detail from './components/Detail';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import Notifications from './components/Notifications';
import { initializeCurrentUser, useUserStore } from './lib/userStore';
import Parse from 'parse/dist/parse.min.js';



const app_id = import.meta.env.VITE_REACT_APP_PARSE_APP_ID;
const host_url = import.meta.env.VITE_REACT_APP_PARSE_HOST_URL;
const js_key = import.meta.env.VITE_REACT_APP_PARSE_JS_KEY;
 
Parse.initialize(app_id, js_key);
Parse.serverURL = host_url;

function App() {

   const {currentUser} = useUserStore();
   
   useEffect(() => {
    initializeCurrentUser();
   },[])

  

      useGSAP(() => {
        gsap.fromTo('#container',{
          y: 100,
          delay: 0.1,
          duration:0.1  
        }, {
          y: 0,
          duration: 0.5,
        })
       },[])

  return (
    <main className='h-screen w-screen flex items-center justify-center'>
      <Bg />
      <div className='w-[85vw] h-[85vh] bg-purple-100/20 z-20 rounded-3xl backdrop-blur-sm border border-white/10 flex justify-around overflow-hidden' id='container'>
      {currentUser? 
        <>
          <List />
          <Chat />
          <Detail />
        </> :
        <Login />
    }

        <Notifications />
       
     </div>
    </main>
  )

}

export default App
