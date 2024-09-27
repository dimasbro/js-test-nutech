const express = require('express');
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const bannerRoutes = require('./routes/banner');
const serviceRoutes = require('./routes/service');
const transactionRoutes = require('./routes/transaction');
const path = require('path');
const { swaggerUi, swaggerSpec } = require('./swagger');

const app = express();
app.use(express.json());

// Define routes
app.use(authRoutes);
app.use(profileRoutes);
app.use(bannerRoutes);
app.use(serviceRoutes);
app.use(transactionRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Start the server
const PORT = process.env.PORT_SERVER;
const APP_URL = process.env.APP_URL;
app.listen(PORT, () => {
    console.log(`Server running at ${APP_URL}`);
    console.log(`Swagger UI available at ${APP_URL}/api-docs`);
});