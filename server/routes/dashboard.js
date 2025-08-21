import express from 'express';
import pool from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get dashboard statistics
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    // Get total devices count
    const [totalDevices] = await pool.execute(
      'SELECT COUNT(*) as total FROM devices'
    );

    // Get devices by status
    const [devicesByStatus] = await pool.execute(`
      SELECT 
        operational_status,
        COUNT(*) as count
      FROM devices 
      GROUP BY operational_status
    `);

    // Get devices by type
    const [devicesByType] = await pool.execute(`
      SELECT 
        device_type,
        COUNT(*) as count
      FROM devices 
      GROUP BY device_type
    `);

    // Get recent devices
    const [recentDevices] = await pool.execute(`
      SELECT 
        d.*,
        u.first_name, u.last_name,
        l.division, l.department
      FROM devices d
      LEFT JOIN users u ON d.user_id = u.user_id
      LEFT JOIN locations l ON d.locations_id = l.locations_id
      ORDER BY d.created_at DESC
      LIMIT 5
    `);

    // Calculate statistics
    const stats = {
      total: totalDevices[0].total,
      byStatus: {
        active: 0,
        in_repair: 0,
        decommissioned: 0
      },
      byType: {},
      recent: recentDevices
    };

    // Process status counts
    devicesByStatus.forEach(item => {
      if (item.operational_status === 'active') {
        stats.byStatus.active = item.count;
      } else if (item.operational_status === 'in_repair') {
        stats.byStatus.in_repair = item.count;
      } else if (item.operational_status === 'decommissioned') {
        stats.byStatus.decommissioned = item.count;
      }
    });

    // Process type counts
    devicesByType.forEach(item => {
      stats.byType[item.device_type] = item.count;
    });

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get chart data
router.get('/charts', authenticateToken, async (req, res) => {
  try {
    // Devices by type chart
    const [devicesByType] = await pool.execute(`
      SELECT 
        device_type,
        COUNT(*) as count
      FROM devices 
      GROUP BY device_type
    `);

    // Devices by location chart
    const [devicesByLocation] = await pool.execute(`
      SELECT 
        l.division,
        l.department,
        COUNT(d.device_id) as count
      FROM locations l
      LEFT JOIN devices d ON l.locations_id = d.locations_id
      GROUP BY l.locations_id, l.division, l.department
      HAVING count > 0
    `);

    // Monthly devices added (last 12 months)
    const [monthlyDevices] = await pool.execute(`
      SELECT 
        DATE_FORMAT(created_at, '%Y-%m') as month,
        COUNT(*) as count
      FROM devices 
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
      GROUP BY DATE_FORMAT(created_at, '%Y-%m')
      ORDER BY month
    `);

    res.json({
      success: true,
      data: {
        byType: devicesByType,
        byLocation: devicesByLocation,
        monthly: monthlyDevices
      }
    });
  } catch (error) {
    console.error('Get chart data error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

export default router;
