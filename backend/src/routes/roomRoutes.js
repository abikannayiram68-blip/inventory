const router = require('express').Router();
const roomController = require('../controllers/roomController');
const { protect, requireAdmin } = require('../middlewares/authMiddleware');

router.use(protect);
router.get('/', roomController.list);
router.post('/', requireAdmin, roomController.create);
router.put('/:id', requireAdmin, roomController.update);
router.delete('/:id', requireAdmin, roomController.remove);

module.exports = router;
