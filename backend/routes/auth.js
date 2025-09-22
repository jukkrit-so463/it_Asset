const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.post('/register', async (req, res) => {
  const {
    ipAddressId, departmentId, divisionId, deviceType, brand, model, 
    serviceTag, macAddress, dateReceived, status, notes, rank, 
    firstName, lastName, username, password, contactNumber, 
    snMonitor, snUps, colorSticker // Added fields
  } = req.body;

  // Basic validation
    if (!username || !password || !contactNumber || !ipAddressId || !departmentId || !divisionId || !deviceType || !brand || !model || !serviceTag || !dateReceived || !firstName || !lastName) {
    return res.status(400).json({ message: 'All required fields must be filled.' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        contactNumber,
        rank,
        firstName,
        lastName,
        devices: {
          create: [
            {
              ipAddress:    { connect: { id: ipAddressId } },
              department:   { connect: { id: departmentId } },
              division:     { connect: { id: divisionId } },
              deviceType,
              brand,
              model,
              serviceTag,
              macAddress,
              dateReceived: new Date(dateReceived),
              status:       status || 'Active',
              notes,
              snMonitor,
              snUps,
              colorSticker,
            },
          ],
        },
      },
      include: {
        devices: true,
      },
    });

    // Update the IP address status
    await prisma.ipAddress.update({
      where: { id: ipAddressId },
      data: { status: 'Assigned' },
    });

    res.status(201).json({ message: 'User registered successfully', user: newUser });

  } catch (error) {
    console.error("Registration Error:", error);

    if (error.code === 'P2002' && error.meta?.target?.includes('username')) {
        return res.status(409).json({ message: 'มีผู้ใช้งาน username นี้แล้ว' });
    }
    
    if (error.code === 'P2002') {
      // Unique constraint violation
      const target = Array.isArray(error.meta.target) ? error.meta.target.join(', ') : error.meta.target;
      return res.status(409).json({ message: `Registration failed: The ${target} is already taken.` });
    } 
    if (error.code === 'P2003') {
      // Foreign key constraint failed
       return res.status(400).json({ message: `Registration failed: Invalid selection for ${error.meta.field_name}.` });
    }
    
    // General error
    res.status(500).json({ message: error.message || 'An internal server error occurred during registration.' });
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }

  try {
    // Check if it's an admin
    let user = await prisma.admin.findUnique({
      where: { username },
    });
    let role = 'ADMIN';

    // If not an admin, check if it's a regular user
    if (!user) {
      user = await prisma.user.findUnique({
        where: { username },
      });
      role = 'USER';
    }

    // If no user or admin found
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    console.log('User found:', user); // Add this line

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    // Create JWT payload
    const payload = {
      id: user.id,
      username: user.username,
      role: role,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '8h', // Increased expiry for convenience
    });

    // Remove password from user object before sending
    const { password: _, ...userData } = user;

    res.json({ token, user: { ...userData, role } });

  } catch (error) {
    console.error('Login error:', error.message);
    console.error('Login error stack:', error.stack);
    res.status(500).json({ message: 'An unexpected error occurred during login. Please try again later.' });
  }
});

module.exports = router;
