import { useUserStore } from "../lib/userStore";
import React from "react";

const UserInfo = () => {
  const {currentUser} = useUserStore();
  const userName = currentUser.get('userName');
  const avatar = currentUser.get('avatar');
 
  return (
    <div className="w-full overflow-hidden grow-0 flex flex-row items-center pb-4 md:justify-between">
      <div className="flex items-center justify-between w-auto gap-2">
        <img src={avatar?.url() || 'images/avatar.png'} width={50} height={50} className="md:rounded-full rounded-xl w-[50px] h-[50px]" />
        <h2 className="text-sm font-semibold hidden md:block">
          {userName? `${userName}` : `${currentUser.get('username')}`}
        </h2>
      </div>
    </div>
  )
}

export default UserInfo
