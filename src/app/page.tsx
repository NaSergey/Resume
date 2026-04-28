import { Header } from "@/widgets/Header";
import { Footer } from "@/widgets/Footer";
import { Hero } from "./(main)/components/Hero";
import { About } from "./(main)/components/About";
import { Stack } from "./(main)/components/Stack";
import { Experience } from "./(main)/components/Experience";
import { Portfolio } from "./(main)/components/Portfolio";
import { ScrollAnimations } from "@/shared/providers/ScrollAnimations";

export default function Home() {
  return (
    <>
      <Header />
      <main className="max-w-[1200px] mx-auto w-full px-5 md:px-8">
        <Hero />
        <About />
        <Stack />
        <Experience />
        <Portfolio />
      </main>
      <Footer />
      <ScrollAnimations />
    </>
  );
}
