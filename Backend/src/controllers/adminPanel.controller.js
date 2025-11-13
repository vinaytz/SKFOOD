const menuModel = require("../model/menu.model")
const historyMenuModel = require("../model/historyMenu.model")
const ordersModel = require("../model/oder.model")
const myservices = require("../services/imageStorage.service")
const {v4:uuid} = require("uuid")
const orderModel = require("../model/oder.model") 

async function menuHistoryLog(req, res){
    try{
        const allMenu = await historyMenuModel.find().sort({ createdAt: -1 }).limit(5);
        res.json(allMenu)
    }
    catch(error){
        res.json({"message": `something went wrong ${error}`})
    }
}

async function imageUpload(req,res){
    try{
        console.log("start...")
        const uploading = await myservices.imageFileUpload(req.file.buffer, uuid())
        res.json(uploading.thumbnailUrl)
    }
    catch(error){
        res.json({"meesage": `Something Went Wrong: ${error}`})
    }
}

async function createMenu(req, res){
    //from menuHistoryLog

    try{
        const {mealType, basePrice, listOfSabjis, isNewMeal} = req.body
        const creatingMenu =await menuModel.updateOne(
            {mealType},
            {$set: {
                listOfSabjis,
                basePrice
            }},
            {upsert:true}
        )
        if (isNewMeal) {
            await historyMenuModel.create({
                mealType,
                listOfSabjis,
                basePrice,
            })
        }

        res.json(creatingMenu)

        
    }catch(error){
        res.status(500).json({message: `Something went Wrong: ${error}`})
    }
}

// ✅ Get Orders for Admin (ONLY PAID ORDERS)
async function allOrders(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const { status = 'all', search = '' } = req.query;
    const limit = 10;
    const skip = (page - 1) * limit;

    // Base query: by default exclude DB-status 'pending'
    let query = { status: { $ne: 'pending' } };

    // Interpret the incoming `status` query param:
    // - 'all'  => leave base query (all except DB 'pending')
    // - 'pending' => you actually want DB 'paid' (mapping because of your variable choice)
    // - any other valid value => filter exactly that status
    if (status && status !== 'all') {
      if (status === 'pending') {
        // NOTE: your weird requirement — 'status=pending' should return DB status 'paid'
        query.status = 'paid';
      } else {
        query.status = status;
      }
    }

    // Search by order ID (keeps regex approach; works if client sends partial/full ObjectId string)
    if (search) {
      query._id = { $regex: search, $options: 'i' };
    }

    const [orders, totalOrders] = await Promise.all([
      orderModel
        .find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('userId', 'name phone email')
        .lean(),
      orderModel.countDocuments(query),
    ]);

    const formattedOrders = orders.map(order => ({
      ...order,
      userInfo: {
        name: order.userId?.name || 'Unknown',
        phone: order.userId?.phone || order.deliveryAddress?.phoneNumber || 'N/A',
        email: order.userId?.email || 'N/A',
      }
    }));

    const pagination = {
      currentPage: page,
      totalPages: Math.ceil(totalOrders / limit),
      totalOrders,
      ordersPerPage: limit,
      hasNextPage: skip + limit < totalOrders,
      hasPrevPage: page > 1,
    };

    return res.json({ success: true, orders: formattedOrders, pagination });

  } catch (error) {
    console.error('Admin orders fetch error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch orders'
    });
  }
}


async function confirmedOrders(req, res){
    try {
        const allConfirmedOrders = await orderModel.find({ status: "Confirmed" });
        res.json(allConfirmedOrders)
    } catch (error) {
    res.json({'message': `Something went worng ${error}`})
    }
}

async function orderwithId(req, res){
    try {
        const { id } = req.params;
        const order = await orderModel.findOne({_id:id})
        res.json(order)
    } catch (error) {
    res.json({'message': `Somwthing went worng ${error}`})
    }
}

