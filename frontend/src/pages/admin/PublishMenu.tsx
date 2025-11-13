import React, { useState } from 'react';
import {useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, X, Star, Upload, Loader2 } from 'lucide-react';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { Modal } from '../../components/Modal';


const API_BASE_URL = import.meta.env.VITE_BACKEND_API_URL;

interface MenuItem {
  id: string;
  name: string;
  imageUrl: string;
  isSpecial: boolean;
}

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
}


// Toast Component
const Toast = ({ message, type, onClose }: ToastProps & { onClose: () => void }) => {
  const bgColors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
  };
  
  React.useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);
  
  return (
    <div className={`fixed top-4 right-4 ${bgColors[type]} text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in`}>
      {message}
    </div>
  );
};

// Main Component
export const PublishMenu: React.FC = () => {
  const [mealType, setMealType] = useState<'lunch' | 'dinner'>('lunch');
  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    { 
      id: '1', 
      name: 'Aloo Jeera', 
      imageUrl: 'https://foreignfork.com/wp-content/uploads/2025/03/Jeera-Aloo-feature-image-1.jpg', 
      isSpecial: false 
    },
    { 
      id: '2', 
      name: 'Paneer Bhurji', 
      imageUrl: 'https://www.cookwithmanali.com/wp-content/uploads/2019/06/Paneer-Bhurji-Recipe-Vegetarian-Indian-Cottage-Cheese-Scramble.jpg', 
      isSpecial: true 
    },
  ]);
  const [basePrice, setBasePrice] = useState(60);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItem, setNewItem] = useState({ name: '', imageUrl: '', isSpecial: false });
  const [toast, setToast] = useState<ToastProps | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  const showToast = (message: string, type: ToastProps['type']) => {
    setToast({ message, type });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      showToast('Please upload an image file', 'error');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      showToast('Image size should be less than 5MB', 'error');
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('imageFile', file);

      const response = await fetch(`${API_BASE_URL}/admin/imageUpload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to upload image');
      }

      const data = await response.json();
      
      // Handle different possible response formats
      const imageUrl = data.imageUrl || data.url || data.path || data.data?.imageUrl;
      
      if (imageUrl) {
        setNewItem(prev => ({ ...prev, imageUrl }));
        showToast('Image uploaded successfully!', 'success');
      } else {
        console.error('Unexpected API response:', data);
        throw new Error('No image URL in response');
      }
    } catch (error) {
      console.error('Image upload error:', error);
      showToast(
        error instanceof Error ? error.message : 'Failed to upload image. Please try again.',
        'error'
      );
    } finally {
      setIsUploading(false);
      // Reset the file input
      e.target.value = '';
    }
  };

  const handleAddItem = () => {
    if (!newItem.name.trim()) {
      showToast('Please enter sabji name', 'error');
      return;
    }

    const item: MenuItem = {
      id: Date.now().toString(),
      name: newItem.name.trim(),
      imageUrl: newItem.imageUrl || 'https://static.vecteezy.com/system/resources/thumbnails/044/312/570/small/thai-curry-in-bowl-with-chicken-basil-leaves-chili-peppers-traditional-thai-meal-concept-of-authentic-asian-cuisine-national-dish-spicy-food-graphic-illustration-isolated-on-white-background-vector.jpg',
      isSpecial: newItem.isSpecial,
    };

    setMenuItems(prev => [...prev, item]);
    setNewItem({ name: '', imageUrl: '', isSpecial: false });
    setShowAddModal(false);
    showToast('Sabji added successfully!', 'success');
  };

  const handleRemoveItem = (id: string) => {
    setMenuItems(prev => prev.filter(item => item.id !== id));
    showToast('Sabji removed', 'info');
  };

  const handleToggleSpecial = (id: string) => {
    setMenuItems(prev => prev.map(item => 
      item.id === id ? { ...item, isSpecial: !item.isSpecial } : item
    ));
  };

  const handlePublish = async () => {
    if (menuItems.length < 3) {
      showToast('Please add at least 3 sabjis', 'error');
      return;
    }

    setIsPublishing(true);

    try {
      const payload = {
        mealType,
        basePrice,
        listOfSabjis: menuItems.map(item => ({
          name: item.name,
          imageUrl: item.imageUrl,
          isSpecial: item.isSpecial,
        })),
        isNewMeal: true,
      };

      const response = await fetch(`${API_BASE_URL}/admin/createMeal`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `Server error: ${response.status}`);
      }
      
      showToast('Menu published successfully!', 'success');

      setTimeout(() => {
        navigate("/admin") 
       
      }, 1500);
    } catch (error) {
      console.error('Publish error:', error);
      showToast(
        error instanceof Error ? error.message : 'Failed to publish menu. Please try again.',
        'error'
      );
    } finally {
      setIsPublishing(false);
    }
  };

  const navigate = useNavigate();
  const handleCancel = () => {
    // In a real app with routing
    // window.location.href = '/admin';
    showToast('Cancelled', 'info');
    navigate("/admin")
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50/20 pb-24">
      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="flex items-center justify-between px-4 py-4">
          <Button variant="ghost" size="sm" onClick={handleCancel}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg md:text-xl font-bold text-gray-900">Publish Menu</h1>
          <div className="w-10" />
        </div>
      </header>

      <div className="px-4 py-6 max-w-2xl mx-auto space-y-6">
        {/* Meal Type Toggle */}
        <Card className="p-4">
          <h3 className="font-bold text-gray-900 mb-4">Meal Type</h3>
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setMealType('lunch')}
              disabled={isPublishing}
              className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
                mealType === 'lunch'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              } ${isPublishing ? 'cursor-not-allowed opacity-50' : ''}`}
            >
              Lunch (12-3 PM)
            </button>
            <button
              onClick={() => setMealType('dinner')}
              disabled={isPublishing}
              className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
                mealType === 'dinner'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              } ${isPublishing ? 'cursor-not-allowed opacity-50' : ''}`}
            >
              Dinner (7-10 PM)
            </button>
          </div>
        </Card>

        {/* Base Price */}
        <Card className="p-4">
          <h3 className="font-bold text-gray-900 mb-4">Base Price</h3>
          <div className="flex items-center space-x-4">
            <label className="text-sm text-gray-600">Thali Price:</label>
            <div className="flex items-center space-x-2">
              <span className="text-lg font-semibold">₹</span>
              <input
                type="number"
                value={basePrice}
                onChange={(e) => setBasePrice(Number(e.target.value))}
                disabled={isPublishing}
                className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-100"
                min="0"
              />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Includes 2 sabjis + base + raita + salad
          </p>
        </Card>

        {/* Sabji List */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900">Today's Sabjis</h3>
            <Button
              size="sm"
              onClick={() => setShowAddModal(true)}
              disabled={isPublishing}
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Sabji
            </Button>
          </div>

          <div className="space-y-3">
            {menuItems.map((item) => (
              <div key={item.id} className="flex items-center space-x-4 p-3 bg-orange-50 rounded-lg">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-12 h-12 object-cover rounded-lg"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://static.vecteezy.com/system/resources/thumbnails/044/312/570/small/thai-curry-in-bowl-with-chicken-basil-leaves-chili-peppers-traditional-thai-meal-concept-of-authentic-asian-cuisine-national-dish-spicy-food-graphic-illustration-isolated-on-white-background-vector.jpg';
                  }}
                />
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{item.name}</h4>
                  {item.isSpecial && (
                    <div className="flex items-center space-x-1 mt-1">
                      <Star className="w-3 h-3 text-yellow-500 fill-current" />
                      <span className="text-xs text-yellow-600">Special</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant={item.isSpecial ? "primary" : "outline"}
                    onClick={() => handleToggleSpecial(item.id)}
                    disabled={isPublishing}
                  >
                    <Star className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleRemoveItem(item.id)}
                    disabled={isPublishing}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}

            {menuItems.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No sabjis added yet</p>
                <Button onClick={() => setShowAddModal(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Sabji
                </Button>
              </div>
            )}
          </div>

          {menuItems.length > 0 && (
            <div className="mt-4 p-3 bg-blue-50/50 border border-blue-200/50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>{menuItems.length} sabjis</strong> added. 
                {menuItems.length < 3 && ` Add ${3 - menuItems.length} more to publish.`}
                {menuItems.length >= 3 && ' Ready to publish! ✓'}
              </p>
            </div>
          )}
        </Card>

        {/* Menu Preview */}
        <Card className="p-4">
          <h3 className="font-bold text-gray-900 mb-4">Menu Preview</h3>
          <div className="bg-gradient-to-r from-orange-50/50 to-orange-50/30 rounded-lg p-4 border border-orange-200/50">
            <h4 className="font-semibold text-gray-900 mb-2">
              Today's {mealType.charAt(0).toUpperCase() + mealType.slice(1)} Special
            </h4>
            <div className="text-2xl font-bold text-orange-600 mb-2">₹{basePrice}</div>
            <div className="text-sm text-gray-700 space-y-1">
              <p><strong>Choose 2 from:</strong></p>
              {menuItems.length > 0 ? (
                <div className="grid grid-cols-2 gap-1">
                  {menuItems.map((item) => (
                    <div key={item.id} className="flex items-center space-x-1">
                      <span>•</span>
                      <span>{item.name}</span>
                      {item.isSpecial && <Star className="w-3 h-3 text-yellow-500 fill-current" />}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">No sabjis added yet</p>
              )}
              <p className="pt-2"><strong>Includes:</strong> Roti/Rice + Raita + Salad</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Add Item Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setNewItem({ name: '', imageUrl: '', isSpecial: false });
        }}
        title="Add New Sabji"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sabji Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              placeholder="e.g., Aloo Gobi"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              onKeyPress={(e) => e.key === 'Enter' && handleAddItem()}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image
            </label>
            <div className="space-y-2">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newItem.imageUrl}
                  onChange={(e) => setNewItem({ ...newItem, imageUrl: e.target.value })}
                  placeholder="Or paste image URL here"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                  disabled={isUploading}
                />
                <label className="inline-flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2 text-sm cursor-pointer hover:bg-orange-50 transition-colors whitespace-nowrap">
                  {isUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      <span>Upload</span>
                    </>
                  )}
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isUploading}
                  />
                </label>
              </div>
              {newItem.imageUrl && (
                <div className="relative">
                  <img 
                    src={newItem.imageUrl} 
                    alt="Preview" 
                    className="w-full h-32 object-cover rounded-lg"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://static.vecteezy.com/system/resources/thumbnails/044/312/570/small/thai-curry-in-bowl-with-chicken-basil-leaves-chili-peppers-traditional-thai-meal-concept-of-authentic-asian-cuisine-national-dish-spicy-food-graphic-illustration-isolated-on-white-background-vector.jpg';
                    }}
                  />
                </div>
              )}
              <p className="text-xs text-gray-500">
                {isUploading ? 'Uploading image...' : 'Upload an image or paste URL (optional - default image will be used if empty)'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="special"
              checked={newItem.isSpecial}
              onChange={(e) => setNewItem({ ...newItem, isSpecial: e.target.checked })}
              className="w-4 h-4 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500"
            />
            <label htmlFor="special" className="text-sm font-medium text-gray-700 cursor-pointer">
              Mark as Today's Special
            </label>
          </div>

          <div className="flex space-x-3 pt-4 border-t">
            <Button
              variant="outline"
              fullWidth
              onClick={() => {
                setShowAddModal(false);
                setNewItem({ name: '', imageUrl: '', isSpecial: false });
              }}
              disabled={isUploading}
            >
              Cancel
            </Button>
            <Button
              fullWidth
              onClick={handleAddItem}
              disabled={isUploading}
            >
              Add Sabji
            </Button>
          </div>
        </div>
      </Modal>

      {/* Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-10">
        <div className="max-w-2xl mx-auto flex space-x-3">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="flex-1"
            disabled={isPublishing}
          >
            Cancel
          </Button>
          <Button
            onClick={handlePublish}
            disabled={menuItems.length < 3 || isPublishing}
            className="flex-1"
          >
            {isPublishing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Publishing...
              </>
            ) : (
              'Publish Menu'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}