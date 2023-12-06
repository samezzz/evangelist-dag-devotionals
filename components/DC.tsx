"use client";

import React from "react";
import { useState, useEffect } from "react";
import { useTypewriter, Cursor } from 'react-simple-typewriter'

const DC = () => {
  const [gradientIndex, setGradientIndex] = useState(0);
  const gradients = [
    'text-gradient_blue-purple',
    'pink-text-gradient',
    'text-gradient_blue',
    'green-text-gradient',
    'text-gradient_purple-blue',
    'orange-text-gradient',
    'blue-text-gradient',
  ];
  
  const [typeEffect] = useTypewriter({
    words: ['Counsel', 'Advice', 'Keys', 'Solutions'],
    loop: true,
    typeSpeed: 150,
    deleteSpeed: 100,
    
  });
  
  const words = `Daily ${typeEffect}`.split(' ');

  useEffect(() => {
    const interval = setInterval(() => {
      setGradientIndex((prevIndex) => (prevIndex + 1) % gradients.length);
    }, 2000); // Change gradient every 3 seconds

    return () => clearInterval(interval);
  }, [gradients.length]);

  const alternatingGradients = words.map((word, index) => {
    const gradientClass = index === 1 ? gradients[gradientIndex] : ''; // Apply gradient to the first word
    return (
      <span key={index} className={`${gradientClass}`}>
        {word} <br />{' '}
      </span>
    );
  });

  return (
    <h1
      className="pb-4 font-extrabold tracking-tight text-7xl md:text-9xl lg:text-[200px] bg-clip-text"
      data-aos="fade-down"
    >
      {alternatingGradients}
    </h1>
  );
};

export default DC;
