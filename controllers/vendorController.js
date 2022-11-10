import asyncHandler from 'express-async-handler'
import Vendor from '../models/vendorModel.js'
import generateToken from '../utils/generateToken.js'
import jwt from 'jsonwebtoken'
import Order from '../models/orderModel.js'
import Product from '../models/productModel.js'
const registerStore = asyncHandler(async (req, res) => {
  let { email, phoneNo } = req.body
  let emailExists = await Vendor.findOne({ email: email })
  if (emailExists) {
    return res.status(500).json({ message: 'Email already in use' })
  }
  let phoneExists = await Vendor.findOne({ phoneNo: phoneNo })
  if (phoneExists) {
    return res.status(500).json({ message: 'PhoneNo already in use' })
  }

  const vendor = await Vendor.create(req.body)
  if (vendor) {
    res.status(201).json({
      _id: vendor._id,
      name: vendor.name,
      email: vendor.email,
      token: generateToken(vendor._id),
    })
  } else {
    res.status(400)
    throw new Error('Invalid user data')
  }
})
const loginStore = asyncHandler(async (req, res) => {
  try {
    let { phoneNo, password } = req.body
    const store = await Vendor.findOne({ phoneNo: phoneNo })
    if (!store) {
      return res.status(500).json('User not found')
    }
    if (await store.matchPassword(password)) {
      // store.password = null
      // let categories = store.categories
      res.json({
        _id: store._id,
        token: generateToken(store._id),
        msg: 'Login Successful',
      })
    } else {
      res.status(500).json({ message: `Password didn't match` })
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ error })
  }
})
const changePassword = asyncHandler(async (req, res) => {
  try {
    let { email } = req.body
    let user = await Vendor.findOne({ email: email })
    if (user && (await user.matchPassword(req.body.password))) {
      user.password = req.body.newPassword
      await user.save()
      return res.status(200).json({ msg: 'Password updated' })
    }
    res.status(500).json({ msg: 'Invalid email or password' })
  } catch (error) {
    res.status(500).json({ msg: 'Internal server error' })
  }
})
// Go Offline
const goOffline = asyncHandler(async (req, res) => {
  try {
    let token = req.headers.authorization.split(' ')[1]
    let storeId = jwt.verify(token, process.env.JWT_SECRET)
    if (!storeId) {
      return res.status(500).json({ msg: 'User not found' })
    }
    let store = await Vendor.findById(storeId.id)
    store.online = false
    await store.save()
    res.status(200).json({ mess: 'Vendor is Offline' })
  } catch (error) {
    res.status(500).json({ msg: 'Internal server error' })
  }
})

// Go Online
const goOnline = asyncHandler(async (req, res) => {
  try {
    let token = req.headers.authorization.split(' ')[1]
    let storeId = jwt.verify(token, process.env.JWT_SECRET)
    if (!storeId) {
      return res.status(500).json({ msg: 'User not found' })
    }
    let store = await Vendor.findById(storeId.id)
    store.online = true
    await store.save()
    res.status(200).json({ mess: 'Vendor is Online' })
  } catch (error) {
    console.log(error)
    res.status(500).json({ msg: 'Internal server error' })
  }
})
const storeWalletAmount = asyncHandler(async (req, res) => {
  try {
    let token = req.headers.authorization.split(' ')[1]
    let storeid = jwt.verify(token, process.env.JWT_SECRET)
    if (!storeid) {
      return res.status(500).json({ msg: 'User not found' })
    }
    res.status(200).json({ amount: '$500' })
  } catch (error) {
    res.status(500).json({ status: 500, msg: err.message })
  }
})

//get vendor orders
const getAllVendorOrders = asyncHandler(async (req, res) => {
  try {
    let token = req.headers.authorization.split(' ')[1]
    let storeId = jwt.verify(token, process.env.JWT_SECRET)
    if (!storeId) {
      return res.status(500).json('Authnetication Failed')
    }
    // const store = await Store.find({ _id: storeId.id.toString() });
    // if (store.isApproved == false) {
    //   return res.status(500).json("Registeration approval pending by admin");
    // }

    const orders = await Order.find({
      vendorId: storeId.id.toString(),
    }).populate([
      // {
      //   path: "userId",
      //   model: "User",
      //   select: "_id name lastname phoneNo",
      // },
      {
        path: 'products.id',
        model: 'Product',
        select: '_id name image',
      },
    ])
    res.status(200).json({ orders })
  } catch (error) {
    console.log(error)
    res.status(500).json({ msg: error })
  }
})

const updateOrderStatus = asyncHandler(async (req, res) => {
  try {
    let token = req.headers.authorization.split(' ')[1]

    let storeId = jwt.verify(token, process.env.JWT_SECRET)
    if (!storeId) {
      return res.status(500).json('Authnetication Failed')
    }
    const { status } = req.body
    const order = await Order.findById(req.params.orderId)
    let mess = ''
    if (status === 'accepted') {
      order.isAccepted = true
      mess = 'Order Accepted'
    } else if (status === 'rejected') {
      order.isRejected = true
      order.isAccepted = false
      mess = 'Order Rejected'
    } else if (status === 'delivered') {
      order.isDelivered = true
      mess = 'Order Delivered'
    }
    await order.save()
    res.status(200).json({
      msg: `${mess}`,
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({ error })
  }
})
const addStock = asyncHandler(async (req, res) => {
  try {
    let token = req.headers.authorization.split(' ')[1]
    let storeId = jwt.verify(token, process.env.JWT_SECRET)
    if (!storeId) {
      return res.status(500).json('Authnetication Failed')
    }
    const { productId, stock } = req.body
    const product = await Product.findOne({ _id: productId })
    if (!product) {
      return res.status(500).json('Product not found')
    }
    if (product.vendorId.toString() !== storeId.id.toString()) {
      return res.status(500).json('Access denied')
    } else {
      product.qty += stock
      await product.save()
      res.status(200).json({ msg: 'Stock Updated', stock: product.qty })
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ error })
  }
})

// Fetch Reviews (Get req)c
const fetchStoreRatings = asyncHandler(async (req, res) => {
  try {
    let token = req.headers.authorization.split(' ')[1]
    let storeId = jwt.verify(token, process.env.JWT_SECRET)
    if (!storeId) {
      return res.json('Authentication Failed')
    }
    // const reviews = await Reviews.find({
    //   vendorId: storeId.id.toString(),
    // }).populate([
    //   {
    //     path: "userId",
    //     model: "User",
    //     select: "_id name",
    //   },
    // ]);
    const store = await Vendor.findById(storeId.id)
    const rating = store.storeRating

    res.status(200).json({ ratings: rating })
  } catch (error) {
    res.status(500).json({ msg: error })
  }
})
export {
  registerStore,
  loginStore,
  changePassword,
  goOffline,
  goOnline,
  storeWalletAmount,
  getAllVendorOrders,
  updateOrderStatus,
  addStock,
  fetchStoreRatings,
}
