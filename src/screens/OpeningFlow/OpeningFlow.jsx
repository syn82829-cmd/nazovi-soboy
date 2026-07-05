import { useRef, useState } from 'react';

import { confirmSearch } from '../../app/telegramViewport.js';
import { FloatingPhrase } from '../../components/FloatingPhrase/FloatingPhrase.jsx';
import { SearchLine } from '../../components/SearchLine/SearchLine.jsx';
import { floatingPhrases } from '../../data/floatingPhrases.js';

import './OpeningFlow.css';

const phraseScene = [
  { x: '18%', y: '82%', duration: 26, delay: -1 },
  { x: '72%', y: '92%', duration: 27, delay: -5 },
  { x: '42%', y: '104%', duration: 28, delay: -9 },
  { x: '83%', y: '116%', duration: 29, delay: -13 },
  { x: '28%', y: '128%', duration: 30, delay: -17 },
  { x: '62%', y: '140%', duration: 31, delay: -21 },
  { x: '21%', y: '152%', duration: 32, delay: -25 },
  { x: '78%', y: '164%', duration: 33, delay: -29 },
  { x: '46%', y: '176%', duration: 34, delay: -33 },
  { x: '84%', y: '188%', duration: 35, delay: -37 },
  { x: '24%', y: '200%', duration: 36, delay: -41 },
  { x: '58%', y: '212%', duration: 37, delay: -45 },
  { x: '50%', y: '224%', duration: 39, delay: -49 },
  { x: '76%', y: '236%', duration: 40, delay: -53 }
];

export function OpeningFlow() {
  const [name, setName] = useState('');
  const confirmationShown = useRef(false);

  function handleSubmit(event) {
    event.preventDefault();
  }

  function handleSearchIntent() {
    if (confirmationShown.current) {
      return;
    }

    confirmationShown.current = true;
    confirmSearch();
  }

  return (
    <section className="opening-flow">
      <div className="opening-flow__phrases" aria-hidden="true">
        {floatingPhrases.map((phrase, index) => {
          const scene = phraseScene[index % phraseScene.length];

          return (
            <FloatingPhrase
              key={phrase}
              x={scene.x}
              y={scene.y}
              duration={scene.duration}
              delay={scene.delay}
            >
              {phrase}
            </FloatingPhrase>
          );
        })}
      </div>

      <div className="opening-flow__search">
        <SearchLine
          value={name}
          onChange={(event) => setName(event.target.value)}
          onSubmit={handleSubmit}
          onSearchIntent={handleSearchIntent}
        />
      </div>
    </section>
  );
}
