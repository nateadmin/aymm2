const FOCUSABLE_INPUT_SELECTOR = 'input, textarea, select, [contenteditable="true"]';
const THUMB_CTA_RESERVE_PX = 80;
const VIEWPORT_MARGIN_PX = 12;

let installed = false;

export function findScrollParent(element) {
  if (!element || typeof window === 'undefined') return null;
  let node = element.parentElement;
  while (node) {
    const { overflowY } = window.getComputedStyle(node);
    const scrollable = overflowY === 'auto' || overflowY === 'scroll' || overflowY === 'overlay';
    if (scrollable && node.scrollHeight > node.clientHeight + 1) {
      return node;
    }
    node = node.parentElement;
  }
  return document.scrollingElement;
}

/**
 * Scroll the nearest scroll container so `element` sits in the visual viewport
 * above the software keyboard, with room for a primary button.
 */
export function ensureVisibleAboveKeyboard(element, options = {}) {
  if (typeof window === 'undefined') return;
  const viewport = window.visualViewport;
  if (!element || !viewport) return;

  const ctaReserve = options.ctaReserve ?? THUMB_CTA_RESERVE_PX;
  const margin = options.margin ?? VIEWPORT_MARGIN_PX;
  const visibleTop = viewport.offsetTop + margin;
  const visibleBottom = viewport.offsetTop + viewport.height - margin - ctaReserve;

  const rect = element.getBoundingClientRect();
  const scrollParent = findScrollParent(element);
  if (!scrollParent) return;

  let delta = 0;
  if (rect.bottom > visibleBottom) {
    delta += rect.bottom - visibleBottom;
  }
  if (rect.top < visibleTop) {
    delta -= visibleTop - rect.top;
  }
  if (delta !== 0) {
    scrollParent.scrollTop += delta;
  }
}

function syncKeyboardInset() {
  const viewport = window.visualViewport;
  if (!viewport) return;

  const keyboardInset = Math.max(
    0,
    Math.round(window.innerHeight - viewport.height - viewport.offsetTop),
  );
  const open = keyboardInset > 80;

  document.documentElement.style.setProperty('--keyboard-inset', `${keyboardInset}px`);
  if (open) {
    document.documentElement.dataset.keyboardOpen = 'true';
  } else {
    delete document.documentElement.dataset.keyboardOpen;
  }
}

function findPrimaryAction(container) {
  if (!container) return null;
  return container.querySelector(
    ':scope > .auth-page__footer, :scope > .mobile-onboarding__actions, :scope > .connection-success__actions, :scope > .aymm-button',
  );
}

function revealFieldAndAction(target) {
  ensureVisibleAboveKeyboard(target);

  if (!document.documentElement.dataset.keyboardOpen) return;

  const pad = target.closest('.screen-pad, .auth-page');
  const action = findPrimaryAction(pad);
  if (!action) return;

  const viewport = window.visualViewport;
  if (!viewport) return;

  const margin = VIEWPORT_MARGIN_PX;
  const visibleBottom = viewport.offsetTop + viewport.height - margin;
  const actionRect = action.getBoundingClientRect();
  if (actionRect.bottom > visibleBottom) {
    ensureVisibleAboveKeyboard(action, { ctaReserve: margin });
  }
}

function handleFocusIn(event) {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;
  if (!target.matches(FOCUSABLE_INPUT_SELECTOR)) return;

  window.requestAnimationFrame(() => {
    revealFieldAndAction(target);
  });
  window.setTimeout(() => {
    revealFieldAndAction(target);
  }, 120);
}

function handleViewportChange() {
  syncKeyboardInset();
  const active = document.activeElement;
  if (active instanceof HTMLElement && active.matches(FOCUSABLE_INPUT_SELECTOR)) {
    ensureVisibleAboveKeyboard(active);
  }
}

/** Keep focused fields and nearby CTAs above the mobile software keyboard. */
export function initKeyboardViewport() {
  if (installed || typeof window === 'undefined') return;
  if (!window.visualViewport) return;
  installed = true;

  document.documentElement.style.setProperty('--keyboard-inset', '0px');
  syncKeyboardInset();

  window.visualViewport.addEventListener('resize', handleViewportChange);
  window.visualViewport.addEventListener('scroll', handleViewportChange);
  document.addEventListener('focusin', handleFocusIn, true);
}
