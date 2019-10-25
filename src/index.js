import React from 'react';
import { render } from 'react-dom';
import App from './components/App';
import { loadFreezeframes } from './util';
import TeamError from './components/TeamError';

function init() {
  // // Detect a valid production unit
  // const productionUnit = document.querySelector('meta[name="ABC.productionUnit"]');
  // if (!productionUnit || ['Story Lab', 'EDL team'].indexOf(productionUnit.getAttribute('content')) === -1) {
  //   // If we are in preview...
  //   if (document.location.href.indexOf('nucwed') > -1) {
  //     // ...mount a message about talking to Tim
  //     const anchor = document.querySelector('a[name^="freezeframe"]');
  //     const mountNode = document.createElement('div');
  //     anchor.parentElement.insertBefore(mountNode, anchor);
  //     render(<TeamError />, mountNode);
  //   }
  //   // Either way, stop
  //   return;
  // }

  const scrollytellers = loadFreezeframes('u-full', 'mark');
  Object.keys(scrollytellers).forEach(key => {
    const scrollyteller = scrollytellers[key];
    render(<App scrollyteller={scrollyteller} />, scrollyteller.mountNode);
  });
}

if (window.__ODYSSEY__) {
  init();
} else {
  window.addEventListener('odyssey:api', init);
}
