import Link from "next/link";
import { Youtube } from "lucide-react";
import { Cta } from "./cta";
import { Particles } from "@/components/Particles";
import DC from "./DC";

const Hero = () => {
	return (
		<section>
			<div className="relative max-w-6xl min-h-screen px-4 mx-auto sm:px-6 ">
				<div className="pt-24 lg:pt-12 pb-16 md:pt-32 md:pb-32">
					<Particles className="absolute inset-0 -z-10" />
					<Particles className="absolute inset-0 -z-10" />
					{/* Hero content */}
					<div className="mx-auto text-center ">
						<div className="mb-6" data-aos="fade-down">
							<div className="relative inline-flex before:absolute before:inset-0 ">
								<Link
									className="px-3 py-1 text-sm font-medium inline-flex items-center justify-center border border-transparent rounded-full text-zinc-500 dark:text-zinc-300 hover:text-zinc-600 transition duration-150 ease-in-out w-full group relative before:absolute before:inset-0 before:bg-zinc-800/30 before:rounded-full before:pointer-events-none"
									href="https://youtube.com/daghewardmills"
									target="_blank"
								>
									<Youtube />
									<span className="ml-3 relative inline-flex items-center text-white">
										Dag Heward-Mills{" "}
										<span className="tracking-normal text-primary-500 group-hover:translate-x-0.5 transition-transform duration-150 ease-in-out ml-1">
											-&gt;
										</span>
									</span>
								</Link>
							</div>
						</div>
						<DC />
						<p
							className="mt-6 mb-8 text-gray-50 dark:text-gray-20  z-20 max-w-4xl mx-auto"
							data-aos="fade-down"
							data-aos-delay="200"
						>
							This is a website dedicated to sharing daily devotionals by the esteemed
							evangelist, Bishop Dag Heward Mills. This platform is created out of a deep love
							and admiration for his profound teachings, unwavering faith, and passion for
							spreading the gospel.
						</p>
						<Cta />
					</div>
				</div>
			</div>
		</section>
	);
};

export default Hero;
