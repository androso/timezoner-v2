import React from 'react'

export default function PageWrapper({children}:any) {
  return (
    <div className='page-wrapper bg-gradient-to-t from-gunMetal to-blackCoral min-h-screen text-whiteText1 font-sans font-normal'>
      
        {children}
      
    </div>
  )
}