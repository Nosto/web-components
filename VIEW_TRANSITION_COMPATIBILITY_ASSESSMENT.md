# View Transition API Compatibility Assessment

## Overview

This document provides a comprehensive analysis of all custom elements in the Nosto Web Components library for compatibility with the [View Transition API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API). The assessment identifies problematic DOM manipulation patterns that could break smooth visual transitions and proposes solutions.

## Assessment Methodology

Each component was analyzed for the following compatibility issues:

1. **Synchronous DOM mutations** outside of `startViewTransition` wrapper
2. **Direct innerHTML assignments** that bypass transition lifecycle
3. **Style recalculation triggers** during DOM updates
4. **Missing requestAnimationFrame guards** for visual changes
5. **Batch DOM operations** that should be coordinated

## Component Analysis

### 🔴 HIGH PRIORITY: Direct innerHTML Manipulation

#### Campaign (`nosto-campaign`)
**Issues Found:**
- Uses Vue templating engine that calls `root.replaceChildren(...wrapper.children)` synchronously
- Direct innerHTML injection via `api.placements.injectCampaigns()` without transition guards
- Template compilation happens immediately in DOM

**Impact:** High - Campaign content swapping is highly visible to users
**Recommendation:** Wrap content updates in `document.startViewTransition()`

#### DynamicCard (`nosto-dynamic-card`)  
**Issues Found:**
- `element.innerHTML = await getMarkup(element)` - Direct synchronous replacement
- `element.innerHTML = placeholders.get(key) || ""` - Placeholder injection without transitions
- Loading state changes via `toggleAttribute` happen outside transition context

**Impact:** High - Product card swapping is core user experience
**Recommendation:** Implement view transitions for content loading states

#### SectionCampaign (`nosto-section-campaign`)
**Issues Found:**
- `this.innerHTML = markup` - Direct synchronous replacement of section content
- No transition consideration for loading states

**Impact:** Medium-High - Section-level content changes are visually prominent
**Recommendation:** Wrap markup injection in view transitions

#### Control (`nosto-control`)
**Issues Found:**
- `this.replaceChildren(...clone.childNodes)` - Immediate content replacement
- Conditional content swapping based on user segments happens without transitions

**Impact:** Medium - Conditional content may cause jarring layout shifts
**Recommendation:** Add transition wrapper for segment-based content changes

### 🟡 MEDIUM PRIORITY: Shadow DOM Updates

#### SimpleCard (`nosto-simple-card`)
**Issues Found:**
- `setShadowContent(element, cardHTML.html)` - Shadow DOM innerHTML replacement
- Loading state management via `toggleAttribute` without transition coordination

**Impact:** Medium - Card updates within shadow DOM, partially isolated but still visible
**Recommendation:** Coordinate shadow DOM updates with view transitions

#### Popup (`nosto-popup`)
**Issues Found:**
- `setShadowContent()` calls update shadow DOM innerHTML directly
- Dialog show/hide operations: `dialog.showModal()`, `dialog.close()`
- Style changes: `element.style.display = "none"` without transition

**Impact:** Medium - Popup state changes are visually significant
**Recommendation:** Wrap dialog state changes and style updates in transitions

#### VariantSelector (`nosto-variant-selector`)
**Issues Found:**
- `setShadowContent(element, selectorHTML.html)` - Shadow DOM content replacement
- Attribute toggling for active/unavailable states happens synchronously

**Impact:** Medium - Product option selection feedback should be smooth
**Recommendation:** Batch attribute updates within view transitions

#### Image (`nosto-image`)
**Issues Found:**
- `this.shadowRoot!.replaceChildren(img)` - Direct element replacement
- `Object.assign(img.style, style)` - Batch style changes without transition guards

**Impact:** Low-Medium - Image updates are common but usually quick
**Recommendation:** Consider transitions for layout-affecting image changes

### 🟢 LOW PRIORITY: Incremental Updates

#### Product (`nosto-product`)
**Issues Found:**
- `element.style.setProperty()` calls for CSS custom properties
- `element.querySelectorAll().forEach(e => (e.innerHTML = price))` - Batch content updates
- All changes happen synchronously when SKU data updates

**Impact:** Low - Price/content updates are typically small text changes
**Recommendation:** Batch updates and consider transitions for significant changes

#### SkuOptions (`nosto-sku-options`)
**Issues Found:**
- Multiple `toggleAttribute()` calls for disabled/unavailable/selected states
- Event-driven attribute updates happen immediately

**Impact:** Low - Attribute changes are usually subtle visual feedback
**Recommendation:** Batch attribute updates, especially when multiple options change simultaneously

