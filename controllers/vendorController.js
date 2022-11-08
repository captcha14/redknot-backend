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
export { registerStore }
