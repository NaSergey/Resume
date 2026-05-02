import { Header } from "@/widgets/Header";
import { Footer } from "@/widgets/Footer";
import { Hero } from "@/features/Hero";
import { About } from "@/features/About";
import { Skills } from "@/features/Skills";
import { Experience } from "@/features/Experience";
import { Projects } from "@/features/Projects";
import { Contact } from "@/features/Contact";

const Divider = () => (
  <div className="h-px bg-[linear-gradient(90deg,transparent,var(--color-border-hi),transparent)]" />
);

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Divider />
        <About />
        <Divider />
        <Skills />
        <Divider />
        <Experience />
        <Divider />
        <Projects />
        <Divider />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
