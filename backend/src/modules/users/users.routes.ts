import { Router } from 'express';
import { requireAuth, requireRole } from '../../middleware/auth';
import * as usersController from './users.controller';

const router = Router();

router.use(requireAuth);
router.use(requireRole(['admin']));

router.get('/', usersController.getUsers);
router.post('/', usersController.create);
router.patch('/:id', usersController.update);
router.delete('/:id', usersController.remove);

export default router;
