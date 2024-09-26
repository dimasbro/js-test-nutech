const express = require('express');
const { getAllServices } = require('../controllers/serviceController'); // Import service controller
const router = express.Router();

/**
 * @swagger
 * /service:
 *   get:
 *     summary: Get service
 *     tags: [Information]
 *     responses:
 *       200:
 *         description: successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 */
router.get('/service', getAllServices);

module.exports = router;