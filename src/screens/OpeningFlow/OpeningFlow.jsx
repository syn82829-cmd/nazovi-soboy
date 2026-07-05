import { useRef, useState } from 'react';

import { confirmSearch } from '../../app/telegramViewport.js';
import { FloatingPhrase } from '../../components/FloatingPhrase/FloatingPhrase.jsx';
import { InfoHint } from '../../components/InfoHint/InfoHint.jsx';
import { SearchLine } from '../../components/SearchLine/SearchLine.jsx';
import { floatingPhrases } from '../../data/floatingPhrases.js';

import './OpeningFlow.css';

const phraseScene = [
  { x: '20%', y: '122%', duration: 31, delay: -2 },
  { x: '54%', y: '136%', duration: 34, delay: -7 },
  { x: '80%', y: '150%', duration: 33, delay: -12 },
  { x: '32%', y: '164%', duration: 36, delay: -17 },
  { x: '68%', y: '178%', duration: 35, delay: -22 },
  { x: '16%', y: '192%', duration: 38, delay: -27 },
  { x: '48%', y: '206%', duration: 37, delay: -32 },
  { x: '82%', y: '220%', duration: 40, delay: -37 },
  { x: '28%', y: '234%', duration: 39, delay: -42 },
  { x: '62%', y: '248%', duration: 42, delay: -47 },
  { x: '18%', y: '262%', duration: 41, delay: -52 },
  { x: '74%', y: '276%', duration: 44, delay: -57 },
  { x: '44%', y: '290%', duration: 45, delay: -62 },
  { x: '84%', y: '304%', duration: 46, delay: -67 }
];

export function OpeningFlow() {
  const [name, setName] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const isWaitingForAnswer = useRef(false);
  const inputRef = useRef(null);

  function handleSubmit(event) {
    event.preventDefault();
  }

  function focusSearch() {
    inputRef.current?.focus({ preventScroll: true });
  }

  function handleSearchIntent() {
    if (isSearchOpen) {
      focusSearch();
      return;
    }

    if (isWaitingForAnswer.current) {
      return;
    }

    isWaitingForAnswer.current = true;

    confirmSearch((accepted) => {
      isWaitingForAnswer.current = false;

      if (!accepted) {
        return;
      }

      setIsSearchOpen(true);

      requestAnimationFrame(() => {
        focusSearch();
        setTimeout(focusSearch, 80);
      });
    });
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
          inputRef={inputRef}
          isOpen={isSearchOpen}
        />

        <InfoHint
          isOpen={false}
          onOpen={() => setIsInfoOpen(true)}
          onClose={() => setIsInfoOpen(false)}
        />
      </div>

      <InfoHint
        isOpen={isInfoOpen}
        onOpen={() => setIsInfoOpen(true)}
        onClose={() => setIsInfoOpen(false)}
        showButton={false}
      />
    </section>
  );
}
