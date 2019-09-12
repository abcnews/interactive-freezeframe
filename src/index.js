import React from 'react';
import { render } from 'react-dom';
import App from './components/App';
import { loadFreezeframes } from './util';

function init() {
  const scrollytellers = loadFreezeframes('u-full', 'mark');
  Object.keys(scrollytellers).forEach(key => {
    const scrollyteller = scrollytellers[key];
    render(<App scrollyteller={scrollyteller} />, scrollyteller.mountNode);
  });
}

if (window.__ODYSSEY__) {
  console.log('didnt wait');
  init();
} else {
  window.addEventListener('odyssey:api', () => {
    console.log('waited');
    init();
  });
}
