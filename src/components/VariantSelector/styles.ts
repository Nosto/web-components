export const variantSelectorStyles = `
  :host {
    display: block;
    font-family: inherit;
  }

  :host([loading]) {
    opacity: var(--variant-selector-loading-opacity, 0.7);
  }

  .variant-selector {
    display: block;
  }

  .variant-option-row {
    display: flex;
    flex-direction: column;
    gap: var(--variant-selector-row-gap, 0.5rem);
    margin-bottom: var(--variant-selector-row-margin, 1rem);
  }

  .variant-option-row:last-child {
    margin-bottom: 0;
  }

  .variant-option-label {
    font-weight: var(--variant-selector-label-weight, 600);
    color: var(--variant-selector-label-color, #333);
    font-size: var(--variant-selector-label-size, 0.9rem);
  }

  .variant-option-values {
    display: flex;
    flex-wrap: wrap;
    gap: var(--variant-selector-values-gap, 0.5rem);
  }

  .variant-option-value {
    background: var(--variant-selector-value-bg, #f8f9fa);
    border: var(--variant-selector-value-border, 1px solid #e1e5e9);
    border-radius: var(--variant-selector-value-radius, 4px);
    color: var(--variant-selector-value-color, #333);
    cursor: pointer;
    font-family: inherit;
    font-size: var(--variant-selector-value-font-size, 0.875rem);
    padding: var(--variant-selector-value-padding, 0.5rem 1rem);
    transition: all 0.2s ease;
    white-space: nowrap;
  }

  .variant-option-value:hover {
    background: var(--variant-selector-value-hover-bg, #e9ecef);
    border-color: var(--variant-selector-value-hover-border, #adb5bd);
  }

  .variant-option-value--active {
    background: var(--variant-selector-value-active-bg, #007bff);
    border-color: var(--variant-selector-value-active-border, #007bff);
    color: var(--variant-selector-value-active-color, white);
  }

  .variant-option-value--active:hover {
    background: var(--variant-selector-value-active-hover-bg, #0056b3);
    border-color: var(--variant-selector-value-active-hover-border, #0056b3);
  }

  .variant-option-value:focus {
    outline: 2px solid var(--variant-selector-value-focus-color, #007bff);
    outline-offset: 2px;
  }
`
