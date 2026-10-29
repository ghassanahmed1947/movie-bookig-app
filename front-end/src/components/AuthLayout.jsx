import { useEffect, useState } from "react";
import api from "../api";
import { Logo } from "./Brand";

// Agar movies load na hon to ye tasveerein dikhengi
const fallback = [
  "/images/spiderman.png",
  "/images/john-wick.jfif",
  "/images/Top-Gun-Maverick.jfif",
  "/images/Mad-Max.jfif",
  "/images/endgame.jfif",
  "/images/uncharted.jfif",
  "/images/Mission-Impossible.jfif",
  "/images/jumanji.jfif",
];

function Column({ images, slow }) {
  // Do dafa repeat taake loop seamless ho
  const list = [...images, ...images];
  return (
    <div className={`drift ${slow ? "slow" : ""} flex flex-col gap-3`}>
      {list.map((src, i) => (
        <img key={i} src={src} alt="" className="aspect-video w-full rounded-xl object-cover" />
      ))}
    </div>
  );
}

function AuthLayout({ title, subtitle, children }) {
  const [images, setImages] = useState(fallback);

  useEffect(() => {
    api
      .get("/movies")
      .then((res) => {
        const posters = res.data.map((m) => m.posterUrl).filter(Boolean);
        if (posters.length >= 3) setImages(posters);
      })
      .catch(() => {});
  }, []);

  const a = images.filter((_, i) => i % 2 === 0);
  const b = images.filter((_, i) => i % 2 === 1);

  return (
    <div className="grid min-h-screen lg:grid-cols-[1.1fr_1fr]">
      {/* Poster wall */}
      <div className="relative hidden overflow-hidden bg-velvet-deep lg:block" aria-hidden>
        <div className="absolute inset-0 grid -rotate-6 scale-125 grid-cols-2 gap-3 opacity-60">
          <Column images={a.length ? a : images} />
          <Column images={b.length ? b : images} slow />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-velvet-deep/40 via-velvet-deep/60 to-ink" />
        <div className="absolute inset-x-0 bottom-0 p-12">
          <p className="max-w-md font-display text-6xl font-black leading-[0.95] text-paper">
            The lights are going down. Grab your seat.
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="flex flex-col px-4 py-8 sm:px-10">
        <Logo />
        <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-12">
          <h1 className="text-6xl font-black text-paper">{title}</h1>
          <p className="mb-8 mt-3 text-smoke">{subtitle}</p>
          {children}
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
