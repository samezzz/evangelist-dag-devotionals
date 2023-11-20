import Link from "next/link";
import { Youtube } from "lucide-react";
import { Cta } from "./cta";

const Hero = () => {
  return (
    <section>
      <div className="relative max-w-6xl min-h-screen px-4 mx-auto sm:px-6 ">
        <div className="pt-24 lg:pt-12 pb-16 md:pt-52 md:pb-32">
          {/* Hero content */}
          <div className="mx-auto text-center ">
            <div className="mb-6" data-aos="fade-down">
              <div className="relative inline-flex before:absolute before:inset-0 ">
                <Link
                  className="px-3 py-1 text-sm font-medium inline-flex items-center justify-center border border-transparent rounded-full  text-zinc-300 hover:text-white transition duration-150 ease-in-out w-full group [background:linear-gradient(theme(colors.primary.900),_theme(colors.primary.900))_padding-box,_conic-gradient(theme(colors.primary.400),_theme(colors.primary.700)_25%,_theme(colors.primary.700)_75%,_theme(colors.primary.400)_100%)_border-box] relative before:absolute before:inset-0 before:bg-zinc-800/30 before:rounded-full before:pointer-events-none"
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
            <h1
              className="pb-4 font-extrabold tracking-tight text-8xl lg:text-[200px]  bg-clip-text"
              data-aos="fade-down"
            >
              Daily Counsel
            </h1>
            <p
              className="mt-6 mb-8 text-gray-30  z-20 max-w-4xl mx-auto"
              data-aos="fade-down"
              data-aos-delay="200"
            >
              This is a website dedicated to sharing daily devotionals by the
              esteemed evangelist, Bishop Dag Heward Mills. This platform is
              created out of a deep love and admiration for his profound
              teachings, unwavering faith, and passion for spreading the gospel.
            </p>
            <Cta />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

