import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChefHat, Plus, Search, LogOut, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import RecipeCard from "@/components/RecipeCard";
import AddRecipeModal from "@/components/AddRecipeModal";
import RecipeDetailModal from "@/components/RecipeDetailModal";
import SearchFilters from "@/components/SearchFilters";
import { apiRequest } from "@/lib/api";
import type { Recipe } from "@shared/schema";

export default function Home() {
  const { user } = useAuth();
  const [showAddRecipe, setShowAddRecipe] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  const { data: recipes = [], isLoading, refetch } = useQuery({
    queryKey: ["/api/recipes", searchQuery, categoryFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchQuery) params.append("search", searchQuery);
      if (categoryFilter) params.append("category", categoryFilter);
      
      const response = await apiRequest("GET", `/api/recipes?${params}`);
      return response.json();
    },
  });

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  const handleRecipeClick = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <ChefHat className="h-8 w-8 text-orange-600" />
              <h1 className="text-xl font-bold text-gray-900">RecipeSaver</h1>
            </div>

            <div className="flex items-center space-x-4">
              <Button
                onClick={() => setShowAddRecipe(true)}
                className="bg-orange-600 hover:bg-orange-700 flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Add Recipe</span>
              </Button>

              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-orange-600" />
                </div>
                <span className="font-medium text-gray-700">
                  {user?.firstName || user?.email}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-gray-900"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Search and Filters */}
      <SearchFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">My Recipes</h2>
          <p className="text-gray-600 mt-1">
            You have <span className="font-medium text-orange-600">{recipes.length}</span> saved recipes
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-pulse">
                <div className="w-full h-48 bg-gray-300"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-300 rounded w-full"></div>
                  <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : recipes.length === 0 ? (
          <div className="text-center py-16">
            <ChefHat className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No recipes found</h3>
            <p className="text-gray-600 mb-6">
              {searchQuery || categoryFilter 
                ? "Try adjusting your search or filters" 
                : "Start building your recipe collection by adding your first recipe"
              }
            </p>
            <Button
              onClick={() => setShowAddRecipe(true)}
              className="bg-orange-600 hover:bg-orange-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Recipe
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {recipes.map((recipe: Recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onClick={() => handleRecipeClick(recipe)}
                onUpdate={refetch}
              />
            ))}
          </div>
        )}
      </main>

      {/* Modals */}
      <AddRecipeModal
        open={showAddRecipe}
        onOpenChange={setShowAddRecipe}
        onSuccess={refetch}
      />

      <RecipeDetailModal
        recipe={selectedRecipe}
        open={!!selectedRecipe}
        onOpenChange={(open) => !open && setSelectedRecipe(null)}
        onUpdate={refetch}
      />
    </div>
  );
}
