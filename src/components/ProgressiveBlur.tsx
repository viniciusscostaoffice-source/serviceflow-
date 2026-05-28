const LAYERS = [
  { blur: '0.25px', mask: 'linear-gradient(to bottom, transparent 0%, black 12.5%, black 25%, transparent 37.5%)' },
  { blur: '0.5px',  mask: 'linear-gradient(to bottom, transparent 12.5%, black 25%, black 37.5%, transparent 50%)' },
  { blur: '1px',    mask: 'linear-gradient(to bottom, transparent 25%, black 37.5%, black 50%, transparent 62.5%)' },
  { blur: '2px',    mask: 'linear-gradient(to bottom, transparent 37.5%, black 50%, black 62.5%, transparent 75%)' },
  { blur: '4px',    mask: 'linear-gradient(to bottom, transparent 50%, black 62.5%, black 75%, transparent 87.5%)' },
  { blur: '8px',    mask: 'linear-gradient(to bottom, transparent 62.5%, black 75%, black 87.5%, transparent 100%)' },
  { blur: '16px',   mask: 'linear-gradient(to bottom, transparent 75%, black 87.5%, black 100%)' },
  { blur: '32px',   mask: 'linear-gradient(to bottom, transparent 87.5%, black 100%)' },
];

export function ProgressiveBlur() {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        width: '100%',
        height: '200px',
        zIndex: 999,
        pointerEvents: 'none',
      }}
    >
      {LAYERS.map((layer, i) => ({
        ...layer,
        key: i,
      })).map(({ blur, mask, key }) => (
        <div
          key={key}
          style={{
            position: 'absolute',
            inset: 0,
            backdropFilter: `blur(${blur})`,
            WebkitBackdropFilter: `blur(${blur})`,
            maskImage: mask,
            WebkitMaskImage: mask,
          }}
        />
      ))}
    </div>
  );
}
