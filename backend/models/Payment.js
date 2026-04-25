const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
  razorpayOrderId: { type: String, required: true },
  razorpayPaymentId: String,
  amount: { type: Number, required: true },
  status: { type: String, enum: ['Pending', 'Completed', 'Failed'], default: 'Pending' },
  planType: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Payment', PaymentSchema);
