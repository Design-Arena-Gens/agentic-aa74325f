"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type SceneSpec = {
  id: string;
  title: string;
  caption: string;
  background: string; // CSS gradient
  renderForeground?: () => JSX.Element;
};

const useInterval = (cb: () => void, ms: number | null) => {
  const saved = useRef(cb);
  useEffect(() => { saved.current = cb; }, [cb]);
  useEffect(() => {
    if (ms === null) return;
    const t = setInterval(() => saved.current(), ms);
    return () => clearInterval(t);
  }, [ms]);
};

export default function Reel() {
  const scenes: SceneSpec[] = useMemo(() => [
    {
      id: "bed",
      title: "Freshly made bed",
      caption: "Hands smoothing soft fabric, slow and gentle.",
      background:
        "radial-gradient(120% 120% at 10% 10%, var(--pastel-rose), transparent), " +
        "radial-gradient(120% 120% at 100% 0%, var(--pastel-mint), transparent), " +
        "linear-gradient(180deg, #ffffff, #f6f7fb)",
      renderForeground: () => (
        <div aria-hidden className="backdrop" style={{
          background:
            "repeating-linear-gradient(115deg, rgba(255,255,255,.7) 0 10px, rgba(255,255,255,.55) 10px 20px), " +
            "linear-gradient(180deg, #ffffff80, #ffffff00)",
          transform: "translate3d(0,0,0)",
        }} />
      )
    },
    {
      id: "coffee",
      title: "Warm morning coffee",
      caption: "Sunlight kisses the cup; steam drifts in the air.",
      background:
        "radial-gradient(100% 120% at 80% 10%, var(--pastel-peach), transparent), " +
        "radial-gradient(120% 120% at 0% 100%, var(--pastel-blue), transparent), " +
        "linear-gradient(180deg, #ffffff, #f6f7fb)",
      renderForeground: () => (
        <>
          {/* Minimal cup */}
          <svg aria-hidden width={220} height={150} style={{zIndex:2}}
               viewBox="0 0 220 150">
            <defs>
              <linearGradient id="cup" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ffffff"/>
                <stop offset="100%" stopColor="#f1f5ff"/>
              </linearGradient>
            </defs>
            <g transform="translate(20,20)">
              <rect x="15" y="40" rx="18" ry="18" width="150" height="80" fill="url(#cup)" />
              <rect x="135" y="55" rx="20" ry="20" width="50" height="50" fill="#ffffff" opacity="0.8" />
              <rect x="0" y="110" width="180" height="10" fill="#e9eefc"/>
            </g>
          </svg>
          <div className="steam" aria-hidden>
            <span />
            <span />
            <span />
          </div>
        </>
      )
    },
    {
      id: "bathroom",
      title: "Clean, aesthetic bathroom",
      caption: "Glass bottles and soft towels glow in the sun.",
      background:
        "radial-gradient(120% 120% at 90% 80%, var(--pastel-lav), transparent), " +
        "radial-gradient(120% 120% at 0% 0%, var(--pastel-blue), transparent), " +
        "linear-gradient(180deg, #ffffff, #f6f7fb)",
      renderForeground: () => (
        <svg aria-hidden width={280} height={160} viewBox="0 0 280 160" style={{zIndex:2}}>
          <defs>
            <linearGradient id="glassG" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85"/>
              <stop offset="100%" stopColor="#dfe9ff" stopOpacity="0.6"/>
            </linearGradient>
          </defs>
          <g transform="translate(10,20)">
            <rect x="10" y="40" width="40" height="80" rx="8" fill="url(#glassG)" />
            <rect x="80" y="25" width="50" height="95" rx="10" fill="url(#glassG)" />
            <rect x="160" y="35" width="60" height="85" rx="12" fill="url(#glassG)" />
            <rect x="0" y="125" width="240" height="8" fill="#eaefff" />
          </g>
        </svg>
      )
    },
    {
      id: "wash",
      title: "Refreshing cold water",
      caption: "Droplets sparkle in the sunlight.",
      background:
        "radial-gradient(120% 120% at 20% 0%, var(--pastel-blue), transparent), " +
        "radial-gradient(120% 120% at 100% 60%, var(--pastel-mint), transparent), " +
        "linear-gradient(180deg, #ffffff, #f6f7fb)",
      renderForeground: () => (
        <Droplets />
      )
    },
    {
      id: "breakfast",
      title: "Calm breakfast prep",
      caption: "Milk pours; fruits fall in soft natural light.",
      background:
        "radial-gradient(120% 120% at 80% 0%, var(--pastel-peach), transparent), " +
        "radial-gradient(120% 120% at 0% 100%, var(--pastel-rose), transparent), " +
        "linear-gradient(180deg, #ffffff, #f6f7fb)",
      renderForeground: () => (
        <BreakfastAnim />
      )
    }
  ], []);

  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const trackRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const step = useCallback(() => {
    setIndex((i) => (i + 1) % scenes.length);
  }, [scenes.length]);

  useInterval(step, playing ? 4200 : null);

  useEffect(() => {
    const x = index * -100;
    trackRef.current?.style.setProperty('transform', `translateX(${x}%)`);
  }, [index]);

  useEffect(() => {
    if (!audioRef.current) return;
    if (playing) {
      void audioRef.current.play().catch(() => {});
    } else {
      audioRef.current.pause();
    }
  }, [playing]);

  return (
    <main className="reel-root" aria-label="Soft cinematic morning reel">
      <div className="controls">
        <button className="button" onClick={() => setPlaying(p => !p)}>
          {playing ? 'Pause' : 'Play'}
        </button>
        <button className="button" onClick={() => setIndex(i => (i + scenes.length - 1) % scenes.length)}>
          ? Prev
        </button>
        <button className="button" onClick={() => setIndex(i => (i + 1) % scenes.length)}>
          Next ?
        </button>
      </div>

      <audio ref={audioRef} loop preload="none" aria-label="Calm morning background music">
        {/* CC0 music sample from pixabay (light ambient). If it fails, UI still works. */}
        <source src="https://cdn.pixabay.com/audio/2021/09/10/audio_a6f1c60f3a.mp3" type="audio/mpeg" />
      </audio>

      <div ref={trackRef} className="reel-track" role="list" aria-live="polite">
        {scenes.map((s) => (
          <section key={s.id} className="scene" role="listitem" aria-roledescription="scene">
            <div className="backdrop" style={{ background: s.background }} />
            <div className="grain" />
            <div className="flare" />
            {s.renderForeground?.()}
            <div className="glass-card">
              <div className="caption">{s.caption}</div>
              <h2 className="title">{s.title}</h2>
            </div>
            <span className="sr-only">{s.title}. {s.caption}</span>
          </section>
        ))}
      </div>
    </main>
  );
}

