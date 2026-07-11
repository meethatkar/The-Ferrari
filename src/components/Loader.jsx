import React, { useState, useEffect } from 'react'

const Loader = ({ setIsLoaded }) => {
  const [perct, setPerct] = useState(0);

  useEffect(() => {
    const updatePerct = setInterval(() => {
      setPerct((p) => {
        if (p >= 100) {
          clearInterval(updatePerct);
          setIsLoaded(true);
          return 100;
        }
        return p + 1;
      });
    }, 50);

    return () => clearInterval(updatePerct);
  }, [setIsLoaded]);

  return (
    <div className='w-full h-screen flex items-center justify-center flex-col bg-white z-50 fixed top-0 left-0 font-bebas text-4xl'>
      {perct}%
    </div>
  )
}

export default Loader