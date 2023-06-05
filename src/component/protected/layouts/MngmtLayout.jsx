import React from 'react'

const MngmtLayout = ({children}) => {
  return (
      <div className='-translate-x-4 opacity-0 w-full h-[28rem] md:w-[270px] md:h-full flex flex-col bg-subBg rounded-md shadow-lg z-[9]'>
         {children}
      </div>
  )
}

export default MngmtLayout