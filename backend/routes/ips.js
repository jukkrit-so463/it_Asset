const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET all IP addresses
router.get('/', async (req, res) => {
  const { status } = req.query;

  let whereCondition = {};
  if (status && status.toLowerCase() !== 'all') {
    whereCondition.status = status;
  }

  try {
    const ips = await prisma.ipAddress.findMany({
      where: whereCondition,
      include: {
        device: {
          include: {
            user: true,
            division: true,
            department: true,
          },
        },
      },
      orderBy: {
        id: 'asc'
      }
    });
    res.json(ips);
  } catch (error) {
    console.error('Error fetching IPs:', error);
    res.status(500).json({ error: 'Failed to fetch IP addresses' });
  }
});

// GET available IP addresses
router.get('/available', async (req, res) => {
  const availableIps = await prisma.ipAddress.findMany({
    where: { status: 'Available' },
  });
  res.json(availableIps);
});

module.exports = router;
