import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth.middleware";
import {
  validate,
  paginationSchema,
  idSchema,
  fruitSchema,
} from "../middleware/validation";
import { FruitController } from "../controllers/fruit.controller";

const router = Router();

// Fetch paginated fruit inventory
// GET /api/fruit/fruits-inventory?page=2&limit=5
router.get(
  "/fruits-inventory",
  authenticate,
  validate({ query: paginationSchema }),
  FruitController.getFruitsInventory
);

// Fetch fruit names
router.get("/fruits-name", authenticate, FruitController.getFruitNames);

// // CREATE
router.post(
  "/",
  authenticate,
  validate({ body: fruitSchema }),
  FruitController.addFruit
);

// UPDATE
router.put(
  "/:id",
  authenticate,
  validate({ params: idSchema }),
  validate({ body: fruitSchema }),
  FruitController.updateFruit
);

// DELETE
router.delete(
  "/:id",
  authenticate,
  validate({ params: idSchema }),
  FruitController.deleteFruit
);

export default router;
