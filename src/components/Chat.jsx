import React, { useEffect, useRef, useState } from 'react';
import EmojiPicker from 'emoji-picker-react';
import Backdrop from './Backdrop';
import Parse from 'parse/dist/parse.min.js';
import { useChatStore, useUserStore } from '../lib/userStore';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'react-toastify';


const Chat = () => {
  const [selectedEmoji, setSelectedEmoji] = useState(false);
  const [text,setText] = useState("");
  const endRef = useRef(null);
  const selectedChat = useChatStore(state => state.selectedChat);
  const [messages,setMessages] = useState([]);
  const {currentUser} = useUserStore();
  const [reciever,setReciever] = useState(null);
  const [file, setFile] = useState({
    file: null,
    parseFile: null
  })

  //to dos: set last message and make it scroll there

  useEffect(() => {
    let interval;
    //endRef.current?.scrollIntoView({behavior: "smooth"});

    if(selectedChat) {
      const fetchMessages = async() => {
      try{
        const query = new Parse.Query('messages');
        query.equalTo('chatId', selectedChat.id);
        const results = await query.find();
        setMessages(results);


      }catch(err) {
        console.log('Error Fetching Messages.'+err.message);
      }
    }

      fetchMessages();
      interval= setInterval(fetchMessages, 3000);


      const fetchReciever = async() => {

        try{
          const recieverId = selectedChat.get('participants').find(reId => reId !== currentUser.id);

          if(recieverId) {

            const query = new Parse.Query('User');

            query.equalTo('objectId',recieverId);
            const reciever = await query.first();
            if(reciever) {
              setReciever(reciever);
            }
          }
          
  
  
        }catch(err) {
          console.log(err)
        }
       }

       fetchReciever();

      }

      return () => {
        clearInterval(interval);
      }


  },[selectedChat]);

  const handleSend = async () => {
    const trimText = text.trim();

    if(trimText) {
      try{

        const messages = new Parse.Object('messages');
        messages.set('content', text);
        messages.set('senderId', currentUser.id);
        messages.set('chatId', selectedChat.id);
        messages.set('updatedAt', Date.now());
        messages.set('recieverId',selectedChat.get('participants').find(reId => reId !== currentUser.id));
        messages.set('timeStamp',Date.now());


        await messages.save();
        setText("");


      }catch (err) {
        console.log(err.message);
      }
    } else {
      toast("message can't be empty.")
    }
  }



  const handleReaction = (e) => {
    setText((pre) => pre+e.emoji);
  }

  const handleFileUpload = (e) => {
    setFile({
      file: e.target.files[0],
      parseFile: new Parse.File(file.name, e.target.files[0])
    })
  }

  useEffect(() => {
    if(file.parseFile) {
      const sendFile = async() => {
        
        try {
          await file.parseFile.save();
          const messages = new Parse.Object('messages');
          messages.set('file', file.parseFile.url());
          messages.set('senderId', currentUser.id);
          messages.set('chatId', selectedChat.id);
          messages.set('updatedAt', Date.now());
          messages.set('recieverId',selectedChat.get('participants').find(reId => reId !== currentUser.id));
          messages.set('timeStamp',Date.now());

          await messages.save();
          setFile({
          file: null,
          parseFile: null
          })
          toast.success('File uploaded')

        }catch(err) {
          console.log(err);
          toast.success('Failed to upload file')
          setFile({
            file: null,
            parseFile: null
            })

        }
      }

      sendFile();

    }
  },[file,selectedChat])


  return (
    <div className='lg:border-r border-white/10 lg:w-[calc(60%)] border-none px-2 md:flex flex-col overflow-hidden'>
      {/* Top */}
      <div className='flex w-full justify-between items-center h-[12%] border-b border-b-white/10'>
        {selectedChat ? (
          <>
          <div className='flex items-center gap-2'>
          <div>
          <img src={selectedChat.get('avatar')[0] === currentUser.get('avatar') ? selectedChat.get('avatar')[1] : selectedChat.get('avatar')[0] || 'images/avatar.png'} width={40} height={40} alt='avatar' className='rounded-full w-[40px] h-[40px]' />
          </div>
          <div className='tracking-wide text-sm'>
            <span className='font-semibold'>{selectedChat.get('chatName')[0] === currentUser.get('userName')? selectedChat.get('chatName')[1] : selectedChat.get('chatName')[0]}</span>
          </div>
        </div>
          </>
        ) : <div>...</div>}
      </div>


      {/* center */}
      <div className='relative h-[79%] py-2 overflow-y-auto scrollbar-thin scrollbar-webkit pr-2'>
        {messages.length > 0? (
         messages.map((msg) => (
          <div key={msg.id} className={`flex items-center ${msg.get('senderId') === currentUser.id? 'justify-end' : 'justify-start'} gap-2 w-full pb-6`} >
            {msg.get('senderId') !== currentUser.id && <img className='rounded-full w-[40px] h-[40px]' src={reciever && reciever.get('avatar').url() || 'images/avatar.png'} width={40} height={40} />}
                {msg.get('content') && (
                  <>
                  <p className={`relative text-sm tracking-wide ${msg.get('senderId') === currentUser.id? 'bg-[#7204c7]' : 'bg-[#b704c7]'} rounded-lg p-2 max-w-[75%]`}>
                    {msg.get('content')}
                  <span className={`text-[0.65rem] font-bold text-gray-400 absolute -bottom-5 leading-1 w-[10rem] ${msg.get('senderId') === currentUser.id? 'right-2 text-right': 'left-2 text-left' }`}>{msg.get('timeStamp') && formatDistanceToNow(new Date(msg.get('timeStamp')),{addSuffix: true}) || 'now'}</span>
                   </p> 
                  </>
                   )}
                {msg.get('file') && (
                  <>
                   <a
                   className={`w-fit max-w-[70%] p-1 relative h-auto max-h-[80%] rounded-lg flex items-center justify-center ${msg.get('senderId') === currentUser.id? 'bg-[#7204c7]/20 right-1' : 'bg-[#b704c7] right-1'}`}
                   href={msg.get('file')}
                   target='_blank'
                   rel='noopener noreferrer' >
                  {msg.get('file').endsWith('.jpg') ||
                   msg.get('file').endsWith('.jpeg') ||
                  msg.get('file').endsWith('.png')  ? (
                    <>
                    <img src={msg.get('file')} alt='sent pic' className='w-full h-auto rounded-md' />
                    <span className={`text-[0.65rem] font-bold text-gray-400 absolute -bottom-5 z-50 leading-1 w-[10rem] ${msg.get('senderId') === currentUser.id? 'right-2 text-right': 'left-2 text-left' }`}>{msg.get('timeStamp') && formatDistanceToNow(new Date(msg.get('timeStamp')),{addSuffix: true}) || 'now'}</span>
                    </>
                  ) : (
                    <>
                     <p className='underline m-2 cursor-pointer'>Download here</p>
                     <span className={`text-[0.65rem] font-bold text-gray-400 absolute -bottom-5 z-50 leading-1 w-[10rem] ${msg.get('senderId') === currentUser.id? 'right-2 text-right': 'left-2 text-left' }`}>{msg.get('timeStamp') && formatDistanceToNow(new Date(msg.get('timeStamp')),{addSuffix: true}) || 'now'}</span>
                    </>  
                  )}
                  </a>
              </>
                )}
          </div>
        )) ) : <div className={'m-auto absolute left-1/2 top-1/2'}>...</div>
        }




        {/* <div ref={endRef} /> */}

      </div>


      {/* bottom */}
      <div className='w-full flex items-center h-[2.7rem] border-t border-white/10 pt-2 mr-2'>
        {selectedChat ? 
        (
          <>
        <div className='flex justify-center items-center h-full mr-2 max-w-[3rem] '>
            <label htmlFor='fileUpload' className='w-full flex justify-center items-center'>
            <img src='images/img.png' width={20} height={20} className='hover:cursor-pointer w-[25px] h-[25px]' />
            </label>
            <input id='fileUpload' className='hidden' name='fileUpload' type='file' accept='image/*,application/pdf,.doc,.docx' onChange={handleFileUpload} />
        </div>
        <div className='relative w-full h-full flex items-center'>
          <input className='outline-none h-full border-none bg-gray-300/15 backdrop-blur-2xl rounded-2xl placeholder:text-purple-100 px-3 pr-9 w-[calc(100%+2rem)] text-sm tracking-normal' placeholder='Message' onChange={(e) => setText(e.target.value)} value={text} />
          <div className='absolute right-1 cursor-pointer pl-1 text-center' onClick={() => setSelectedEmoji(!selectedEmoji)}>
              <img src='images/emoji.png' width={26} height={25} className='m-auto' />
          </div>
        </div>
          <button className='border border-purple-100/25 backdrop-blur-sm rounded-2xl hover:bg-purple-100/50 active:bg-purple-100/20 p-2 text-sm font-semibold ml-1' onClick={handleSend}>
            Send
          </button>
          </>
        ) : <div>...</div>}
      </div>

      <EmojiPicker onEmojiClick={handleReaction} open={selectedEmoji} className='!absolute top-[7rem] lg:right-52 right-4 z-50' />
      <Backdrop show={selectedEmoji} modalClosed={() => setSelectedEmoji(false)} />

    </div>
  )
}

export default Chat
