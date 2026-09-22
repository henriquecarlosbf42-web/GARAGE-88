import Image from "next/image";

export function BannerParallax({
  imagemUrl,
  alt,
}: {
  imagemUrl: string;
  alt: string;
}) {
  return (
    <section className="w-full bg-background">
      <Image
        src={imagemUrl}
        alt={alt}
        width={1677}
        height={938}
        className="h-auto w-full"
      />
    </section>
  );
}
