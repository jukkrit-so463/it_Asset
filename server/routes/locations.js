import express from 'express';
import pool from '../config/database.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all locations
router.get('/', authenticateToken, async (req, res) => {
  try {
    const [locations] = await pool.execute(`
      SELECT * FROM locations 
      WHERE status = 'active'
      ORDER BY division, department
    `);

    res.json({
      success: true,
      data: locations
    });
  } catch (error) {
    console.error('Get locations error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Create new location
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { division, department } = req.body;

    if (!division || !department) {
      return res.status(400).json({
        success: false,
        message: 'Division and department are required'
      });
    }

    const [result] = await pool.execute(`
      INSERT INTO locations (division, department)
      VALUES (?, ?)
    `, [division, department]);

    res.status(201).json({
      success: true,
      message: 'Location created successfully',
      data: { locations_id: result.insertId }
    });
  } catch (error) {
    console.error('Create location error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

export default router;
