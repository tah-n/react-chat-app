import React, { useEffect, useState } from 'react'
import AddUser from './AddUser';
import { useChatStore, useUserStore } from '../lib/userStore';
import Parse from 'parse/dist/parse.min.js';
import Backdrop from './Backdrop';

const ChatList = () => {
    const [addMode,setAddMode] = useState(false);
    const [chats,setChats] = useState([]);
    const {currentUser} = useUserStore();
    const setSelectedChat = useChatStore(state => state.setSelectedChat);

    const handleAddMode = () => {
       setAddMode(!addMode);
    }

    useEffect(() => {
      const fetchChats = async () => {
        try{

          const query = new Parse.Query('chats');
          query.containedIn('participants', [currentUser.id]);
          const allChats = await query.find();
          if(allChats.length > 0) {
            allChats.sort((a,b) => b.updatedAt - a.updatedAt);
            setChats(allChats);
          } 
          
        }catch(err) {
          console.error(err);
        }

      }
      

      fetchChats();

      return () => {
        fetchChats()
      }
    },[currentUser.id,addMode]);

    const handleChatClick = (chat) => {
      setSelectedChat(chat);
    }



   

  return (
    <div className='w-full flex-1 flex-col overflow-hidden'>
      <div className='w-full flex items-center justify-start flex-1 gap-2'>
        <div className='items-center hidden md:flex'>
            <img className='relative left-6' src='images/search.png' width={20} height={20} alt='searchbar'/>
            <input className='w-[calc(100%+1rem)] rounded-md outline-none bg-gray-300/15 backdrop-blur-2xl h-9 placeholder:text-gray-400 pl-[32px] text-sm text-gray-50 tracking-wider' placeholder='Search' />
        </div>
        <div className='bg-gray-300/15 backdrop-blur-2xl flex rounded-md items-center w-9 h-9 hover:cursor-pointer hover:bg-gray-300/30 transition' onClick={handleAddMode}>
            <img className='m-auto' src={addMode? 'images/minus.png' : 'images/plus.png'} alt='add/minus' width={20} height={20}/>
        </div>
        </div>

        {addMode && (
          <>
              <AddUser />
              <Backdrop show={addMode} modalClosed={() => setAddMode(false)} />
          </>
          )}

        {/* items */}
        <div className='my-4 h-[80vh] overflow-y-auto scrollbar-thin scrollbar-webkit pb-[9rem]'>
          {chats.map((chat, i) => ( 
            <div
             key={chat.id}
             className='flex items-center gap-2 py-2 border-b-[1px] border-white/15 cursor-pointer'
             onClick={() => handleChatClick(chat)}
             >
              <img src={chat.get('avatar')[0] === currentUser.get('avatar').url() ? chat.get('avatar')[1] : chat.get('avatar')[0]} alt='avatar' width={40} height={40} className='md:rounded-full rounded-xl w-[40px] h-[40px]' />
              <div>
               {chat.get('chatName').length > 1 && chat.get('chatName').map((username, i) => {
                      if(username !== currentUser.get('userName')) {
                        return (
                          <span key={i} className='text-sm font-semibold md:block hidden'>
                            {username}
                          </span>
                        )
                      } 
                  })}
                  <p className='text-xs font-light tracking-wider mt-1 text-gray-300/80'>{chat.get('lastMessage')}</p>
              </div>
            </div>
          )
          )}
          
        
            
        </div>
    </div>
  )
}

export default ChatList
