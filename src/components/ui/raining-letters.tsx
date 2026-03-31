import { useState, useEffect, useCallback } from "react";

interface Character {
  char: string;
  x: number;
  y: number;
  speed: number;
}

const RainingLetters = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [activeIndices, setActiveIndices] = useState<Set<number>>(new Set());

  const createCharacters = useCallback(() => {
    const allChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789ΨΩΔΣΦΠλμ∞∂∫≈≠±";
    const charCount = 200;
    const newCharacters: Character[] = [];
    for (let i = 0; i < charCount; i++) {
      newCharacters.push({
        char: allChars[Math.floor(Math.random() * allChars.length)],
        x: Math.random() * 100,
        y: Math.random() * 100,
        speed: 0.05 + Math.random() * 0.15,
      });
    }
    return newCharacters;
  }, []);

  useEffect(() => {
    setCharacters(createCharacters());
  }, [createCharacters]);

  useEffect(() => {
    const flickerInterval = setInterval(() => {
      const newActive = new Set<number>();
      const numActive = Math.floor(Math.random() * 3) + 2;
      for (let i = 0; i < numActive; i++) {
        newActive.add(Math.floor(Math.random() * characters.length));
      }
      setActiveIndices(newActive);
    }, 80);
    return () => clearInterval(flickerInterval);
  }, [characters.length]);

  useEffect(() => {
    let raf: number;
    const allChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789ΨΩΔΣΦΠλμ∞∂∫≈≠±";
    const update = () => {
      setCharacters(prev =>
        prev.map(c => ({
          ...c,
          y: c.y + c.speed,
          ...(c.y >= 100 && {
            y: -2,
            x: Math.random() * 100,
            char: allChars[Math.floor(Math.random() * allChars.length)],
          }),
        }))
      );
      raf = requestAnimationFrame(update);
    };
    raf = requestAnimationFrame(update);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
      {characters.map((char, i) => (
        <span
          key={i}
          className="absolute font-mono text-[10px] transition-opacity duration-100"
          style={{
            left: `${char.x}%`,
            top: `${char.y}%`,
            opacity: activeIndices.has(i) ? 0.18 : 0.06,
            color: "hsl(var(--muted-foreground))",
          }}
        >
          {char.char}
        </span>
      ))}
    </div>
  );
};

export default RainingLetters;
