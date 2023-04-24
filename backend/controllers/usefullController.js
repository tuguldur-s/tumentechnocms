const nodemailer = require("nodemailer");
const fs = require('fs');
const url = require('url'); 
var macaddress = require('macaddress');
const db = require("../database/connection");

const sha256 = require("js-sha256");
const jwt = require('jwt-then');
const { userInfo } = require("os");
const { ESRCH, DH_UNABLE_TO_CHECK_GENERATOR } = require("constants");

exports.addCompany = async (req, res) => {
    const { company } = req.body;
    var pst = {name: company.name, email: company.email, register: company.register, phone: company.phone, nickname: company.nickname};
    var l = `INSERT INTO companies SET ?`;
    db.query(`SELECT id from companies WHERE email = '${company.email}'`, async (err, check) => {
        if(err) {
            throw err;
        }
        if(check.length > 0) {
            res.json({
                result: 'failed'
            });
        } else {
            db.query(l, pst, async err => {
                if(err) {
                    throw err;
                }
                res.json({
                    result: 'success'
                });
            });
        }
    });
}

exports.EditBrand = async (req, res) => {
    const { brand } = req.body;
    db.query(`UPDATE brands SET brandname = '${brand.brandname}' WHERE id = ${brand.id}`, async err => {
        if(err) {
            throw err;
        }
        res.json({
            result: 'success'
        });
    });
}

exports.editCategory = async (req, res) => {
    const { category } = req.body;
    db.query(`UPDATE category SET category_name = '${category.category_name}' WHERE id = ${category.id}`, async err => {
        if(err) {
            throw err;
        }
        res.json({
            result: 'success'
        });
    });
}

exports.editSubCategory = async (req, res) => {
    const { category } = req.body;
    db.query(`UPDATE category_sub SET sub_category_name = '${category.sub_category_name}' WHERE id = ${category.id}`, async err => {
        if(err) {
            throw err;
        }
        res.json({
            result: 'success'
        });
    });
}


exports.deleteCategory = async (req, res) => {
    const { id } = req.body;
    db.query(`SELECT ID from product WHERE type = ${id}`, async (err, check) => {
        if(err) {
            throw err;
        }
        if(check.length > 0) {
            res.json({
                result: 'failed',
                p: check.length
            });
        } else {
            db.query(`DELETE from category WHERE id = ${id}`, async (err) => {
                if(err) {
                    throw err;
                }
                res.json({
                    result: 'success'
                });
            });
        }
        
    });
}

exports.deleteSubCategory = async (req, res) => {
    const { id } = req.body;
    db.query(`SELECT ID from product WHERE category_sub_id = ${id}`, async (err, check) => {
        if(err) {
            throw err;
        }
        if(check.length > 0) {
            res.json({
                result: 'failed',
                p: check.length
            });
        } else {
            db.query(`DELETE from category_sub WHERE id = ${id}`, async (err) => {
                if(err) {
                    throw err;
                }
                res.json({
                    result: 'success'
                });
            });
        }
        
    });
}

exports.deleteBrand = async (req, res) => {
    const { id } = req.body;
    db.query(`SELECT ID from product WHERE brand = ${id}`, async (err, check) => {
        if(err) {
            throw err;
        }
        if(check.length > 0) {
            res.json({
                result: 'failed',
                p: check.length
            });
        } else {
            db.query(`DELETE from brands WHERE id = ${id}`, async (err) => {
                if(err) {
                    throw err;
                }
                res.json({
                    result: 'success'
                });
            });
        }
        
    });
}

exports.updateBrandStat = async (req, res) => {
    const { id, active } = req.body;
    console.log(id, active);
    db.query(`UPDATE brands SET itlab = ${active} WHERE id = ${id}`, async (err) => {
        if(err) {
            throw err;
        }
        res.json({
            result: 'success'
        });
    });
}
exports.updateCategoryStat = async (req, res) => {
    const { id, active } = req.body;
    console.log(id, active);
    db.query(`UPDATE category SET itlab = ${active} WHERE id = ${id}`, async (err) => {
        if(err) {
            throw err;
        }
        res.json({
            result: 'success'
        });
    });
}
exports.updateSubCategoryStat = async (req, res) => {
    const { id, active } = req.body;
    console.log(id, active);
    db.query(`UPDATE category_sub SET itlab = ${active} WHERE id = ${id}`, async (err) => {
        if(err) {
            throw err;
        }
        res.json({
            result: 'success'
        });
    });
}

