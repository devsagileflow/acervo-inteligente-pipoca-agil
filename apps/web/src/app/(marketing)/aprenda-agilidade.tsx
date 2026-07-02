export const AprendaAgilidade = () => {
  return (
    <section className="relative overflow-hidden bg-[#0F172A] text-white">
      <div>
        <article className="container mx-auto">
          <div>
            <h1 className="p-10 text-center text-5xl font-bold">FAQ</h1>
            <div className="grid gap-y-3 p-10 text-2xl">
              <button
                type="button"
                id="pergunta-1"
                className="w-full rounded-2xl bg-linear-to-r from-[#6C3DBF] to-[#FCD34D] p-0.5"
              >
                <div className="h-full w-full rounded-2xl bg-[#0F172A] px-10 py-3 text-left">
                  <p className="font-bold">PORQUE APRENDER AQUI E NÃO NO YOUTUBE?</p>
                  <p id="resposta-1" className="">
                    Porque aqui você não precisa adivinhar o que estudar. Os conteúdos já estão
                    oganizados em trilhas para te guiar do começo ao próximo passo, sem perder
                    tempo.
                  </p>
                </div>
              </button>
              <button
                type="button"
                id="pergunta-2"
                className="w-full rounded-2xl bg-linear-to-r from-[#6C3DBF] to-[#FCD34D] p-0.5"
              >
                <div className="h-full w-full rounded-2xl bg-[#0F172A] px-10 py-3 text-left">
                  <p className="font-bold">O QUE SÃO TRILHAS DE APRENDIZADO?</p>
                  <p className="hidden">
                    São sequências de conteúdos organizados para te ajudar a aprender com mais
                    clareza e direção - sem ficar pulando de vídeo em vídeo.
                  </p>
                </div>
              </button>
              <button
                type="button"
                id="pergunta-3"
                className="w-full rounded-2xl bg-linear-to-r from-[#6C3DBF] to-[#FCD34D] p-0.5"
              >
                <div className="h-full w-full rounded-2xl bg-[#0F172A] px-10 py-3 text-left">
                  <p className="font-bold">PRECISO ME CADASTRAR PARA COMEÇAR?</p>
                  <p className="hidden">
                    Não. Você pode explorar as trilhas livremente e entender a proposta antes de
                    qualquer cadastro.
                  </p>
                </div>
              </button>
              <button
                type="button"
                id="pergunta-4"
                className="w-full rounded-2xl bg-linear-to-r from-[#6C3DBF] to-[#FCD34D] p-0.5"
              >
                <div className="h-full w-full rounded-2xl bg-[#0F172A] px-10 py-3 text-left">
                  <p className="font-bold">PRECISO PAGAR PARA USAR A PLATAFORMA?</p>
                  <p className="hidden">Não. O acesso às trilhas é 100% gratuito.</p>
                </div>
              </button>
              <button
                type="button"
                id="pergunta-5"
                className="w-full rounded-2xl bg-linear-to-r from-[#6C3DBF] to-[#FCD34D] p-0.5"
              >
                <div className="h-full w-full rounded-2xl bg-[#0F172A] px-10 py-3 text-left">
                  <p className="font-bold">E AGORA, POR ONDE COMEÇAR?</p>
                  <p className="hidden">
                    Comece explorando as trilhas disponíveis e escolha aquela que mais faz sentido
                    para você neste momento.
                  </p>
                </div>
              </button>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
};

export default AprendaAgilidade;
