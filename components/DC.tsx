"use client";

import React from "react";
import { useTypewriter } from 'react-simple-typewriter'

const DC = () => {
  const [typeEffect] = useTypewriter({
    words: ['Counsel', 'Advice', 'Keys', 'Solutions'],
    loop: true,
    typeSpeed: 70,
    deleteSpeed: 90,
  });

  return (
    <h1
      className="pb-4 font-extrabold tracking-tight text-7xl md:text-9xl lg:text-[200px] bg-clip-text min-h-[180px] md:min-h-[300px] lg:min-h-[420px]"
      data-aos="fade-down"
    >
      Daily <br /> {typeEffect}
    </h1>
  );
};

export default DC;




  // const words = `Daily ${typeEffect}`.split(' ');

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setGradientIndex((prevIndex) => (prevIndex + 1) % gradients.length);
  //   }, 2000); // Change gradient every 3 seconds

  //   return () => clearInterval(interval);
  // }, [gradients.length]);

  // const alternatingGradients = words.map((word, index) => {
  //   const gradientClass = index === 1 ? gradients[gradientIndex] : ''; // Apply gradient to the first word
  //   return (
  //     <span key={index} className={`${gradientClass}`}>
  //       {word} <br />{' '}
  //     </span>
  //   );
  // });
