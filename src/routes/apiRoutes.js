const express = require('express')
const router = express.Router()
const apiController = require('../controllers/apiController')

router.get('/weather', apiController.getCityByName)
router.get('/weather/filter', apiController.getDataFilter)

module.exports = router