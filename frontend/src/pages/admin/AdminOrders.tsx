// src/pages/admin/AdminOrders.tsx - FIXED VERSION
import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Button } from "../../components/Button";
import { Card } from "../../components/Card";

// API Base URL
const API_BASE_URL = import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:6363/api';

interface Order {
  _id: string;
  userId: string;
  menuId: string;
  mealType?: string;
  selectedSabjis?: Array<{ name: string; imageUrl: string; isSpecial: boolean }>;
  sabjisSelected?: string[]; // Legacy support
  baseOption?: string;
  base?: string; // Legacy support
  extraRoti: number;
  quantity: number;
  deliveryAddress?: {
    label?: string;
    address: string;
    lat?: number;
    lng?: number;
    phoneNumber?: string;
    hostel?: string;
    room?: string;
  };
  address?: { // Legacy support
    name?: string;
    label?: string;
    address: string;
    lat?: number;
    lng?: number;
  };
  userInfo?: {
    name?: string;
    phone?: string;
  };
  pricing?: {
    total: number;
    basePrice: number;
    specialSabjiPrice: number;
    extraRotiPrice: number;
  };
  totalPrice?: number; // Legacy support
  tipMoney?: number;
  isSpecial?: boolean;
  otp: string;
  status: "pending" | "paid" | "preparing" | "on-the-way" | "delivered" | "cancelled";
  createdAt: string;
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalOrders: number;
  ordersPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface ApiResponse {
  orders: Order[];
  pagination: PaginationInfo;
}

type StatusFilter = "all" | "pending" | "on-the-way" | "delivered";

export const AdminOrders: React.FC = () => {
  const { status = "all" } = useParams<{ status: StatusFilter }>();
  const navigate = useNavigate();

  const [orders, setOrders] = useState<Order[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [otpInputs, setOtpInputs] = useState<{ [key: string]: string }>({});
  const [error, setError] = useState<string | null>(null);
  const [statusCounts, setStatusCounts] = useState({
    all: 0,
    pending: 0,
    onTheWay: 0,
    delivered: 0,
  });

  // Fetch orders
  const fetchOrders = async (page: number = 1, append: boolean = false) => {
    try {
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
        setOrders([]);
      }
      setError(null);

      const params = new URLSearchParams({
        page: page.toString(),
        status: status || "all",
        ...(searchTerm && { search: searchTerm }),
      });

      const response = await fetch(`${API_BASE_URL}/admin/orders?${params}`, {
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }

      const data: ApiResponse = await response.json();

      if (append) {
        setOrders((prev) => [...prev, ...data.orders]);
      } else {
        setOrders(data.orders);
      }

      setPagination(data.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch orders");
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Fetch order stats
  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/orders/stats`, {
        credentials: 'include'
      });
      if (response.ok) {
        const stats = await response.json();
        setStatusCounts({
          all: stats.total,
          pending: stats.pending,
          onTheWay: stats.onTheWay,
          delivered: stats.delivered,
        });
      }
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  useEffect(() => {
    fetchOrders(1, false);
    fetchStats();
  }, [status, searchTerm]);

  const handleStatusChange = (newStatus: StatusFilter) => {
    navigate(`/admin/orders/${newStatus}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchTerm(searchInput.trim());
  };

  const handleLoadMore = () => {
    if (pagination?.hasNextPage) {
      fetchOrders(pagination.currentPage + 1, true);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: "on-the-way") => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update order status");
      }

      fetchOrders(1, false);
      fetchStats();
      showToast("Order status updated!", "success");
    } catch (err) {
      showToast("Failed to update status", "error");
      console.error("Error updating status:", err);
    }
  };

  const handleMarkDelivered = async (orderId: string) => {
    const enteredOtp = otpInputs[orderId];

    if (!enteredOtp || enteredOtp.trim() === "") {
      showToast("Please enter OTP", "error");
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/admin/orders/${orderId}/verify-delivery`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: 'include',
          body: JSON.stringify({ otp: enteredOtp.trim() }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        showToast(data.message || "Failed to verify OTP", "error");
        return;
      }

      setOtpInputs((prev) => ({ ...prev, [orderId]: "" }));
      fetchOrders(1, false);
      fetchStats();
      showToast("Order marked as delivered!", "success");
    } catch (err) {
      showToast("Failed to mark as delivered", "error");
      console.error("Error marking delivered:", err);
    }
  };

  const handleOtpChange = (orderId: string, value: string) => {
    setOtpInputs((prev) => ({ ...prev, [orderId]: value }));
  };

  const showToast = (message: string, type: "success" | "error") => {
    alert(`${type.toUpperCase()}: ${message}`);
  };

  const getStatusColor = (orderStatus: string) => {
    switch (orderStatus) {
      case "pending":
      case "paid":
        return "text-orange-600 bg-orange-100";
      case "preparing":
        return "text-yellow-600 bg-yellow-100";
      case "on-the-way":
        return "text-blue-600 bg-blue-100";
      case "delivered":
        return "text-green-600 bg-green-100";
      default:
        return "text-primary-600 bg-primary-100";
    }
  };

  const getStatusText = (orderStatus: string) => {
    switch (orderStatus) {
      case "pending":
      case "paid":
        return "Preparing";
      case "preparing":
        return "Preparing";
      case "on-the-way":
        return "On the way";
      case "delivered":
        return "Delivered";
      default:
        return orderStatus;
    }
  };

  const getBaseText = (order: Order) => {
    const base = order.baseOption || order.base || '';
    if (base.includes('5 Roti') || base === 'roti') return 'Roti Only';
    if (base.includes('3 Roti') || base === 'roti+rice') return 'Roti + Rice';
    if (base.toLowerCase().includes('rice')) return 'Rice Bowl';
    return base;
  };

  const getSabjisText = (order: Order) => {
    if (order.selectedSabjis && order.selectedSabjis.length > 0) {
      return order.selectedSabjis.map(s => s.name).join(', ');
    }
    if (order.sabjisSelected && order.sabjisSelected.length > 0) {
      return order.sabjisSelected.join(', ');
    }
    return 'N/A';
  };

  const getOrderTotal = (order: Order) => {
    return order.pricing?.total || order.totalPrice || 0;
  };

  const getAddress = (order: Order) => {
    return order.deliveryAddress || order.address || null;
  };

  const getUserPhone = (order: Order) => {
    return order.deliveryAddress?.phoneNumber || order.userInfo?.phone || 'N/A';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50/20">
      {/* Header */}
      <header className="glass border-b border-primary-200/50 shadow-sm">
        <div className="flex items-center justify-between px-4 py-4">
          <Link to="/admin">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-lg md:text-xl font-bold text-primary-900">
            Order Management
          </h1>
          <div className="w-10" />
        </div>
      </header>

      <div className="px-4 py-6 max-w-4xl mx-auto space-y-6">
        {/* Search and Filter */}
        <Card className="p-4">
          <form onSubmit={handleSearch} className="mb-4">
            <div className="flex space-x-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search by Order ID..."
                  className="w-full pl-10 pr-4 py-2 border border-primary-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                />
              </div>
              <Button type="submit" size="sm">
                Search
              </Button>
              {searchTerm && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchInput("");
                    setSearchTerm("");
                  }}
                >
                  Clear
                </Button>
              )}
            </div>
          </form>

          {/* Status Tabs */}
          <div className="flex space-x-2 overflow-x-auto">
            {[
              { key: "all", label: "All", count: statusCounts.all },
              { key: "pending", label: "Preparing", count: statusCounts.pending },
              { key: "on-the-way", label: "On the way", count: statusCounts.onTheWay },
              { key: "delivered", label: "Delivered", count: statusCounts.delivered },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => handleStatusChange(tab.key as StatusFilter)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  status === tab.key
                    ? "bg-orange-50 text-orange-600 shadow-xs"
                    : "text-primary-600 hover:text-primary-900 hover:bg-primary-50"
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
        </Card>

        {/* Error State */}
        {error && (
          <Card className="p-4 bg-red-50 border-red-200">
            <div className="flex items-center space-x-2 text-red-600">
              <AlertCircle className="w-5 h-5" />
              <p>{error}</p>
            </div>
          </Card>
        )}

        {/* Loading State */}
        {loading && (
          <Card className="p-8 text-center">
            <Loader2 className="w-8 h-8 text-primary-600 animate-spin mx-auto mb-4" />
            <p className="text-primary-600">Loading orders...</p>
          </Card>
        )}

        {/* Orders List */}
        {!loading && (
          <div className="space-y-4">
            {orders.length === 0 ? (
              <Card className="p-8 text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-primary-900 mb-2">
                  No orders found
                </h3>
                <p className="text-primary-600">
                  {searchTerm
                    ? "No orders match your search criteria"
                    : `No ${status === "all" ? "" : status} orders found`}
                </p>
              </Card>
            ) : (
              <>
                {orders.map((order) => {
                  const address = getAddress(order);
                  const phone = getUserPhone(order);
                  
                  return (
                    <Card
                      key={order._id}
                      className="p-5 border border-gray-200 shadow-sm hover:shadow-md transition"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="text-lg font-bold text-primary-900">
                            #{order._id.slice(-8).toUpperCase()}
                          </h3>
                          <p className="text-xs text-gray-500">
                            {new Date(order.createdAt).toLocaleString('en-IN')}
                          </p>
                          {order.mealType && (
                            <p className="text-xs text-orange-600 font-medium mt-1 capitalize">
                              {order.mealType} Order
                            </p>
                          )}
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {getStatusText(order.status)}
                        </span>
                      </div>

                      {/* Order Summary */}
                      <div className="bg-orange-50/40 rounded-lg p-3 mb-3">
                        <p className="text-sm text-primary-800 mb-1">
                          <strong>Dishes:</strong> {getSabjisText(order)}
                        </p>
                        <p className="text-sm text-primary-800 mb-1">
                          <strong>Base:</strong> {getBaseText(order)}
                        </p>
                        {order.extraRoti > 0 && (
                          <p className="text-sm text-primary-800 mb-1">
                            <strong>Extra Roti:</strong> {order.extraRoti}
                          </p>
                        )}
                        <p className="text-sm text-primary-800 mb-1">
                          <strong>Quantity:</strong> {order.quantity} Thali(s)
                        </p>
                        <p className="text-sm text-primary-800">
                          <strong>Total:</strong> ₹{getOrderTotal(order)}
                          {order.tipMoney && order.tipMoney > 0 && (
                            <span className="text-green-700 font-medium ml-1">
                              (+₹{order.tipMoney} Tip)
                            </span>
                          )}
                        </p>
                      </div>

                      {/* Address */}
                      {address && (
                        <div className="bg-gray-50 border rounded-lg p-3 mb-3">
                          <p className="text-sm font-semibold text-gray-700 mb-1">
                            📍 {address.label || 'Delivery Address'}
                          </p>
                          <p className="text-sm text-gray-600 leading-snug">
                            {address.address}
                          </p>
                        </div>
                      )}

                      {/* Contact Info */}
                      {phone && phone !== 'N/A' && (
                        <div className="bg-green-50 border rounded-lg p-3 mb-3 flex items-center justify-between">
                          <div>
                            <p className="text-sm font-semibold text-gray-700">
                              👤 Customer
                            </p>
                            <p className="text-sm text-gray-600">{phone}</p>
                          </div>
                          <a
                            href={`tel:${phone}`}
                            className="bg-green-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition"
                          >
                            Call
                          </a>
                        </div>
                      )}

                      {/* Actions */}
                      {order.status !== "delivered" && order.status !== "cancelled" && (
                        <div className="flex flex-col gap-3">
                          <div>
                            <label className="block text-sm font-medium text-primary-700 mb-1">
                              Enter Delivery OTP:
                            </label>
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={otpInputs[order._id] || ""}
                                onChange={(e) =>
                                  handleOtpChange(order._id, e.target.value)
                                }
                                placeholder="4-digit OTP"
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-center font-mono text-lg focus:ring-2 focus:ring-orange-500 outline-none"
                                maxLength={6}
                              />
                              <Button
                                size="sm"
                                onClick={() => handleMarkDelivered(order._id)}
                                disabled={!otpInputs[order._id]}
                                className="bg-zinc-700 hover:bg-zinc-800 text-white"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>

                          {(order.status === "pending" || order.status === "paid") && (
                            <Button
                              size="sm"
                              fullWidth
                              onClick={() =>
                                updateOrderStatus(order._id, "on-the-way")
                              }
                              variant="primary"
                              className="border-blue-500 text-blue-600 hover:bg-blue-50"
                            >
                              Mark as On the Way
                            </Button>
                          )}
                        </div>
                      )}
                    </Card>
                  );
                })}

                {/* Load More Button */}
                {pagination?.hasNextPage && (
                  <Card className="p-4">
                    <Button
                      fullWidth
                      variant="outline"
                      onClick={handleLoadMore}
                      disabled={loadingMore}
                    >
                      {loadingMore ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Loading...
                        </>
                      ) : (
                        <>Load More Orders</>
                      )}
                    </Button>
                    <p className="text-center text-sm text-primary-600 mt-2">
                      Showing {orders.length} of {pagination.totalOrders} orders
                    </p>
                  </Card>
                )}

                {/* End of results */}
                {!pagination?.hasNextPage && orders.length > 0 && (
                  <Card className="p-4 text-center">
                    <p className="text-sm text-primary-600">
                      You've reached the end • Total: {pagination?.totalOrders} orders
                    </p>
                  </Card>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};