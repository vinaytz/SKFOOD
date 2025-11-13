import React from 'react';
import { Heart, Users, Clock, Award, Star, MapPin } from 'lucide-react';
import { Card } from '../components/Card';

export const AboutUs: React.FC = () => {
  return (
    <div className="min-h-screen bg-primary-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <span className="font-bold text-3xl"><img src="logo.png" alt="sk food"/></span>
          </div>
          <h1 className="text-4xl font-bold text-primary-900 mb-4">About SKFood</h1>
          <p className="text-xl text-primary-600 max-w-3xl mx-auto">
            Bringing the taste of home to your hostel with authentic, fresh, and delicious Indian meals
          </p>
        </div>

        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-3xl font-bold text-primary-900 mb-6">Our Story</h2>
            <div className="space-y-4 text-primary-600">
              <p>
                SKFood was born from a simple observation: students living in hostels often miss the comfort 
                and nutrition of home-cooked meals. Founded in 2024, we set out to bridge this gap by 
                delivering authentic, homestyle Indian food right to your doorstep.
              </p>
              <p>
                What started as a small initiative to serve a few hostels has grown into a trusted food 
                delivery service, serving hundreds of students daily. We believe that good food is not 
                just about taste—it's about care, quality, and the feeling of being at home.
              </p>
              <p>
                Every meal we prepare is made with fresh ingredients, traditional recipes, and a lot of 
                love. Our team of experienced cooks ensures that each thali maintains the authentic 
                flavors that remind you of home.
              </p>
            </div>
          </div>
          <div className="relative">
            <img
              src="https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=600"
              alt="Traditional Indian Thali"
              className="w-full h-96 object-cover rounded-2xl shadow-lg"
            />
            <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-xl shadow-lg">
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <span className="font-semibold text-primary-900">4.8/5</span>
              </div>
              <p className="text-sm text-primary-600">500+ Happy Students</p>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-primary-900 text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="p-6 text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Heart className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="font-semibold text-primary-900 mb-2">Made with Love</h3>
              <p className="text-sm text-primary-600">
                Every meal is prepared with care and attention, just like home
              </p>
            </Card>

            <Card className="p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-primary-900 mb-2">Community First</h3>
              <p className="text-sm text-primary-600">
                We're here to serve our student community with dedication
              </p>
            </Card>

            <Card className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-primary-900 mb-2">Always On Time</h3>
              <p className="text-sm text-primary-600">
                Reliable delivery that fits your schedule and hunger
              </p>
            </Card>

            <Card className="p-6 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Award className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-primary-900 mb-2">Quality Promise</h3>
              <p className="text-sm text-primary-600">
                Fresh ingredients and hygienic preparation, always
              </p>
            </Card>
          </div>
        </div>

        {/* Stats Section */}
        <Card className="p-8 mb-16 bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
          <h2 className="text-2xl font-bold text-primary-900 text-center mb-8">Our Impact</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-orange-600 mb-2">500+</div>
              <div className="text-sm text-primary-600">Happy Students</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600 mb-2">3,000+</div>
              <div className="text-sm text-primary-600">Meals Delivered</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600 mb-2">5</div>
              <div className="text-sm text-primary-600">Hostels Served</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600 mb-2">4.8★</div>
              <div className="text-sm text-primary-600">Average Rating</div>
            </div>
          </div>
        </Card>

        {/* Team Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-primary-900 text-center mb-12">Meet Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-6 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">SK</span>
              </div>
              <h3 className="font-semibold text-primary-900 mb-1">Suresh Kumar</h3>
              <p className="text-sm text-orange-600 mb-2">Founder & CEO</p>
              <p className="text-sm text-primary-600">
                Passionate about bringing quality food to students
              </p>
            </Card>

            <Card className="p-6 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">RC</span>
              </div>
              <h3 className="font-semibold text-primary-900 mb-1">Ravi Chandra</h3>
              <p className="text-sm text-orange-600 mb-2">Head Chef</p>
              <p className="text-sm text-primary-600">
                5+ years of experience in authentic Indian cuisine
              </p>
            </Card>

            <Card className="p-6 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">PM</span>
              </div>
              <h3 className="font-semibold text-primary-900 mb-1">Priya Mehta</h3>
              <p className="text-sm text-orange-600 mb-2">Operations Manager</p>
              <p className="text-sm text-primary-600">
                Ensuring smooth delivery and customer satisfaction
              </p>
            </Card>
          </div>
        </div>

        {/* Location Section */}
        <Card className="p-8 text-center">
          <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <MapPin className="w-6 h-6 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-primary-900 mb-4">Visit Our Kitchen</h2>
          <p className="text-primary-600 mb-6 max-w-2xl mx-auto">
            We believe in transparency. Our kitchen is open for visits by appointment. 
            Come see how we prepare your meals with care and hygiene.
          </p>
          <div className="text-sm text-primary-600">
            <p className="font-medium">SKFood Central Kitchen</p>
            <p>Lawgate, NH44, Phagwara, Phagwara Tahsil, Kapurthala, Punjab, 144400, India</p>
            <p>Open: 10:00 AM - 11:00 PM</p>
          </div>
        </Card>
      </div>
    </div>
  );
};