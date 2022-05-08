import React from 'react'
import dynamic from 'next/dynamic';

export default function LightButton({innerText, className, clickFunc}: {innerText: string, className?: string, clickFunc?: () => void}) {
  return (
    <button onClick={() => {if (clickFunc) clickFunc();}} className={`light-btn-transition relative bg-gradient-to-t from-lightBtnBottColor to-lightBtnTopColor text-darkText font-semibold rounded-md px-6 py-3 ${className} `}>
        {innerText.toUpperCase()}
    </button>
  )
}


