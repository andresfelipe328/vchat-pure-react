import React from 'react'

const FindFriendForm = ({findFriend, setFindFriend}) => {
   return (
      <input 
         id='friend_username'
         type="text" 
         placeholder='find a friend'
         className='bg-mainBg w-full'
         value={findFriend}
         onChange={(e) => setFindFriend(e.target.value)}
      />
)
}

export default FindFriendForm