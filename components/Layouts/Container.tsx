import React from 'react'

export default function Container({children, styles}: {children: any, styles: string}) {
  return (
    <div className={`container w-container-sm mx-auto ${styles}`}>
        {children}
    </div>
  )
}
