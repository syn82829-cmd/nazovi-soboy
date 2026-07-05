import { useEffect, useRef, useState } from 'react';

import { SearchLine } from '../../components/SearchLine/SearchLine.jsx';

import './OpeningFlow.css';

const PAD = 14;
const GAP = 14;
const MAX_BUBBLES = 36;

function viewport() {
  return { width: window.innerWidth || 390, height: window.innerHeight || 844 };
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function sizeFor(text) {
  const { width } = viewport();
  return {
    width: clamp(text.length * 11 + 42, 88, Math.min(430, width - PAD * 2)),
    height: 46
  };
}

function overlaps(a, b, gap = GAP) {
  return !(
    a.x + a.width + gap < b.x ||
    b.x + b.width + gap < a.x ||
    a.y + a.height + gap < b.y ||
    b.y + b.height + gap < a.y
  );
}

function spawnPosition(items, size) {
  const box = viewport();
  const maxX = Math.max(PAD, box.width - size.width - PAD);
  const maxY = Math.max(96, box.height - 168);
  const center = box.width / 2 - size.width / 2;
  const xs = [center, center - 120, center + 120, box.width * 0.16, box.width * 0.56, box.width * 0.32, box.width * 0.72];

  for (let row = 0; row < 9; row += 1) {
    for (let i = 0; i < xs.length; i += 1) {
      const candidate = {
        x: clamp(xs[i], PAD, maxX),
        y: maxY - row * (size.height + GAP + 8),
        ...size
      };

      if (!items.some((item) => overlaps(candidate, item))) {
        return { x: candidate.x, y: candidate.y };
      }
    }
  }

  return { x: clamp(center, PAD, maxX), y: maxY };
}

function makeBubble(text, items) {
  const size = sizeFor(text);
  const place = spawnPosition(items, size);

  return {
    id: `${Date.now()}-${Math.random()}`,
    text,
    ...size,
    ...place,
    vx: (Math.random() > 0.5 ? 1 : -1) * (8 + Math.random() * 12),
    vy: -(15 + Math.random() * 10),
    dragging: false,
    ox: 0,
    oy: 0
  };
}

export function OpeningFlow() {
  const [text, setText] = useState('');
  const [bubbles, setBubbles] = useState([]);
  const [showExist, setShowExist] = useState(false);
  const bubblesRef = useRef([]);
  const inputRef = useRef(null);
  const frameRef = useRef(0);
  const lastRef = useRef(0);

  useEffect(() => {
    bubblesRef.current = bubbles;
  }, [bubbles]);

  useEffect(() => {
    function step(time) {
      const last = lastRef.current || time;
      const dt = Math.min((time - last) / 1000, 0.032);
      const box = viewport();
      lastRef.current = time;

      const next = bubblesRef.current
        .map((bubble) => ({ ...bubble }))
        .filter((bubble) => bubble.dragging || bubble.y + bubble.height > -110);

      next.forEach((bubble) => {
        if (bubble.dragging) return;
        bubble.x += bubble.vx * dt;
        bubble.y += bubble.vy * dt;

        if (bubble.x < PAD) {
          bubble.x = PAD;
          bubble.vx = Math.abs(bubble.vx);
        }

        if (bubble.x + bubble.width > box.width - PAD) {
          bubble.x = box.width - PAD - bubble.width;
          bubble.vx = -Math.abs(bubble.vx);
        }
      });

      for (let pass = 0; pass < 3; pass += 1) {
        for (let i = 0; i < next.length; i += 1) {
          for (let j = i + 1; j < next.length; j += 1) {
            const a = next[i];
            const b = next[j];
            if (a.dragging || b.dragging || !overlaps(a, b)) continue;

            const ax = a.x + a.width / 2;
            const ay = a.y + a.height / 2;
            const bx = b.x + b.width / 2;
            const by = b.y + b.height / 2;
            const pushX = (a.width + b.width) / 2 + GAP - Math.abs(ax - bx);
            const pushY = (a.height + b.height) / 2 + GAP - Math.abs(ay - by);

            if (pushX < pushY) {
              const s = ax < bx ? -1 : 1;
              a.x += (pushX / 2) * s;
              b.x -= (pushX / 2) * s;
              a.vx *= -0.7;
              b.vx *= -0.7;
            } else {
              const s = ay < by ? -1 : 1;
              a.y += (pushY / 2) * s;
              b.y -= (pushY / 2) * s;
            }

            a.x = clamp(a.x, PAD, box.width - PAD - a.width);
            b.x = clamp(b.x, PAD, box.width - PAD - b.width);
          }
        }
      }

      bubblesRef.current = next;
      setBubbles(next);
      frameRef.current = requestAnimationFrame(step);
    }

    frameRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameRef.current);
  }, []);

  function submit(event) {
    event.preventDefault();
    const value = text.trim();
    if (!value) return;

    setShowExist(value.toLocaleLowerCase('ru-RU') === 'я');
    setText('');
    setBubbles((current) => {
      const living = current.slice(-MAX_BUBBLES + 1);
      const next = [...living, makeBubble(value, living)];
      bubblesRef.current = next;
      return next;
    });
  }

  function down(event, id) {
    const px = event.clientX;
    const py = event.clientY;
    event.currentTarget.setPointerCapture?.(event.pointerId);

    setBubbles((current) => {
      const next = current.map((bubble) => (
        bubble.id === id
          ? { ...bubble, dragging: true, ox: px - bubble.x, oy: py - bubble.y, vx: 0 }
          : bubble
      ));
      bubblesRef.current = next;
      return next;
    });
  }

  function move(event, id) {
    const px = event.clientX;
    const py = event.clientY;
    const box = viewport();

    setBubbles((current) => {
      const next = current.map((bubble) => {
        if (bubble.id !== id || !bubble.dragging) return bubble;
        return {
          ...bubble,
          x: clamp(px - bubble.ox, -bubble.width * 0.45, box.width - bubble.width * 0.55),
          y: clamp(py - bubble.oy, -bubble.height * 0.45, box.height - bubble.height * 0.55)
        };
      });
      bubblesRef.current = next;
      return next;
    });
  }

  function up(event, id) {
    event.currentTarget.releasePointerCapture?.(event.pointerId);

    setBubbles((current) => {
      const next = current.map((bubble) => (
        bubble.id === id
          ? { ...bubble, dragging: false, ox: 0, oy: 0, vx: (Math.random() - 0.5) * 18, vy: -(13 + Math.random() * 11) }
          : bubble
      ));
      bubblesRef.current = next;
      return next;
    });
  }

  return (
    <section className="opening-flow">
      <div className={`opening-flow__exist ${showExist ? 'opening-flow__exist--visible' : ''}`}>Есть?</div>

      <div className="opening-flow__phrases">
        {bubbles.map((bubble) => (
          <button
            className={`opening-flow__bubble ${bubble.dragging ? 'opening-flow__bubble--dragging' : ''}`}
            key={bubble.id}
            type="button"
            style={{ width: `${bubble.width}px`, transform: `translate3d(${bubble.x}px, ${bubble.y}px, 0)` }}
            onPointerDown={(event) => down(event, bubble.id)}
            onPointerMove={(event) => move(event, bubble.id)}
            onPointerUp={(event) => up(event, bubble.id)}
            onPointerCancel={(event) => up(event, bubble.id)}
          >
            {bubble.text}
          </button>
        ))}
      </div>

      <div className="opening-flow__search">
        <SearchLine
          value={text}
          onChange={(event) => setText(event.target.value)}
          onSubmit={submit}
          inputRef={inputRef}
          isOpen
        />
      </div>
    </section>
  );
}
