import express, { Request, Response } from 'express';
import { authenticateToken, requireAdmin, AuthRequest } from '../middleware/auth';
import { getWebhookInfo, isWebhookConfigured, triggerVercelRebuild } from '../utils/webhookService';

const router = express.Router();

// Get webhook configuration info (admin only)
router.get('/info', authenticateToken, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const info = getWebhookInfo();
    
    res.json({
      message: 'Webhook configuration status',
      ...info,
      lastChecked: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error getting webhook info:', error);
    res.status(500).json({ message: 'Error getting webhook info' });
  }
});

// Test webhook trigger (admin only)
router.post('/test', authenticateToken, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    if (!isWebhookConfigured()) {
      return res.status(400).json({
        message: 'Webhook not configured',
        error: 'VERCEL_DEPLOY_HOOK_URL environment variable is not set'
      });
    }

    // Trigger a test rebuild
    await triggerVercelRebuild({
      source: '/api/webhooks/test',
      action: 'update',
      model: 'Test',
      description: 'Manual webhook test from admin panel'
    });

    res.json({
      message: 'Test webhook triggered successfully',
      note: 'Check Vercel dashboard for deployment status',
      triggeredAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error testing webhook:', error);
    res.status(500).json({ 
      message: 'Error testing webhook',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;