exports.getBrandAndCategory = async (req, res) => {
    db.query(`SELECT id, brandname, itlab from brands`, async (err, brands) => {
        if(err) {
            throw err;
        }
        db.query(`SELECT category_name, id, category_code, itlab from category`, async (err, category) => {
            if(err) {
                throw err;
            }
            db.query(`SELECT id, categoryID, sub_category_name, sub_category_code, itlab from category_sub`, async (err, sub) => {
                if(err) {
                    throw err;
                }
                res.json({
                    result: 'success',
                    brands,
                    category,
                    sub
                });
            });
        });
    });
}

exports.companies = async (req, res) => {
    db.query(`SELECT * from companies`, async (err, companies) => {
        if(err) {
            throw err;
        }
        res.json({
            result: 'success',
            companies
        });
    });
}

exports.deleteCompany = async (req, res) => {
    const { id } = req.body;
    db.query(`DELETE FROM companies WHERE id = ${id}`, async (err) => {
        if(err) {
            throw err;
        }
        res.json({
            result: 'success'
        });
    });
}

exports.editCompany = async (req, res) => {
    const { company } = req.body;
    db.query(`UPDATE companies SET name = '${company.name}', nickname = '${company.nickname}', email = '${company.email}', phone = '${company.phone}', register = '${company.register}' WHERE id = ${company.id}`, async err => {
        if(err) {
            throw err;
        }
        res.json({
            result: 'success'
        });
    });
}

exports.getCategories = async (req, res) => {
    db.query(`SELECT id, category_name, category_code from category WHERE itlab = 1`, async (err, result) => {
        if(err) {
            throw err;
        }
        res.json(result);
    });
}

exports.getAllProducts = async (req, res) => {
    db.query(`SELECT code from store_location`, async (err, loc) => {
        if(err) {
            throw err;
        }
        var uld = '';
        loc.forEach(el => {
            if(el.code != 'shop_08') {
                if(uld == '') {
                    uld = `${el.code}`;
                } else {
                    uld = `${uld} + ${el.code}`;
                }
            }
        });
        db.query(`SELECT name, model, brand, type as category, category_sub_id as sub, sale_price, description, color_name, (${uld}) as total from product inner join brands on product.brand = brands.id WHERE itlab = 1`, async (err, result) => {
            if(err) {
                throw err;
            }
            res.json(result);
        });
    });
}

exports.getSubCategories = async (req, res) => {
    db.query(`SELECT id, sub_category_name, categoryID, sub_category_code from category_sub WHERE itlab = 1`, async (err, result) => {
        if(err) {
            throw err;
        }
        res.json(result);
    });
}

exports.getBrands = async (req, res) => {
    db.query(`SELECT id, brandname from brands WHERE itlab = 1`, async (err, result) => {
        if(err) {
            throw err;
        }
        res.json(result);
    });
}

exports.calendar = async (req, res) => {
    const { shop } = req.body;
    db.query(`SELECT code, name from store_location`, async (err, shops) => {
        if(err) {
            throw err;
        }
        Date.prototype.addDays = function(days) {
            var date = new Date(this.valueOf());
            date.setDate(date.getDate() + days);
            return date;
        }
        var normal = new Date().addDays(-60);
        normal = normal.getFullYear() + '-' + ((normal.getMonth() > 8) ? (normal.getMonth() + 1) : ('0' + (normal.getMonth() + 1))) + '-' + ((normal.getDate() > 9) ? normal.getDate() : ('0' + normal.getDate()));
        db.query(`SELECT w.date, u.name, u.id from work_plan as w inner join users as u on w.user_id = u.id WHERE w.shop = '${shop}' AND w.date > '${normal}'`, async (err, plan) => {
            if(err) {
                throw err;
            }
            db.query(`SELECT id, name from users`, async (err, user) => {
                if(err) {
                    throw err;
                }
                res.json({
                    result: 'success',
                    shops, 
                    plan,
                    user
                });
            });
        });
    });
}

