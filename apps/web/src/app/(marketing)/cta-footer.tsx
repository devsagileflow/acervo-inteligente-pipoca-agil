import lkdIcon from "../../../public/img/LinkedIn.png";
import instaIcon from "../../../public/img/Instagram.png";
import ytIcon from "../../../public/img/Youtube.png";
import Image from "next/image";

export const CTAFooter = () => {
  return (
    <section className="bg-[#080D17] text-white">
      <div className="rounded-t-lg border-t-4 border-[#FBBF24]">
        <article className="container mx-auto py-2 md:py-10">
          <div className="flex justify-center gap-20 md:gap-5">
            <a href="#">
              <Image src={lkdIcon} alt="LinkedIn" className="size-5 md:size-15" />
            </a>
            <a href="#">
              <Image src={instaIcon} alt="Instagram" className="size-5 md:size-15" />
            </a>
            <a href="#">
              <Image src={ytIcon} alt="Youtube" className="size-5 md:size-15" />
            </a>
          </div>
          <div className="flex justify-center gap-3 py-5 text-center text-sm">
            <a href="#" className="underline">
              POLÍTICA DE PRIVACIDADE
            </a>
            •
            <a href="#" className="underline">
              TERMOS DE USO
            </a>
          </div>
        </article>
      </div>
    </section>
  );
};

export default CTAFooter;
