import React from 'react'

const Button = ({children, classname, onClick, disabled}) => {
  const enabledStyles = 'bg-[rgb(48,48,48)] text-white hover:bg-gray-600 active:bg-gray-800 cursor-pointer';
  const disabledStyles = 'bg-gray-400 text-gray-200 cursor-not-allowed';

  return (
    <button 
    className={`px-6 py-2 bg-[rgb(48,48,48)]  text-white font-medium text-lg font-mono rounded-full hover:bg-gray-600 active:bg-gray-800 focus:outline-none focus:ring- focus:ring-gray-800 ${disabled ? disabledStyles : enabledStyles} ${classname}`}
    onClick={onClick}
    disabled={disabled}
    >
        {children}
    </button>
  )
}

export default Button