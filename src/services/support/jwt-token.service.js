const jwt = require('jsonwebtoken')

export default {
  generateAuthToken: _id => {
    return jwt.sign({ _id }, process.env.JWT_KEY)
  }
}
