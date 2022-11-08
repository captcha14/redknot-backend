require('dotenv').config()
const twilio = require('twilio')
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_ACCOUNT_TOKEN
)
//create verification service
// const createService = async (req, res) => {
//   client.verify.services
//     .create({ friendlyName: 'phoneVerification' })
//     .then((service) => console.log(service.sid))
// }

// createService()
//after createService function creation

//send verification code token
const sendVerification = async (number) => {
  client.verify
    .services(process.env.TWILIO_VERIFICATION_SID)
    .verifications.create({ to: `${number}`, channel: 'sms' })
    .then((verification) => {
      return verification.status
    })
}
//check verification token
const checkVerification = async (number, code) => {
  return new Promise((resolve, reject) => {
    client.verify
      .services(process.env.TWILIO_VERIFICATION_SID)
      .verificationChecks.create({ to: `${number}`, code: `${code}` })
      .then((verification_check) => {
        resolve(verification_check.status)
      })
  })
}

module.exports = {
  sendVerification,
  checkVerification,
}
