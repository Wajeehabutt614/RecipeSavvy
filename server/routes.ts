import type { Express } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertRecipeSchema } from "@shared/schema";
import multer from "multer";
import path from "path";
import fs from "fs";

// Configure multer for image uploads
const upload = multer({
  dest: "uploads/",
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Recipe routes
  app.get("/api/recipes", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { search, category } = req.query;
      
      const recipes = await storage.searchRecipes(
        userId,
        search as string,
        category as string
      );
      
      res.json(recipes);
    } catch (error) {
      console.error("Error fetching recipes:", error);
      res.status(500).json({ message: "Failed to fetch recipes" });
    }
  });

  app.get("/api/recipes/:id", isAuthenticated, async (req: any, res) => {
    try {
      const recipeId = parseInt(req.params.id);
      const recipe = await storage.getRecipeById(recipeId);
      
      if (!recipe) {
        return res.status(404).json({ message: "Recipe not found" });
      }
      
      // Check if user owns this recipe
      if (recipe.userId !== req.user.claims.sub) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      res.json(recipe);
    } catch (error) {
      console.error("Error fetching recipe:", error);
      res.status(500).json({ message: "Failed to fetch recipe" });
    }
  });

  app.post("/api/recipes", isAuthenticated, upload.single("image"), async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      // Parse ingredients and instructions arrays
      const recipeData = {
        ...req.body,
        ingredients: JSON.parse(req.body.ingredients || "[]"),
        instructions: JSON.parse(req.body.instructions || "[]"),
        tags: req.body.tags ? JSON.parse(req.body.tags) : null,
      };

      // Handle image upload
      if (req.file) {
        // In a real application, you would upload to a cloud storage service
        // For now, we'll just store the filename
        recipeData.imageUrl = `/uploads/${req.file.filename}`;
      }

      // Validate the recipe data
      const validatedData = insertRecipeSchema.parse(recipeData);
      
      const recipe = await storage.createRecipe(userId, validatedData);
      res.status(201).json(recipe);
    } catch (error: any) {
      console.error("Error creating recipe:", error);
      if (error.name === "ZodError") {
        res.status(400).json({ message: "Invalid recipe data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create recipe" });
      }
    }
  });

  app.put("/api/recipes/:id", isAuthenticated, upload.single("image"), async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const recipeId = parseInt(req.params.id);
      
      // Parse ingredients and instructions arrays
      const recipeData = {
        ...req.body,
        ingredients: req.body.ingredients ? JSON.parse(req.body.ingredients) : undefined,
        instructions: req.body.instructions ? JSON.parse(req.body.instructions) : undefined,
        tags: req.body.tags ? JSON.parse(req.body.tags) : undefined,
      };

      // Handle image upload
      if (req.file) {
        recipeData.imageUrl = `/uploads/${req.file.filename}`;
      }

      const recipe = await storage.updateRecipe(recipeId, userId, recipeData);
      
      if (!recipe) {
        return res.status(404).json({ message: "Recipe not found or access denied" });
      }
      
      res.json(recipe);
    } catch (error) {
      console.error("Error updating recipe:", error);
      res.status(500).json({ message: "Failed to update recipe" });
    }
  });

  app.delete("/api/recipes/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const recipeId = parseInt(req.params.id);
      
      const success = await storage.deleteRecipe(recipeId, userId);
      
      if (!success) {
        return res.status(404).json({ message: "Recipe not found or access denied" });
      }
      
      res.json({ message: "Recipe deleted successfully" });
    } catch (error) {
      console.error("Error deleting recipe:", error);
      res.status(500).json({ message: "Failed to delete recipe" });
    }
  });

  // Serve uploaded images
  app.use("/uploads", express.static("uploads"));

  const httpServer = createServer(app);
  return httpServer;
}
