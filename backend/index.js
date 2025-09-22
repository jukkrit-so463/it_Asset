const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const ipRoutes = require('./routes/ips');
const assetRoutes = require('./routes/assets');
const departmentRoutes = require('./routes/departments');
const divisionRoutes = require('./routes/divisions');
const authRoutes = require('./routes/auth');
const { protect } = require('./middleware/authMiddleware');

app.use('/api/ips', ipRoutes);
app.use('/api/assets', protect, assetRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/divisions', divisionRoutes);
app.use('/api/auth', authRoutes); // New line


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
