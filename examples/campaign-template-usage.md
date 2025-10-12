# Campaign Template Usage Examples

This document demonstrates how to use the new Campaign liquid template system for rendering multiple Campaign scenarios.

## Basic Usage

### 1. Simple Mode with Grid Layout

Use SimpleCard components with optional VariantSelector for basic product recommendations:

```javascript
import { createCampaignSettings } from '@nosto/web-components'

const settings = createCampaignSettings(campaignElement, jsonData, 'simple', 'grid')
```

### 2. Native Mode with Carousel Layout  

Use DynamicCard components for Shopify section rendering in a carousel:

```javascript
const settings = createCampaignSettings(campaignElement, jsonData, 'native', 'carousel')
```

### 3. Section Mode (No Children)

Use SectionCampaign for direct API integration without child components:

```javascript
const settings = createCampaignSettings(campaignElement, jsonData, 'section', 'grid')
```

## Available Types

- **CampaignLayout**: `"grid" | "carousel"`
- **CampaignMode**: `"simple" | "native" | "section"`
- **CampaignSettings**: Complete interface with all component attributes

The template automatically handles conditional rendering, responsive layouts, and proper component attribute binding based on the selected mode and layout.