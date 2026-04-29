import { Header } from "@/widgets/Header";
import { Footer } from "@/widgets/Footer";
import { Hero } from "@/features/Hero";
import { About } from "@/features/About";
import { Skills } from "@/features/Skills";
import { Experience } from "@/features/Experience";
import { Projects } from "@/features/Projects";
import { Contact } from "@/features/Contact";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />

        {/* Divider */}
        <div
          style={{
            height: "1px",
            background: "linear-gradient(90deg, transparent, var(--color-border-hi), transparent)",
          }}
        />
        <About />
        <div style={{ height: "1px", background: "linear-gradient(90deg, transparent, var(--color-border-hi), transparent)" }} />
        <Skills />
        <div style={{ height: "1px", background: "linear-gradient(90deg, transparent, var(--color-border-hi), transparent)" }} />
        <Experience />
        <div style={{ height: "1px", background: "linear-gradient(90deg, transparent, var(--color-border-hi), transparent)" }} />
        <Projects />
        <div style={{ height: "1px", background: "linear-gradient(90deg, transparent, var(--color-border-hi), transparent)" }} />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
