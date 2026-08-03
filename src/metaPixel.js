// Meta Pixel (Facebook Pixel) Helper Utility
export const META_PIXEL_ID = import.meta.env.VITE_META_PIXEL_ID || '';

export const initMetaPixel = () => {
  if (typeof window === 'undefined') return;

  const pixelId = META_PIXEL_ID;
  if (!pixelId) {
    console.info("Meta Pixel Notice: VITE_META_PIXEL_ID is not configured yet.");
    return;
  }

  /* eslint-disable */
  !(function (f, b, e, v, n, t, s) {
    if (f.fbq) return;
    n = f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    };
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = !0;
    n.version = '2.0';
    n.queue = [];
    t = b.createElement(e);
    t.async = !0;
    t.src = v;
    s = b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t, s);
  })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
  /* eslint-enable */

  window.fbq('init', pixelId);
  window.fbq('track', 'PageView');
};

export const trackPixelEvent = (eventName, params = {}) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', eventName, params);
  }
};
