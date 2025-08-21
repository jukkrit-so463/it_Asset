import express from 'express';
import pool from '../config/database.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all devices with user and location info
router.get('/', authenticateToken, async (req, res) => {
  try {
    const [devices] = await pool.execute(`
      SELECT 
        d.*,
        u.first_name, u.last_name, u.username,
        l.division, l.department,
        ip.ip_address
      FROM devices d
      LEFT JOIN users u ON d.user_id = u.user_id
      LEFT JOIN locations l ON d.locations_id = l.locations_id
      LEFT JOIN ip_addresses ip ON d.device_id = ip.device_id
      ORDER BY d.created_at DESC
    `);

    res.json({
      success: true,
      data: devices
    });
  } catch (error) {
    console.error('Get devices error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get device by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    const [devices] = await pool.execute(`
      SELECT 
        d.*,
        u.first_name, u.last_name, u.username,
        l.division, l.department,
        ip.ip_address
      FROM devices d
      LEFT JOIN users u ON d.user_id = u.user_id
      LEFT JOIN locations l ON d.locations_id = l.locations_id
      LEFT JOIN ip_addresses ip ON d.device_id = ip.device_id
      WHERE d.device_id = ?
    `, [id]);

    if (devices.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Device not found'
      });
    }

    res.json({
      success: true,
      data: devices[0]
    });
  } catch (error) {
    console.error('Get device error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Create new device
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { 
      user_id, 
      locations_id, 
      device_type, 
      service_tag, 
      date_received, 
      operational_status = 'active' 
    } = req.body;

    if (!device_type || !service_tag) {
      return res.status(400).json({
        success: false,
        message: 'Device type and service tag are required'
      });
    }

    // Check if service tag already exists
    const [existing] = await pool.execute(
      'SELECT device_id FROM devices WHERE service_tag = ?',
      [service_tag]
    );

    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Service tag already exists'
      });
    }

    const [result] = await pool.execute(`
      INSERT INTO devices (user_id, locations_id, device_type, service_tag, date_received, operational_status)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [user_id, locations_id, device_type, service_tag, date_received, operational_status]);

    res.status(201).json({
      success: true,
      message: 'Device created successfully',
      data: { device_id: result.insertId }
    });
  } catch (error) {
    console.error('Create device error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Update device
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      user_id, 
      locations_id, 
      device_type, 
      service_tag, 
      date_received, 
      operational_status 
    } = req.body;

    // Check if device exists
    const [existing] = await pool.execute(
      'SELECT device_id FROM devices WHERE device_id = ?',
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Device not found'
      });
    }

    // Check if service tag already exists (if changed)
    if (service_tag) {
      const [duplicate] = await pool.execute(
        'SELECT device_id FROM devices WHERE service_tag = ? AND device_id != ?',
        [service_tag, id]
      );

      if (duplicate.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Service tag already exists'
        });
      }
    }

    await pool.execute(`
      UPDATE devices 
      SET user_id = ?, locations_id = ?, device_type = ?, service_tag = ?, 
          date_received = ?, operational_status = ?, updated_at = CURRENT_TIMESTAMP
      WHERE device_id = ?
    `, [user_id, locations_id, device_type, service_tag, date_received, operational_status, id]);

    res.json({
      success: true,
      message: 'Device updated successfully'
    });
  } catch (error) {
    console.error('Update device error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Delete device
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.execute(
      'DELETE FROM devices WHERE device_id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Device not found'
      });
    }

    res.json({
      success: true,
      message: 'Device deleted successfully'
    });
  } catch (error) {
    console.error('Delete device error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

export default router;
