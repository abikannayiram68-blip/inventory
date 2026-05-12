const router = require('express').Router();
const bookingController = require('../controllers/bookingController');
const { protect, requireAdmin } = require('../middlewares/authMiddleware');

router.use(protect);
router.get('/', bookingController.list);
router.post('/', bookingController.create);
router.patch('/:id/status', requireAdmin, bookingController.updateStatus);
router.patch('/:id/cancel', bookingController.cancel);

module.exports = router;