exports.shops = async (req, res) => {
    db.query(`SELECT * from store_location`, async (err, shops) => {
        if(err) {
            throw err;
        }
        var date = new Date();
        date = date.getFullYear().toString() + '-' + ((date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1)));
        db.query(`SELECT store_id, SUM(total - sale - deleted) as total_sale from cash_report WHERE date LIKE '${date}%' GROUP BY store_id`, async (err, sale) => {
            if(err) {
                throw err;
            }
            db.query(`SELECT FLOOR(TIME_TO_SEC(t.lost) / 60) as losttime, t.user_id, u.name, u.img, u.call_store, u.feedback, u.response FROM timer_register as t inner join users as u on t.user_id = u.id WHERE t.date LIKE CONCAT(DATE_FORMAT(NOW(), '%Y-%m'), '%') GROUP BY t.user_id`, async (err, lose) => {
                if(err) {
                    throw err;
                }
                db.query(`SELECT c.user_id, FLOOR(AVG((c.total * 100 / s.sale_plan_day))) as percent from cash_report as c inner join store_location as s on c.store_id = s.code WHERE c.date LIKE CONCAT(DATE_FORMAT(NOW(), '%Y-%m'), '%') GROUP BY c.user_id`, async (err, EmpSale) => {
                    if(err) {
                        throw err;
                    }
                    db.query(`SELECT total_shop, storeId from reviewshop WHERE date LIKE CONCAT(DATE_FORMAT(NOW(), '%Y-%m'), '%')`, async (err, shopReview) => {
                        if(err) {
                            throw err;
                        }
                        db.query(`SELECT FLOOR(AVG(total_user)) as percent, userId FROM reviewshop WHERE date LIKE CONCAT(DATE_FORMAT(NOW(), '%Y-%m'), '%') GROUP BY userId`, async (err, reviewUsers) => {
                            if(err) {
                                throw err;
                            }
                            res.json({
                                result: 'success',
                                shops,
                                sale,
                                lose,
                                EmpSale,
                                shopReview,
                                reviewUsers
                            });
                        });
                    })
                });
            });
        });
    });
}

exports.addFontTime = async (req, res) => {
    const { date, fonttime } = req.body;
    var dt = new Date(date);
    dt = dt.getFullYear() + '-' + ((dt.getMonth() > 8) ? (dt.getMonth() + 1) : ('0' + (dt.getMonth() + 1)));
    let u = `UPDATE timer_register SET default_hour = '${fonttime}' WHERE date LIKE '${dt}%'`;
    db.query(u, async (err) => {
        if(err) {
            throw err;
        }
        res.json({
            result: 'success'
        });
    });
}

exports.getMealMoney = async (req, res) => {
    const { datetime } = req.body;    
    var sdt = new Date(datetime[0]);
    sdt = sdt.getFullYear() + '-' + ((sdt.getMonth() > 8) ? (sdt.getMonth() + 1) : ('0' + (sdt.getMonth() + 1)))  + '-' + ((sdt.getDate() > 9) ? sdt.getDate() : ('0' + sdt.getDate()));
    var edt = new Date(datetime[1]);
    edt = edt.getFullYear() + '-' + ((edt.getMonth() > 8) ? (edt.getMonth() + 1) : ('0' + (edt.getMonth() + 1)))  + '-' + ((edt.getDate() > 9) ? edt.getDate() : ('0' + edt.getDate()));
    let q = `SELECT COUNT(*) as day, name, acc_number from (SELECT u.name, t.date, u.acc_number from timer_register as t inner join users as u on t.user_id = u.id WHERE t.date >= '${sdt}' AND t.date <= '${edt}' GROUP BY date, name, u.acc_number) t GROUP BY name, acc_number`;
    db.query(q, async (err, meal) => {
        if(err) {
            throw err;
        }
        res.json({
            result: 'success',
            meal
        });
    });
}

