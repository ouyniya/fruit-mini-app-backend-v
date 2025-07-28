import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth.middleware";
import prisma from "../config/database";

export class FruitController {
  /**
   * @method getFruitsInventory
   * @description Retrieves a paginated list of fruit inventory records.
   * Query Parameters:
   * - page: Page number (default: 1)
   * - limit: Number of items per page (default: 10)
   */
  static async getFruitsInventory(req: AuthenticatedRequest, res: Response) {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    try {
      // Get total count for pagination metadata
      const totalCount = await prisma.fruitsInventory.count();

      // Fetch paginated records
      const records = await prisma.fruitsInventory.findMany({
        skip: offset,
        take: limit,
        orderBy: {
          updatedAt: "desc",
        },
      });

      res.json({
        success: true,
        data: records,
        meta: {
          total: totalCount,
          page,
          limit,
          totalPages: Math.ceil(totalCount / limit),
        },
      });
    } catch (error) {
      console.error("Error fetching fruits inventory:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  /**
   * @method getFruitNames
   * @description Retrieves a list of distinct fruit names.
   * No query parameters.
   */
  static async getFruitNames(req: AuthenticatedRequest, res: Response) {
    try {
      const uniqueProductNames = await prisma.fruitsInventory.findMany({
        distinct: ["productName"],
        select: {
          productName: true,
        },
      });

      res.json({
        success: true,
        data: uniqueProductNames,
      });
    } catch (error) {
      console.error("Error fetching fruits name:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  /**
   * @method addFruit
   * @description Added a fruit inventory record by ID.
   * @route POST /fruit
   * @access Private
   * @param {object} req.body - The added fruit data
   * @returns {object} The added fruit record
   */
  static async addFruit(req: AuthenticatedRequest, res: Response) {
    try {
      const { inventoryDate, productName, color, amount, unit } = req.body;

      const added = await prisma.fruitsInventory.create({
        data: {
          inventoryDate: new Date(inventoryDate),
          productName,
          color,
          amount,
          unit,
        },
      });

      res.json({
        success: true,
        message: "Fruit added successfully.",
      });
    } catch (error: any) {
      console.error("Error adding fruit:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  /**
   * @method updateFruit
   * @description Updates a fruit inventory record by ID.
   * @route PUT /fruit/:id
   * @access Private
   * @param {string} req.params.id - The ID of the fruit to update
   * @param {object} req.body - The updated fruit data
   */
  static async updateFruit(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const { inventoryDate, productName, color, amount, unit } = req.body;

      const existingFruit = await prisma.fruitsInventory.findUnique({
        where: { id: Number(id) },
      });

      if (!existingFruit) {
        return res.status(404).json({
          success: false,
          message: "Fruit not found",
        });
      }

      const updated = await prisma.fruitsInventory.update({
        where: { id: Number(id) },
        data: {
          inventoryDate: new Date(inventoryDate),
          productName,
          color,
          amount,
          unit,
        },
      });

      res.json({
        success: true,
        message: "Fruit updated successfully.",
      });
    } catch (error: any) {
      console.error("Error updating fruit:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  /**
   * @method deleteFruit
   * @description Deletes a fruit inventory record by its ID.
   * @route DELETE /fruit/:id
   * Route Parameter:
   * - id: ID of the fruit inventory to delete
   */
  static async deleteFruit(req: AuthenticatedRequest, res: Response) {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ID",
      });
    }

    try {
      const existingFruit = await prisma.fruitsInventory.findUnique({
        where: { id },
      });

      if (!existingFruit) {
        return res.status(404).json({
          success: false,
          message: "Fruit not found",
        });
      }

      await prisma.fruitsInventory.delete({
        where: { id },
      });

      res.json({
        success: true,
        message: "Fruit deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting fruit:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
}
