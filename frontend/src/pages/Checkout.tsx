  // src/pages/Checkout.tsx
  import React, { useState, useEffect } from 'react';
  import { Link, useNavigate } from 'react-router-dom';
  import { ArrowLeft, MapPin, Navigation, Plus, Loader, Search } from 'lucide-react';
  import { Button } from '../components/Button';
  import { Card } from '../components/Card';
  import { Modal } from '../components/Modal';
  import { AuthModal } from '../components/authModal';
  import { useOrder } from '../contexts/OrderContext';
  import { isAuthenticated } from '../utils/api';

  // Geocoding using OpenStreetMap Nominatim (Free, no API key needed)
  const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        {
          headers: {
            'Accept-Language': 'en',
          },
        }
      );
      
      if (!response.ok) {
        throw new Error('Geocoding failed');
      }
      
      const data = await response.json();
      
      // Build a readable address from the components
      const address = data.address;
      const parts = [
        address.road || address.neighbourhood,
        address.suburb || address.city_district,
        address.city || address.town || address.village,
        address.state,
        address.postcode,
      ].filter(Boolean);
      
      return parts.join(', ') || data.display_name;
    } catch (error) {
      console.error('Geocoding error:', error);
      return `Location: ${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    }
  };

  // GOOGLE MAPS GEOCODING (Commented - Uncomment to use)
  // const GOOGLE_MAPS_API_KEY = 'YOUR_GOOGLE_MAPS_API_KEY';
  // const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
  //   try {
  //     const response = await fetch(
  //       `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAPS_API_KEY}`
  //     );
  //     const data = await response.json();
  //     console.log('Google Maps API Response:', data);
  //     if (data.status === 'OK' && data.results && data.results.length > 0) {
  //       return data.results[0].formatted_address;
  //     } else if (data.status === 'REQUEST_DENIED') {
  //       console.error('API Key Error:', data.error_message);
  //       throw new Error('API key issue: ' + data.error_message);
  //     } else {
  //       throw new Error('No address found: ' + data.status);
  //     }
  //   } catch (error) {
  //     console.error('Geocoding error:', error);
  //     return `Location: ${lat.toFixed(6)}, ${lng.toFixed(6)}`;
  //   }
  // };

  // Search address using Nominatim
  const searchAddress = async (query: string): Promise<any[]> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1`,
        {
          headers: {
            'Accept-Language': 'en',
          },
        }
      );
      
      if (!response.ok) {
        throw new Error('Search failed');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Address search error:', error);
      return [];
    }
  };

  export const Checkout: React.FC = () => {
    const [selectedAddress, setSelectedAddress] = useState<string>('');
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [locationLoading, setLocationLoading] = useState(false);
    const [addressesLoading, setAddressesLoading] = useState(true);
    
    // Address search states
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const [selectedSearchResult, setSelectedSearchResult] = useState<any>(null);
    
    const [manualAddress, setManualAddress] = useState({
      fullAddress: '',
      houseNumber: '',
      floor: '',
      tower: '',
      landmark: '',
      phoneNumber: '',
      addressType: 'Home' as 'Home' | 'Work' | 'Hotel' | 'Other',
    });

    const {
      savedAddresses, 
      addSavedAddress, 
      fetchSavedAddresses,
      showToast 
    } = useOrder();
    const navigate = useNavigate();

    // Check authentication on mount
    useEffect(() => {
      if (!isAuthenticated()) {
        setShowAuthModal(true);
        setAddressesLoading(false);
      } else {
        loadSavedAddresses();
      }
    }, []);

    const loadSavedAddresses = async () => {
      setAddressesLoading(true);
      try {
        await fetchSavedAddresses();
      } catch (error) {
        console.error('Failed to load saved addresses:', error);
      } finally {
        setAddressesLoading(false);
      }
    };

    const handleAuthSuccess = () => {
      setShowAuthModal(false);
      loadSavedAddresses();
      showToast('Welcome! Please select your delivery address', 'success');
    };

    const handleGetLocation = () => {
      if (!navigator.geolocation) {
        showToast('Geolocation not supported by your browser', 'error');
        return;
      }

      setLocationLoading(true);
      showToast('Detecting your location...', 'info');

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          try {
            const readableAddress = await reverseGeocode(latitude, longitude);
            
            // Pre-fill the search with detected address
            setSearchQuery(readableAddress);
            setSelectedSearchResult({
              display_name: readableAddress,
              lat: latitude,
              lon: longitude,
            });
            setManualAddress(prev => ({
              ...prev,
              fullAddress: readableAddress,
            }));
            
            setLocationLoading(false);
            setShowAddressModal(true);
            showToast('Location detected! Please complete the address details', 'success');
          } catch (error) {
            setLocationLoading(false);
            showToast('Failed to get address details. Please try manual entry.', 'error');
            console.error('Geocoding error:', error);
          }
        },
        (error) => {
          setLocationLoading(false);
          showToast('Location access denied. Please use manual entry.', 'error');
          console.error('Geolocation error:', error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000,
        }
      );
    };

    // Debounced address search
    useEffect(() => {
      if (searchQuery.length < 3) {
        setSearchResults([]);
        return;
      }

      const timer = setTimeout(async () => {
        setSearchLoading(true);
        const results = await searchAddress(searchQuery);
        setSearchResults(results);
        setSearchLoading(false);
      }, 500);

      return () => clearTimeout(timer);
    }, [searchQuery]);

    const handleSearchResultSelect = (result: any) => {
      setSelectedSearchResult(result);
      setSearchQuery(result.display_name);
      setManualAddress(prev => ({
        ...prev,
        fullAddress: result.display_name,
      }));
      setSearchResults([]);
    };

    const handleManualAddressSubmit = () => {
      if (!manualAddress.fullAddress) {
        showToast('Please search and select your address', 'error');
        return;
      }

      if (!manualAddress.houseNumber && !manualAddress.floor && !manualAddress.tower) {
        showToast('Please provide house/flat number, floor, or building name', 'error');
        return;
      }

      if (!manualAddress.phoneNumber) {
        showToast('Please provide a phone number for delivery', 'error');
        return;
      }

      // Build complete address string
      const addressParts = [
        manualAddress.houseNumber && `Flat/House: ${manualAddress.houseNumber}`,
        manualAddress.floor && `Floor: ${manualAddress.floor}`,
        manualAddress.tower && `Building: ${manualAddress.tower}`,
        manualAddress.fullAddress,
        manualAddress.landmark && `Landmark: ${manualAddress.landmark}`,
      ].filter(Boolean);

      const fullAddress = addressParts.join(', ');

      const newAddress = {
        id: `manual_${Date.now()}`,
        type: 'manual' as const,
        label: manualAddress.addressType,
        address: fullAddress,
        phoneNumber: manualAddress.phoneNumber,
        houseNumber: manualAddress.houseNumber,
        floor: manualAddress.floor,
        tower: manualAddress.tower,
        landmark: manualAddress.landmark,
        coordinates: selectedSearchResult ? {
          lat: parseFloat(selectedSearchResult.lat),
          lng: parseFloat(selectedSearchResult.lon),
        } : undefined,
      };

      addSavedAddress(newAddress);
      setSelectedAddress(newAddress.id);
      setShowAddressModal(false);
      
      // Reset form
      setManualAddress({ 
        fullAddress: '',
        houseNumber: '',
        floor: '',
        tower: '',
        landmark: '',
        phoneNumber: '',
        addressType: 'Home',
      });
      setSearchQuery('');
      setSelectedSearchResult(null);
      setSearchResults([]);
      
      showToast('Address saved successfully!', 'success');
    };

    const handleProceed = () => {
      if (!selectedAddress) {
        showToast('Please select a delivery address', 'error');
        return;
      }

      const address = savedAddresses.find(addr => addr.id === selectedAddress);
      if (!address) {
        showToast('Invalid address selected', 'error');
        return;
      }

      navigate('/payment', { state: { selectedAddress: address } });
    };

    // Show auth modal if not authenticated
    if (showAuthModal) {
      return (
        <div className="min-h-screen bg-primary-50 flex items-center justify-center p-4">
          <AuthModal
            isOpen={showAuthModal}
            onClose={() => navigate('/checkout')}
            onSuccess={handleAuthSuccess}
          />
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-primary-50">
        {/* Header */}
        <header className="bg-white border-b border-primary-200">
          <div className="flex items-center justify-between px-4 py-4">
            <Link to="/meal-builder">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <h1 className="text-lg font-semibold text-primary-900">Delivery Address</h1>
            <div className="w-10" />
          </div>
        </header>

        <div className="px-4 py-6 max-w-md mx-auto space-y-6">
          {/* Location Options */}
          <div className="space-y-4">
            <Card className="p-4">
              <Button
                variant="outline"
                fullWidth
                onClick={handleGetLocation}
                loading={locationLoading}
                className="justify-center py-4"
              >
                <Navigation className="w-5 h-5 mr-2" />
                Use My Current Location
              </Button>
              <p className="text-xs text-primary-500 text-center mt-2">
                We'll detect your location automatically
              </p>
            </Card>

            <div className="text-center text-sm text-primary-500">or</div>

            <Card className="p-4">
              <Button
                variant="outline"
                fullWidth
                onClick={() => setShowAddressModal(true)}
                className="justify-center py-4"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Address Manually
              </Button>
            </Card>
          </div>

          {/* Saved Addresses */}
          {addressesLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader className="w-8 h-8 text-orange-600 animate-spin" />
            </div>
          ) : savedAddresses.length > 0 ? (
            <div>
              <h3 className="font-semibold text-primary-900 mb-4">Saved Addresses</h3>
              <div className="space-y-3">
                {savedAddresses.map((address) => (
                  <Card
                    key={address.id}
                    hoverable
                    selected={selectedAddress === address.id}
                    onClick={() => setSelectedAddress(address.id || '')}
                    className="p-4 cursor-pointer"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-5 h-5 text-primary-700" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="px-2 py-0.5 bg-primary-100 text-primary-700 text-xs font-medium rounded">
                            {address.label || address.type}
                          </span>
                        </div>
                        <p className="text-sm text-primary-900 font-medium leading-relaxed">
                          {address.address}
                        </p>
                        {address.phoneNumber && (
                          <p className="text-xs text-primary-500 mt-2">
                            📞 {address.phoneNumber}
                          </p>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ) : null}

          {/* Delivery Instructions */}
          <Card className="p-4">
            <h4 className="font-medium text-primary-900 mb-2">Delivery Instructions</h4>
            <p className="text-sm text-primary-600 mb-3">
              Our delivery partner will call you upon arrival
            </p>
            <div className="bg-blue-50 rounded-lg p-3">
              <p className="text-sm text-blue-800">
                💡 <strong>Tip:</strong> Be available at your phone for smooth delivery
              </p>
            </div>
          </Card>

          {/* Estimated Delivery Time */}
          <Card className="p-4 bg-green-50 border-green-200">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">⏰</span>
              <div>
                <h4 className="font-medium text-green-800">Estimated Delivery</h4>
                <p className="text-sm text-green-700">30-40 minutes after order confirmation</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Manual Address Modal - Amazon Style */}
        <Modal
          isOpen={showAddressModal}
          onClose={() => {
            setShowAddressModal(false);
            setSearchQuery('');
            setSearchResults([]);
            setSelectedSearchResult(null);
          }}
          title="Add Delivery Address"
          size="lg"
        >
          <div className="space-y-5">
            {/* Step 1: Search Address */}
            <div>
              <label className="block text-sm font-semibold text-primary-900 mb-2">
                Search your location
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-primary-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for area, street name, locality..."
                  className="w-full pl-10 pr-3 py-3 border border-primary-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                />
                {searchLoading && (
                  <Loader className="absolute right-3 top-3 w-5 h-5 text-primary-400 animate-spin" />
                )}
              </div>
              
              {/* Search Results Dropdown */}
              {searchResults.length > 0 && (
                <div className="mt-2 border border-primary-200 rounded-lg bg-white shadow-lg max-h-60 overflow-y-auto">
                  {searchResults.map((result, index) => (
                    <div
                      key={index}
                      onClick={() => handleSearchResultSelect(result)}
                      className="p-3 hover:bg-primary-50 cursor-pointer border-b border-primary-100 last:border-b-0"
                    >
                      <div className="flex items-start space-x-2">
                        <MapPin className="w-4 h-4 text-primary-500 mt-1 flex-shrink-0" />
                        <p className="text-sm text-primary-900">{result.display_name}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Step 2: Complete Address Details */}
            {selectedSearchResult && (
              <div className="space-y-4 pt-4 border-t border-primary-200">
                <h4 className="text-sm font-semibold text-primary-900">Complete Address Details</h4>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-primary-700 mb-1">
                      Flat / House No. *
                    </label>
                    <input
                      type="text"
                      value={manualAddress.houseNumber}
                      onChange={(e) => setManualAddress({ ...manualAddress, houseNumber: e.target.value })}
                      placeholder="e.g., 101"
                      className="w-full px-3 py-2 border border-primary-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-primary-700 mb-1">
                      Floor (Optional)
                    </label>
                    <input
                      type="text"
                      value={manualAddress.floor}
                      onChange={(e) => setManualAddress({ ...manualAddress, floor: e.target.value })}
                      placeholder="e.g., 3rd Floor"
                      className="w-full px-3 py-2 border border-primary-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-primary-700 mb-1">
                    Building / Tower Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={manualAddress.tower}
                    onChange={(e) => setManualAddress({ ...manualAddress, tower: e.target.value })}
                    placeholder="e.g., Tower A, Wing B"
                    className="w-full px-3 py-2 border border-primary-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-primary-700 mb-1">
                    Nearby Landmark (Optional)
                  </label>
                  <input
                    type="text"
                    value={manualAddress.landmark}
                    onChange={(e) => setManualAddress({ ...manualAddress, landmark: e.target.value })}
                    placeholder="e.g., Near City Mall"
                    className="w-full px-3 py-2 border border-primary-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-primary-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={manualAddress.phoneNumber}
                    onChange={(e) => setManualAddress({ ...manualAddress, phoneNumber: e.target.value })}
                    placeholder="98765 43210"
                    className="w-full px-3 py-2 border border-primary-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-primary-700 mb-2">
                    Save Address As
                  </label>
                  <div className="flex space-x-2">
                    {(['Home', 'Work', 'Hotel', 'Other'] as const).map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setManualAddress({ ...manualAddress, addressType: type })}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          manualAddress.addressType === type
                            ? 'bg-accent-500 text-white'
                            : 'bg-primary-100 text-primary-700 hover:bg-primary-200'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="flex space-x-3 pt-4">
              <Button
                variant="outline"
                fullWidth
                onClick={() => {
                  setShowAddressModal(false);
                  setSearchQuery('');
                  setSearchResults([]);
                  setSelectedSearchResult(null);
                }}
              >
                Cancel
              </Button>
              <Button
                fullWidth
                onClick={handleManualAddressSubmit}
                disabled={!selectedSearchResult}
              >
                Save & Continue
              </Button>
            </div>
          </div>
        </Modal>

        {/* Proceed Button */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-primary-200 p-4">
          <div className="max-w-md mx-auto">
            <Button
              size="lg"
              fullWidth
              onClick={handleProceed}
              disabled={!selectedAddress}
              className="text-lg py-4"
            >
              Proceed to Payment
            </Button>
          </div>
        </div>
      </div>
    );
  };