const fs = require('fs')
const helper = require('../helper/helper')
const userDB = require('../models/admin')
const permitDB = require('../models/permit')
const roleDB = require('../models/role')

const checkAndPushUp = async (db, item, name) => {
  const data = JSON.parse(item)
  for (const x of data) {
    const obj = {}
    obj[name] = x[name]
    const result = await db.findOne(obj)
    if (result === null) {
      if (x.password) {
        x.password = await helper.encode(x.password)
        await new db(x).save()
      } else await new db(x).save()
    }
  }
}

module.exports = {
  migration: async () => {
    const permitData = await fs.readFileSync('./migration/data/permit.json')
    const roleData = await fs.readFileSync('./migration/data/role.json')
    const userData = await fs.readFileSync('./migration/data/user.json')
    await checkAndPushUp(permitDB, permitData, 'name')
    await checkAndPushUp(roleDB, roleData, 'name')
    await checkAndPushUp(userDB, userData, 'email')

    const admin = await userDB.findOne({ name: 'Shinn Thant Minn' })
    const adminRole = await roleDB.findOne({ admin: 'Admin' })
    if (admin && adminRole) {
      const finder = await admin.role.find((i) => adminRole._id.equals(i))
      if (!finder) {
        await userDB.findByIdAndUpdate(admin._id, {
          $push: { role: adminRole._id },
        })
      }
    }
  },
  backupData: async () => {
    const data = await userDB.find()
    const raw = await fs.readFileSync('./migration/backup/backupData.json')
    const finder = JSON.parse(raw)
    if (finder.length === 0) {
      await fs.writeFileSync(
        './migration/backup/backupData.json',
        JSON.stringify(data),
      )
    }
  },
}
