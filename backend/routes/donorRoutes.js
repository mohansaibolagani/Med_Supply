const express = require('express');
const router = express.Router();
const {
  getDonors,
  getDonorById,
  createDonor,
  updateDonor,
  toggleAvailability,
  checkEligibility,
  deleteDonor
} = require('../controllers/donorController');
const { protect, optionalAuth } = require('../middleware/auth');

router.route('/')
  .get(getDonors)
  .post(optionalAuth, createDonor);

router.route('/:id')
  .get(getDonorById)
  .put(protect, updateDonor)
  .delete(protect, deleteDonor);

router.patch('/:id/toggle-availability', toggleAvailability);
router.get('/:id/eligibility', checkEligibility);

module.exports = router;
