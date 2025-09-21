export const VARIANT_SELECTOR_STYLES = `
  :host {
    display: block;
    font-family: var(--nosto-font-family, inherit);
  }
  
  :host([loading]) {
    opacity: var(--nosto-loading-opacity, 0.6);
  }
  
  .variant-selector {
    display: flex;
    flex-direction: column;
    gap: var(--nosto-option-spacing, 1rem);
  }
  
  .variant-option {
    display: flex;
    flex-direction: column;
    gap: var(--nosto-label-spacing, 0.5rem);
  }
  
  .option-label {
    font-weight: var(--nosto-label-weight, 600);
    color: var(--nosto-label-color, #333);
    font-size: var(--nosto-label-size, 1rem);
  }
  
  .option-buttons {
    display: flex;
    flex-wrap: wrap;
    gap: var(--nosto-button-spacing, 0.5rem);
  }
  
  .option-button {
    padding: var(--nosto-button-padding, 0.5rem 1rem);
    border: var(--nosto-button-border, 1px solid #ccc);
    border-radius: var(--nosto-button-radius, 4px);
    background: var(--nosto-button-bg, white);
    color: var(--nosto-button-color, #333);
    font-size: var(--nosto-button-size, 0.875rem);
    cursor: pointer;
    transition: var(--nosto-button-transition, all 0.2s ease);
    min-width: var(--nosto-button-min-width, 2.5rem);
    text-align: center;
  }
  
  .option-button:hover {
    background: var(--nosto-button-hover-bg, #f5f5f5);
    border-color: var(--nosto-button-hover-border, #999);
  }
  
  .option-button:focus {
    outline: none;
    border-color: var(--nosto-button-focus-border, #007bff);
    box-shadow: var(--nosto-button-focus-shadow, 0 0 0 2px rgba(0, 123, 255, 0.25));
  }
  
  .option-button.selected {
    background: var(--nosto-button-selected-bg, #007bff);
    color: var(--nosto-button-selected-color, white);
    border-color: var(--nosto-button-selected-border, #007bff);
  }
  
  .option-button:disabled {
    opacity: var(--nosto-button-disabled-opacity, 0.5);
    cursor: not-allowed;
    background: var(--nosto-button-disabled-bg, #f5f5f5);
    color: var(--nosto-button-disabled-color, #999);
  }
  
  .variant-selector-error {
    color: var(--nosto-error-color, #dc3545);
    background: var(--nosto-error-bg, #f8d7da);
    padding: var(--nosto-error-padding, 1rem);
    border-radius: var(--nosto-error-radius, 4px);
    border: var(--nosto-error-border, 1px solid #f5c6cb);
  }
`

export const VARIANT_SELECTOR_EMPTY_STYLES = `
  :host {
    display: block;
    font-family: var(--nosto-font-family, inherit);
  }
  .variant-selector-empty {
    color: var(--nosto-text-color, #666);
    padding: var(--nosto-padding, 1rem);
  }
`
