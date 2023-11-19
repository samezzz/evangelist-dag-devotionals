import Hero from "../components/Hero";
import Camp from "@/components/Camp";
import Info from "@/components/Info";
import Features from "@/components/Features";
import GetApp from "@/components/GetApp";

export const revalidate = 86400;

export default function Home() {
  return (
    <main className="">
      <Hero />
      {/* <Camp /> */}
      <Info />
      {/* <Features /> */}
      {/* <GetApp /> */}
    </main>
  );
}
 