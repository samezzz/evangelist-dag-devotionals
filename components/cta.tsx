import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";

export const Cta: React.FC = () => {
  return (
    <section>
      <div className="pt-2 lg:pt-8 max-w-6xl px-4 mx-auto sm:px-6">
        <div className="relative px-8 rounded-[3rem] overflow-hidden">
          {/* Radial gradient */}
          <div
            className="absolute top-0 flex items-center justify-center w-1/3 pointer-events-none -translate-y-1/2 left-1/2 -translate-x-1/2 -z-10 aspect-square"
            aria-hidden="true"
          >
            <div className="absolute inset-0 translate-z-0 bg-primary-500 rounded-full blur-[120px] opacity-70" />
            <div className="absolute w-1/4 h-1/4 translate-z-0 bg-primary-400 rounded-full blur-[40px]" />
          </div>
          {/* Blurred shape */}
          <div
            className="absolute bottom-0 left-0 opacity-50 pointer-events-none translate-y-1/2 blur-2xl -z-10"
            aria-hidden="true"
          />
          {/* Content */}
          <div className="max-w-3xl mx-auto text-center">
            <div>
              <div className="inline-flex pb-3 font-medium bg-clip-text bg-gradient-to-r from-primary-500 to-primary-200">
              Embrace Bishop Dag's teachings
              </div>
            </div>
            <h2 className="pb-4 text-4xl font-extrabold ">
              Simplify spiritual growth
            </h2>
            <p className="mb-8 text-lg text-zinc-400">
              Access daily devotionals for enlightenment.
            </p>
            <div>
              <Button variant="default" className="">
              <Link
                className=" justify-center flex sm:inline-flex items-center whitespace-nowrap transition duration-150 ease-in-out font-medium rounded px-4 py-1.5 group"
                href="/posts"
              >
                View Posts{" "}
                <ArrowRight className="w-3 h-3 tracking-normal text-primary-500 group-hover:translate-x-0.5 transition-transform duration-150 ease-in-out ml-1" />
              </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
