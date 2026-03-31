const TrustStrip = () => {
  const items = [
    { emoji: '🏦', label: 'Punjab National Bank' },
    { emoji: '🎓', label: 'IIT Kanpur' },
    { emoji: '🏛', label: 'Dept. of Financial Services, Govt. of India' },
  ];

  return (
    <section className="bg-brand-primary py-5 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        <span className="font-mono text-[10px] text-white/40 tracking-[2px] uppercase">
          In Collaboration With
        </span>
        <div className="flex flex-wrap items-center gap-6">
          {items.map((item, i) => (
            <div key={item.label} className="flex items-center gap-4">
              {i > 0 && <div className="w-px h-4 bg-white/10" />}
              <span className="font-body text-[13px] font-semibold text-white flex items-center gap-1.5">
                <span>{item.emoji}</span> {item.label}
              </span>
            </div>
          ))}
        </div>
        <span className="font-mono text-xs text-accent-amber">NIST FIPS 203 · 204 · 205</span>
      </div>
    </section>
  );
};

export default TrustStrip;
