import asyncHandler from 'express-async-handler'
import Vendor from '../models/vendorModel.js'
import Product from '../models/productModel.js'
import generateToken from '../utils/generateToken.js'
import jwt from 'jsonwebtoken'
//add Product
const addProduct = asyncHandler(async (req, res) => {
  try {
    let token = req.headers.authorization.split(' ')[1]
    let storeId = jwt.verify(token, process.env.JWT_SECRET)
    if (!storeId) {
      return res.status(500).json({ msg: 'Authentication Failed' })
    }
    // Add here to look for category and then use the gst inside that to the product controller
    // let category = await Category.findOne({
    //   subcategory: req.body.subcategory,
    // })
    let obj = {
      name: req.body.name,
      image: req.body.image,
      category: req.body.category,
      subCategory: req.body.subCategory,
      veg: req.body.veg || true,
      qty: req.body.qty,
      price: req.body.price,
      gst: req.body.gst,
      description: req.body.description,
      vendorId: storeId.id,
      unit: req.body.unit,
      inStock: req.body.inStock,
    }
    // send price,qty,discount,unit,inStock as objects in variable array.
    let product = await Product.create(obj)
    res.status(200).json({ msg: 'Product Added Successfully' })
  } catch (err) {
    res.json({ status: 500, msg: err })
  }
})

//get all products
const getProducts = asyncHandler(async (req, res) => {
  try {
    let token = req.headers.authorization.split(' ')[1]
    let storeId = jwt.verify(token, process.env.JWT_SECRET)
    if (!storeId) {
      return res.status(500).json({ msg: 'Authentication Failed' })
    }
    // let store = await Store.findById(storeId.id);
    // let mycategory = await Category.find({
    //   parent: "null",
    //   subcategory: store.categories,
    // });
    if (req.params.category === 'all') {
      let products = await Product.find({
        vendorId: storeId.id,
      })
      res.status(200).json({ products })
    } else {
      let products = await Product.find({
        vendorId: storeId.id,
        category: req.params.category,
      })
      res.status(200).json({ products })
    }
  } catch (err) {
    res.json({ status: 500, msg: err })
  }
})

//update product
const updateProduct = asyncHandler(async (req, res) => {
  try {
    let token = req.headers.authorization.split(' ')[1]
    let storeId = jwt.verify(token, process.env.JWT_SECRET)
    if (!storeId) {
      return res.status(500).json({ msg: 'Authentication Failed' })
    }
    // const store = await Store.find({ _id: storeId.id.toString() });
    // if (store.isApproved == false) {
    //   return res.status(500).json("Registeration approval pending by admin");
    // }
    let exists = await Product.findById(req.params.id)
    if (exists) {
      exists.name = req.body.name || exists.name
      exists.image = req.body.image || exists.image
      exists.category = req.body.category || exists.category
      exists.subCategory = req.body.subCategory || exists.subCategory

      exists.veg = req.body.veg || exists.veg
      exists.qty = req.body.qty || exists.qty
      exists.price = req.body.price || exists.price
      exists.gst = req.body.gst || exists.gst
      exists.description = req.body.description || exists.description
      exists.unit = req.body.unit || exists.unit
      exists.inStock = req.body.inStock || exists.inStock

      await exists.save()
      res.status(200).json({ msg: 'Product Updated Successfully' })
    } else {
      res.status(404).json({ status: 404, msg: 'Product not found' })
    }
  } catch (err) {
    res.json({ status: 500, msg: err.message })
  }
})

//delete product
const deleteProduct = asyncHandler(async (req, res) => {
  try {
    let token = req.headers.authorization.split(' ')[1]
    let storeId = jwt.verify(token, process.env.JWT_SECRET)
    if (!storeId) {
      return res.status(500).json({ msg: 'Authentication Failed' })
    }
    await Product.deleteOne({ _id: req.params.productId })
    return res.status(200).json({ msg: 'Product Deleted' })
  } catch (error) {
    res.status(400).json({ error })
  }
})

export { addProduct, getProducts, updateProduct, deleteProduct }
