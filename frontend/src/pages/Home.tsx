import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Clock, Star, Users, ArrowRight, Utensils } from "lucide-react";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { Badge } from "../components/Badge";
export const Home: React.FC = () => {

  const getInitialMealType = (): "lunch" | "dinner" => {
    const currentHour = new Date().getHours();
    return currentHour >= 6 && currentHour < 17 ? "lunch" : "dinner";
  };

  const [selectedMealType, setSelectedMealType] = useState<"lunch" | "dinner">(
    getInitialMealType()
  );

  const mealDetails = {
    lunch: {
      time: "11:00 AM - 5:00 PM",
      emoji: "🌅",
      description: "Fresh homestyle lunch delivered hot",
      image:
        "https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=600&h=350&fit=crop",
    },
    dinner: {
      time: "7:00 PM - 10:30 PM",
      emoji: "🌙",
      description: "Delicious dinner made with love",
      image:
        "https://images.pexels.com/photos/1860208/pexels-photo-1860208.jpeg?auto=compress&cs=tinysrgb&w=600&h=350&fit=crop",
    },
  };

  const currentMeal = mealDetails[selectedMealType];

  return (
<div className="min-h-screen w-full relative overflow-hidden">
  {/* Dashed Grid Background */}
  <div
    className="absolute inset-0 z-0 "
    style={{
      backgroundImage: `
        linear-gradient(to right, #e7e5e4 1px, transparent 1px),
        linear-gradient(to bottom, #e7e5e4 1px, transparent 1px)
      `,
      backgroundSize: "20px 20px",
      maskImage: `
        repeating-linear-gradient(
          to right,
          black 0px,
          black 3px,
          transparent 3px,
          transparent 8px
        ),
        repeating-linear-gradient(
          to bottom,
          black 0px,
          black 3px,
          transparent 3px,
          transparent 8px
        )
      `,
      WebkitMaskImage: `
        repeating-linear-gradient(
          to right,
          black 0px,
          black 3px,
          transparent 3px,
          transparent 8px
        ),
        repeating-linear-gradient(
          to bottom,
          black 0px,
          black 3px,
          transparent 3px,
          transparent 8px
        )
      `,
      maskComposite: "intersect",
      WebkitMaskComposite: "source-in",
    }}
  />
      <main className="relative z-10 px-4 py-12 pt-6 max-w-4xl mx-auto space-y-6">
        {/* Hero Section with Chef */}
        <div className="w-full px-2 py-1 md:py-12">
          {/* <Badge variant="info" size="lg" className="mb-4 md:mb-6 inline-flex">
            <Zap className="w-3 h-3 md:w-4 md:h-4 mr-2" />
            <span className="text-xs md:text-sm">
              Now delivering to all hostels
            </span>
          </Badge> */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight mb-3 md:mb-4">
            Oh Hello paajii..
            <br />
            <span className="bg-gradient-to-r from-orange-500 via-orange-600 to-orange-500 bg-clip-text text-transparent">
              {selectedMealType === "lunch" ? "Lunch" : "Dinner"} Time!!
            </span>
          </h1>
          <div className="max-w-7xl mx-auto">
            {/* Flex container - side by side even on mobile */}
            <div className="flex flex-row items-start md:items-center gap-4 md:gap-12">
              <div className="flex-1 min-w-0">
                <p className="w-[170px] sm:w-[340px] text-gray-600 text-xs sm:text-sm md:text-lg lg:text-xl leading-relaxed mb-4 md:mb-0">
                  Experience authentic homestyle meals prepared fresh daily and
                  delivered right to your doorstep.
                </p>
              </div>

              {/* Chef Image - stays on the right even on mobile */}
              <div className="flex-shrink-0 w-[270px] h-59 sm:w-40 lg:w-[390px] sm:h-40 md:w-56 md:h-56 lg:h-80 self-end md:self-center">
                <div className="relative w-full h-full">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-orange-600 blur-3xl opacity-20"></div>
                  <img
                    src="chef.png"
                    alt="Chef"
                    className="relative right-[-9px] bottom-[-4px] w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Timing Badge */}
          <div className="bg-gradient-to-r from-orange-100 to-orange-50 rounded-xl p-4 border border-orange-200 m-0 relative z-30">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-3xl">{currentMeal.emoji}</span>
                <div>
                  <p className="text-xs text-primary-500 font-medium">
                    Available for {selectedMealType}
                  </p>
                  <p className="text-lg font-bold text-primary-900">
                    {currentMeal.time}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Integrated Meal Card with Premium Toggle */}
        <div className="max-w-2xl mx-auto">
          <Card className="overflow-hidden shadow-2xl border-2 border-orange-100 transition-all duration-300 hover:shadow-3xl">
            {/* Premium Meal Type Toggle - Integrated at Top */}
            <div className="bg-gradient-to-b from-gray-50 to-white p-6 border-b border-gray-200">
              <div className="flex justify-center">
                <div className="relative bg-gray-100 rounded-full p-1 flex w-full max-w-sm shadow-inner">
                  {/* Sliding background indicator */}
                  <div
                    className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-full shadow-md transition-all duration-300 ease-out ${
                      selectedMealType === "lunch"
                        ? "left-1"
                        : "left-[calc(50%+3px)]"
                    }`}
                  />

                  <button
                    onClick={() => setSelectedMealType("lunch")}
                    className={`relative z-10 flex-1 py-3 rounded-full font-medium text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
                      selectedMealType === "lunch"
                        ? "text-gray-900"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <span className="text-base">🌅</span>
                    <span>Lunch</span>
                  </button>

                  <button
                    onClick={() => setSelectedMealType("dinner")}
                    className={`relative z-10 flex-1 py-3 rounded-full font-medium text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
                      selectedMealType === "dinner"
                        ? "text-gray-900"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <span className="text-base">🌙</span>
                    <span>Dinner</span>
                  </button>
                </div>
              </div>

              {/* Timing Info - Elegant and subtle */}
              <div className="mt-4 text-center">
                <div className="inline-flex items-center gap-2 text-sm text-gray-600 bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm">
                  <Clock className="w-4 h-4 text-orange-500" />
                  <span className="font-medium">{currentMeal.time}</span>
                </div>
              </div>
            </div>

            {/* Image with Overlay Badge */}
            <div className="relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10"></div>
              <img
                src={currentMeal.image}
                alt={`Fresh Indian ${selectedMealType}`}
                className="w-full h-72 md:h-96 object-cover transition-transform duration-500 group-hover:scale-110"
              />

              <div className="absolute top-4 left-4 z-20 space-x-6">
                <Badge
                  variant="success"
                  size="lg"
                  className="backdrop-blur-sm bg-white/90 text-green-700 border border-green-200 gap-1"
                >
                  {/* <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div> */}
                  <Utensils className="w-4 h-4 text-green-600" />
                  <span className="font-semibold text-sm text-gray-900">
                    Available Now
                  </span>
                </Badge>
              </div>

              <div className="absolute bottom-4 left-4 right-4 z-20">
                <div className="bg-white/95 backdrop-blur-sm rounded-xl p-3 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-primary-500 font-medium">
                        Starting from
                      </p>
                      <span className="text-3xl font-bold text-primary-900">
                        ₹60
                      </span>
                    </div>
                    <div className="flex items-center space-x-1.5 bg-yellow-50 px-3 py-2 rounded-lg">
                      <Star className="w-5 h-5 text-yellow-500 fill-current" />
                      <span className="text-lg font-bold text-primary-900">
                        4.8
                      </span>
                      <span className="text-sm text-primary-500">(284)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card Content */}
            <div className="p-6 space-y-4 bg-gradient-to-b from-white to-gray-50/30">
              <div>
                <h3 className="text-2xl font-bold text-primary-900 mb-2">
                  Fresh, Homestyle Indian Thali
                </h3>
                <p className="text-primary-600">{currentMeal.description}</p>
              </div>

              {/* CTA Button - Refined and Premium */}
              <Link to={`/meal-builder?mealType=${selectedMealType}`}>
                <Button
                  size="lg"
                  fullWidth
                  className="text-base h-14 mt-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.01] active:scale-[0.99]"
                >
                  <span className="flex items-center justify-center gap-2.5 font-semibold">
                    <span>
                      Build Your{" "}
                      {selectedMealType === "lunch" ? "Lunch" : "Dinner"} Thali
                    </span>
                    <ArrowRight className="w-5 h-5" />
                  </span>
                </Button>
              </Link>

              {/* Quick Stats - Refined */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="flex items-center justify-center space-x-2 bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <Clock className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-900">
                    30-40 min
                  </span>
                </div>
                <div className="flex items-center justify-center space-x-2 bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <Users className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-900">
                    Student Favorite
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/*
          // Info Grid
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center space-x-3 bg-white rounded-xl p-3 border border-orange-100">
                  <div className="bg-orange-100 rounded-lg p-2">
                    <Clock className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-xs text-primary-500 font-medium">
                      Delivery
                    </p>
                    <p className="text-sm font-bold text-primary-900">
                      30-40 min
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 bg-white rounded-xl p-3 border border-orange-100">
                  <div className="bg-orange-100 rounded-lg p-2">
                    <Users className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-xs text-primary-500 font-medium">
                      Loved by
                    </p>
                    <p className="text-sm font-bold text-primary-900">
                      Students
                    </p>
                  </div>
                </div>
              </div> */}

        {/* Sign In Section */}
        {/* <div className="pt-8 max-w-md mx-auto text-center">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-orange-100">
            <p className="text-primary-600 mb-3">Already have an account?</p>
            <Link to="/login">
              <Button
                variant="outline"
                fullWidth
                className="border-2 border-orange-500 text-orange-600 hover:bg-orange-50 font-semibold"
              >
                Sign in to order faster
              </Button>
            </Link>
          </div>
        </div> */}

        {/* Premium Features Section */}
        <div className="max-w-6xl mx-auto mt-16 mb-12">
          {/* Why Choose Us - Premium Grid */}
          <div className="text-center mb-10">
            <p className="text-sm font-semibold text-orange-600 uppercase tracking-wider mb-2">
              Why Students Love Us
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              More Than Just Food
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 px-4">
            {/* Feature 1 */}
            <div className="group bg-white rounded-2xl p-8 border border-gray-200 hover:border-orange-200 transition-all duration-300 hover:shadow-xl">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-100 to-orange-50 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                <Utensils className="w-7 h-7 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Authentic Homestyle
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Every meal is prepared with love, just like home. Fresh
                ingredients, traditional recipes, and that authentic taste
                you've been missing.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group bg-white rounded-2xl p-8 border border-gray-200 hover:border-orange-200 transition-all duration-300 hover:shadow-xl">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-100 to-orange-50 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                <Clock className="w-7 h-7 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Always On Time
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Hot, fresh meals delivered right to your hostel within 30-40
                minutes. No more waiting or cold food - just delicious meals
                when you need them.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group bg-white rounded-2xl p-8 border border-gray-200 hover:border-orange-200 transition-all duration-300 hover:shadow-xl">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-100 to-orange-50 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                <Star className="w-7 h-7 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Budget Friendly
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Quality meals starting at just ₹60. Build your perfect thali
                without breaking the bank. Great food shouldn't cost a fortune.
              </p>
            </div>
          </div>
        </div>

        {/* Social Proof Section - Premium Testimonial */}
        <div className="max-w-4xl mx-auto mt-16 mb-12 px-4">
          <div className="bg-gradient-to-br from-orange-50 via-white to-orange-50 rounded-3xl p-8 md:p-12 border-2 border-orange-100 shadow-xl">
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Stats Column */}
              <div className="flex md:flex-col gap-6 md:gap-8 md:border-r md:border-gray-200 md:pr-8">
                <div className="text-center">
                  <div className="text-4xl font-bold text-orange-600 mb-1">
                    284+
                  </div>
                  <div className="text-sm text-gray-600 font-medium">
                    Happy Students
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-orange-600 mb-1">
                    4.8
                  </div>
                  <div className="text-sm text-gray-600 font-medium">
                    Average Rating
                  </div>
                </div>
              </div>

              {/* Testimonial Content */}
              <div className="flex-1">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-yellow-500 fill-current"
                    />
                  ))}
                </div>
                <p className="text-gray-700 text-lg leading-relaxed mb-4 italic">
                  "Finally found a place that serves food that actually tastes
                  like home! The portions are generous, delivery is quick, and
                  the quality is consistently amazing. Best decision for my
                  hostel life!"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    R
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">
                      Rajveer Singh
                    </div>
                    <div className="text-sm text-gray-500">
                      Btech CSE Student
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* How It Works - Clean Timeline */}
        <div className="max-w-5xl mx-auto mt-16 mb-12 px-4">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold text-orange-600 uppercase tracking-wider mb-2">
              Simple Process
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              How It Works
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting Line (hidden on mobile) */}
            <div className="hidden md:block absolute top-8 left-[16.666%] right-[16.666%] h-0.5 bg-gradient-to-r from-orange-200 via-orange-300 to-orange-200"></div>

            {/* Step 1 */}
            <div className="relative text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4 shadow-lg relative z-10">
                1
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Choose Your Meal
              </h3>
              <p className="text-gray-600">
                Select lunch or dinner and build your perfect thali with your
                favorite items
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4 shadow-lg relative z-10">
                2
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Place Your Order
              </h3>
              <p className="text-gray-600">
                Quick checkout with your hostel details. Pay online or cash on
                delivery
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4 shadow-lg relative z-10">
                3
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Enjoy Hot Meal
              </h3>
              <p className="text-gray-600">
                Sit back and relax. Your delicious meal arrives fresh and hot in
                30-40 minutes
              </p>
            </div>
          </div>
        </div>

        {/* Final CTA Banner - Premium */}
        <div className="max-w-4xl mx-auto mt-16 mb-8 px-4">
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-3xl p-8 md:p-12 text-center shadow-2xl relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>

            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to Experience Home Food?
              </h2>
              <p className="text-orange-100 text-lg mb-8 max-w-2xl mx-auto">
                Join hundreds of students who've already made the switch to
                delicious, homestyle meals
              </p>
              <Link to="/meal-builder?mealType=lunch">
                <Button
                  size="lg"
                  className="h-14 px-8 p-20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 bg-white"
                >
                  <span className="text-orange-400 font-bold text-lg ">
                    Start Building Your Thali
                  </span>
                  <ArrowRight className="w-5 h-5 ml-2 text-orange-500" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
