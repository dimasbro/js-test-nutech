// routes/banner.js
const express = require('express');
const { getAllBanners } = require('../controllers/bannerController');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: 2. Module Information
 */

/**
 * @swagger
 * /banner:
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
router.get('/banner', getAllBanners);

module.exports = router;
