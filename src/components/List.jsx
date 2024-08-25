import React from 'react'
import UserInfo from './UserInfo'
import ChatList from './ChatList'

const List = () => {
  return (
    <div className='bg-trasparent w-[10%] md:w-[40%] lg:w-[27%] pt-2 p-2 border-r border-white/10'>
      <UserInfo />
      <ChatList />
    </div>
  )
}

export default List
