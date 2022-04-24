import React from 'react'


export default function LightButton({innerText, className}: {innerText: string, className?: string}) {
  return (
    <button className={`light-btn-transition relative bg-gradient-to-t from-lightBtnBottColor to-lightBtnTopColor text-darkText font-semibold rounded-md px-6 py-3 ${className} `}>
        {innerText.toUpperCase()}
    </button>
  )
}
