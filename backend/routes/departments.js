const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET all departments
router.get('/', async (req, res) => {
  const departments = await prisma.department.findMany({
    include: { divisions: true },
  });
  console.log(departments);
  res.json(departments);
});

module.exports = router;