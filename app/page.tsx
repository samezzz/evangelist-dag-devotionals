import Hero from "../components/Hero";
import Info from "@/components/Info";

export const revalidate = 86400;

export default function Home() {
  return (
    <main className="overflow-x-hidden max-w-screen">
      <Hero />
      {/* <Info /> */} 
    </main>
  );
}
