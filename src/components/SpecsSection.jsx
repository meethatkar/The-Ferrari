import React from 'react';
import SpecItem from './SpecItem';

const specsData = [
  {
    title: 'The Structure',
    description: "Developed with Alcoa, the 360's space-frame chassis is entirely aluminum, making it 40% stiffer and 28% lighter than its predecessor.",
    image: '/components/structure.webp',
    reverse: false,
  },
  {
    title: 'The Engine',
    description: 'At its core lies a naturally aspirated 3.6-liter V8 engine, delivering 395 horsepower and an exhilarating 8,500 rpm redline.',
    image: '/components/engine.webp',
    reverse: true,
  },
  {
    title: 'The Exhaust',
    description: 'The variable back-pressure exhaust valves open at high RPMs, bypassing the silencers to unleash the iconic, high-pitched Ferrari V8 scream.',
    image: '/components/exhaust.webp',
    reverse: false,
  },
  {
    title: 'The Wheels',
    description: 'Equipped with 18-inch five-spoke alloy wheels, the 360 houses robust Brembo ventilated disc brakes for exceptional stopping power and control.',
    image: '/components/wheel.webp',
    reverse: true,
  },
];

const SpecsSection = () => {
  return (
    <div id="specs" className="px-6 md:px-8 py-16 md:py-24 w-full max-w-7xl mx-auto flex flex-col gap-20 md:gap-32">
      {specsData.map((spec, index) => (
        <SpecItem
          key={index}
          title={spec.title}
          description={spec.description}
          image={spec.image}
          reverse={spec.reverse}
        />
      ))}
    </div>
  );
};

export default SpecsSection;
