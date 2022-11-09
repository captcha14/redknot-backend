import asyncHandler from 'express-async-handler'
import Vendor from '../models/vendorModel.js'
import Product from '../models/productModel.js'
import generateToken from '../utils/generateToken.js'
import jwt from 'jsonwebtoken'
import Order from '../models/orderModel.js'

const placeOrder = asyncHandler(async (req, res) => {
  try {
    let token = req.headers.authorization.split(' ')[1]
    let vendorId = jwt.verify(token, process.env.JWT_SECRET)
    // let user = await User.findById(userId.id)
    // if (!user) {
    //   return res.status(500).json({ mess: 'User not Found' })
    // }
    // let cart = await Cart.findOne({
    //   userId: userId.id,
    //   status: 'shopping',
    // })
    // let vendor = await Store.findById(cart.vendorId.toString())
    // let subTotal = 0
    // let totalGST = 0
    // cart.products.forEach((ele) => {
    //   subTotal += ele.price
    //   totalGST += ele.gst
    // })

    // let orderaddress = await Address.findOne({ _id: req.body.addressId })
    // const couponCode = req.body.couponCode || null

    // const admin = await Admin.findById(process.env.ADMIN_ID)
    // let distFee = 0
    // let baseFare = admin.baseFare
    // // will modify this to let admin decide base Distance
    // if (req.body.distance > 10) {
    //   let remainingDistance = req.body.distance - 10
    //   distFee = remainingDistance * admin.distanceFee //distance Fee per km
    // }
    // // let serves = (subTotal / 100) * admin.serviceFee;
    // let cashRedeemed = (subTotal / 100) * vendor.cashback

    // if (couponCode) {
    //   let code = await Coupons.findOne({
    //     couponCode: req.body.couponCode.toString(),
    //   })
    //   const result = vendor.myCoupons.filter((ele) => {
    //     return ele.couponId.toString() == code._id.toString()
    //   })
    //   if (result && code) {
    //     const expiry = new Date(code.expiryDuration)
    //     const currDate = new Date(Date.now())
    //     if (expiry - currDate > 0) {
    //       if (code.isPercent) {
    //         const amount = subTotal
    //         const discount = (amount / 100) * code.amountOff
    //         subTotal = amount - discount
    //       } else {
    //         const amount = subTotal
    //         if (amount < code.amountOff) {
    //           return res.status(500).json('Coupon Not Applicable')
    //         }
    //         subTotal = amount - code.amountOff
    //       }
    //     } else {
    //       return res.status(500).json({ mess: 'Invalid Coupon Code' })
    //     }
    //   } else {
    //     return res.status(500).json({ mess: 'Invalid Coupon Code' })
    //   }
    // }
    // var Total =
    //   subTotal + totalGST + distFee + vendor.packagingCharge + admin.baseFare
    // let cashRemaining = req.body.cashbackUsed
    // if (cashRemaining > parseInt(Total)) {
    //   const mess = 'Cashback Used is greater than total amount Order declined'
    //   return res.status(500).json({ mess })
    // } else {
    //   const checkDate = new Date(Date.now())
    //   for (let i = 0; i < user.cashback.length; i++) {
    //     const expiry = new Date(user.cashback[i].expiryDate)
    //     if (expiry - checkDate > 0) {
    //       if (user.cashback[i].amount > cashRemaining) {
    //         user.cashback[i].amount = user.cashback[i].amount - cashRemaining
    //         Total = Total - cashRemaining
    //         user.cashbackAvailable = user.cashbackAvailable - cashRemaining
    //         cashRemaining = 0
    //       } else {
    //         cashRemaining = cashRemaining - user.cashback[i].amount
    //         Total = Total - user.cashback[i].amount
    //         user.cashbackAvailable =
    //           user.cashbackAvailable - user.cashback[i].amount
    //         user.cashback[i].amount = 0
    //       }
    //     } else {
    //       user.cashbackAvailable =
    //         user.cashbackAvailable - user.cashback[i].amount
    //       user.cashback[i].amount = 0
    //     }
    //   }
    // }
    // // // ******************************
    // user.cashbackAvailable += cashRedeemed
    // const today1 = new Date(Date.now())
    // today1.setDate(today1.getDate() + 30)

    // let cash = {
    //   expiryDate: today1,
    //   amount: cashRedeemed,
    // }
    // const result = user.cashback.filter((ele) => ele.amount != 0)
    // user.cashback = [...result, cash]
    // // // ******************************

    // await user.save()
    // let deliveryOption = req.body.deliveryOption || 'Home Delivery'
    // let DeliverySlot = {
    //   deliveryTime: req.body.deliverySlot,
    //   now: req.body.now,
    // }
    // if (!req.body.now) {
    //   Total = Total - admin.deliverLaterDiscount
    // }
    // if (deliveryOption == 'Takeway') {
    //   Total = Total - distFee - baseFare
    //   distFee = 0
    //   baseFare = 0
    // }

    let obj = {
      userId: '60f1b0b0b0b0b0b0b0b0b0b0',
      vendorId: vendorId.id,
      products: req.body.products,
      //   Total: parseInt(Total),
      //   GST: totalGST,
      subTotal: req.body.subTotal,
      deliveryAddress: req.body.deliveryAddress,
    }
    const newOrder = await Order.create(obj)
    // cart.status = 'Order Placed'
    // await cart.save()
    res.status(200).json({ mess: 'Order Placed Successfully' })
  } catch (error) {
    console.log(error)
    res.status(500).json({ error })
  }
})

export default placeOrder
