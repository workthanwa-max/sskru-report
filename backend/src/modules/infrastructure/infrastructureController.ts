import { Request, Response } from 'express';
import { logAction } from '../auditlog/auditController';
import {
  findAllBuildings,
  insertBuilding,
  findBuildingById,
  updateBuildingById,
  deleteBuildingById,
  findAllFloors,
  insertFloor,
  findAllRooms,
  insertRoom,
  findAllCategories,
  insertCategory
} from './infrastructureRepository';

// --- Buildings ---
export const getBuildings = async (req: Request, res: Response) => {
  try {
    const buildings = await findAllBuildings();
    res.json({ data: buildings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch buildings' });
  }
};

export const createBuilding = async (req: Request, res: Response) => {
  const { name, code } = req.body;
  try {
    const info = await insertBuilding(name, code);
    res.status(201).json({ data: { id: info.lastID, name, code } });
    logAction(req, 'BUILDING_CREATED', 'INFRA', { name, code });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create building' });
  }
};

export const getBuildingById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const building = await findBuildingById(id as string);
    if (!building) {
      res.status(404).json({ error: 'Building not found' });
      return;
    }
    res.json({ data: building });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch building' });
  }
};

export const updateBuilding = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { name, code } = req.body;
  try {
    const info = await updateBuildingById(id as string, name, code);
    if (info.changes === 0) {
      res.status(404).json({ error: 'Building not found' });
      return;
    }
    res.json({ data: { id, name, code } });
    logAction(req, 'BUILDING_UPDATED', 'INFRA', { id, name, code });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update building' });
  }
};

export const deleteBuilding = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const info = await deleteBuildingById(id as string);
    if (info.changes === 0) {
      res.status(404).json({ error: 'Building not found' });
      return;
    }
    res.json({ message: 'Building deleted successfully' });
    logAction(req, 'BUILDING_DELETED', 'INFRA', { id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete building' });
  }
};

// --- Floors ---
export const getFloors = async (req: Request, res: Response) => {
  try {
    const floors = await findAllFloors();
    res.json({ data: floors });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch floors' });
  }
};

export const createFloor = async (req: Request, res: Response) => {
  const { building_id, floor_number } = req.body;
  try {
    const info = await insertFloor(building_id, floor_number);
    res.status(201).json({ data: { id: info.lastID, building_id, floor_number } });
    logAction(req, 'FLOOR_CREATED', 'INFRA', { building_id, floor_number });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create floor' });
  }
};

// --- Rooms ---
export const getRooms = async (req: Request, res: Response) => {
  try {
    const rooms = await findAllRooms();
    res.json({ data: rooms });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch rooms' });
  }
};

export const createRoom = async (req: Request, res: Response) => {
  const { floor_id, room_number, room_name } = req.body;
  try {
    const info = await insertRoom(floor_id, room_number, room_name);
    res.status(201).json({ data: { id: info.lastID, floor_id, room_number, room_name } });
    logAction(req, 'ROOM_CREATED', 'INFRA', { floor_id, room_number, room_name });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create room' });
  }
};

// --- Categories ---
export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await findAllCategories();
    res.json({ data: categories });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
};

export const createCategory = async (req: Request, res: Response) => {
  const { category_name } = req.body;
  try {
    const info = await insertCategory(category_name);
    res.status(201).json({ data: { id: info.lastID, category_name } });
    logAction(req, 'CATEGORY_CREATED', 'INFRA', { category_name });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create category' });
  }
};

