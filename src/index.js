import React from 'react';
import { render } from 'react-dom';
import App from './components/App';
import { loadFreezeframes } from './util';

const scrollytellers = loadFreezeframes('u-full', 'mark');

function init() {
  Object.keys(scrollytellers).forEach(key => {
    const scrollyteller = scrollytellers[key];
    render(<App scrollyteller={scrollyteller} />, scrollyteller.mountNode);
  });
}

init();
