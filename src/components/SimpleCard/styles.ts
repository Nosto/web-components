export function getCardStyles(): string {
  return `
    :host {
      display: var(--simple-card-display, block);
      border: 1px solid var(--simple-card-border, #e1e1e1);
      border-radius: var(--simple-card-border-radius, 8px);
      overflow: hidden;
      background: var(--simple-card-bg, white);
      transition: box-shadow 0.2s ease;
    }

    :host(:hover) { 
      box-shadow: var(--simple-card-hover-shadow, 0 4px 12px rgba(0, 0, 0, 0.1)); 
    }
    
    :host([loading]) { 
      opacity: var(--simple-card-loading-opacity, 0.7); 
    }

    /* Card structure */
    .simple-card { 
      display: flex; 
      flex-direction: column; 
      height: 100%; 
    }
    
    .simple-card__image { 
      position: relative; 
      width: 100%; 
      overflow: hidden; 
    }
    
    .simple-card__img { 
      width: 100%; 
      height: 100%; 
      object-fit: cover; 
      transition: opacity 0.3s ease; 
    }

    /* Alternate image hover */
    .simple-card__image--alternate .simple-card__img--alternate { 
      position: absolute; 
      top: 0; 
      left: 0; 
      opacity: 0; 
    }
    
    .simple-card__image--alternate:hover .simple-card__img--primary { 
      opacity: 0; 
    }
    
    .simple-card__image--alternate:hover .simple-card__img--alternate { 
      opacity: 1; 
    }

    /* Content */
    .simple-card__content { 
      padding: var(--simple-card-content-padding, 1rem); 
      flex: 1; 
    }
    
    .simple-card__brand { 
      font-size: 12px; 
      color: var(--simple-card-brand-color, #666); 
      text-transform: uppercase; 
      margin-bottom: 0.5rem; 
    }
    
    .simple-card__title { 
      margin: 0 0 0.5rem; 
      color: var(--simple-card-title-color, inherit);
    }
    
    .simple-card__link { 
      text-decoration: none; 
      color: var(--simple-card-link-color, #333); 
      font-weight: 500; 
    }
    
    .simple-card__link:hover { 
      color: var(--simple-card-link-hover-color, #0066cc); 
    }
    
    .simple-card__price { 
      margin: 0.5rem 0; 
      display: flex; 
      gap: 0.5rem; 
    }
    
    .simple-card__price-current { 
      font-size: 18px; 
      font-weight: 600; 
      color: var(--simple-card-price-color, inherit);
    }
    
    .simple-card__price-original { 
      color: var(--simple-card-price-original-color, #999); 
      text-decoration: line-through; 
    }
    
    .simple-card__discount { 
      background: var(--simple-card-discount-bg, #e74c3c); 
      color: var(--simple-card-discount-color, white); 
      padding: 0.25rem 0.5rem; 
      border-radius: 4px; 
      font-size: 12px; 
      width: fit-content; 
    }

    .simple-card__rating { 
      color: var(--simple-card-rating-color, inherit);
      font-size: 14px;
      margin-top: 0.5rem;
    }

    .simple-card__image--placeholder {
      background: var(--simple-card-placeholder-bg, #f5f5f5);
      min-height: 200px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--simple-card-placeholder-color, #999);
    }

    .simple-card__image--placeholder::after {
      content: "No image available";
    }
  `
}
