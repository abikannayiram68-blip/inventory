const router = require('express').Router();

router.use('/auth', require('./authRoutes'));
router.use('/rooms', require('./roomRoutes'));
router.use('/resources', require('./resourceRoutes'));
router.use('/bookings', require('./bookingRoutes'));

module.exports = router;
