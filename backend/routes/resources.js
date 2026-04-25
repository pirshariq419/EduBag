const express = require('express');
const { getResources, createResource, deleteResource } = require('../controllers/resources');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

router.route('/')
  .get(getResources)
  .post(protect, authorize('admin'), createResource);

router.route('/:id')
  .delete(protect, authorize('admin'), deleteResource);

module.exports = router;
