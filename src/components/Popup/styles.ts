export const popupStyles = `
  :host {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1000;
    pointer-events: none;
  }

  [part="dialog"] {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border: none;
    border-radius: 8px;
    padding: 0;
    background: transparent;
    pointer-events: auto;
    z-index: 1001;
  }

  [part="dialog"]::backdrop {
    background: rgba(0, 0, 0, 0.5);
  }

  [part="ribbon"] {
    position: fixed;
    bottom: 20px;
    right: 20px;
    pointer-events: auto;
    z-index: 1002;
  }

  .hidden {
    display: none;
  }
`
