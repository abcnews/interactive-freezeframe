const a2o = require('@abcnews/alternating-case-to-object');

/**
 * Finds and grabs any nodes between #freezeframe and #endfreezeframe
 * @param {string?} className The className to apply to the mount node
 * @param {string?} markerName The hash name for markers
 * @returns {object}
 */
export function loadFreezeframes(className, markerName) {
  markerName = markerName || 'mark';

  const selector = 'freezeframe';

  if (!window.__freezeframes) {
    window.__freezeframes = {};

    // Grab any nodes between #freezeframe<ID> and #endfreezeframe
    [].slice.call(document.querySelectorAll(`[name^=${selector}]`)).forEach(firstNode => {
      const id = firstNode.getAttribute('name').match(/freezeframe(\d+)/)[1];
      const config = a2o(firstNode.getAttribute('name').slice((selector + id).length));

      let node = firstNode.nextSibling;
      let nodes = [];
      let hasMoreContent = true;

      while (hasMoreContent && node) {
        if (!node.tagName) {
          node = node.nextSibling;
          continue;
        }
        if ((node.getAttribute('name') || '').indexOf(`endfreezeframe`) > -1) {
          hasMoreContent = false;
        } else {
          if (config.captions === 'none') {
            // Not sure why this was in here but putting it behind an optional flag
            [].slice.apply(node.querySelectorAll('.inline-caption')).forEach(child => {
              child.parentNode.removeChild(child);
            });
          }
          nodes.push(node);
          node = node.nextSibling;
        }
      }

      window.__freezeframes[id] = {
        freezeframeKey: id,
        config,
        mountNode: createMountNode(name, className),
        panels: loadPanels(nodes, config, markerName)
      };
    });
  }

  return window.__freezeframes;
}

/**
 * Parse a list of nodes loocking for anchors starting with a given name
 * @param {array<DOMNode>} nodes
 * @param {object} initialMarker
 * @param {string} name
 */
function loadPanels(nodes, initialMarker, name) {
  let panels = [];
  let nextConfig = initialMarker;
  let nextNodes = [];

  let id = 0;

  // Commit the current nodes to a marker
  function pushPanel() {
    if (nextNodes.length === 0) return;

    panels.push({
      id: id++,
      config: nextConfig,
      nodes: nextNodes
    });
    nextNodes = [];
  }

  // Check the section nodes for panels and marker content
  nodes.forEach((node, index) => {
    if (node.tagName === 'A' && node.getAttribute('name') && node.getAttribute('name').indexOf(name) === 0) {
      // Found a new marker so we should commit the last one
      pushPanel();

      // If marker has no config then just use the previous config
      let configString = node.getAttribute('name').replace(new RegExp(`^${name}`), '');
      if (configString) {
        nextConfig = a2o(configString);
        if (typeof initialMarker.align !== 'undefined' && typeof nextConfig.align === 'undefined') {
          nextConfig.align = initialMarker.align;
        }
        nextConfig.hash = configString;
      } else {
        // Empty marks should stop the piecemeal flow
        nextConfig.piecemeal = false;
      }
    } else if (!node.mountable) {
      // Any other nodes just get grouped for the next marker
      nextNodes.push(node);
      node.parentNode.removeChild(node);
    }

    // Any trailing nodes just get added as a last marker
    if (index === nodes.length - 1) {
      pushPanel();
    }

    // If piecemeal is on/true then each node has its own box
    if (nextConfig.piecemeal) {
      pushPanel();
    }
  });

  return panels;
}

/**
 * Create a node to mount a scrollyteller on
 * @param {string} name
 * @param {string} className
 */
function createMountNode(id, className) {
  const selector = `freezeframe${name}`;
  const mountParent = document.querySelector(`[name^=${selector}]`);
  const mountNode = document.createElement('div');
  mountNode.className = className || '';
  mountNode.style.setProperty('margin-bottom', '-3rem');
  mountParent.parentNode.insertBefore(mountNode, mountParent);

  return mountNode;
}
