const express = require('express');
const { register, login, getMe, getUsers, updateUser, updateDetails, updatePassword } = require('../controllers/auth');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.get('/users', protect, authorize('admin'), getUsers);
router.put('/users/:id', protect, authorize('admin'), updateUser);
router.put('/updatedetails', protect, updateDetails);
router.put('/updatepassword', protect, updatePassword);

module.exports = router;