## Utility Functions Analysis

### shadowContentFactory
**Issues Found:**
- Direct `element.shadowRoot!.innerHTML = content` assignment
- No consideration for transition lifecycle

**Recommendation:** Add optional view transition wrapper parameter

### Vue Templating Engine
**Issues Found:**
- `root.replaceChildren(...wrapper.children)` performs immediate DOM replacement
- Template compilation happens synchronously

**Recommendation:** Add view transition integration to template rendering

## Compatibility Matrix

| Component | Severity | DOM Mutation Type | Transition Candidate | Implementation Effort |
|-----------|----------|------------------|---------------------|---------------------|
| Campaign | 🔴 HIGH | innerHTML injection | ✅ Yes | Medium |
| DynamicCard | 🔴 HIGH | innerHTML replacement | ✅ Yes | Medium |
| SectionCampaign | 🔴 HIGH | innerHTML replacement | ✅ Yes | Low |
| Control | 🔴 HIGH | replaceChildren | ✅ Yes | Low |
| SimpleCard | 🟡 MEDIUM | Shadow DOM innerHTML | ⚠️ Partial | Medium |
| Popup | 🟡 MEDIUM | Shadow + style changes | ✅ Yes | Medium |
| VariantSelector | 🟡 MEDIUM | Shadow DOM + attributes | ⚠️ Partial | Low |
| Image | 🟡 MEDIUM | replaceChildren + styles | ⚠️ Partial | Low |
| Product | 🟢 LOW | Style properties + innerHTML | ⚠️ Selective | Low |
| SkuOptions | 🟢 LOW | Attribute toggling | ❌ No | None |

## Recommended Implementation Approach

### Phase 1: High-Impact Components (Weeks 1-2)
1. **Campaign**: Wrap template compilation and injection in `startViewTransition`
2. **DynamicCard**: Add transition support for content loading and placeholder states  
3. **SectionCampaign**: Wrap markup injection in view transitions
4. **Control**: Add transitions for conditional content replacement

### Phase 2: Shadow DOM Components (Weeks 3-4)  
1. **SimpleCard**: Coordinate shadow DOM updates with view transitions
2. **Popup**: Implement transitions for dialog state changes and visibility
3. **VariantSelector**: Batch attribute updates within transitions
4. **Image**: Add transition support for layout-affecting changes

### Phase 3: Incremental Enhancements (Week 5)
1. **Product**: Selective transitions for significant content changes
2. **Utility Functions**: Update shadowContentFactory and Vue engine
3. **Performance Optimization**: Add transition guards and fallbacks

### Implementation Pattern

```typescript
// Recommended pattern for view transition integration
function updateWithTransition(updateFn: () => void, fallbackFn?: () => void) {
  if ('startViewTransition' in document) {
    document.startViewTransition(() => {
      updateFn()
    })
  } else {
    // Fallback for browsers without View Transition API support
    updateFn()
    if (fallbackFn) {
      fallbackFn()
    }
  }
}

// Usage example in component
updateWithTransition(() => {
  this.innerHTML = newContent
})
```

### Browser Compatibility Considerations

- View Transition API is supported in Chrome 111+, Edge 111+
- Firefox and Safari support is in development
- Graceful degradation required for unsupported browsers
- Consider polyfill or progressive enhancement approach

## Performance Implications

1. **Memory Usage**: View transitions create snapshots, monitor memory impact
2. **Animation Performance**: Ensure 60fps during transitions
3. **Transition Duration**: Balance smoothness with perceived performance  
4. **Selective Application**: Not all DOM changes need transitions

## Testing Strategy

1. **Visual Regression Tests**: Capture before/after transition states
2. **Performance Monitoring**: Measure transition smoothness and memory usage
3. **Browser Compatibility**: Test graceful degradation in unsupported browsers
4. **User Experience**: Validate transition appropriateness with design team

## Conclusion

The Nosto Web Components library has several high-impact opportunities for View Transition API integration, particularly around content loading and dynamic card updates. The assessment identifies clear implementation priorities and provides a roadmap for enhancing user experience through smooth visual transitions.

Key recommendations:
- **Immediate**: Focus on Campaign, DynamicCard, SectionCampaign, and Control components
- **Progressive**: Add shadow DOM transition support  
- **Selective**: Apply transitions judiciously based on visual impact
- **Compatibility**: Ensure graceful degradation for all browsers

This compatibility assessment provides the foundation for implementing View Transition API support across the component library while maintaining performance and browser compatibility.