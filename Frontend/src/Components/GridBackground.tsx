
export default function GridBackground({ ratio, contained }: { ratio?: number; contained?: boolean }) {
  const CELL  = 72 / (ratio ?? 1);
  const COLS  = Math.ceil(window.innerWidth  / CELL) + 2;
  const ROWS  = Math.ceil(window.innerHeight / CELL) + 2;
  const TOTAL = COLS * ROWS;

  return (
    <div
      className={`${contained ? "absolute" : "fixed"} inset-0 z-0 overflow-hidden pointer-events-none`}
      style={{
        maskImage: 'radial-gradient(ellipse at 50% 0%, black 0%, transparent 75%)',
        WebkitMaskImage: 'radial-gradient(ellipse at 50% 0%, black 0%, transparent 75%)',
      }}
    >
      <div
        className="absolute animate-move-grid"
        style={{
          top: -CELL,
          left: -CELL,
          display: 'grid',
          gridTemplateColumns: `repeat(${COLS}, ${CELL}px)`,
          gridTemplateRows:    `repeat(${ROWS}, ${CELL}px)`,
        }}
      >
        {Array.from({ length: TOTAL }, (_, i) => (
          <div
            key={i}
            style={{
              border: '1px solid var(--grid-line)',
              opacity: 0.6,
            }}
          />
        ))}
      </div>
    </div>
  )
}