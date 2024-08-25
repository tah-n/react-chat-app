import React, { useEffect, useState } from 'react'
import { useChatStore,useUserStore } from '../lib/userStore'
import Loading from './loading/Loading';
import Parse from 'parse/dist/parse.min.js';

const Detail = () => {
  const {logout,loading,currentUser} = useUserStore();
  const [arrowState,setArrowState] = useState(false);
  const {selectedChat} = useChatStore();
  const [images,setImages] = useState([]);

  const handleArrow = () => {
    setArrowState(!arrowState);
  }
  
  useEffect(() => {
    let interval = null;
    if(selectedChat) {
      const fetchFiles = async () => {
        try {
          const query = new Parse.Query('messages');
          query.equalTo('chatId', selectedChat.id);
          const results = await query.find();

          if(Array.isArray(results) && results.length > 0) {
           // const allImages = results.map(msg => msg.get('file').filter(file => file))
            setImages(results)
          }
        

        }catch(err) {
          console.log(err.message)
        } 
      }

      fetchFiles();
      interval = setInterval(fetchFiles, 100000);
    }

    return() => {
      if(interval) {
      clearInterval(interval);
      }
    }

  },[selectedChat])



  return (
    <div className='hidden z-100 md:hidden sm:hidden lg:flex lg:w-[25%] flex-col'>
      <div className='w-full flex items-center flex-col justify-center border-b border-b-white/10 text-center py-5 gap-2'>
        <img src={currentUser.get('avatar') ? currentUser.get('avatar').url() : 'images/avatar.png'} alt='avatar' width={100} height={100} className='rounded-full w-[100px] h-[100px]' />
        <h1 className='font-semibold'>{currentUser.get('userName')}</h1>
      </div>

      <div className='w-full z-100 flex flex-col gap-2 p-1 mt-2 text-sm text-white/70'>
        <div className='w-full z-50 flex items-center justify-between px-1'>
          <p>Shared Photos</p>
          <div 
            id="arrow" 
            className={`p-2 bg-black-100/40 rounded-full cursor-pointer hover:bg-black-100/60 w-[30px] h-[30px] transition-all flex items-center justify-center ${arrowState && 'rotate-180'}`} 
            onClick={handleArrow}
            >
            <img className='m-auto' src='images/arrowDown.png' alt='icon' width={12} height={12} />
          </div>
        </div>

        {/* pics */}
        <div className={`relative flex-col w-full z-0 max-h-[8rem] overflow-y-auto scrollbar-thin scrollbar-webkit transition-all ${arrowState? 'flex top-0 opacity-100' : '-top-[60%] opacity-0 absolute h-1'}`}>
          {images.length > 0 && images.map((img, i) => (
          <div key={i} className='w-full flex items-center gap-2 justify-between px-1 overflow-hidden'>
            {img.get('file') && (
                img.get('file').endsWith('.jpg') ||
                img.get('file').endsWith('.jpeg') ||
                img.get('file').endsWith('.png')
              ) ? (
                <div className='flex gap-2 items-center justify-between w-full'>
                 <img src={img.get('file')} alt='picture' width={50} height={50} className='w-[50px] h-[50px] rounded-md'  />
                 <a
                 href={img.get('file')}
                 target='_blank'
                 rel='noopener noreferrer'
                 >
                 <span className='underline text-[0.85rem] tracking-tighter'>{JSON.stringify(img.get('file')).split('/').pop()}</span>
                 </a>
                 <div className='p-2 bg-black-100/40 rounded-full cursor-pointer hover:bg-black-100/60 w-[30px] h-[30px]'>
                  <img className='m-auto' src='images/download.png' alt='icon' width={12} height={12} />
                </div>
                </div>
              ) : null
              }
             
          </div>

          ))}
   
        </div>
        {/* end og images */}

        {/* <div className='w-full flex items-center justify-between px-1'>
          <p>Shared Files</p>
          <div className='p-2 bg-black-100/40 rounded-full cursor-pointer hover:bg-black-100/60 w-[30px] h-[30px]'>
            <img className='m-auto' src='images/arrowUp.png' alt='icon' width={12} height={12} />
          </div>
        </div> */}

        <button disabled={loading} className='w-full bg-blue-400/40 py-2 text-xs font-semibold tracking-wider rounded-sm hover:bg-blue-400/70 text-white h-fit text-center flex items-center justify-center' onClick={() => logout()}>
          {loading? <Loading /> : "Logout"}
        </button>
      </div>
      
    </div>
  )
}

export default Detail
