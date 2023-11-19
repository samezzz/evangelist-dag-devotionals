import Image from "next/image";
import { Button } from "./ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";

const Hero = () => {
  return (
    <section className="mx-auto max-w-[1440px] px-4 md:px-20 3xl:px-0 flex flex-col gap-20 py-10 pb-32 md:gap-28 lg:py-20 xl:flex-row">
      <div className="flex flex-1 flex-col xl:w-1/2">
        <div>
          <div className="background-gradient gradient z-0"></div>
          <div className="orange_gradient z-0"></div>
          <div className="green_gradient z-0"></div>
          <div className="blue_gradient z-0"></div>
          <div className="gradient-01 z-0"></div>
          <div className="gradient-02 z-0"></div>
          <h1 className="text-8xl md:text-9xl font-bold z-20">
            Daily <br />
            Counsel
          </h1>
          <p className="mt-6 text-gray-30 xl:max-w-[520px] z-20">
            This is a website dedicated to sharing daily devotionals by the
            esteemed evangelist, Bishop Dag Heward Mills. This platform is
            created out of a deep love and admiration for his profound
            teachings, unwavering faith, and passion for spreading the gospel.
          </p>
          <div className="my-11 flex flex-wrap gap-5">
            <p className="">
              198k
              <span className="ml-1">Excellent Reviews</span>
            </p>
          </div>
          <div className="flex flex-col w-full gap-3 sm:flex-row">
            <Button className="">Go to posts</Button>
          </div>
        </div>
      </div>

      <div className="w-[450px]">
        <div className="flex items-center justify-center">
          <AspectRatio ratio={16 / 9} className="">
            <Image
              src="/evangelist-dag.png"
              alt="Image"
              width={600}
              height={600}
              className="ml-32 rounded-md object-cover z-30"
            />
            <div className="stand-gradient"></div>
          </AspectRatio>
        </div>
      </div>
    </section>
  );
};

export default Hero;

{
  /* <div className="flex flex-1 items-start">
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
</div> */
}
