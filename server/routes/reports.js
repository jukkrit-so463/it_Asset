import express from 'express';
import pool from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get asset summary report
router.get('/assets-summary', authenticateToken, async (req, res) => {
  try {
    const [summary] = await pool.execute(`
      SELECT 
        COUNT(*) as total_devices,
        COUNT(CASE WHEN operational_status = 'active' THEN 1 END) as active_devices,
        COUNT(CASE WHEN operational_status = 'in_repair' THEN 1 END) as repair_devices
      FROM devices
    `);

    const [byType] = await pool.execute(`
      SELECT device_type, COUNT(*) as count
      FROM devices 
      GROUP BY device_type
    `);

    res.json({
      success: true,
      data: { summary: summary[0], byType }
    });
  } catch (error) {
    console.error('Get assets summary error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

export default router;
