import { useState } from 'react';

import { FloatingPhrase } from '../../components/FloatingPhrase/FloatingPhrase.jsx';
import { SearchLine } from '../../components/SearchLine/SearchLine.jsx';
import { floatingPhrases } from '../../data/floatingPhrases.js';

import './OpeningFlow.css';

const speeds = ['slow', 'medium', 'fast'];

export function OpeningFlow() {
  const [name, setName] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
  }

  return (
    <section className="opening-flow">
      <div className="opening-flow__phrases" aria-hidden="true">
        {floatingPhrases.map((phrase, index) => (
          <FloatingPhrase
            key={phrase}
            lane={index % 5}
            speed={speeds[index % speeds.length]}
            delay={index * -2.4}
          >
            {phrase}
          </FloatingPhrase>
        ))}
      </div>

      <div className="opening-flow__search">
        <SearchLine
          value={name}
          onChange={(event) => setName(event.target.value)}
          onSubmit={handleSubmit}
        />
      </div>
    </section>
  );
}
