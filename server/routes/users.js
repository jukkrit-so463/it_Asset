import express from 'express';
import bcrypt from 'bcryptjs';
import pool from '../config/database.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all users
router.get('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const [users] = await pool.execute(`
      SELECT u.*, l.division, l.department
      FROM users u
      LEFT JOIN locations l ON u.locations_id = l.locations_id
      ORDER BY u.created_at DESC
    `);

    const usersWithoutPasswords = users.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });

    res.json({ success: true, data: usersWithoutPasswords });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Create new user
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { username, password, email, first_name, last_name, rank, locations_id, role = 'user' } = req.body;

    if (!username || !password || !email || !first_name || !last_name) {
      return res.status(400).json({ success: false, message: 'All required fields must be provided' });
    }

    const [existingUsers] = await pool.execute(
      'SELECT username, email FROM users WHERE username = ? OR email = ?',
      [username, email]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({ success: false, message: 'Username or email already exists' });
    }

    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const [result] = await pool.execute(`
      INSERT INTO users (username, password, email, first_name, last_name, rank, locations_id, role)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [username, hashedPassword, email, first_name, last_name, rank, locations_id, role]);

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: { user_id: result.insertId }
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Update user
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { email, first_name, last_name, rank, locations_id, role, status } = req.body;

    // ... (เพิ่มโค้ดสำหรับ validation)

    await pool.execute(`
      UPDATE users 
      SET email = ?, first_name = ?, last_name = ?, rank = ?, locations_id = ?, role = ?, status = ?
      WHERE user_id = ?
    `, [email, first_name, last_name, rank, locations_id, role, status, id]);

    res.json({ success: true, message: 'User updated successfully' });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Delete user
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await pool.execute('DELETE FROM users WHERE user_id = ?', [id]);
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});


export default router;
