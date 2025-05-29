import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, Edit, Trash2, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/api";
import type { Recipe } from "@shared/schema";

interface RecipeCardProps {
  recipe: Recipe;
  onClick: () => void;
  onUpdate: () => void;
}

export default function RecipeCard({ recipe, onClick, onUpdate }: RecipeCardProps) {
  const { toast } = useToast();
  const [isFavorited, setIsFavorited] = useState(false);

  const deleteRecipeMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest("DELETE", `/api/recipes/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Recipe deleted",
        description: "The recipe has been removed from your collection.",
      });
      onUpdate();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete recipe. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this recipe?")) {
      deleteRecipeMutation.mutate(recipe.id);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    // TODO: Implement edit functionality
    toast({
      title: "Edit feature",
      description: "Edit functionality will be implemented soon.",
    });
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorited(!isFavorited);
  };

  const getCategoryColor = (category: string) => {
    switch (category?.toLowerCase()) {
      case "breakfast":
        return "bg-yellow-100 text-yellow-700";
      case "lunch":
        return "bg-green-100 text-green-700";
      case "dinner":
        return "bg-blue-100 text-blue-700";
      case "dessert":
        return "bg-purple-100 text-purple-700";
      case "snack":
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <Card
      className="group cursor-pointer overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
      onClick={onClick}
    >
      <div className="relative">
        {recipe.imageUrl ? (
          <img
            src={recipe.imageUrl}
            alt={recipe.title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-48 bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
            <span className="text-orange-600 text-4xl">🍽️</span>
          </div>
        )}
        
        <div className="absolute top-3 right-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleFavorite}
            className="w-8 h-8 bg-white/90 hover:bg-white rounded-full p-0"
          >
            <Heart
              className={`h-4 w-4 ${
                isFavorited ? "text-red-500 fill-current" : "text-gray-400"
              }`}
            />
          </Button>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          {recipe.category && (
            <Badge className={`text-xs font-medium ${getCategoryColor(recipe.category)}`}>
              {recipe.category}
            </Badge>
          )}
          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleEdit}
              className="p-1 h-auto text-gray-400 hover:text-blue-500"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              className="p-1 h-auto text-gray-400 hover:text-red-500"
              disabled={deleteRecipeMutation.isPending}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
          {recipe.title}
        </h3>

        {recipe.description && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {recipe.description}
          </p>
        )}

        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-4">
            {recipe.cookTime && (
              <span className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{recipe.cookTime}</span>
              </span>
            )}
            {recipe.servings && (
              <span className="flex items-center space-x-1">
                <Users className="h-4 w-4" />
                <span>{recipe.servings}</span>
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
