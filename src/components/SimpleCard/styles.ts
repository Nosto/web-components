export const cardStyles = `
  :host {
    display: var(--simple-card-display, block);
    border: 1px solid var(--simple-card-border, #e1e1e1);
    border-radius: var(--simple-card-border-radius, 8px);
    overflow: hidden;
    background: var(--simple-card-bg, white);
    transition: box-shadow 0.2s ease;
    
    /* All CSS variables moved to :host level */
    --content-padding: var(--simple-card-content-padding, 1rem);
    --brand-color: var(--simple-card-brand-color, #666);
    --title-color: var(--simple-card-title-color, inherit);
    --link-color: var(--simple-card-link-color, #333);
    --link-hover-color: var(--simple-card-link-hover-color, #0066cc);
    --price-color: var(--simple-card-price-color, inherit);
    --price-original-color: var(--simple-card-price-original-color, #999);
    --discount-bg: var(--simple-card-discount-bg, #e74c3c);
    --discount-color: var(--simple-card-discount-color, white);
    --rating-color: var(--simple-card-rating-color, inherit);
    --placeholder-bg: var(--simple-card-placeholder-bg, #f5f5f5);
    --placeholder-color: var(--simple-card-placeholder-color, #999);
    --slot-padding: var(--simple-card-slot-padding, 1rem);
    --slot-padding-top: var(--simple-card-slot-padding-top, 0.5rem);
  }

  :host(:hover) { 
    box-shadow: var(--simple-card-hover-shadow, 0 4px 12px rgba(0, 0, 0, 0.1)); 
  }
  
  :host([loading]) { 
    opacity: var(--simple-card-loading-opacity, 0.7); 
  }

  /* Card structure */
  .card { 
    display: flex; 
    flex-direction: column; 
    height: 100%; 
  }
  
  .image { 
    position: relative; 
    width: 100%; 
    overflow: hidden; 
  }
  
  .img { 
    width: 100%; 
    height: 100%; 
    object-fit: cover; 
    transition: opacity 0.3s ease; 
  }

  /* Alternate image hover */
  .image.alternate .img.alternate { 
    position: absolute; 
    top: 0; 
    left: 0; 
    opacity: 0; 
  }
  
  .image.alternate:hover .img.primary { 
    opacity: 0; 
  }
  
  .image.alternate:hover .img.alternate { 
    opacity: 1; 
  }

  /* Content */
  .content { 
    padding: var(--content-padding); 
    flex: 1; 
  }
  
  .brand { 
    font-size: 12px; 
    color: var(--brand-color); 
    text-transform: uppercase; 
    margin-bottom: 0.5rem; 
  }
  
  .title { 
    margin: 0 0 0.5rem; 
    color: var(--title-color);
  }
  
  .link { 
    text-decoration: none; 
    color: var(--link-color); 
    font-weight: 500; 
  }
  
  .link:hover { 
    color: var(--link-hover-color); 
  }
  
  .price { 
    margin: 0.5rem 0; 
    display: flex; 
    gap: 0.5rem; 
  }
  
  .price-current { 
    font-size: 18px; 
    font-weight: 600; 
    color: var(--price-color);
  }
  
  .price-original { 
    color: var(--price-original-color); 
    text-decoration: line-through; 
  }
  
  .discount { 
    background: var(--discount-bg); 
    color: var(--discount-color); 
    padding: 0.25rem 0.5rem; 
    border-radius: 4px; 
    font-size: 12px; 
    width: fit-content; 
  }

  .rating { 
    color: var(--rating-color);
    font-size: 14px;
    margin-top: 0.5rem;
  }

  .image.placeholder {
    background: var(--placeholder-bg);
    min-height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--placeholder-color);
  }

  .image.placeholder::after {
    content: "No image available";
  }

  .slot {
    padding: var(--slot-padding);
    padding-top: var(--slot-padding-top);
  }
`
