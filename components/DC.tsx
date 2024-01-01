"use client";

import React, { useEffect } from "react";
import { gsap } from "gsap";
// @ts-expect-error
import SplitTextJS from "split-text-js";

const DC = () => {
	useEffect(() => {
		const titles = document.querySelectorAll(".text-wrapper p");
		const tl = gsap.timeline({ repeat: -1, repeatDelay: 0 }); // Set repeat and repeat delay

		titles.forEach((title) => {
			const splitTitle = new SplitTextJS(title);
			tl.from(
				splitTitle.chars,
				{
					opacity: 0,
					ease: "power2.inOut",
					y: 60,
					rotateX: -90,
					stagger: 0.05,
					duration: 0.5,
				},
				"<"
			)
				.to(
					splitTitle.chars,
					{
						opacity: 0,
						ease: "power2.inOut",
						y: 35,
						rotateX: 90,
						stagger: 0.05,
						duration: 0.3,
					},
					"<1"
				);
		});

		return () => {
			tl.pause(); // Pause the animation on unmount (optional)
		};
	}, []);

	return (
		// Your JSX remains unchanged
		<div
			className="pb-4 font-extrabold tracking-tight text-7xl md:text-9xl lg:text-[200px] bg-clip-text min-h-[180px] md:min-h-[300px] lg:min-h-[420px]"
			data-aos="fade-down"
		>
			Daily <br />
			<div className="text-wrapper text-center">
				<p className="absolute">Keys</p>
				<p className="absolute">Advice</p>
				<p className="absolutet">Counsel</p>
				<p className="absolute">Solutions</p>
			</div>
		</div>
	);
};

export default DC;
