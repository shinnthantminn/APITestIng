const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

module.exports = {
  fMsg: (res, msg = '', result = []) => {
    res.status(200).json({
      con: true,
      msg,
      result,
    })
  },
  encode: async (payload) => await bcrypt.hashSync(payload, 10),
  compare: (plane, hash) => bcrypt.compareSync(plane, hash),
  token: (payload) =>
    jwt.sign(payload, 453493851, {
      expiresIn: '1h',
    }),
  decode: (payload) => jwt.decode(payload, 453493851),
}
