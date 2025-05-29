import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChefHat, Clock, Users, Search, Plus, Star } from "lucide-react";

export default function Landing() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-orange-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <ChefHat className="h-8 w-8 text-orange-600" />
              <h1 className="text-xl font-bold text-gray-900">RecipeSaver</h1>
            </div>
            <Button onClick={handleLogin} className="bg-orange-600 hover:bg-orange-700">
              Sign In
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Save & Organize Your
            <span className="text-orange-600 block">Favorite Recipes</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Build your personal recipe collection with images, ingredients, and step-by-step instructions. 
            Never lose a great recipe again!
          </p>
          <Button 
            onClick={handleLogin} 
            size="lg" 
            className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3"
          >
            Get Started Free
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Everything You Need to Manage Recipes
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              From saving your grandmother's secret recipe to organizing meal plans, 
              RecipeSaver has all the tools you need.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center p-6 border-orange-200 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <Plus className="h-12 w-12 text-orange-600 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Add Recipes</h4>
                <p className="text-gray-600">
                  Save recipes with titles, ingredients, instructions, and photos
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 border-orange-200 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <Search className="h-12 w-12 text-orange-600 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Smart Search</h4>
                <p className="text-gray-600">
                  Find recipes by title, ingredients, or category quickly
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 border-orange-200 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <Clock className="h-12 w-12 text-orange-600 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Cook Time</h4>
                <p className="text-gray-600">
                  Track cooking time and serving sizes for meal planning
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 border-orange-200 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <Users className="h-12 w-12 text-orange-600 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Categories</h4>
                <p className="text-gray-600">
                  Organize recipes by breakfast, lunch, dinner, and more
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-orange-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-bold text-white mb-4">
            Ready to Start Cooking?
          </h3>
          <p className="text-orange-100 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of home cooks who are already organizing their recipes with RecipeSaver.
          </p>
          <Button 
            onClick={handleLogin}
            size="lg" 
            variant="secondary"
            className="bg-white text-orange-600 hover:bg-orange-50 px-8 py-3"
          >
            Start Saving Recipes
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <ChefHat className="h-6 w-6 text-orange-600" />
            <span className="text-lg font-semibold">RecipeSaver</span>
          </div>
          <p className="text-gray-400">
            Your personal recipe collection, organized and accessible anywhere.
          </p>
        </div>
      </footer>
    </div>
  );
}
