export function FaixaPixelada() {
  return (
    <div
      className="h-3 w-full sm:h-4"
      style={{
        backgroundImage:
          "repeating-linear-gradient(90deg, #3B6EC9 0, #3B6EC9 12px, #E03C31 12px, #E03C31 24px, #F3F3F3 24px, #F3F3F3 36px)",
        imageRendering: "pixelated",
      }}
      aria-hidden="true"
    />
  );
}
