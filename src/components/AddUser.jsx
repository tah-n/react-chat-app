import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import React, { useState } from 'react'
import { toast } from 'react-toastify';
import { useUserStore } from '../lib/userStore';
import Parse from 'parse/dist/parse.min.js';



const AddUser = () => {
  const [user,setUser] = useState(null);
  const {currentUser} = useUserStore();
  const [userName, setUserName] = useState(null);
  const [avatar,setAvatar] = useState(null);

  useGSAP(() => {
    gsap.fromTo("#add", {
      x:-100,
      duration: 0.5,
      delay: 0.2
    },{
      x: 0
    });

  },[])

  const handleSearch = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const userName = formData.get("username");

    try{

      const parseQuery = new Parse.Query('User');
      parseQuery.equalTo('userName', userName);
      let res = await parseQuery.find();
    
      if(res.length > 0) {
        setUser(res[0]);
        setUserName(res[0].get('userName'));
        setAvatar(res[0].get('avatar')?.url());
      }


    }catch(err) {
      console.log(err.message);
      toast.error('User Not Found.');
    }

  }



  const handleAddUser = async () => {

    try{

      //get the chat from database
      const query = new Parse.Query('chats');
      query.containsAll('participants', [currentUser.id, user.id])
      const existingChat = await query.first();
      console.log(existingChat)
      
      if(existingChat) {
        console.log('chat already exists:', existingChat);
      } else {
        const chats = new Parse.Object('chats');
        chats.set('userId', currentUser.id);
        chats.set('participants',[currentUser.id,user.id]);
        chats.set('lastMessage', '');
        chats.set('updateAt',Date.now());
        chats.set('chatName', [user.get('userName'),currentUser.get('userName')]);
        chats.set('avatar', [user.get('avatar')?.url(),currentUser.get('avatar')?.url()]);


        await chats.save();
        console.log('new chat created.', chats);

        const messages = new Parse.Object('messages');
        messages.set('content','');
        messages.set('chatId', chats.id);
        messages.set('senderId', currentUser.id);
        messages.set('timestamp', Date.now());
        messages.set('status', '');
        messages.set('type', '');

        await messages.save();

      }
     
      
    }catch(err) {
      console.log(err.message);
      toast.error(err.message);
    }


  }




  return (
    <div id='add' className='absolute z-50 md:top-[40%] md:left-[37%] left-[25%] top-[40%] w-[19rem] h-fit rounded-lg bg-purple-100/50 backdrop-blur-xl'>
        <form onSubmit={handleSearch} className='w-full flex gap-1 items-center justify-between p-3'>
            <input className='loginInput !bg-black-100/50 !rounded-xl placeholder:text-white/80' type='text' name='username' placeholder='User Name'  />
            <button className='button p-2 !text-sm !font-light'>Search</button>
        </form>
        {user && (
          <div className='flex items-center p-2 gap-3'>
            <img className='rounded-full w-[40px] h-[40px]' src={avatar || 'images/avatar.png'} alt='avatar' width={40} height={40} />
            <h2 className='font-semibold text-sm'>{userName}</h2>
            <button className='button p-3 !text-sm !font-light' onClick={handleAddUser}>Add User</button>
        </div>
      )}
    </div>
  )
}

export default AddUser
