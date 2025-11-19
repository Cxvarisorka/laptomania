import { Link } from "react-router";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { useAuth } from "../context/auth.context";

const Home = () => {
  const { user } = useAuth();

  const features = [
    {
      title: "Wide Selection",
      description: "Browse through hundreds of laptops from top brands like Dell, HP, Lenovo, and more.",
      icon: "💻"
    },
    {
      title: "Best Prices",
      description: "Get competitive prices and exclusive deals on the latest laptop models.",
      icon: "💰"
    },
    {
      title: "Expert Support",
      description: "Our team of experts is here to help you find the perfect laptop for your needs.",
      icon: "🎯"
    },
    {
      title: "Fast Delivery",
      description: "Quick and reliable shipping to get your new laptop to you as soon as possible.",
      icon: "🚀"
    },
    {
      title: "Warranty & Support",
      description: "All laptops come with manufacturer warranty and our dedicated customer support.",
      icon: "🛡️"
    },
    {
      title: "Secure Shopping",
      description: "Shop with confidence using our secure payment system and data protection.",
      icon: "🔒"
    }
  ];

  const categories = [
    { name: "Gaming Laptops", description: "High-performance machines for gamers", color: "bg-purple-100 text-purple-700" },
    { name: "Business Laptops", description: "Professional devices for work", color: "bg-blue-100 text-blue-700" },
    { name: "Student Laptops", description: "Affordable options for students", color: "bg-green-100 text-green-700" },
    { name: "Creative Workstations", description: "Powerful laptops for creators", color: "bg-orange-100 text-orange-700" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-indigo-600 to-purple-600 text-white pb-20">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 animate-fade-in">
              Welcome to Laptomania
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-indigo-100 max-w-3xl mx-auto">
              Your one-stop destination for the latest laptops at unbeatable prices. 
              Find the perfect device that matches your lifestyle and budget.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-20">
              <Link to="/laptops">
                <Button size="lg" className="bg-white text-indigo-600 hover:bg-gray-100 shadow-lg text-lg px-8 py-6 w-full sm:w-auto">
                  Browse Laptops
                </Button>
              </Link>
              {!user && (
                <Link to="/signup">
                  <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-indigo-600 text-lg px-8 py-6 w-full sm:w-auto">
                    Sign Up Now
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 z-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Choose Laptomania?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We provide the best laptop shopping experience with unmatched service and quality.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-300 border-2 hover:border-indigo-200">
              <CardHeader>
                <div className="text-4xl mb-2">{feature.icon}</div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Categories Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Shop by Category
            </h2>
            <p className="text-lg text-gray-600">
              Find the perfect laptop for your specific needs
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <Link to="/laptops" key={index}>
                <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer h-full">
                  <CardHeader className={`${category.color} rounded-t-lg`}>
                    <CardTitle className="text-lg">{category.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <p className="text-gray-600">{category.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-indigo-600 mb-2">500+</div>
            <div className="text-gray-600">Laptop Models</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-indigo-600 mb-2">10K+</div>
            <div className="text-gray-600">Happy Customers</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-indigo-600 mb-2">50+</div>
            <div className="text-gray-600">Top Brands</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-indigo-600 mb-2">24/7</div>
            <div className="text-gray-600">Customer Support</div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Find Your Perfect Laptop?
          </h2>
          <p className="text-xl mb-8 text-indigo-100">
            Join thousands of satisfied customers and discover amazing deals today!
          </p>
          <Link to="/laptops">
            <Button size="lg" className="bg-white text-indigo-600 hover:bg-gray-100 shadow-lg text-lg px-8 py-6">
              Start Shopping Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
