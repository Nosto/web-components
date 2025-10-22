# Nosto Web Components Presentation

This directory contains a Reveal.js presentation showcasing all components in the Nosto Web Components library with built-in auto narration functionality.

## Quick Start

Run the presentation locally:

```bash
npm run present
```

Then open your browser to [http://localhost:3001](http://localhost:3001)

## Features

### 🎬 Auto Narration
- **Intelligent timing**: Automatically calculates slide duration based on content length
- **Smart controls**: Easy-to-use play/pause/stop controls
- **Keyboard shortcuts**: 
  - `Ctrl + Space`: Start/pause auto narration
  - `Esc`: Stop auto narration

### 📊 Component Coverage
The presentation covers all 10 web components:
- `<nosto-campaign>` - Campaign rendering with template support
- `<nosto-product>` - Product management with SKU selection  
- `<nosto-image>` - Responsive images for Shopify/BigCommerce
- `<nosto-popup>` - Modal overlays and popups
- `<nosto-control>` - Component control mechanisms
- `<nosto-dynamic-card>` - Dynamic product cards
- `<nosto-section-campaign>` - Section-level campaigns
- `<nosto-simple-card>` - Lightweight product cards
- `<nosto-sku-options>` - SKU option management
- `<nosto-variant-selector>` - Product variant selection

### 🎮 Navigation Controls
- **Mouse/Touch**: Click navigation arrows or swipe
- **Keyboard**: Arrow keys, space bar for navigation
- **Speaker Notes**: Press `s` to view speaker notes
- **Help**: Press `?` to view all keyboard shortcuts

## File Structure

```
docs/
├── README.md           # This documentation
├── presentation.md     # Main presentation content (Markdown)
├── presentation.html   # Reveal.js HTML wrapper
└── server.js          # Local development server
```

## Customization

### Editing Content
Edit `docs/presentation.md` to modify the presentation content. The file uses Reveal.js markdown format with `---` as slide separators.

### Styling
Modify the CSS in `docs/presentation.html` to customize the appearance:
- Theme colors (currently using Nosto orange/blue)
- Layout and typography
- Component highlighting
- Control styling

### Auto Narration Timing
The auto narration calculates timing based on:
- **Base time**: 3 seconds minimum per slide
- **Reading time**: 150 words per minute + 2 second buffer
- **Custom timing**: Modify `calculateSlideTiming()` in `presentation.html`

## Advanced Usage

### Custom Server Port
```bash
PORT=8080 npm run present
```

### Integration with Storybook
The presentation can reference Storybook examples and static assets. Ensure Storybook is built:

```bash
npm run build-storybook
```

### Development Mode
For active development of the presentation:

```bash
# Terminal 1: Start presentation server
npm run present

# Terminal 2: Watch for changes (manual refresh needed)
# Edit docs/presentation.md or docs/presentation.html
```

## Browser Support

- **Modern browsers** with ES2020+ support
- **Local development**: Chrome, Firefox, Safari, Edge
- **Mobile support**: Touch navigation enabled

## Troubleshooting

### Server Won't Start
- Ensure port 3001 is available
- Check Node.js version (requires 18+)
- Verify dependencies: `npm install`

### Presentation Not Loading
- Check browser console for errors
- Ensure all files exist in `docs/` directory
- Verify `node_modules/reveal.js` is installed

### Auto Narration Issues
- Refresh the page to reset narration state
- Check browser console for JavaScript errors
- Ensure slides are properly loaded before starting

## Contributing

To update the presentation:

1. Edit content in `docs/presentation.md`
2. Test locally with `npm run present`
3. Update documentation if needed
4. Follow conventional commits: `docs(presentation): description`

## Resources

- [Reveal.js Documentation](https://revealjs.com/)
- [Markdown Guide](https://revealjs.com/markdown/)
- [Nosto Developer Docs](https://help.nosto.com/developers)
- [Component Storybook](https://nosto.github.io/web-components)