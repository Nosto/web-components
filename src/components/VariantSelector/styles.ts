export const variantSelectorStyles = `
  :host {
    display: block;
    font-family: inherit;
    
    /* All CSS variables moved to :host level */
    --row-gap: var(--variant-selector-row-gap, 0.5rem);
    --row-margin: var(--variant-selector-row-margin, 1rem);
    --label-weight: var(--variant-selector-label-weight, 600);
    --label-color: var(--variant-selector-label-color, #333);
    --label-size: var(--variant-selector-label-size, 0.9rem);
    --values-gap: var(--variant-selector-values-gap, 0.5rem);
    --value-bg: var(--variant-selector-value-bg, #f8f9fa);
    --value-border: var(--variant-selector-value-border, 1px solid #e1e5e9);
    --value-radius: var(--variant-selector-value-radius, 4px);
    --value-color: var(--variant-selector-value-color, #333);
    --value-font-size: var(--variant-selector-value-font-size, 0.875rem);
    --value-padding: var(--variant-selector-value-padding, 0.5rem 1rem);
    --value-hover-bg: var(--variant-selector-value-hover-bg, #e9ecef);
    --value-hover-border: var(--variant-selector-value-hover-border, #adb5bd);
    --value-active-bg: var(--variant-selector-value-active-bg, #007bff);
    --value-active-border: var(--variant-selector-value-active-border, #007bff);
    --value-active-color: var(--variant-selector-value-active-color, white);
    --value-active-hover-bg: var(--variant-selector-value-active-hover-bg, #0056b3);
    --value-active-hover-border: var(--variant-selector-value-active-hover-border, #0056b3);
    --value-focus-color: var(--variant-selector-value-focus-color, #007bff);
  }

  :host([loading]) {
    opacity: var(--variant-selector-loading-opacity, 0.7);
  }

  .selector {
    display: block;
  }

  .row {
    display: flex;
    flex-direction: column;
    gap: var(--row-gap);
    margin-bottom: var(--row-margin);
  }

  .row:last-child {
    margin-bottom: 0;
  }

  .label {
    font-weight: var(--label-weight);
    color: var(--label-color);
    font-size: var(--label-size);
  }

  .values {
    display: flex;
    flex-wrap: wrap;
    gap: var(--values-gap);
  }

  .value {
    background: var(--value-bg);
    border: var(--value-border);
    border-radius: var(--value-radius);
    color: var(--value-color);
    cursor: pointer;
    font-family: inherit;
    font-size: var(--value-font-size);
    padding: var(--value-padding);
    transition: all 0.2s ease;
    white-space: nowrap;
  }

  .value:hover {
    background: var(--value-hover-bg);
    border-color: var(--value-hover-border);
  }

  .value.active {
    background: var(--value-active-bg);
    border-color: var(--value-active-border);
    color: var(--value-active-color);
  }

  .value.active:hover {
    background: var(--value-active-hover-bg);
    border-color: var(--value-active-hover-border);
  }

  .value:focus {
    outline: 2px solid var(--value-focus-color);
    outline-offset: 2px;
  }
`
