const twilio = require('twilio')
const asyncHandler = require('express-async-handler')
// import messagebird from 'messagebird'
var messagebird = require('messagebird')('VDibD3N1mH50FZjaXQ2qrsCvS')
const sendSMS = asyncHandler(async (msg, userPhone) => {
  try {
    const client = new twilio(
      'ACf155fab36c8b6ac0207e8f4804188ef1',
      '9bcc7213b9be81581f8a9029ae3138a9'
    )

    await client.messages.create({
      body: ` ${msg} is you OTP for login verification`,
      from: '+15626205969',
      to: userPhone,
    })
    console.log('SMS sent')
  } catch (error) {
    console.log(error)
  }
})
const sendOTP = (number, otp) => {
  try {
    var params = {
      originator: 'Your Brand',
      recipients: [`+919110061379`],
      body: `OTP for login verification is ${otp}`,
    }

    messagebird.messages.create(params, function (err, response) {
      if (err) {
        return console.log(err)
      }
      console.log(response)
    })
  } catch (error) {
    console.log(error)
  }
}

const verifySMS = (msg, number) => {
  var params = {
    originator: 'Your Brand',
    recipients: [`+91${number}`],
    body: msg,
  }

  messagebird.messages.create(params, function (err, response) {
    if (err) {
      return console.log(err)
    }
  })
}

module.exports = { sendSMS, sendOTP, verifySMS }
