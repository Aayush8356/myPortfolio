# Webhook System for Automatic Vercel Rebuilds

This document describes the webhook system implemented to automatically trigger Vercel deployments when data is modified through the admin panel.

## Overview

The webhook system ensures that any changes made through the admin panel automatically trigger a new Vercel deployment, which:
1. Runs the static data generation script
2. Fetches the latest data from the database 
3. Builds and deploys the updated static site

## Configuration

### Environment Variable

Add the following environment variable to your backend deployment (Render):

```bash
VERCEL_DEPLOY_HOOK_URL=https://api.vercel.com/v1/integrations/deploy/YOUR_DEPLOY_HOOK_ID/YOUR_PROJECT_ID
```

**To get your Deploy Hook URL:**
1. Go to your Vercel project settings
2. Navigate to "Git" → "Deploy Hooks"
3. Create a new deploy hook
4. Copy the provided URL

### Testing Configuration

You can verify the webhook configuration using these admin-only endpoints:

```bash
# Check webhook configuration status
GET /api/webhooks/info

# Test webhook trigger manually
POST /api/webhooks/test
```

## Implementation Details

### Webhook Service (`src/utils/webhookService.ts`)

The core webhook functionality is implemented as a utility service with the following features:

- **Fire-and-forget**: Webhook calls are non-blocking and won't delay API responses
- **Error handling**: Failed webhook calls are logged but don't crash the server
- **Payload metadata**: Each webhook includes context about what changed
- **Convenience functions**: Pre-configured triggers for different data models

### Webhook Triggers

The following admin operations automatically trigger webhooks:

#### Project Operations
- **Create Project** (`POST /api/projects`)
- **Update Project** (`PUT /api/projects/:id`)
- **Delete Project** (`DELETE /api/projects/:id`)
- **Upload Project Image** (`POST /api/projects/upload-image`)

#### Resume Operations
- **Upload Resume** (`POST /api/resume/upload`)
- **Delete Resume** (`DELETE /api/resume`)
- **Sync Resume URL** (`POST /api/resume/sync-url`)

#### Content Operations
- **Update Contact Details** (`PUT /api/contact-details`)
- **Update About Section** (`PUT /api/about`)
- **Update Hero Section** (`PUT /api/hero`)
- **Update Fun Centre** (`PUT /api/fun-centre`)

#### Contact Management
- **Delete Contact Message** (`DELETE /api/contact/:id`)

### Webhook Payload Structure

Each webhook request includes metadata about the change:

```json
{
  "timestamp": "2025-08-19T15:07:00.000Z",
  "trigger": {
    "source": "/api/projects",
    "action": "create",
    "model": "Project",
    "id": "507f1f77bcf86cd799439011",
    "description": "New project added"
  },
  "environment": "production"
}
```

## Usage Examples

### Using the Convenience Functions

```typescript
import { WebhookTriggers } from '../utils/webhookService';

// After creating a project
WebhookTriggers.projectCreated(project._id.toString());

// After updating contact details
WebhookTriggers.contactDetailsUpdated();

// After uploading a resume
WebhookTriggers.resumeUploaded();
```

### Manual Webhook Trigger

```typescript
import { triggerVercelRebuild } from '../utils/webhookService';

await triggerVercelRebuild({
  source: '/api/custom-route',
  action: 'update',
  model: 'CustomModel',
  id: 'some-id',
  description: 'Custom data change'
});
```

## Benefits

1. **Instant Updates**: Changes appear on the live site within minutes of admin updates
2. **Reliability**: Static generation eliminates runtime dependencies and API failures
3. **Performance**: Static files load instantly with no database queries
4. **SEO**: All content is available at build-time for search engine crawlers
5. **Scalability**: Static files can be served globally via CDN

## Monitoring

### Logs

Webhook activities are logged with the following format:

```
🔄 Triggering Vercel rebuild: create Project from /api/projects
✅ Vercel rebuild triggered successfully (234ms)
❌ Failed to trigger Vercel rebuild (1245ms): HTTP 404: Not Found
```

### Vercel Dashboard

Monitor deployments in your Vercel dashboard:
1. Go to your project in Vercel
2. Check the "Deployments" tab
3. Look for deployments triggered by "Deploy Hook"

### Admin Panel Testing

Use the webhook test endpoints to verify configuration:

```bash
# Check if webhooks are properly configured
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     https://your-backend.com/api/webhooks/info

# Trigger a test deployment
curl -X POST \
     -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     https://your-backend.com/api/webhooks/test
```

## Error Handling

The webhook system is designed to be resilient:

- **Non-blocking**: Failed webhooks don't affect admin panel functionality
- **Graceful degradation**: If webhook URL is not configured, operations continue normally
- **Comprehensive logging**: All webhook attempts are logged for debugging
- **Timeout protection**: Webhook requests timeout after reasonable duration

## Security

- **Admin-only**: All webhook-triggering operations require admin authentication
- **Environment isolation**: Webhook URLs are stored as environment variables
- **Secure endpoints**: Debug endpoints require admin authentication

## Troubleshooting

### Common Issues

1. **Webhooks not firing**: Check `VERCEL_DEPLOY_HOOK_URL` environment variable
2. **Deployments not starting**: Verify the deploy hook URL is correct
3. **Build failures**: Check static data generation script logs

### Debug Steps

1. Check webhook configuration: `GET /api/webhooks/info`
2. Test webhook manually: `POST /api/webhooks/test`
3. Monitor Vercel deployment logs
4. Check backend logs for webhook error messages

### Logs to Monitor

```bash
# Success logs
✅ Vercel rebuild triggered successfully (XXXms)

# Configuration warnings  
⚠️ VERCEL_DEPLOY_HOOK_URL not configured - skipping rebuild trigger

# Error logs
❌ Failed to trigger Vercel rebuild (XXXms): [error message]
```

This webhook system ensures your portfolio stays up-to-date automatically, providing a seamless experience for both admin management and visitor browsing.