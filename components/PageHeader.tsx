import React from "react";

const PageHeader = ({ title, description }: { title: string; description: string }) => {
	return (
		<div className="max-w-[800px]">
			<h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-2">{title}</h1>
			<p className="max-w-[600px] text-gray-700 dark:text-gray-300">
				{description}
			</p>
		</div>
	);
};

export default PageHeader;
