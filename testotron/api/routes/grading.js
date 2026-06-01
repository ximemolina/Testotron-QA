const express = require('express');
const router = express.Router();
const { authMiddleware, requireRole } = require('../middleware/auth');
const { GradingController } = require('../controllers/grading');

router.use(authMiddleware);

// POST /api/attempts/:id/grade — auto-grade (recalculate from stored scores)
router.post('/:id/grade', requireRole('teacher','admin'), GradingController.grade);
// PATCH /api/attempts/:id/grade — manual grade (teacher edits per-question scores)
router.patch('/:id/grade', requireRole('teacher','admin'), GradingController.manualGrade);

module.exports = router;