export const styles = `
  :host {
    padding: 2rem;
    border-radius: 8px;
    max-width: 500px;
    width: 90vw;
    border: none;
    box-shadow: 0 2px 16px rgba(0,0,0,0.15);
  }
  .grid {
    display: grid;
    grid-template-columns: 160px 1fr;
    gap: 2rem;
    align-items: start;
  }
  .image {
    max-width: 100%;
    border-radius: 6px;
    box-shadow: 0 1px 4px rgba(0,0,0,0.07);
  }
  .title {
    margin-top: 0;
    margin-bottom: 0.5rem;
    font-size: 1.25rem;
  }
  .price {
    font-weight: bold;
    font-size: 1.1rem;
    margin-bottom: 1rem;
  }
  .swatches {
    margin-bottom: 1rem;
  }
  .add-btn {
    padding: 0.5rem 1.5rem;
    font-size: 1rem;
    border-radius: 4px;
    background: #222;
    color: #fff;
    border: none;
    cursor: pointer;
  }
  .close-btn {
    margin-top: 1rem;
    margin-left: 1rem;
    background: none;
    border: none;
    color: #888;
    cursor: pointer;
    font-size: 0.95rem;
  }`
