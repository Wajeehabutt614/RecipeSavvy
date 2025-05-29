import {
  users,
  recipes,
  type User,
  type UpsertUser,
  type Recipe,
  type InsertRecipe,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, ilike, or } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Recipe operations
  getRecipesByUserId(userId: string): Promise<Recipe[]>;
  getRecipeById(id: number): Promise<Recipe | undefined>;
  createRecipe(userId: string, recipe: InsertRecipe): Promise<Recipe>;
  updateRecipe(id: number, userId: string, recipe: Partial<InsertRecipe>): Promise<Recipe | undefined>;
  deleteRecipe(id: number, userId: string): Promise<boolean>;
  searchRecipes(userId: string, query?: string, category?: string): Promise<Recipe[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.

  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Recipe operations
  async getRecipesByUserId(userId: string): Promise<Recipe[]> {
    return await db
      .select()
      .from(recipes)
      .where(eq(recipes.userId, userId))
      .orderBy(desc(recipes.createdAt));
  }

  async getRecipeById(id: number): Promise<Recipe | undefined> {
    const [recipe] = await db
      .select()
      .from(recipes)
      .where(eq(recipes.id, id));
    return recipe;
  }

  async createRecipe(userId: string, recipe: InsertRecipe): Promise<Recipe> {
    const [newRecipe] = await db
      .insert(recipes)
      .values({
        ...recipe,
        userId,
      })
      .returning();
    return newRecipe;
  }

  async updateRecipe(id: number, userId: string, recipe: Partial<InsertRecipe>): Promise<Recipe | undefined> {
    const [updatedRecipe] = await db
      .update(recipes)
      .set({
        ...recipe,
        updatedAt: new Date(),
      })
      .where(and(eq(recipes.id, id), eq(recipes.userId, userId)))
      .returning();
    return updatedRecipe;
  }

  async deleteRecipe(id: number, userId: string): Promise<boolean> {
    const result = await db
      .delete(recipes)
      .where(and(eq(recipes.id, id), eq(recipes.userId, userId)));
    return (result.rowCount || 0) > 0;
  }

  async searchRecipes(userId: string, query?: string, category?: string): Promise<Recipe[]> {
    let whereCondition = eq(recipes.userId, userId);

    if (query) {
      const searchCondition = or(
        ilike(recipes.title, `%${query}%`),
        ilike(recipes.description, `%${query}%`)
      );
      if (searchCondition) {
        whereCondition = and(whereCondition, searchCondition);
      }
    }

    if (category) {
      whereCondition = and(whereCondition, eq(recipes.category, category));
    }

    return await db
      .select()
      .from(recipes)
      .where(whereCondition)
      .orderBy(desc(recipes.createdAt));
  }
}

export const storage = new DatabaseStorage();
