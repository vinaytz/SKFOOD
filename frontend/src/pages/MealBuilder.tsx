// src/pages/MealBuilder.tsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Check, Plus, Minus, ChevronRight, Sparkles, Loader } from 'lucide-react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Modal } from '../components/Modal';
import { useOrder } from '../contexts/OrderContext';
import { menuAPI } from '../utils/api';

interface MenuData {
  _id: string;
  mealType: 'lunch' | 'dinner';
  listOfSabjis: Array<{
    name: string;
    imageUrl: string;
    isSpecial: boolean;
  }>;
  baseOptions: string[];
  basePrice: number;
}

export const MealBuilder: React.FC = () => {
  const [searchParams] = useSearchParams();
  const mealType = searchParams.get('mealType') as 'lunch' | 'dinner' | null;
  
  const [currentStep, setCurrentStep] = useState(0);
  const [menuData, setMenuData] = useState<MenuData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showMealTypeModal, setShowMealTypeModal] = useState(false);
  
  const { currentOrder, setCurrentOrder, showToast } = useOrder();
  const navigate = useNavigate();

  // Fetch menu data on component mount
  useEffect(() => {
    if (!mealType) {
      setShowMealTypeModal(true);
      setLoading(false);
      return;
    }

    fetchMenuData();
  }, [mealType]);

  const fetchMenuData = async () => {
    if (!mealType) return;
    
    setLoading(true);
    setError('');

    try {
      const response = mealType === 'lunch' 
        ? await menuAPI.getLunchMenu() 
        : await menuAPI.getDinnerMenu();

      if (response.data && response.data.length > 0) {
        const menu = response.data[0];
        setMenuData(menu);
        
        // Initialize order with menu data
        setCurrentOrder({
          ...currentOrder,
          mealType: menu.mealType,
          menuId: menu._id,
          basePrice: menu.basePrice,
          availableBaseOptions: menu.baseOptions,
        });
      } else {
        setError('No menu available for selected meal type');
      }
    } catch (err: any) {
      console.error('Failed to fetch menu:', err);
      setError(err.response?.data?.message || 'Failed to load menu. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSabjiSelect = (sabji: MenuData['listOfSabjis'][0]) => {
    const isSelected = currentOrder.selectedSabjis.find(s => s.name === sabji.name);
    
    if (isSelected) {
      setCurrentOrder({
        ...currentOrder,
        selectedSabjis: currentOrder.selectedSabjis.filter(s => s.name !== sabji.name),
      });
      showToast(`${sabji.name} removed`);
    } else if (currentOrder.selectedSabjis.length < 2) {
      setCurrentOrder({
        ...currentOrder,
        selectedSabjis: [...currentOrder.selectedSabjis, sabji],
      });
      showToast(`${sabji.name} added`, 'success');
    } else {
      showToast('Maximum 2 dishes allowed', 'error');
    }
  };

  const mapBaseOptionToType = (option: string): 'roti-only' | 'both' | 'rice-only' => {
    if (option.toLowerCase().includes('5 roti') || option.toLowerCase() === 'roti only') {
      return 'roti-only';
    } else if (option.toLowerCase().includes('3 roti') && option.toLowerCase().includes('rice')) {
      return 'both';
    } else {
      return 'rice-only';
    }
  };

  const handleBaseOptionChange = (option: string) => {
    const baseType = mapBaseOptionToType(option);
    const baseRoti = baseType === 'roti-only' ? 5 : baseType === 'both' ? 3 : 0;
    
    setCurrentOrder({
      ...currentOrder,
      baseOption: baseType,
      extraRoti: Math.max(0, currentOrder.extraRoti - (5 - baseRoti)),
    });
  };

  const handleExtraRotiChange = (change: number) => {
    const maxExtra = currentOrder.baseOption === 'rice-only' ? 5 : 3;
    const newExtra = Math.max(0, Math.min(maxExtra, currentOrder.extraRoti + change));
    setCurrentOrder({
      ...currentOrder,
      extraRoti: newExtra,
    });
  };

  const handleNext = () => {
    if (currentStep === 0 && currentOrder.selectedSabjis.length === 0) {
      showToast('Please select at least one dish', 'error');
      return;
    }

    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    } else {
      navigate('/checkout');
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleQuantityChange = (change: number) => {
    const newQuantity = Math.max(1, Math.min(5, currentOrder.quantity + change));
    setCurrentOrder({ ...currentOrder, quantity: newQuantity });
  };

  const getBaseText = () => {
    const baseRotiCount = currentOrder.baseOption === 'roti-only' ? 5 : currentOrder.baseOption === 'both' ? 3 : 0;
    const totalRoti = baseRotiCount + currentOrder.extraRoti;

    switch (currentOrder.baseOption) {
      case 'roti-only': 
        return `Roti (${totalRoti})`;
      case 'both': 
        return `Roti (${totalRoti}) + Rice`;
      case 'rice-only': 
        return 'Rice Bowl';
    }
  };

  // Calculate pricing
  const basePrice = menuData?.basePrice || 60;
  const specialSabjiPrice = currentOrder.selectedSabjis.some(s => s.isSpecial) ? 20 : 0;
  const extraRotiPrice = currentOrder.extraRoti * 10;
  const perThaliTotal = basePrice + specialSabjiPrice + extraRotiPrice;
  const subtotal = perThaliTotal * currentOrder.quantity;
  const discount = currentOrder.quantity >= 3 ? Math.round(subtotal * 0.05) : 0;
  const tax = Math.round((subtotal - discount) * 0.05);
  const deliveryFee = 0;
  const total = subtotal - discount + tax + deliveryFee;

  const steps = ['Dishes', 'Base', 'Summary'];

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-primary-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-orange-600 animate-spin mx-auto mb-4" />
          <p className="text-primary-600 font-medium">Loading menu...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-primary-50 flex items-center justify-center p-4">
        <Card className="p-8 text-center max-w-md">
          <p className="text-red-600 font-medium mb-4">{error}</p>
          <Button onClick={fetchMenuData}>Try Again</Button>
        </Card>
      </div>
    );
  }

  // Meal type selection modal
  if (showMealTypeModal) {
    return (
      <Modal
        isOpen={showMealTypeModal}
        onClose={() => navigate('/')}
        title="Select Meal Type"
        size="sm"
      >
        <div className="space-y-3 mt-3">
          <Button
            fullWidth
            size="lg"
            onClick={() => {
              navigate('/meal-builder?mealType=lunch');
              setShowMealTypeModal(false);
            }}
          >
            Lunch
          </Button>
          <Button
            fullWidth
            size="lg"
            onClick={() => {
              navigate('/meal-builder?mealType=dinner');
              setShowMealTypeModal(false);
            }}
          >
            Dinner
          </Button>
        </div>
      </Modal>
    );
  }

  if (!menuData) return null;

  return (
<div className="min-h-screen relative">
  {/* Dashed Grid Background */}
  <div
    className="fixed inset-0 z-0"
    style={{
      backgroundImage: `
        linear-gradient(to right, #e7e5e4 1px, transparent 1px),
        linear-gradient(to bottom, #e7e5e4 1px, transparent 1px)
      `,
      backgroundSize: "20px 20px",
      backgroundPosition: "0 0, 0 0",
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
  <main className='relative z-10'>
        <header className="sticky top-0 z-30 bg-white border-b border-primary-200/60">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <Link to="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <h1 className="text-lg font-semibold text-primary-900">
              {currentStep === 2 ? 'Order Summary' : `Build Your ${mealType === 'lunch' ? 'Lunch' : 'Dinner'} Thali`}
            </h1>
            <div className="w-20" />
          </div>

          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-250 ${
                    index <= currentStep
                      ? 'bg-primary-900 text-white'
                      : 'bg-primary-200 text-primary-600'
                  }`}>
                    {index < currentStep ? <Check className="w-4 h-4" /> : index + 1}
                  </div>
                  <span className={`text-xs mt-1.5 font-medium ${
                    index <= currentStep ? 'text-primary-900' : 'text-primary-500'
                  }`}>{step}</span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`h-0.5 flex-1 mx-2 transition-all duration-250 ${
                    index < currentStep ? 'bg-primary-900' : 'bg-primary-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 pb-32">
        {/* Step 0: Select Dishes */}
        {currentStep === 0 && (
          <div className="animate-fade-in">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-primary-900 mb-2">Choose Your Dishes</h2>
              <p className="text-primary-600">Select up to 2 delicious dishes for your thali</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
              {menuData.listOfSabjis.map((sabji, idx) => {
                const isSelected = currentOrder.selectedSabjis.find(s => s.name === sabji.name);
                return (
                  <Card
                    key={idx}
                    hoverable
                    selected={!!isSelected}
                    onClick={() => handleSabjiSelect(sabji)}
                    className="p-4 cursor-pointer group relative"
                  >
                    {sabji.isSpecial && (
                      <div className="absolute top-2 left-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 z-10">
                        <Sparkles className="w-3 h-3" />
                        Special
                      </div>
                    )}
                    <div className="relative mb-3 overflow-hidden rounded-lg">
                      <img
                        src={sabji.imageUrl}
                        alt={sabji.name}
                        className="w-full h-28 sm:h-32 object-cover group-hover:scale-105 transition-transform duration-250"
                      />
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-6 h-6 bg-primary-900 rounded-full flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                    <h3 className="font-medium text-sm text-primary-900">{sabji.name}</h3>
                    {sabji.isSpecial && (
                      <p className="text-xs text-orange-600 mt-1">+₹20</p>
                    )}
                  </Card>
                );
              })}
            </div>

            <div className="text-center">
              <span className="inline-block px-4 py-2 bg-white rounded-lg border border-primary-200 text-sm font-medium text-primary-900">
                {currentOrder.selectedSabjis.length} of 2 selected
              </span>
            </div>
          </div>
        )}

        {/* Step 1: Select Base */}
        {currentStep === 1 && (
          <div className="animate-fade-in">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-primary-900 mb-2">Choose Your Base</h2>
              <p className="text-primary-600">Select your preferred combination</p>
            </div>

            <div className="space-y-3 mb-8">
              {menuData.baseOptions.map((option, idx) => {
                const baseType = mapBaseOptionToType(option);
                const isSelected = currentOrder.baseOption === baseType;
                
                return (
                  <Card
                    key={idx}
                    hoverable
                    selected={isSelected}
                    onClick={() => handleBaseOptionChange(option)}
                    className="p-5 cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-primary-900 mb-1">{option}</h3>
                        <p className="text-sm text-primary-600">
                          {baseType === 'roti-only' && 'Fresh rotis only'}
                          {baseType === 'both' && 'Perfect combo of roti and rice'}
                          {baseType === 'rice-only' && 'Generous rice bowl'}
                        </p>
                      </div>
                      {isSelected && <Check className="w-5 h-5 text-primary-900" />}
                    </div>
                  </Card>
                );
              })}
            </div>

            {currentOrder.baseOption !== 'rice-only' && (
              <Card className="p-5">
                <h4 className="font-semibold text-primary-900 mb-4">Extra Roti</h4>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-primary-600">Add extra rotis (+₹10 each)</span>
                  <div className="flex items-center space-x-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleExtraRotiChange(-1)}
                      disabled={currentOrder.extraRoti === 0}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="font-semibold text-lg text-primary-900 min-w-[2rem] text-center">
                      {currentOrder.extraRoti}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleExtraRotiChange(1)}
                      disabled={currentOrder.extraRoti >= 3}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            )}
          </div>
        )}

        {/* Step 2: Summary */}
        {currentStep === 2 && (
          <div className="animate-fade-in">
            <Card className="p-6">
              <h3 className="font-semibold text-primary-900 mb-4">Your Selection</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-medium text-primary-900">Sabjis</span>
                    <div className="text-sm text-primary-600">
                      {currentOrder.selectedSabjis.map(s => s.name).join(', ')}
                    </div>
                    {currentOrder.selectedSabjis.some(s => s.isSpecial) && (
                      <div className="text-xs text-orange-600 mt-1 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        Includes special dish
                      </div>
                    )}
                  </div>
                  <span className="text-sm font-medium text-primary-900">
                    ₹{basePrice + specialSabjiPrice}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="font-medium text-primary-900">{getBaseText()}</span>
                  {extraRotiPrice > 0 && (
                    <span className="text-sm font-medium text-primary-900">+₹{extraRotiPrice}</span>
                  )}
                </div>

                <div className="bg-green-50 rounded-lg p-3">
                  <div className="text-sm font-medium text-green-800 mb-1">Included Free</div>
                  <div className="text-sm text-green-700">Fresh Raita • Garden Salad</div>
                </div>
              </div>
            </Card>

            <Card className="p-6 my-3">
              <h3 className="font-semibold text-primary-900 mb-4">Quantity</h3>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-lg font-medium text-primary-900">How many thalis?</span>
                  <p className="text-sm text-primary-600">Most students choose 1</p>
                </div>
                <div className="flex items-center space-x-3">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={currentOrder.quantity === 1}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="font-medium text-xl px-4">{currentOrder.quantity}</span>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleQuantityChange(1)}
                    disabled={currentOrder.quantity === 5}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold text-primary-900 mb-4">Price Breakdown</h3>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-primary-700">Per thali</span>
                  <span className="font-medium">₹{perThaliTotal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-primary-700">Quantity × {currentOrder.quantity}</span>
                  <span className="font-medium">₹{subtotal}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-orange-600">
                    <span>Bulk discount (5%)</span>
                    <span>-₹{discount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-primary-700">Tax (5%)</span>
                  <span className="font-medium">₹{tax}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-primary-700">Delivery fee</span>
                  <span className="font-medium text-green-600">Free</span>
                </div>
                <div className="border-t border-primary-200 pt-2 flex justify-between">
                  <span className="font-semibold text-lg text-primary-900">Total</span>
                  <span className="font-bold text-xl text-orange-600">₹{total}</span>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-primary-200/60 p-4 shadow-lg">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          {currentStep > 0 && (
            <Button variant="outline" onClick={handleBack} className="flex-1 sm:flex-none sm:px-8">
              Back
            </Button>
          )}
          <Button onClick={handleNext} className="flex-1">
            {currentStep === 2 ? (
              <>
                Select Address
                <ChevronRight className="w-4 h-4 ml-1" />
              </>
            ) : (
              <>
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </>
            )}
          </Button>
        </div>
      </div>
      </main>
    </div>
  );
};