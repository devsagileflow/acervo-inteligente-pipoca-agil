export const AprendaAgilidade = () => {
  return (
    <section className="relative overflow-hidden bg-[#0F172A] text-white">
      <div>
        <article className="container mx-auto">
          <div>
            <h1 className="p-10 text-center text-5xl font-bold">FAQ</h1>
            <div className="grid gap-y-3 p-10 text-2xl">
              <div className="relative w-full rounded-2xl bg-linear-to-r from-[#6C3DBF] to-[#FCD34D] p-0.5">
                <button
                  type="button"
                  className="group grid h-full w-full grid-cols-2 rounded-2xl bg-[#0F172A] px-10 py-3 text-left"
                >
                  <p className="font-bold">PORQUE APRENDER AQUI E NÃO NO YOUTUBE?</p>
                  <div className="absolute top-3 right-5 text-2xl font-bold">
                    <p className="group-focus:hidden">▼</p>
                    <p className="hidden group-focus:flex">▲</p>
                  </div>
                  <p className="col-span-2 hidden py-4 group-focus:flex">
                    Porque aqui você não precisa adivinhar o que estudar. Os conteúdos já estão
                    oganizados em trilhas para te guiar do começo ao próximo passo, sem perder
                    tempo.
                  </p>
                </button>
              </div>

              <div className="relative w-full rounded-2xl bg-linear-to-r from-[#6C3DBF] to-[#FCD34D] p-0.5">
                <button
                  type="button"
                  className="group grid h-full w-full grid-cols-2 rounded-2xl bg-[#0F172A] px-10 py-3 text-left"
                >
                  <p className="font-bold">O QUE SÃO TRILHAS DE APRENDIZADO?</p>
                  <div className="absolute top-3 right-5 text-2xl font-bold">
                    <p className="group-focus:hidden">▼</p>
                    <p className="hidden group-focus:flex">▲</p>
                  </div>
                  <p className="col-span-2 hidden py-4 group-focus:flex">
                    São sequências de conteúdos organizados para te ajudar a aprender com mais
                    clareza e direção - sem ficar pulando de vídeo em vídeo.
                  </p>
                </button>
              </div>

              <div className="relative w-full rounded-2xl bg-linear-to-r from-[#6C3DBF] to-[#FCD34D] p-0.5">
                <button
                  type="button"
                  className="group grid h-full w-full grid-cols-2 rounded-2xl bg-[#0F172A] px-10 py-3 text-left"
                >
                  <p className="font-bold">PRECISO ME CADASTRAR PARA COMEÇAR?</p>
                  <div className="absolute top-3 right-5 text-2xl font-bold">
                    <p className="group-focus:hidden">▼</p>
                    <p className="hidden group-focus:flex">▲</p>
                  </div>
                  <p className="col-span-2 hidden py-4 group-focus:flex">
                    Não. Você pode explorar as trilhas livremente e entender a proposta antes de
                    qualquer cadastro.
                  </p>
                </button>
              </div>

              <div className="relative w-full rounded-2xl bg-linear-to-r from-[#6C3DBF] to-[#FCD34D] p-0.5">
                <button
                  type="button"
                  className="group grid h-full w-full grid-cols-2 rounded-2xl bg-[#0F172A] px-10 py-3 text-left"
                >
                  <p className="font-bold">PRECISO PAGAR PARA USAR A PLATAFORMA?</p>
                  <div className="absolute top-3 right-5 text-2xl font-bold">
                    <p className="group-focus:hidden">▼</p>
                    <p className="hidden group-focus:flex">▲</p>
                  </div>
                  <p className="col-span-2 hidden py-4 group-focus:flex">
                    Não. O acesso às trilhas é 100% gratuito.
                  </p>
                </button>
              </div>

              <div className="relative w-full rounded-2xl bg-linear-to-r from-[#6C3DBF] to-[#FCD34D] p-0.5">
                <button
                  type="button"
                  className="group grid h-full w-full grid-cols-2 rounded-2xl bg-[#0F172A] px-10 py-3 text-left"
                >
                  <p className="font-bold">E AGORA, POR ONDE COMEÇAR?</p>
                  <div className="absolute top-3 right-5 text-2xl font-bold">
                    <p className="group-focus:hidden">▼</p>
                    <p className="hidden group-focus:flex">▲</p>
                  </div>
                  <p className="col-span-2 hidden py-4 group-focus:flex">
                    Comece explorando as trilhas disponíveis e escolha aquela que mais faz sentido
                    para você neste momento.
                  </p>
                </button>
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
};

export default AprendaAgilidade;
