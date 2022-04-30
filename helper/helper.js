const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const redis = require('async-redis').createClient({
  url:
    'rediss://red-c9meke75f997mglh6fjg:DtYOTVHRbiHllsqGj1Rijn2JpGtRFTqU@singapore-redis.render.com:6379',
})

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
    jwt.sign(payload, '453493851', {
      expiresIn: '1h',
    }),
  decode: (payload) => jwt.decode(payload, '453493851'),
  set: (key, value) => redis.set(key.toString(), JSON.stringify(value)),
  get: (key) => redis.get(key.toString()),
  del: (key) => redis.del(key.toString()),
}
