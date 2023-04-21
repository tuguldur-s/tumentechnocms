const router = require('express').Router();
const { catchErrors } = require('../handlers/errorHandler');
const adminController  = require('../controllers/adminController');
const auth = require('../middlewares/admin');



module.exports = router;