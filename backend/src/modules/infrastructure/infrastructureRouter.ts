import { Router } from 'express';
import {
  getBuildings,
  createBuilding,
  getBuildingById,
  updateBuilding,
  deleteBuilding,
  getFloors,
  createFloor,
  getRooms,
  createRoom,
  getCategories,
  createCategory
} from './infrastructureController';
import { authenticate, authorize } from '../auth/authMiddleware';

const router = Router();

// Apply middleware to all routes in this router
router.use(authenticate);


// Buildings
router.route('/buildings')
  .get(getBuildings)
  .post(authorize(['Admin', 'Manager']), createBuilding);

router.route('/buildings/:id')
  .get(getBuildingById)
  .put(authorize(['Admin', 'Manager']), updateBuilding)
  .delete(authorize(['Admin', 'Manager']), deleteBuilding);

// Floors
router.route('/floors')
  .get(getFloors)
  .post(authorize(['Admin', 'Manager']), createFloor);

// Rooms
router.route('/rooms')
  .get(getRooms)
  .post(authorize(['Admin', 'Manager']), createRoom);

// Categories
router.route('/categories')
  .get(getCategories)
  .post(authorize(['Admin', 'Manager']), createCategory);

export default router;
