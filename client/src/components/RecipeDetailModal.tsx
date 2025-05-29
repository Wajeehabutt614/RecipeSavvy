import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, ChefHat } from "lucide-react";
import type { Recipe } from "@shared/schema";

interface RecipeDetailModalProps {
  recipe: Recipe | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: () => void;
}

export default function RecipeDetailModal({
  recipe,
  open,
  onOpenChange,
}: RecipeDetailModalProps) {
  if (!recipe) return null;

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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{recipe.title}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recipe Image */}
          <div>
            {recipe.imageUrl ? (
              <img
                src={recipe.imageUrl}
                alt={recipe.title}
                className="w-full h-64 lg:h-full object-cover rounded-lg"
              />
            ) : (
              <div className="w-full h-64 lg:h-full bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg flex items-center justify-center">
                <ChefHat className="h-16 w-16 text-orange-600" />
              </div>
            )}
          </div>

          {/* Recipe Details */}
          <div className="space-y-6">
            {/* Meta Info */}
            <div className="flex flex-wrap gap-4 items-center">
              {recipe.category && (
                <Badge className={`${getCategoryColor(recipe.category)}`}>
                  {recipe.category}
                </Badge>
              )}
              {recipe.cookTime && (
                <div className="flex items-center space-x-1 text-gray-600">
                  <Clock className="h-4 w-4" />
                  <span>{recipe.cookTime}</span>
                </div>
              )}
              {recipe.servings && (
                <div className="flex items-center space-x-1 text-gray-600">
                  <Users className="h-4 w-4" />
                  <span>{recipe.servings}</span>
                </div>
              )}
            </div>

            {/* Description */}
            {recipe.description && (
              <div>
                <p className="text-gray-700 leading-relaxed">{recipe.description}</p>
              </div>
            )}

            {/* Ingredients */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <span className="w-2 h-2 bg-orange-600 rounded-full mr-2"></span>
                Ingredients
              </h3>
              <ul className="space-y-2">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-orange-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700">{ingredient}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Instructions */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                Instructions
              </h3>
              <ol className="space-y-4">
                {recipe.instructions.map((instruction, index) => (
                  <li key={index} className="flex space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <p className="text-gray-700 pt-1 leading-relaxed">{instruction}</p>
                  </li>
                ))}
              </ol>
            </div>

            {/* Tags */}
            {recipe.tags && recipe.tags.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {recipe.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-gray-600">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
