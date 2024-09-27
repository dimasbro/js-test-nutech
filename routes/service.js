const express = require('express');
const { getAllServices } = require('../controllers/serviceController'); // Import service controller
const router = express.Router();

/**
 * @swagger
 * /service:
 *   get:
 *     tags: [2. Module Information]
 *     responses:
 *       200:
 *         description: successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 message:
 *                   type: string
 *                 data:
 *                   type: string
 */
router.get('/service', getAllServices);

module.exports = router;