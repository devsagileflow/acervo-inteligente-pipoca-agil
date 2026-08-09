import { TrilhasContent, type Trilha } from "./components/trilhas-card";

const trilhas: Trilha[] = [
  {
    id: "agilidade-geral",
    title: "Agilidade Geral",
    image: "/img/agilidade-geral-trilha.png",
  },
  {
    id: "product-owner",
    title: "Product Owner",
    image: "/img/product-owner-trilha.png",
  },
];

export default function PageTrilhas() {
  return <TrilhasContent trilhas={trilhas} />;
}
