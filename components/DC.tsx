"use client";

import React from "react";
import { useState, useEffect } from "react";

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
      // Add more gradients as needed
    ];
    const words = 'Daily Counsel'.split(' ');
  
    useEffect(() => {
      const interval = setInterval(() => {
        setGradientIndex((prevIndex) => (prevIndex + 1) % gradients.length);
      }, 3000); // Change gradient every 3 seconds
  
      return () => clearInterval(interval);
    }, [gradients.length]);
  
    const alternatingGradients = words.map((word, index) => {
      const gradientClass = index === 1 ? gradients[gradientIndex] : ''; // Apply gradient to the first word
      return (
        <span key={index} className={`${gradientClass}`} >
          {word}{' '}
        </span>
      );
    });
  
    return (
      <h1
        className="pb-4 font-extrabold tracking-tight text-8xl lg:text-[200px] bg-clip-text"
        data-aos="fade-down"
      >
        {alternatingGradients}
      </h1>
    );
  };
  
  export default DC;
