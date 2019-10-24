import React from 'react';

import styles from './styles.scss';
import auntyPng from './aunty.png';
import stemPng from './stem.png';

export default () => {
  return (
    <div className={styles.base}>
      <p>It looks like you're wanting to use Freezeframe.</p>
      <p>You'll have to have a chat to Tim Leslie.</p>
      <p>
        <a className={styles.link} href="mailto:leslie.tim@abc.net.au">
          leslie.tim@abc.net.au
        </a>
      </p>
      <div className={styles.character} style={{ backgroundImage: `url(${stemPng})` }}>
        <img src={auntyPng} className={styles.image} />
      </div>
    </div>
  );
};
