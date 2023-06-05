import { useState, useEffect, lazy, Suspense } from 'react';
import { useParams } from 'react-router-dom';

import { BsFillBellFill } from 'react-icons/bs'
import { collection, doc, orderBy, query } from 'firebase/firestore';
import { db } from '../../../config/firebase'
import { useCollectionData, useDocumentData } from 'react-firebase-hooks/firestore';

// import RoomChatContents from './RoomChatContents';
import SendingArea from '../chat/SendingArea'
import PinMsgs from '../../popups/PinMsgs';
import AddToRoom from '../../popups/AddToRoom.';
import RoomCall from './RoomCall';
const RoomChatContents = lazy(() => import('./RoomChatContents'))


const MainRoomChat = () => {
   const {id, subID} = useParams()
   const [showReply, setShowReply] = useState(false)
   const [replyToMsg, setReplyToMsg] = useState(null)
   const [miniRoomType, setMiniRoomType] = useState('text')

   const roomRef = doc(db, 'rooms', id)
   const [data] = useDocumentData(roomRef)
   const messagesRef = query(collection(db, `rooms/${id}/miniRooms/${subID}`, 'messages'), orderBy('timestamp', "asc"))
   const [messages] = useCollectionData(messagesRef)

   useEffect(() => {
      if (data) {
         let miniRoom
         for (let i = 0; i < data.mainRooms.length; ++i) {
            miniRoom = data.mainRooms[i].miniRooms.find(miniRoom => miniRoom.miniRoomID === subID)
            if (miniRoom)
               break
         }
         if (miniRoom.miniRoomType === 'voice') {
            setMiniRoomType('call')
         }
         else
            setMiniRoomType('text')
      }
   }, [data, subID])

   return (
      <div className='flex flex-col w-full h-full'>
         <ul className='flex gap-1 items-center justify-end shadow-sm p-2'>
            <li>
               <button className='rounded-md hover:shadow-md hover:bg-mainBg transition-all duration-200 ease-in-out p-1'>
                  <BsFillBellFill className='text-light_1 text-xl'/>
               </button>
            </li>
            <li>
               <PinMsgs messages={messages}/>
            </li>
            <AddToRoom data={data}/>
            <li>
               <input type="text" placeholder='search...' className='bg-mainBg'/>
            </li>
         </ul>

         { miniRoomType === 'text'
            ?
               <>
                  <Suspense fallback={<div>Loading...</div>}>
                     <RoomChatContents 
                        data={data} 
                        messages={messages}
                        setShowReply={setShowReply}
                        setReplyToMsg={setReplyToMsg}
                     />
                  </Suspense>

                  <SendingArea
                     replyToMsg={replyToMsg}
                     showReply={showReply}
                     setShowReply={setShowReply}
                     setReplyToMsg={setReplyToMsg}
                  />
               </>
            :
               <RoomCall/>
         }
      </div>
   )
}

export default MainRoomChat