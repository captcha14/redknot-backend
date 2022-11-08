import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
const Address = mongoose.Schema({
  streetName: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pinCode: { type: String, required: true },
})
const vendorSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },

    storeName: {
      type: String,
      required: true,
    },
    phoneNo: {
      type: String,
      required: true,
    },
    otp: { type: String, default: '' },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    address: {
      type: Address,
      required: true,
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    online: {
      type: Boolean,
      default: true,
    },
    licenseNo: {
      type: Number,
      required: true,
    },
    storeImage: { type: String, required: true },
    storeCategory: { type: String, required: true },
    gst: { type: String, minlength: 15, unique: true, required: false },
    pan: { type: String, required: true, unique: true, minlength: 10 },
    bankName: { type: String, required: true },
    accountHolder: { type: String, required: true },
    accountNo: { type: Number, required: true },
    ifsc: { type: String, required: true },
    storeRating: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
)
vendorSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password)
}
vendorSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next()
  }
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})
const Vendor = mongoose.model('Vendor', vendorSchema)

export default Vendor
