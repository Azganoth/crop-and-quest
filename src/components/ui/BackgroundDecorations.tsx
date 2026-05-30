export function BackgroundDecorations() {
  return (
    <>
      {/* Ambient Glows (Optimized with hardware-accelerated CSS gradients instead of blur DOM nodes) */}
      <div
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          backgroundImage: `
            radial-gradient(circle closest-side at 25% 25%, color-mix(in oklch, var(--primary), transparent 80%) 0%, transparent 100%),
            radial-gradient(circle closest-side at 75% 50%, color-mix(in oklch, var(--primary), transparent 80%) 0%, transparent 100%),
            radial-gradient(circle closest-side at 25% 75%, color-mix(in oklch, var(--primary), transparent 90%) 0%, transparent 100%)
          `,
        }}
      />

      {/* Decorative Crop Marks */}
      <div className="pointer-events-none absolute inset-4 md:inset-8 xl:inset-12">
        <div className="absolute top-0 left-0 h-12 w-12 border-t-2 border-l-2 border-primary/20 md:h-24 md:w-24" />
        <div className="absolute top-0 right-0 h-12 w-12 border-t-2 border-r-2 border-primary/20 md:h-24 md:w-24" />
        <div className="absolute bottom-0 left-0 h-12 w-12 border-b-2 border-l-2 border-primary/20 md:h-24 md:w-24" />
        <div className="absolute right-0 bottom-0 h-12 w-12 border-r-2 border-b-2 border-primary/20 md:h-24 md:w-24" />
      </div>
    </>
  );
}
