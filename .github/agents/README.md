# Shopify Custom Copilot Agent

This directory contains the Shopify specialist custom agent for GitHub Copilot.

## Agent: shopify-specialist

A specialized agent focused on Shopify development tasks within the Nosto Web Components library.

### Purpose

The `shopify-specialist` agent is configured to handle all Shopify-specific development work, including:

- Working with Shopify APIs (Admin GraphQL, Storefront, Partner, Customer Account)
- Developing and maintaining Shopify-only web components (SectionCampaign, DynamicCard, SimpleCard, VariantSelector)
- Handling Shopify types and data structures
- Optimizing Shopify CDN assets and URLs
- Following Shopify platform best practices

### MCP Server Integration

This agent leverages the **Shopify Dev MCP server** to provide real-time access to:

- **introspect_admin_schema**: Explore Shopify Admin GraphQL API schema
- **search_dev_docs**: Search Shopify developer documentation
- **fetch_docs_by_path**: Retrieve specific documentation pages
- **get_started**: Access getting started guides for Shopify APIs

### Usage

To use this agent in GitHub Copilot:

```
@shopify-specialist [your Shopify-related request]
```

Examples:
- `@shopify-specialist Update the VariantSelector component to support new variant option types`
- `@shopify-specialist Add tests for SimpleCard component with Shopify product data`
- `@shopify-specialist Check the latest Admin API schema for product metafields`

### Configuration

The agent configuration is stored in `shopify-specialist.agent.md` and includes:

- **Tools**: read, search, edit, bash, plus all Shopify Dev MCP server tools
- **Prompts**: Instructions emphasizing Shopify expertise and MCP tool usage
- **Description**: Clear scope of Shopify development responsibilities

### Requirements

To use this agent with the Shopify Dev MCP server:

1. Node.js 18+ installed
2. MCP-compatible AI tool (GitHub Copilot with MCP support)
3. The Shopify Dev MCP server configured in your environment

Note: For documentation-only tasks, no Shopify store credentials are required.

### Related Documentation

- [Shopify Dev MCP Server](https://shopify.dev/docs/apps/build/devmcp)
- [GitHub Copilot Custom Agents](https://docs.github.com/en/copilot/reference/custom-agents-configuration)
- [Model Context Protocol](https://modelcontextprotocol.io/)

## Maintenance

When updating Shopify-related components or adding new Shopify features, ensure this agent configuration stays current with:

- New Shopify components added to the repository
- Updated file paths for Shopify-related code
- Any new Shopify APIs or features being utilized
