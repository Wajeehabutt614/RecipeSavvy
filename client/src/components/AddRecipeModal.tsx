import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2, Upload, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { insertRecipeSchema } from "@shared/schema";
import { apiRequest } from "@/lib/api";

const formSchema = insertRecipeSchema.extend({
  image: z.instanceof(File).optional(),
});

type FormData = z.infer<typeof formSchema>;

interface AddRecipeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export default function AddRecipeModal({
  open,
  onOpenChange,
  onSuccess,
}: AddRecipeModalProps) {
  const { toast } = useToast();
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      cookTime: "",
      servings: "",
      ingredients: [""],
      instructions: [""],
      tags: [],
    },
  });

  const createRecipeMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const formData = new FormData();
      
      // Append basic fields
      formData.append("title", data.title);
      formData.append("description", data.description || "");
      formData.append("category", data.category || "");
      formData.append("cookTime", data.cookTime || "");
      formData.append("servings", data.servings || "");
      
      // Filter out empty ingredients and instructions
      const ingredients = data.ingredients.filter(item => item.trim());
      const instructions = data.instructions.filter(item => item.trim());
      
      formData.append("ingredients", JSON.stringify(ingredients));
      formData.append("instructions", JSON.stringify(instructions));
      
      if (data.tags && data.tags.length > 0) {
        formData.append("tags", JSON.stringify(data.tags));
      }
      
      if (data.image) {
        formData.append("image", data.image);
      }

      const response = await fetch("/api/recipes", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to create recipe");
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Recipe created!",
        description: "Your recipe has been saved successfully.",
      });
      onSuccess();
      onOpenChange(false);
      form.reset();
      setImagePreview(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create recipe. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleImageChange = (file: File | undefined) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const addIngredient = () => {
    const ingredients = form.getValues("ingredients");
    form.setValue("ingredients", [...ingredients, ""]);
  };

  const removeIngredient = (index: number) => {
    const ingredients = form.getValues("ingredients");
    if (ingredients.length > 1) {
      form.setValue("ingredients", ingredients.filter((_, i) => i !== index));
    }
  };

  const addInstruction = () => {
    const instructions = form.getValues("instructions");
    form.setValue("instructions", [...instructions, ""]);
  };

  const removeInstruction = (index: number) => {
    const instructions = form.getValues("instructions");
    if (instructions.length > 1) {
      form.setValue("instructions", instructions.filter((_, i) => i !== index));
    }
  };

  const onSubmit = (data: FormData) => {
    createRecipeMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Recipe</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Image Upload */}
            <FormField
              control={form.control}
              name="image"
              render={({ field: { onChange, value, ...field } }) => (
                <FormItem>
                  <FormLabel>Recipe Image</FormLabel>
                  <FormControl>
                    <div className="space-y-4">
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-orange-500 transition-colors cursor-pointer">
                        <input
                          {...field}
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            onChange(file);
                            handleImageChange(file);
                          }}
                          className="hidden"
                          id="image-upload"
                        />
                        <label htmlFor="image-upload" className="cursor-pointer">
                          <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-gray-600">Click to upload or drag and drop</p>
                          <p className="text-gray-400 text-sm">PNG, JPG up to 10MB</p>
                        </label>
                      </div>
                      {imagePreview && (
                        <div className="relative">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-full h-48 object-cover rounded-lg"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={() => {
                              onChange(undefined);
                              setImagePreview(null);
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Recipe Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recipe Title *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter recipe title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Category, Cook Time, Servings */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="breakfast">Breakfast</SelectItem>
                        <SelectItem value="lunch">Lunch</SelectItem>
                        <SelectItem value="dinner">Dinner</SelectItem>
                        <SelectItem value="dessert">Dessert</SelectItem>
                        <SelectItem value="snack">Snacks</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cookTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cook Time</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 30 min" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="servings"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Servings</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 4 servings" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Brief description of your recipe"
                      className="resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Ingredients */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <FormLabel>Ingredients *</FormLabel>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addIngredient}
                  className="text-orange-600 border-orange-600 hover:bg-orange-50"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Ingredient
                </Button>
              </div>
              <div className="space-y-2">
                {form.watch("ingredients").map((_, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <FormField
                      control={form.control}
                      name={`ingredients.${index}`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input
                              placeholder="e.g., 2 cups flour"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeIngredient(index)}
                      disabled={form.watch("ingredients").length === 1}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Instructions */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <FormLabel>Instructions *</FormLabel>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addInstruction}
                  className="text-orange-600 border-orange-600 hover:bg-orange-50"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Step
                </Button>
              </div>
              <div className="space-y-3">
                {form.watch("instructions").map((_, index) => (
                  <div key={index} className="flex space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <div className="flex-1 flex space-x-2">
                      <FormField
                        control={form.control}
                        name={`instructions.${index}`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Textarea
                                placeholder="Describe this step..."
                                className="resize-none"
                                rows={2}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeInstruction(index)}
                        disabled={form.watch("instructions").length === 1}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createRecipeMutation.isPending}
                className="bg-orange-600 hover:bg-orange-700"
              >
                {createRecipeMutation.isPending ? "Saving..." : "Save Recipe"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
