import Image from "next/image";

import { Hero } from "./hero";
import { YoutubeXTrilha } from "./youtube-x-trilha";
import { AprendaAgilidade } from "./aprenda-agilidade";
import { CTAFooter } from "./cta-footer";
import { Processo } from "./processo";
import { Reforco } from "./reforco";
import { Label } from "@/components/ui";

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
