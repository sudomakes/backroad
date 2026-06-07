import { Nav } from './components/Nav';
import { Hero } from './components/Hero';
import { Compare } from './components/Compare';
import { Manifesto } from './components/Manifesto';
import { Gallery } from './components/Gallery';
import { Features } from './components/Features';
import { Hosting } from './components/Hosting';
import { CtaStrip } from './components/CtaStrip';
import { Footer } from './components/Footer';

export default function App() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Compare />
        <Manifesto />
        <Gallery />
        <Features />
        <Hosting />
        <CtaStrip />
      </main>
      <Footer />
    </>
  );
}