exports.getTotalTime = async (req, res) => {
    const { date } = req.body;
    var dt = new Date(date);
    
    dt = dt.getFullYear() + '-' + ((dt.getMonth() > 8) ? (dt.getMonth() + 1) : ('0' + (dt.getMonth() + 1)));
    console.log(dt);
    let q = `SELECT u.name, u.id, t.default_hour, SEC_TO_TIME(SUM(TIME_TO_SEC(TIMEDIFF(endtime,ADDTIME(starttime, '01:00:00'))))) as total_time, SEC_TO_TIME(SUM(TIME_TO_SEC(lost))) as total_lost_time from timer_register as t inner join users as u on t.user_id = u.id WHERE t.date LIKE '${dt}%' GROUP BY u.id, u.name`;
    db.query(q, async (err, total) => {
        if(err) {
            throw err;
        }
        // let b = `SELECT user_id, SUM(c.total - s.sale_plan_day) * 0.07 as total_bonus from store_location as s inner join cash_report as c on s.code = c.store_id WHERE c.date LIKE '${dt}%' GROUP BY user_id`;
        let b = `SELECT (cash_report.total - cash_report.sale - cash_report.deleted) as totalSale, cash_report.date, cash_report.store_id, cash_report.user_id, store_location.sale_plan_day FROM cash_report inner join store_location on cash_report.store_id = store_location.code WHERE cash_report.date LIKE '${dt}%'`;        
        db.query(b, async (err, allbonus) => {
            if(err) {
                throw err;
            }
            //`SELECT address, date FROM timer_register WHERE date LIKE '${dt}%' GROUP BY date, user_id`
            var t = `SELECT store_id as address, date FROM cash_report WHERE date LIKE '${dt}%' GROUP BY date, user_id`;
            db.query(t, async (err, timerRegisters) => {
                if(err) {
                    throw err;
                }
                var bonus = [];
                allbonus.forEach(a => {
                    var cnt = 0;

                    timerRegisters.forEach(t => {
                        if(t.address == a.store_id && t.date == a.date) {
                            if (t.address == 'remain') {
                                cnt = 1;
                            } else {
                                cnt++;
                            }
                        }
                    });
                    var isHave = false;
                    bonus.forEach(b => {
                        if(b.user_id == a.user_id) {
                            if(cnt > 0) {
                                var bn = a.totalSale - (a.sale_plan_day / cnt);
                                b.total_bonus += bn;
                                isHave = true;
                            }
                        }
                    });

                    if(!isHave) {
                        if (cnt > 0) {
                            var bn = a.totalSale - (a.sale_plan_day / cnt);
                            bonus.push({user_id: a.user_id, total_bonus: bn});   
                        }
                    }                    
                });

                bonus.forEach(b => {
                    b.total_bonus = b.total_bonus * 0.07;
                });
                

                db.query(`SELECT user_id, starttime, endtime, date, lost from timer_register WHERE date LIKE '${dt}%'`, async (err, MoreTime) => {
                    if(err) {
                        throw err;
                    }
                    db.query(`SELECT name, id from users`, async (err, users) => {
                        if(err) {
                            throw err;
                        }
                        res.json( {
                            result: 'success',
                            total,
                            bonus,
                            users,
                            MoreTime
                        });
                    });
                });
             });
        });
    });
}

exports.editShops = async (req, res) => {
    const { shop } = req.body;
    db.query(`UPDATE store_location SET start = '${shop.start}', end = '${shop.end}', weekend = '${shop.weekend}', second_part = '${shop.second_part}', rest = '${shop.rest}', sale_plan = '${shop.sale_plan}', sale_plan_day = '${shop.sale_plan_day}' WHERE id = ${shop.id}`, async err => {
        if(err) {
            throw err;
        }
        res.json({
            result: 'success'
        });
    });
}

exports.deleteEvent = async (req, res) => {
    const { id, date, shop } = req.body;
    db.query(`DELETE from work_plan WHERE user_id = ${id} AND date = '${date}' AND shop = '${shop}'`, async err => {
        if(err) {
            throw err;
        }
        res.json({
            result: 'success'
        });
    });
}

exports.addEvent = async (req, res) => {
    const { date, id, shop } = req.body;
    var n = `INSERT INTO work_plan SET ?`
    var pst = {user_id: id, date, shop};
    db.query(n, pst, async err => {
        if(err) {
            throw err;
        }
        res.json({
            result: 'success'
        });
    });

}

exports.setShopReview = async (req, res) => {
    const { store, userId, emp, shop, feedback, totalEmp, totalShop } = req.body;
    
    db.query(`UPDATE users SET feedback = ${feedback.feedback} * 20, response = ${feedback.tasag_orhih} * 20 WHERE id = ${userId}`, async (err) => {
        if(err) {
            throw err;
        }
        console.log(emp, shop);
        var pst = {une: shop.une * 20, orolt: shop.orolt * 20, tatan_awalt: shop.tatan_avalt * 20, barimt: shop.barimt * 20, baraanii_uzemj: shop.uzemj * 20, tech_buten_baidal: shop.technical, total_shop: totalShop, storeId: store.code, userId, date: new Date(), huwts: emp.huwts * 20, haritsaa: emp.haritsaa * 20, program: emp.program * 20, tsewerlegee: emp.tsewerlegee * 20, baraanii_medleg: emp.baraanii_medleg * 20, butsaalt: emp.butsaalt * 20, total_user: totalEmp};
        var l = `INSERT INTO reviewshop SET ?`;
        db.query(l, pst, async err => {
            if(err) {
                throw err;
            }
            res.json({
                result: 'success'
            });
        });
    });
}