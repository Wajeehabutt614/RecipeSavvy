import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, Filter, Grid, List } from "lucide-react";

interface SearchFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  categoryFilter: string;
  setCategoryFilter: (category: string) => void;
}

export default function SearchFilters({
  searchQuery,
  setSearchQuery,
  categoryFilter,
  setCategoryFilter,
}: SearchFiltersProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 max-w-lg">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search recipes by title or ingredients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          />
        </div>

        <div className="flex items-center space-x-3">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px] focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Categories</SelectItem>
              <SelectItem value="breakfast">Breakfast</SelectItem>
              <SelectItem value="lunch">Lunch</SelectItem>
              <SelectItem value="dinner">Dinner</SelectItem>
              <SelectItem value="dessert">Dessert</SelectItem>
              <SelectItem value="snack">Snacks</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="sm"
            className="border-gray-300 hover:bg-gray-50"
          >
            <Filter className="h-4 w-4" />
          </Button>

          <div className="flex border border-gray-300 rounded-lg overflow-hidden">
            <Button
              variant="ghost"
              size="sm"
              className="bg-orange-50 text-orange-600 hover:bg-orange-100 rounded-none"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-600 hover:bg-gray-50 rounded-none"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
