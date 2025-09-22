const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET all divisions
router.get('/', async (req, res) => {
  const divisions = await prisma.division.findMany();
  res.json(divisions);
});

module.exports = router;
