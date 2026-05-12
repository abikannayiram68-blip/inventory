const router = require('express').Router();
const resourceController = require('../controllers/resourceController');
const { protect, requireAdmin } = require('../middlewares/authMiddleware');

router.use(protect);
router.get('/', resourceController.list);
router.post('/', requireAdmin, resourceController.create);
router.put('/:id', requireAdmin, resourceController.update);
router.delete('/:id', requireAdmin, resourceController.remove);

module.exports = router;
