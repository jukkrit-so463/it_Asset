const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');

// Middleware to check for Admin role
const adminOnly = (req, res, next) => {
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ message: 'Forbidden: Admin access required.' });
  }
  next();
};

// GET assets (all for admin, own for user)
router.get('/', async (req, res) => {
  try {
    let whereClause = {};
    if (req.user.role === 'USER') {
      whereClause = {
        user: {
          id: req.user.id,
        },
      };
    }
    // For ADMIN, whereClause remains empty, fetching all devices.

    const assets = await prisma.device.findMany({
      where: whereClause,
      include: { ipAddress: true, user: true, department: true, division: true },
    });
    res.json(assets);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch assets', details: error.message });
  }
});

// GET a single asset by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const asset = await prisma.device.findUnique({
      where: { id },
      include: { ipAddress: true, user: true, department: true, division: true },
    });

    if (!asset) {
      return res.status(404).json({ message: 'Asset not found.' });
    }

    // If user is not an admin, check if they own the asset
    if (req.user.role === 'USER' && asset.user?.id !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden: You do not have access to this asset.' });
    }

    res.json(asset);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch asset', details: error.message });
  }
});

// CREATE a new asset (Admin only)
router.post('/', async (req, res) => {
  const { ipAddressId, departmentId, divisionId, deviceType, brand, model, serviceTag, macAddress, dateReceived, status, notes, rank, firstName, lastName, username, password, contactNumber, snMonitor, snUps, colorSticker, userId } = req.body;
  const loggedInUser = req.user;

  try {
    let userConnection = {};

    if (loggedInUser.role === 'USER') {
      // Regular users can only add devices for themselves
      if (userId && userId !== loggedInUser.id) {
        return res.status(403).json({ message: 'Forbidden: You can only add devices to your own account.' });
      }
       if (username || password) {
        return res.status(403).json({ message: 'Forbidden: You cannot create a new user.' });
      }
      userConnection = { connect: { id: loggedInUser.id } };
    } else if (loggedInUser.role === 'ADMIN') {
      // Admins can add devices for other users or create new users
      if (userId) {
        userConnection = { connect: { id: userId } };
      } else if (username && password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        userConnection = {
          create: {
            rank,
            firstName,
            lastName,
            username,
            password: hashedPassword,
            contactNumber,
          },
        };
      } else {
          return res.status(400).json({ error: 'For admins, either a userId or a username and password are required.' });
      }
    } else {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const newAsset = await prisma.device.create({
      data: {
        ipAddress: { connect: { id: ipAddressId } },
        department: departmentId ? { connect: { id: departmentId } } : undefined,
        division: divisionId ? { connect: { id: divisionId } } : undefined,
        deviceType,
        brand,
        model,
        serviceTag,
        macAddress,
        dateReceived: new Date(dateReceived),
        status,
        notes,
        snMonitor,
        snUps,
        colorSticker,
        user: userConnection,
      },
       include: { ipAddress: true, user: true, department: true, division: true },
    });

    await prisma.ipAddress.update({
      where: { id: ipAddressId },
      data: { status: 'Assigned' },
    });

    res.status(201).json(newAsset);
  } catch (error) {
    if (error.code === 'P2002' && error.meta?.target?.includes('username')) {
        return res.status(409).json({ message: 'มีผู้ใช้งาน username นี้แล้ว' });
    }
    console.error('Create asset error:', error);
    res.status(500).json({ error: 'Failed to create asset', details: error.message });
  }
});

// UPDATE an asset (Admin only)
router.put('/:id', adminOnly, async (req, res) => {
  const { id } = req.params;
  const { ipAddressId, departmentId, divisionId, deviceType, brand, model, serviceTag, macAddress, dateReceived, status, notes, rank, firstName, lastName, username, contactNumber, snMonitor, snUps, colorSticker } = req.body;

  try {
    const currentAsset = await prisma.device.findUnique({ where: { id } });
    if (currentAsset && currentAsset.ipAddressId !== ipAddressId) {
      // Free up the old IP
      await prisma.ipAddress.update({
        where: { id: currentAsset.ipAddressId },
        data: { status: 'Available' },
      });
      // Assign the new IP
      await prisma.ipAddress.update({
        where: { id: ipAddressId },
        data: { status: 'Assigned' },
      });
    }

    const updatedAsset = await prisma.device.update({
      where: { id },
      data: {
        ipAddress: { connect: { id: ipAddressId } },
        department: departmentId ? { connect: { id: departmentId } } : undefined,
        division: divisionId ? { connect: { id: divisionId } } : undefined,
        deviceType,
        brand,
        model,
        serviceTag,
        macAddress,
        dateReceived: new Date(dateReceived),
        status,
        notes,
        snMonitor,
        snUps,
        colorSticker,
        user: {
          update: {
            rank,
            firstName,
            lastName,
            username,
            contactNumber,
          },
        },
      },
      include: { ipAddress: true, user: true, department: true, division: true },
    });
    res.json(updatedAsset);
  } catch (error) {
    if (error.code === 'P2002' && error.meta?.target?.includes('username')) {
        return res.status(409).json({ message: 'มีผู้ใช้งาน username นี้แล้ว' });
    }
    console.error('Update asset error:', error);
    res.status(500).json({ error: 'Failed to update asset', details: error.message });
  }
});

// DELETE an asset (Admin only)
router.delete('/:id', adminOnly, async (req, res) => {
  const { id } = req.params;
  try {
    const device = await prisma.device.findUnique({ where: { id }, include: { user: true } });
    if (device) {
      await prisma.$transaction(async (prisma) => {
        // If there's a user and this is their only device, delete the user.
        if (device.user) {
          const userDevices = await prisma.device.count({ where: { userId: device.user.id } });
          if (userDevices <= 1) {
            await prisma.user.delete({ where: { id: device.user.id } });
          }
        }
        // Delete the device
        await prisma.device.delete({ where: { id } });
        // Free up the IP address
        await prisma.ipAddress.update({
          where: { id: device.ipAddressId },
          data: { status: 'Available' },
        });
      });
    }
    res.status(204).json({ message: 'Asset deleted successfully' });
  } catch (error) {
     // If the user or device doesn't exist, it might throw an error which we can ignore
    if (error.code === 'P2025') {
        // Attempt to delete the device anyway if user deletion failed because it didn't exist
        try {
            const device = await prisma.device.findUnique({ where: { id } });
            if(device) {
                await prisma.device.delete({ where: { id } });
                await prisma.ipAddress.update({
                    where: { id: device.ipAddressId },
                    data: { status: 'Available' },
                });
            }
            return res.status(204).json({ message: 'Asset deleted successfully' });
        } catch (e) {
             return res.status(500).json({ error: 'Failed to delete asset', details: e.message });
        }
    }
    res.status(500).json({ error: 'Failed to delete asset', details: error.message });
  }
});

module.exports = router;