// routes/banner.js
const express = require('express');
const { getAllBanners } = require('../controllers/bannerController');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Information
 *   description: List product
 */

/**
 * @swagger
 * /banner:
 *   get:
 *     summary: Get banner
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
router.get('/banner', getAllBanners);

module.exports = router;
