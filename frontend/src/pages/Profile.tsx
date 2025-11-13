import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, CreditCard as Edit3, Save, X } from 'lucide-react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { useAuth } from '../contexts/AuthContext';
import { useOrder } from '../contexts/OrderContext';

export const Profile: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const { savedAddresses, showToast } = useOrder();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    updateProfile(formData);
    setIsEditing(false);
    showToast('Profile updated successfully!', 'success');
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
    });
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-primary-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary-900 mb-2">My Profile</h1>
          <p className="text-primary-600">Manage your account settings and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-primary-900">Basic Information</h2>
                {!isEditing ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                ) : (
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCancel}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleSave}
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-primary-700 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl transition-all ${
                        isEditing
                          ? 'border-primary-300 focus:ring-2 focus:ring-accent-500 focus:border-transparent'
                          : 'border-primary-200 bg-primary-50'
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-primary-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl transition-all ${
                        isEditing
                          ? 'border-primary-300 focus:ring-2 focus:ring-accent-500 focus:border-transparent'
                          : 'border-primary-200 bg-primary-50'
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-primary-700 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={!isEditing}
                      placeholder="Add your phone number"
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl transition-all ${
                        isEditing
                          ? 'border-primary-300 focus:ring-2 focus:ring-accent-500 focus:border-transparent'
                          : 'border-primary-200 bg-primary-50'
                      }`}
                    />
                  </div>
                </div>
              </div>
            </Card>

            {/* Saved Addresses */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-primary-900 mb-6">Saved Addresses</h2>
              
              {savedAddresses.length > 0 ? (
                <div className="space-y-4">
                  {savedAddresses.map((address) => (
                    <div key={address.id} className="flex items-start space-x-4 p-4 bg-primary-50 rounded-lg">
                      <MapPin className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
                      <div className="flex-1">
                        <h3 className="font-medium text-primary-900">
                          {address.type === 'geolocation' ? 'Current Location' : address.hostel}
                        </h3>
                        <p className="text-sm text-primary-600 mt-1">{address.address}</p>
                        {address.type === 'geolocation' && (
                          <span className="inline-block mt-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            GPS Location
                          </span>
                        )}
                      </div>
                      <Button variant="ghost" size="sm">
                        <Edit3 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-primary-500 mb-4">No saved addresses yet</p>
                  <Button variant="outline">Add Address</Button>
                </div>
              )}
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profile Picture */}
            <Card className="p-6 text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-2xl">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <h3 className="font-semibold text-primary-900 mb-1">{user?.name}</h3>
              <p className="text-sm text-primary-600 mb-4">{user?.email}</p>
              <Button variant="outline" size="sm" fullWidth>
                Change Photo
              </Button>
            </Card>

            {/* Account Stats */}
            <Card className="p-6">
              <h3 className="font-semibold text-primary-900 mb-4">Account Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-primary-600">Member Since</span>
                  <span className="text-sm font-medium text-primary-900">Jan 2025</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-primary-600">Total Orders</span>
                  <span className="text-sm font-medium text-primary-900">12</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-primary-600">Money Saved</span>
                  <span className="text-sm font-medium text-green-600">₹240</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-primary-600">Loyalty Points</span>
                  <span className="text-sm font-medium text-orange-600">150</span>
                </div>
              </div>
            </Card>

            {/* Preferences */}
            <Card className="p-6">
              <h3 className="font-semibold text-primary-900 mb-4">Preferences</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-primary-700">Email Notifications</span>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-4 h-4 text-orange-600 bg-primary-100 border-primary-300 rounded focus:ring-accent-500"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-primary-700">SMS Updates</span>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-4 h-4 text-orange-600 bg-primary-100 border-primary-300 rounded focus:ring-accent-500"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-primary-700">Marketing Emails</span>
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-orange-600 bg-primary-100 border-primary-300 rounded focus:ring-accent-500"
                  />
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};