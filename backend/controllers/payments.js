const Razorpay = require('razorpay');
const crypto = require('crypto');
const Payment = require('../models/Payment');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');

exports.createOrder = async (req, res, next) => {
  try {
    const { planType } = req.body;
    const amount = 99;

    const instance = new Razorpay({
      key_id: (process.env.RAZORPAY_KEY_ID || 'dummy_id').trim(),
      key_secret: (process.env.RAZORPAY_KEY_SECRET || 'dummy_secret').trim(),
    });

    const options = {
      amount: amount * 100,
      currency: 'INR',
      receipt: `receipt_order_${Date.now()}`,
    };

    const order = await instance.orders.create(options);

    const payment = await Payment.create({
      user: req.user.id,
      razorpayOrderId: order.id,
      amount,
      planType
    });

    res.status(200).json({ success: true, order, paymentId: payment._id });
  } catch (error) {
    console.error('Razorpay Error:', error);
    next(new ErrorResponse('Payment order creation failed', 500));
  }
};

exports.verifyPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, paymentId } = req.body;

    const secret = (process.env.RAZORPAY_KEY_SECRET || 'dummy_secret').trim();
    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac('sha256', secret)
      .update(sign.toString())
      .digest('hex');

    console.log('--- Verification Debug ---');
    console.log('Order ID:', razorpay_order_id);
    console.log('Received Sign:', razorpay_signature);
    console.log('Expected Sign:', expectedSign);
    console.log('Match:', razorpay_signature === expectedSign);
    console.log('---------------------------');

    if (razorpay_signature === expectedSign) {
      const payment = await Payment.findById(paymentId);
      if (!payment) return next(new ErrorResponse('Payment record not found', 404));
      
      payment.status = 'Completed';
      payment.razorpayPaymentId = razorpay_payment_id;
      await payment.save();

      const user = await User.findById(req.user.id);
      if (user) {
        await user.save();
      }

      res.status(200).json({ success: true, message: 'Payment verified successfully' });
    } else {
      console.error('Signature Mismatch!');
      res.status(400).json({ success: false, message: 'Invalid signature sent!' });
    }
  } catch (error) {
    console.error('Verification Error:', error);
    next(error);
  }
};

exports.getPayments = async (req, res, next) => {
  try {
    const payments = await Payment.find().populate('user', 'name email').sort('-createdAt');
    res.status(200).json({ success: true, count: payments.length, data: payments });
  } catch (error) {
    next(error);
  }
};
