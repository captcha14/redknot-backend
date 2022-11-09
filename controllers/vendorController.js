import asyncHandler from 'express-async-handler'
import Vendor from '../models/vendorModel.js'
import generateToken from '../utils/generateToken.js'
import jwt from 'jsonwebtoken'
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
    let { email, password } = req.body
    const store = await Vendor.findOne({ email: email })
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
    // let token = req.headers.authorization.split(' ')[1]
    // let storeid = jwt.verify(token, process.env.JWT_SECRET)
    // if (!storeid) {
    //   return res.status(500).json({ msg: 'User not found' })
    // }
    res.status(200).json({ amount: '$500' })
  } catch (error) {
    res.status(500).json({ status: 500, msg: err.message })
  }
})
export {
  registerStore,
  loginStore,
  changePassword,
  goOffline,
  goOnline,
  storeWalletAmount,
}
