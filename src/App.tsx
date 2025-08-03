import { Header } from "./Header";
import { Hero } from "./Hero";
import { About } from "./About";
import { Services } from "./Services";
import { CallToAction } from "./CallToAction";
import { Footer } from "./Footer";

export default function App() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <About />
      <Services />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
}