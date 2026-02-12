export function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false;

  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

export function isIOS(): boolean {
  if (typeof window === 'undefined') return false;

  return /iPad|iPhone|iPod/.test(navigator.userAgent);
}

export function isAndroid(): boolean {
  if (typeof window === 'undefined') return false;

  return /Android/.test(navigator.userAgent);
}

export function isTouchDevice(): boolean {
  if (typeof window === 'undefined') return false;

  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

export function getViewportHeight(): number {
  if (typeof window === 'undefined') return 0;

  return window.innerHeight || document.documentElement.clientHeight;
}

export function getViewportWidth(): number {
  if (typeof window === 'undefined') return 0;

  return window.innerWidth || document.documentElement.clientWidth;
}

export function preventPullToRefresh() {
  if (typeof window === 'undefined') return;

  let lastTouchY = 0;
  const threshold = 5;

  document.addEventListener(
    'touchstart',
    (e) => {
      if (e.touches.length !== 1) return;
      lastTouchY = e.touches[0].clientY;
    },
    { passive: false }
  );

  document.addEventListener(
    'touchmove',
    (e) => {
      const touchY = e.touches[0].clientY;
      const touchYDelta = touchY - lastTouchY;
      lastTouchY = touchY;

      if (window.scrollY === 0 && touchYDelta > threshold) {
        e.preventDefault();
      }
    },
    { passive: false }
  );
}

export function setViewportHeight() {
  if (typeof window === 'undefined') return;

  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}

export function setupMobileOptimizations() {
  if (typeof window === 'undefined') return;

  setViewportHeight();

  window.addEventListener('resize', setViewportHeight);

  if (isIOS()) {
    preventPullToRefresh();
  }

  return () => {
    window.removeEventListener('resize', setViewportHeight);
  };
}
