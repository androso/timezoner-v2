import React from 'react'

export default function Container({children, css}: {children: any, css?: string}) {
  return (
    <div className={`h-full w-full mx-auto max-w-mobile-max-w sm:max-w-tablet-max-w xl:max-w-desktop-max-w xl:px-8 ${css}`}>
        {children}
    </div>
  )
}
