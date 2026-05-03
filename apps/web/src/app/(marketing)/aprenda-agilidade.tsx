import { FaqItem } from "./components/faq-item";

export const AprendaAgilidade = () => {
  return (
    <section className="relative overflow-hidden bg-[#0F172A] text-white">
      <div>
        <article className="container mx-auto">
          <div>
            <h1 className="mt-4 mb-8 text-center text-5xl font-bold">FAQ</h1>
            <div className="mx-auto grid max-w-5xl gap-y-3 p-10 text-[15px] md:text-[20px]">
              <FaqItem
                question="PORQUE APRENDER AQUI E NÃO NO YOUTUBE?"
                answer="Porque aqui você não precisa adivinhar o que estudar. Os conteúdos já estão oganizados em trilhas para te guiar do começo ao próximo passo, sem perder tempo."
              />
              <FaqItem
                question="O QUE SÃO TRILHAS DE APRENDIZADO?"
                answer="São sequências de conteúdos organizados para te ajudar a aprender com mais clareza e direção - sem ficar pulando de vídeo em vídeo."
              />
              <FaqItem
                question="PRECISO ME CADASTRAR PARA COMEÇAR?"
                answer="Não. Você pode explorar as trilhas livremente e entender a proposta antes de qualquer cadastro."
              />
              <FaqItem
                question="PRECISO PAGAR PARA USAR A PLATAFORMA?"
                answer="Não. O acesso às trilhas é 100% gratuito."
              />
              <FaqItem
                question="E AGORA, POR ONDE COMEÇAR?"
                answer="Comece explorando as trilhas disponíveis e escolha aquela que mais faz sentido para você neste momento."
              />
            </div>
          </div>
        </article>
      </div>
    </section>
  );
};

export default AprendaAgilidade;
