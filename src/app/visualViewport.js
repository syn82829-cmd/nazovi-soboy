export function bindVisualViewport() {
  const root = document.documentElement;

  function update() {
    const viewport = window.visualViewport;

    if (!viewport) {
      root.style.setProperty('--keyboard-height', '0px');
      return;
    }

    const keyboardHeight = Math.max(0, window.innerHeight - viewport.height - viewport.offsetTop);
    root.style.setProperty('--keyboard-height', `${keyboardHeight}px`);
  }

  update();

  window.visualViewport?.addEventListener('resize', update);
  window.visualViewport?.addEventListener('scroll', update);
  window.addEventListener('resize', update);

  return () => {
    window.visualViewport?.removeEventListener('resize', update);
    window.visualViewport?.removeEventListener('scroll', update);
    window.removeEventListener('resize', update);
  };
}
