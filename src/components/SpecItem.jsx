import React from 'react';

const SpecItem = ({ title, description, image, reverse }) => {
  return (
    <div className={`wrapper w-full min-h-[45vh] flex flex-col ${reverse ? 'md:flex-row-reverse' : 'md:flex-row'} items-center justify-between gap-8 md:gap-16`}>
      <div className="left img w-full md:w-1/2 h-[40vh]">
        <img src={image} alt={title} loading="lazy" decoding="async" className="w-full h-full object-contain drop-shadow-md" />
      </div>
      <div className="right txt w-full md:w-1/2 text-center md:text-left flex flex-col justify-center gap-4 md:gap-6">
        <h2 className="text-5xl md:text-7xl font-bebas tracking-wide text-gray-900">{title}</h2>
        <p className="text-lg md:text-2xl font-elms text-gray-600 leading-relaxed font-light">
          {description}
        </p>
      </div>
    </div>
  );
};

export default SpecItem;
