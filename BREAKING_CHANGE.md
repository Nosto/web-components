# Breaking Change: SectionCampaign Handle Separator

## Change Summary

**Type**: `feat!` - Breaking Change  
**Component**: `SectionCampaign`  
**Version**: Next major release

## Description

Product handles in `SectionCampaign` are now joined with ` OR ` separator instead of `:` for Shopify search queries.

### Before
```
?q=product-a:product-b:product-c
```

### After
```
?q=product-a OR product-b OR product-c
```

## Impact

This change affects merchants using custom Shopify Liquid templates with the `nosto-section-campaign` component.

## Migration Guide

Update your Shopify Liquid templates to split `search.terms` using ` OR ` instead of `:`:

### Before
```liquid
{% assign handles = search.terms | split: ':' %}
```

### After
```liquid
{% assign handles = search.terms | split: ' OR ' %}
```

## Rationale

The ` OR ` separator provides a valid Shopify search query with the boolean OR operator, enabling proper product search functionality.

## Related Files

- `src/components/SectionCampaign/SectionCampaign.ts` (Line 49)
- `src/components/SectionCampaign/examples.md`
- `test/components/SectionCampaign/SectionCampaign.spec.tsx`