function Droplets() {
  const holder = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!holder.current) return;
    const el = holder.current;
    const spawn = () => {
      const d = document.createElement('div');
      d.className = 'droplet';
      d.style.left = Math.random() * 90 + 5 + '%';
      d.style.animationDuration = (4 + Math.random() * 3).toFixed(2) + 's';
      d.style.animationDelay = (Math.random() * 1.5).toFixed(2) + 's';
      el.appendChild(d);
      setTimeout(() => d.remove(), 8000);
    };
    const id = setInterval(spawn, 220);
    return () => clearInterval(id);
  }, []);
  return <div ref={holder} aria-hidden />;
}

function BreakfastAnim() {
  const holder = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!holder.current) return;
    const el = holder.current;

    const makeFruit = (cls: string) => {
      const f = document.createElement('div');
      f.className = 'fruit ' + cls;
      f.style.left = Math.random() * 90 + 5 + '%';
      f.style.animationDuration = (5 + Math.random() * 3).toFixed(2) + 's';
      f.style.animationDelay = (Math.random() * 1.5).toFixed(2) + 's';
      el.appendChild(f);
      setTimeout(() => f.remove(), 9000);
    };

    const fruitId = setInterval(() => {
      makeFruit(Math.random() > 0.5 ? 'peach' : 'berry');
    }, 400);

    return () => clearInterval(fruitId);
  }, []);

  return (
    <div aria-hidden>
      <div className="milk-stream" />
      <div ref={holder} />
    </div>
  );
}
