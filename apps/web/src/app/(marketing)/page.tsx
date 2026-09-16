import { Hero } from "./hero";
import { YoutubeXTrilha } from "./youtube-x-trilha";
import { AprendaAgilidade } from "./aprenda-agilidade";
import { CTAFooter } from "./cta-footer";
import { Processo } from "./processo";
import { Reforco } from "./reforco";

export default function Home() {
  return (
    <>
      <Hero />
      <YoutubeXTrilha />
      <Processo />
      <AprendaAgilidade />
      <Reforco />
      <CTAFooter />
    </>
  );
}
