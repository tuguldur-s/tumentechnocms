const router = require('express').Router();
const { catchErrors } = require('../handlers/errorHandler');
const controller  = require('../controllers/BIController');
const auth = require('../middlewares/admin');

router.post("/get-shop-detail", auth, catchErrors(controller.getShopDetail));
router.post("/get-main-detail", auth, catchErrors(controller.getMainDetail));
router.post("/get-sale-by-year", auth, catchErrors(controller.getSaleByYear));
router.post("/get-main-sale-by-year", auth, catchErrors(controller.getMainSaleByYear));
router.post("/get-reports", auth, catchErrors(controller.getCashReports));
router.post("/get-report", auth, catchErrors(controller.getCashReport));

module.exports = router;