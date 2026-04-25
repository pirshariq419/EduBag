const express = require('express');
const { createOrder, verifyPayment, getPayments } = require('../controllers/payments');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', protect, authorize('admin'), getPayments);
router.post('/create-order', protect, createOrder);
router.post('/verify', protect, verifyPayment);

module.exports = router;
