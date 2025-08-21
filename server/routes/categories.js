import express from 'express';
import pool from '../config/database.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Ensure table exists
async function ensureTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS device_categories (
      category_id INT NOT NULL AUTO_INCREMENT,
      code VARCHAR(50) NOT NULL UNIQUE,
      name VARCHAR(255) NOT NULL,
      description TEXT NULL,
      status VARCHAR(50) NOT NULL DEFAULT 'active',
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (category_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);
}

router.use(async (req, res, next) => {
  try {
    await ensureTable();
    next();
  } catch (err) {
    console.error('Error ensuring device_categories table:', err);
    res.status(500).json({ success: false, message: 'Database initialization error' });
  }
});

// GET all categories
router.get('/', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM device_categories ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching categories:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch categories' });
  }
});

// CREATE category
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { code, name, description, status } = req.body;
    if (!code || !name) {
      return res.status(400).json({ success: false, message: 'code and name are required' });
    }

    const [result] = await pool.query(
      'INSERT INTO device_categories (code, name, description, status) VALUES (?, ?, ?, ?)',
      [code, name, description || null, status || 'active']
    );

    const [rows] = await pool.query('SELECT * FROM device_categories WHERE category_id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ success: false, message: 'Duplicate category code' });
    }
    console.error('Error creating category:', err);
    res.status(500).json({ success: false, message: 'Failed to create category' });
  }
});

// UPDATE category
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { code, name, description, status } = req.body;
    const [existing] = await pool.query('SELECT * FROM device_categories WHERE category_id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    if (!name) {
      return res.status(400).json({ success: false, message: 'name is required' });
    }

    // If code provided, ensure uniqueness (other than this id)
    if (code) {
      const [dup] = await pool.query('SELECT category_id FROM device_categories WHERE code = ? AND category_id <> ?', [code, id]);
      if (dup.length > 0) {
        return res.status(409).json({ success: false, message: 'Duplicate category code' });
      }
    }

    await pool.query(
      'UPDATE device_categories SET code = COALESCE(?, code), name = ?, description = ?, status = COALESCE(?, status) WHERE category_id = ?',
      [code || null, name, description || null, status || null, id]
    );

    const [rows] = await pool.query('SELECT * FROM device_categories WHERE category_id = ?', [id]);
    res.json(rows[0]);
  } catch (err) {
    console.error('Error updating category:', err);
    res.status(500).json({ success: false, message: 'Failed to update category' });
  }
});

// DELETE category
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM device_categories WHERE category_id = ?', [id]);
    res.json({ success: true });
  } catch (err) {
    console.error('Error deleting category:', err);
    res.status(500).json({ success: false, message: 'Failed to delete category' });
  }
});

// CLEAR all categories
router.delete('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    await pool.query('DELETE FROM device_categories');
    await pool.query('ALTER TABLE device_categories AUTO_INCREMENT = 1');
    res.json({ success: true });
  } catch (err) {
    console.error('Error clearing categories:', err);
    res.status(500).json({ success: false, message: 'Failed to clear categories' });
  }
});

export default router;
