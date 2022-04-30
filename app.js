require('dotenv').config()
const express = require('express'),
  app = express(),
  fileUpload = require('express-fileupload'),
  mongoose = require('mongoose')

app.use(express.json())
app.use(fileUpload())

mongoose.connect(
  `mongodb+srv://root:${453493851}@blog.74s1i.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`,
)

// mongoose.connect(`mongodb://127.0.0.1:27017/${'Test'}`)

const permitRouter = require('./routers/permit')
const roleRouter = require('./routers/role')
const adminRouter = require('./routers/admin')

app.use('/permit', permitRouter)
app.use('/role', roleRouter)
app.use('/admin', adminRouter)

app.get('*', (req, res, next) => {
  res.status(200).json({
    msg: 'this route is no valid',
  })
})

app.use((err, req, res, next) => {
  err.status = err.status || 200
  res.status(err.status).json({
    con: false,
    msg: err.message,
  })
})

const migrator = require('./migration/migrator')

const dataMigrationAndBackUp = async () => {
  await migrator.migration()
  await migrator.backupData()
}

dataMigrationAndBackUp()

app.listen(process.env.PORT || 4000, () => {
  console.log('i am running from ' + process.env.PORT)
})
