import { Router } from 'express';
import { protect } from '../middleware/authMiddleware';
import {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addCollaborator,
} from '../controllers/projectController';
import { addComment, deleteComment } from '../controllers/commentController';

const router = Router();

router.route('/').get(getProjects).post(protect, createProject);
router
  .route('/:id')
  .get(getProjectById)
  .put(protect, updateProject)
  .delete(protect, deleteProject);

router.route('/:id/collaborators').put(protect, addCollaborator);

router.route('/:id/comments').post(protect, addComment);
router.route('/:id/comments/:commentId').delete(protect, deleteComment);

export default router;