// GET ALL ORDERS WITH FILTERS, SEARCH & PAGINATION
async function allOrders(req, res) {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const status = req.query.status?.toLowerCase(); // 'all', 'pending', 'on-the-way', 'delivered'
    const search = req.query.search?.trim();
    const limit = 10;
    const skip = (page - 1) * limit;

    // Build filter query
    const filter = {};
    
    // Status filter
    if (status && status !== 'all') {
      if (!['pending', 'on-the-way', 'delivered'].includes(status)) {
        return res.status(400).json({ 
          message: 'Invalid status. Use: pending, on-the-way, or delivered' 
        });
      }
      filter.status = status;
    }

    // Search filter by orderNumber
    if (search) {
      const searchNumber = parseInt(search);
      
      if (!isNaN(searchNumber)) {
        // Search by orderNumber (FAST!)
        filter.orderNumber = searchNumber;
      } else if (/^[0-9a-fA-F]{24}$/.test(search)) {
        // Fallback: search by ObjectId
        filter._id = search;
      } else {
        // Invalid search - return empty results
        return res.json({
          success: true,
          orders: [],
          pagination: {
            currentPage: page,
            totalPages: 0,
            totalOrders: 0,
            ordersPerPage: limit,
            hasNextPage: false,
            hasPrevPage: false
          }
        });
      }
    }

    // Execute queries in parallel for better performance
    const [orders, totalOrders] = await Promise.all([
      ordersModel.find(filter)
        .populate("userId", "name phone email") // Only fetch needed fields
        .populate("menuId", "name price") // Only fetch needed fields
        .select("-__v") // Exclude version key
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }) // Newest first
        .lean(), // Return plain JS objects (faster)
      ordersModel.countDocuments(filter)
    ]);

    const totalPages = Math.ceil(totalOrders / limit);

    res.json({
      success: true,
      orders,
      pagination: {
        currentPage: page,
        totalPages,
        totalOrders,
        ordersPerPage: limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });

  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch orders',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

// 2. UPDATE ORDER STATUS
async function updateOrderStatus(req, res) {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        // Validate status
        const validStatuses = ['pending', 'on-the-way', 'delivered'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ 
                message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` 
            });
        }

        // Find and update order
        const order = await ordersModel.findById(orderId);
        
        if (!order) {
            return res.status(404).json({ 
                message: 'Order not found' 
            });
        }

        // Update status
        order.status = status;
        await order.save();

        res.json({
            message: 'Order status updated successfully',
            order
        });
    } catch (error) {
        res.status(500).json({ 
            message: `Something went wrong: ${error.message}` 
        });
    }
}

// 3. VERIFY OTP AND MARK AS DELIVERED
async function verifyDeliveryOtp(req, res) {
    try {
        const { orderId } = req.params;
        const { otp } = req.body;

        // Validate OTP input
        if (!otp || otp.trim() === '') {
            return res.status(400).json({ 
                message: 'OTP is required' 
            });
        }

        // Find order
        const order = await ordersModel.findById(orderId);
        
        if (!order) {
            return res.status(404).json({ 
                message: 'Order not found' 
            });
        }

        // Check if already delivered
        if (order.status === 'delivered') {
            return res.status(400).json({ 
                message: 'Order is already delivered' 
            });
        }

        // Verify OTP
        if (order.otp !== otp.trim()) {
            return res.status(400).json({ 
                message: 'Incorrect OTP' 
            });
        }

        // Mark as delivered
        order.status = 'delivered';
        order.deliveredAt = new Date(); // Optional: track delivery time
        await order.save();

        res.json({
            message: 'Order marked as delivered successfully',
            order
        });
    } catch (error) {
        res.status(500).json({ 
            message: `Something went wrong: ${error.message}` 
        });
    }
}

// 4. GET ORDER COUNTS BY STATUS (for dashboard stats)
async function getOrderStats(req, res) {
    try {
        const [pending, onTheWay, delivered, total] = await Promise.all([
            ordersModel.countDocuments({ status: 'pending' }),
            ordersModel.countDocuments({ status: 'on-the-way' }),
            ordersModel.countDocuments({ status: 'delivered' }),
            ordersModel.countDocuments()
        ]);

        res.json({
            pending,
            onTheWay,
            delivered,
            total
        });
    } catch (error) {
        res.status(500).json({ 
            message: `Something went wrong: ${error.message}` 
        });
    }
}

module.exports = {
    createMenu,
    menuHistoryLog, 
    imageUpload,
    allOrders, 
    confirmedOrders, 
    orderwithId,
    
    getOrderStats,
    updateOrderStatus,
    verifyDeliveryOtp
    }