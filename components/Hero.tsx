import Image from "next/image";
import { Button } from "./ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";

const Hero = () => {
  return (
    <section className="mx-auto max-w-[1440px]; px-6 lg:px-20 3xl:px-0 flex flex-col gap-20 py-10 pb-32 md:gap-28 lg:py-20 xl:flex-row">
      <div className="flex flex-1 flex-col xl:w-1/2">
        <h1 className="text-8xl md:text-9xl font-bold">
          Daily <br />
          Counsel
        </h1>
        <p className=" mt-6 text-gray-30 xl:max-w-[520px]">
          We want to be on each of your journeys seeking the satisfaction of
          seeing the incorruptible beauty of nature. We can help you on an
          adventure around the world in just one app
        </p>

        <div className="my-11 flex flex-wrap gap-5">
          <div className="flex items-center gap-2"></div>

          <p className="">
            198k
            <span className="ml-1">Excellent Reviews</span>
          </p>
        </div>

        <div className="flex flex-col w-full gap-3 sm:flex-row">
          <Button>Download app</Button>
          <Button>How we work</Button>
        </div>
      </div>

      <div className="w-[450px]">
        <AspectRatio ratio={16 / 9} className="">
          <Image
            src="/evangelist-dag.png"
            alt="Image"
            width={600}
            height={600}
            className="rounded-md object-cover"
          />
        </AspectRatio>
      </div>

      {/* <div className="flex flex-1 items-start">
        <div className="flex w-[268px] flex-col gap-8 rounded-3xl bg-green-90 px-7 py-8">
          <div className="flex flex-col">
            <div className="flex items-center justify-between">
              <p className=" text-gray-20">Location</p>
            </div>
            <p className=" text-white">Aguas Calientes</p>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <p className=" block text-gray-20">Distance</p>
              <p className=" text-white">173.28 mi</p>
            </div>
            <div className="flex flex-col">
              <p className="block text-gray-20">Elevation</p>
              <p className=" text-white">2.040 km</p>
            </div>
          </div>
            
        </div>
      </div> */}
    </section>
  );
};

export default Hero;
