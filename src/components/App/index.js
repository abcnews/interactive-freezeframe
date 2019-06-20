import React from 'react';
import styles from './styles.scss';

const Scrollyteller = require('@abcnews/scrollyteller');
import Video from '@abcnews/scrollyteller-video';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.onMarker = this.onMarker.bind(this);
    this.onTargetTimeReached = this.onTargetTimeReached.bind(this);

    this.state = {
      freezeframe: null,
      hasOverlay: false,
      time: 0
    };
  }

  componentDidMount() {
    fetch(`//www.abc.net.au/dat/news/interactives/freezeframe/${this.props.scrollyteller.freezeframeKey}/config.json`)
      .then(r => r.json())
      .then(freezeframe => {
        this.setState(() => ({ freezeframe }));
      });
  }

  onMarker(config, id) {
    this.setState(state => {
      const updates = {};

      if (typeof config.time !== 'undefined' && state.time !== config.time) updates.hasOverlay = false;
      if (config.time) updates.time = config.time;

      return updates;
    });
  }

  onTargetTimeReached() {
    // hide overlays
    this.setState(() => ({ hasOverlay: true }));
  }

  render() {
    const { scrollyteller } = this.props;
    const { freezeframe, time, hasOverlay } = this.state;

    if (!freezeframe) return <div />;

    const isLandscape = window.innerWidth > window.innerHeight;
    let rendition;
    if (isLandscape) {
      rendition = freezeframe.renditions.filter(r => r.width > r.height)[0];
    } else {
      rendition = freezeframe.renditions.filter(r => r.width < r.height)[0];
    }
    const renditionIndex = freezeframe.renditions.indexOf(rendition);

    let overlays = {};
    freezeframe.marks.forEach(mark => {
      if (mark.renditions[renditionIndex].svg) {
        overlays['overlay' + mark.time] = mark.renditions[renditionIndex].svg;
      }
    });

    const fallbackImages = freezeframe.marks
      .map(mark => {
        return {
          time: mark.time,
          src: mark.fallback
        };
      })
      .reverse();

    return (
      <div className={styles.base}>
        <Scrollyteller
          panels={scrollyteller.panels}
          className={`Block is-richtext is-piecemeal ${styles.scrollyteller}`}
          panelClassName={`Block-content u-layout u-richtext`}
          onMarker={this.onMarker}>
          <Video src={rendition.url} targetTime={time} onTargetTimeReached={this.onTargetTimeReached}>
            {fallbackImages.map(img => {
              return (
                <img
                  className={`${styles.fallbackImage} ${time <= img.time ? styles.visible : ''}`}
                  key={img.src}
                  src={img.src}
                />
              );
            })}

            {Object.keys(overlays).map(key => {
              const isOverlayVisible = [`overlay${time}`, `overlay${time - 1}`, `overlay${time + 1}`].indexOf(key) > -1;
              return (
                <img
                  className={`${styles.overlay} ${hasOverlay && isOverlayVisible ? styles.visible : ''}`}
                  key={key}
                  src={overlays[key]}
                />
              );
            })}
          </Video>
          <div className={styles.attribution}>Google Earth: Digital Globe</div>
        </Scrollyteller>
      </div>
    );
  }
}
