/**
 * Webhook Service for Vercel Deployment Triggers
 * Handles automatic rebuild triggers when data changes
 */

interface WebhookTriggerOptions {
  source: string; // Route/operation that triggered the webhook
  action: 'create' | 'update' | 'delete';
  model: string; // Data model affected (Project, ContactDetails, etc.)
  id?: string; // ID of the affected record
  description?: string; // Optional description of the change
}

interface WebhookResponse {
  success: boolean;
  message?: string;
  error?: string;
}

/**
 * Triggers a Vercel deployment via webhook
 * This is a fire-and-forget operation that won't block the main API response
 */
export async function triggerVercelRebuild(options: WebhookTriggerOptions): Promise<void> {
  // Don't block the main operation - run asynchronously
  setImmediate(async () => {
    try {
      await executeWebhookTrigger(options);
    } catch (error) {
      // Log the error but don't propagate it
      console.error('🚨 Webhook trigger failed (non-blocking):', error);
    }
  });
}

/**
 * Actually executes the webhook call
 */
async function executeWebhookTrigger(options: WebhookTriggerOptions): Promise<WebhookResponse> {
  const deployHookUrl = process.env.VERCEL_DEPLOY_HOOK_URL;
  
  if (!deployHookUrl) {
    console.warn('⚠️ VERCEL_DEPLOY_HOOK_URL not configured - skipping rebuild trigger');
    return {
      success: false,
      error: 'Deploy hook URL not configured'
    };
  }

  const startTime = Date.now();
  
  try {
    console.log(`🔄 Triggering Vercel rebuild: ${options.action} ${options.model} from ${options.source}`);
    
    // Create webhook payload with metadata
    const payload = {
      timestamp: new Date().toISOString(),
      trigger: {
        source: options.source,
        action: options.action,
        model: options.model,
        id: options.id,
        description: options.description || `${options.action} ${options.model}`
      },
      environment: process.env.NODE_ENV || 'development'
    };

    // Make the POST request to Vercel Deploy Hook
    const response = await fetch(deployHookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Portfolio-Backend-Webhook/1.0'
      },
      body: JSON.stringify(payload)
    });

    const duration = Date.now() - startTime;

    if (response.ok) {
      const responseText = await response.text();
      console.log(`✅ Vercel rebuild triggered successfully (${duration}ms)`);
      console.log(`📊 Response: ${response.status} ${response.statusText}`);
      
      return {
        success: true,
        message: `Rebuild triggered in ${duration}ms`
      };
    } else {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${response.statusText} - ${errorText}`);
    }

  } catch (error) {
    const duration = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    console.error(`❌ Failed to trigger Vercel rebuild (${duration}ms):`, errorMessage);
    
    return {
      success: false,
      error: errorMessage
    };
  }
}

/**
 * Convenience functions for specific data models
 */
export const WebhookTriggers = {
  // Project-related triggers
  projectCreated: (id: string) => triggerVercelRebuild({
    source: '/api/projects',
    action: 'create',
    model: 'Project',
    id,
    description: 'New project added'
  }),

  projectUpdated: (id: string) => triggerVercelRebuild({
    source: '/api/projects',
    action: 'update',
    model: 'Project',
    id,
    description: 'Project updated'
  }),

  projectDeleted: (id: string) => triggerVercelRebuild({
    source: '/api/projects',
    action: 'delete',
    model: 'Project',
    id,
    description: 'Project deleted'
  }),

  projectImageUploaded: () => triggerVercelRebuild({
    source: '/api/projects/upload-image',
    action: 'create',
    model: 'ProjectImage',
    description: 'Project image uploaded'
  }),

  // Contact Details triggers
  contactDetailsUpdated: () => triggerVercelRebuild({
    source: '/api/contact-details',
    action: 'update',
    model: 'ContactDetails',
    description: 'Contact information updated'
  }),

  // Resume triggers
  resumeUploaded: () => triggerVercelRebuild({
    source: '/api/resume/upload',
    action: 'create',
    model: 'Resume',
    description: 'Resume uploaded'
  }),

  resumeDeleted: () => triggerVercelRebuild({
    source: '/api/resume',
    action: 'delete',
    model: 'Resume',
    description: 'Resume deleted'
  }),

  resumeUrlSynced: () => triggerVercelRebuild({
    source: '/api/resume/sync-url',
    action: 'update',
    model: 'Resume',
    description: 'Resume URL synchronized'
  }),

  // About section triggers
  aboutUpdated: () => triggerVercelRebuild({
    source: '/api/about',
    action: 'update',
    model: 'About',
    description: 'About section updated'
  }),

  // Hero section triggers
  heroUpdated: () => triggerVercelRebuild({
    source: '/api/hero',
    action: 'update',
    model: 'Hero',
    description: 'Hero section updated'
  }),

  // Fun Centre triggers
  funCentreUpdated: () => triggerVercelRebuild({
    source: '/api/fun-centre',
    action: 'update',
    model: 'FunCentre',
    description: 'Fun Centre settings updated'
  }),

  // Contact form triggers (less critical, but might affect admin data)
  contactMessageDeleted: (id: string) => triggerVercelRebuild({
    source: '/api/contact',
    action: 'delete',
    model: 'Contact',
    id,
    description: 'Contact message deleted'
  })
};

/**
 * Utility to check if webhooks are configured
 */
export function isWebhookConfigured(): boolean {
  return !!process.env.VERCEL_DEPLOY_HOOK_URL;
}

/**
 * Get webhook configuration info (for debugging)
 */
export function getWebhookInfo() {
  return {
    configured: isWebhookConfigured(),
    environment: process.env.NODE_ENV || 'development',
    hasUrl: !!process.env.VERCEL_DEPLOY_HOOK_URL,
    urlLength: process.env.VERCEL_DEPLOY_HOOK_URL?.length || 0
  };
}