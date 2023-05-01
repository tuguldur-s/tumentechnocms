const fs = require('fs');
const url = require('url'); 
var macaddress = require('macaddress');
const transporter = require("../database/mail");

const sha256 = require("js-sha256");
const jwt = require('jwt-then');

Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

Date.prototype.addHours = function(h) {
    this.setTime(this.getTime() + (h*60*60*1000));
    return this;
}

exports.getCashReports = async (req, res) => {
    const { datetime } = req.body;

    const token = req.headers.authorization.split(" ")[1];
    const payload = await jwt.verify(token, 'HS256');

    var normal = new Date().addDays(-15);
    normal = normal.getFullYear() + '-' + ((normal.getMonth() > 8) ? (normal.getMonth() + 1) : ('0' + (normal.getMonth() + 1))) + '-' + ((normal.getDate() > 9) ? normal.getDate() : ('0' + normal.getDate())) + ' 00:00:00';

    var d = new Date().addDays(-5);
    d = d.getFullYear() + '-' + ((d.getMonth() > 8) ? (d.getMonth() + 1) : ('0' + (d.getMonth() + 1))) + '-' + ((d.getDate() > 9) ? d.getDate() : ('0' + d.getDate()));
    db.query(`SELECT address, s.name as address_name, s.cash_miss from timer_register as t inner join store_location as s on t.address = s.code GROUP BY address`, async (err, locations) => {
        if(err) {
            throw err;
        }
        var qr;
        db.query(`SELECT posID from users WHERE id = ${payload.id}`, async (err, user) => {
            if(user[0].posID == 1 || user[0].posID == 4) {
                if(datetime == null) {
                    qr = `SELECT c.id, u.img, u.name, c.total, u.phone, u.email, s.name as storename, c.date, c.stat from store_location as s inner join cash_report as c on s.code = c.store_id inner join users as u on c.user_id = u.id WHERE c.date >= '${normal}' ORDER BY c.date DESC`;
                } else {
                    var s = new Date(datetime[0]).addHours(8);
                    var e = new Date(datetime[1]).addHours(8);
                    s = s.getFullYear() + '-' + ((s.getMonth() > 8) ? (s.getMonth() + 1) : ('0' + (s.getMonth() + 1))) + '-' + ((s.getDate() > 9) ? s.getDate() : ('0' + s.getDate())) + ' 00:00:00';
                    e = e.getFullYear() + '-' + ((e.getMonth() > 8) ? (e.getMonth() + 1) : ('0' + (e.getMonth() + 1))) + '-' + ((e.getDate() > 9) ? e.getDate() : ('0' + e.getDate())) + ' 23:59:00';
                    qr = `SELECT c.id, u.img, u.name, c.total, u.phone, u.email, s.name as storename, c.date, c.stat from store_location as s inner join cash_report as c on s.code = c.store_id inner join users as u on c.user_id = u.id WHERE c.date >= '${s}' AND c.date <= '${e}' ORDER BY c.date DESC`;
                }
            }

            db.query(qr, async (err, invoices) => {
                if(err) {
                    throw err;
                }
                res.json({
                    result: 'success',
                    invoices,
                    locations
                });
            });
        });
    });
}

exports.getCashReport = async (req, res) => {
    const { id } = req.body;
    const token = req.headers.authorization.split(" ")[1];
    const payload = await jwt.verify(token, 'HS256');
    var qr;
    db.query(`SELECT posID from users WHERE id = ${payload.id}`, async (err, user) => {
        if(err) {
            throw err;
        }
        qr = `SELECT c.id, u.img, u.name, u.phone, u.email, s.name as storename, c.date, c.stat, c.terminal, c.mobile, c.qpay, c.candy, c.invoice, c.sale, c.deleted, c.tootsoond, c.total, c.belen, c.hariltsahad_tushaasan, c.belen_tushaasan, c.iluu, c.dutuu from store_location as s inner join cash_report as c on s.code = c.store_id inner join users as u on c.user_id = u.id WHERE c.id = ${id}`;

        db.query(qr, async (err, report) => {
            if(err) {
                throw err;
            }
            if(report.length > 0) {
                res.json({
                    result: 'success',
                    report: report[0]
                });
            } else {
                res.json({
                    result: 'failed'
                });
            }
        });
    });
}

exports.getShopDetail = async (req, res) => {
    const { store } = req.body;
    var date = new Date();
    var end = date.getFullYear() + '-' + (date.getMonth()  + 1);
    date.setMonth(date.getMonth() - 20);
    var start = date.getFullYear() + '-' + (date.getMonth() + 1);
    db.query(`SELECT cash_miss, sale_plan, name, tpe from store_location WHERE code = '${store}'`, async (err, shop) => {
        if(err) {
            throw err;
        }
        db.query(`SELECT * from store_archive WHERE date >= '${start}' AND date <= '${end}' AND storeId = '${store}'`, async (err, archive) => {
            if(err) {
                throw err;
            }
            var sale = `SELECT DATE_FORMAT(date, '%Y-%m') as datetime, SUM(total - sale - deleted) as total_sale from cash_report WHERE date >= '${start}' AND date <= '${end}' AND store_id = '${store}' GROUP BY datetime`;
            db.query(sale, async (err, sale) => {
                if (err) {
                    throw err;
                }
                var d, checkdate, uldegdel = [], use = [], rmas = [], rates = [];
                for (let i = 20; i >= 0; i--) {
                    d = new Date();
                    d.setMonth(d.getMonth() - i);
                    checkdate = d.getFullYear() + '-' + (d.getMonth() + 1);
                    var e = false;
                    archive.forEach(el => {
                        if(el.date == checkdate) {
                            e = true;
                            uldegdel.push(el.totalSale.toFixed(2));
                            var ch2 = checkdate.split('-')[0] + '-' + ((checkdate.split('-')[1] > 9) ? (checkdate.split('-')[1]) : ('0'+checkdate.split('-')[1]));
                            var c = false;  
                            sale.forEach(els => {
                                if(els.datetime == ch2) {
                                    use.push(parseInt((100 * els.total_sale) / el.totalSale))
                                    c = true;
                                }
                            });
                            if(!c) {
                                use.push(0);
                            }
                        }
                    });

                    if(!e) {
                        uldegdel.push(0);
                        use.push(0);
                    }
                }
                db.query(`SELECT DATE_FORMAT(r.created_at, '%Y-%m') as date, SUM(p.sale_price * r.qty) as total from rma as r inner join product as p on r.productId = p.id WHERE r.created_at >= '${start}-01' AND r.created_at <= '${end}-31' AND r.storeId = '${store}' GROUP BY date`, async (err, rma) => {
                    if (err) {
                        throw err;
                    }
                    for (let i = 20; i >= 0; i--) {
                        d = new Date();
                        d.setMonth(d.getMonth() - i);
                        checkdate = d.getFullYear() + '-' + ((d.getMonth() > 8) ? (d.getMonth() + 1) : ('0' + (d.getMonth() + 1)));
                        var c = false;  
                        rma.forEach(el => {
                            if(el.date == checkdate) {
                                c = true;
                                rmas.push(el.total);
                            }
                        });

                        if(!c) {
                            rmas.push(0);
                        }
                    }

                    db.query(`SELECT DATE_FORMAT(date, '%Y-%m') as datetime, AVG(total_shop) as avg FROM reviewshop WHERE date >= '${start}-01' AND date <= '${end}-31' AND storeId = '${store}' GROUP BY datetime`, async (err, rate) => {
                        if(err) {
                            throw err;
                        }
                        for (let i = 20; i >= 0; i--) {
                            d = new Date();
                            d.setMonth(d.getMonth() - i);
                            checkdate = d.getFullYear() + '-' + ((d.getMonth() > 8) ? (d.getMonth() + 1) : ('0' + (d.getMonth() + 1)));
                            var c = false;
                            rate.forEach(el => {
                                if(el.datetime == checkdate) {
                                    c = true;
                                    rates.push(el.avg);
                                }
                            });
                            if(!c) {
                                rates.push(0);
                            }
                        }

                        db.query(`SELECT SUM(${store} * sale_price) as total, brandname FROM product as p inner join brands as b on p.brand = b.id GROUP BY brand ORDER BY total DESC LIMIT 5`, async (err, topBrand) => {
                            if(err) {
                                throw err;
                            }
                            db.query(`SELECT SUM(${store} * sale_price) as mainTotal from product`, async (err, mainBrand) => {
                                if(err) {
                                    throw err;
                                }
                                db.query(`SELECT SUM(${store} * sale_price) as total, sub_category_name FROM product as p inner join category_sub as c on p.category_sub_id = c.id GROUP BY sub_category_name ORDER BY total DESC`, async (err, topCate) => {
                                    if(err) {
                                        throw err;
                                    }
                                    mainBrand = mainBrand[0].mainTotal;
                                    res.json({
                                        result: 'success',
                                        rates,
                                        shop,
                                        rmas,
                                        uldegdel,
                                        use,
                                        topBrand,
                                        mainBrand,
                                        topCate
                                    });
                                });
                            });
                        });
                    });
                    
                });
                
            });
        });
    });
}


exports.getMainDetail = async (req, res) => {
    var date = new Date();
    var end = date.getFullYear() + '-' + (date.getMonth()  + 1);
    date.setMonth(date.getMonth() - 20);
    var start = date.getFullYear() + '-' + (date.getMonth() + 1);
    db.query(`SELECT code from store_location`, async (err, shop) => {
        if(err) {
            throw err;
        }
        var store = '';
        shop.forEach(el => {
            if(store == '') {
                store = `${el.code}`;
            } else {
                store += ` + ${el.code}`;
            }
        });
        // console.log(`SELECT SUM(totalSale) as totalSale, SUM(totalCost) as totalCost, date from store_archive WHERE date >= '${start}' AND date <= '${end}' GROUP BY date`);
        db.query(`SELECT SUM(totalSale) as totalSale, SUM(totalCost) as totalCost, date from store_archive WHERE date >= '${start}' AND date <= '${end}' GROUP BY date`, async (err, archive) => {
            if(err) {
                throw err;
            }
            
            var sale = `SELECT DATE_FORMAT(date, '%Y-%m') as datetime, SUM(total - sale - deleted) as total_sale from cash_report WHERE date >= '${start}' AND date <= '${end}' GROUP BY datetime`;
            db.query(sale, async (err, sale) => {
                if (err) {
                    throw err;
                }
                var d, checkdate, uldegdel = [], use = [], rmas = [], rates = [];
                for (let i = 20; i >= 0; i--) {
                    d = new Date();
                    d.setMonth(d.getMonth() - i);
                    checkdate = d.getFullYear() + '-' + (d.getMonth() + 1);
                    var e = false;
                    archive.forEach(el => {
                        if(el.date == checkdate) {
                            e = true;
                            uldegdel.push(el.totalSale.toFixed(2));
                            var ch2 = checkdate.split('-')[0] + '-' + ((checkdate.split('-')[1] > 9) ? (checkdate.split('-')[1]) : ('0'+checkdate.split('-')[1]));
                            var c = false;  
                            sale.forEach(els => {
                                if(els.datetime == ch2) {
                                    use.push(parseInt((100 * els.total_sale) / el.totalSale))
                                    c = true;
                                }
                            });
                            if(!c) {
                                use.push(0);
                            }
                        }
                    });

                    if(!e) {
                        uldegdel.push(0);
                        use.push(0);
                    }
                }
                db.query(`SELECT DATE_FORMAT(r.created_at, '%Y-%m') as date, SUM(p.sale_price * r.qty) as total from rma as r inner join product as p on r.productId = p.id WHERE r.created_at >= '${start}-01' AND r.created_at <= '${end}-31' GROUP BY date`, async (err, rma) => {
                    if (err) {
                        throw err;
                    }
                    for (let i = 20; i >= 0; i--) {
                        d = new Date();
                        d.setMonth(d.getMonth() - i);
                        checkdate = d.getFullYear() + '-' + ((d.getMonth() > 8) ? (d.getMonth() + 1) : ('0' + (d.getMonth() + 1)));
                        var c = false;  
                        rma.forEach(el => {
                            if(el.date == checkdate) {
                                c = true;
                                rmas.push(el.total);
                            }
                        });

                        if(!c) {
                            rmas.push(0);
                        }
                    }

                    db.query(`SELECT DATE_FORMAT(date, '%Y-%m') as datetime, AVG(total_shop) as avg FROM reviewshop WHERE date >= '${start}-01' AND date <= '${end}-31' GROUP BY datetime`, async (err, rate) => {
                        if(err) {
                            throw err;
                        }
                        for (let i = 20; i >= 0; i--) {
                            d = new Date();
                            d.setMonth(d.getMonth() - i);
                            checkdate = d.getFullYear() + '-' + ((d.getMonth() > 8) ? (d.getMonth() + 1) : ('0' + (d.getMonth() + 1)));
                            var c = false;
                            rate.forEach(el => {
                                if(el.datetime == checkdate) {
                                    c = true;
                                    rates.push(el.avg);
                                }
                            });
                            if(!c) {
                                rates.push(0);
                            }
                        }
                        db.query(`SELECT SUM((${store}) * sale_price) as total, brandname FROM product as p inner join brands as b on p.brand = b.id GROUP BY brand ORDER BY total DESC LIMIT 5`, async (err, topBrand) => {
                            if(err) {
                                throw err;
                            }
                            db.query(`SELECT SUM((${store}) * sale_price) as mainTotal from product`, async (err, mainBrand) => {
                                if(err) {
                                    throw err;
                                }
                                db.query(`SELECT SUM((${store}) * sale_price) as total, sub_category_name FROM product as p inner join category_sub as c on p.category_sub_id = c.id GROUP BY sub_category_name ORDER BY total DESC`, async (err, topCate) => {
                                    if(err) {
                                        throw err;
                                    }
                                    mainBrand = mainBrand[0].mainTotal;
                                    // console.log(mainBrand);
                                    res.json({
                                        result: 'success',
                                        rates,
                                        rmas,
                                        uldegdel,
                                        use,
                                        topBrand,
                                        mainBrand,
                                        topCate
                                    });
                                });
                                
                            });
                        });
                    });
                    
                });
                
            });
        });
    });
}

exports.getSaleByYear = async (req, res) => {
    const { store } = req.body;
    var thisYear = new Date().getFullYear();
    var lastYear = new Date().getFullYear() - 1;
    var subYear = new Date().getFullYear() - 2;
    var thisYearQuery = `SELECT
    (CASE
    WHEN date LIKE '${thisYear}-01%' then '${thisYear}-01'
    WHEN date LIKE '${thisYear}-02%' then '${thisYear}-02'
    WHEN date LIKE '${thisYear}-03%' then '${thisYear}-03'
    WHEN date LIKE '${thisYear}-04%' then '${thisYear}-04'
    WHEN date LIKE '${thisYear}-05%' then '${thisYear}-05'
    WHEN date LIKE '${thisYear}-06%' then '${thisYear}-06'
    WHEN date LIKE '${thisYear}-07%' then '${thisYear}-07'
    WHEN date LIKE '${thisYear}-08%' then '${thisYear}-08'
    WHEN date LIKE '${thisYear}-09%' then '${thisYear}-09'
    WHEN date LIKE '${thisYear}-10%' then '${thisYear}-10'
    WHEN date LIKE '${thisYear}-11%' then '${thisYear}-11'
    WHEN date LIKE '${thisYear}-12%' then '${thisYear}-12'
    END) as datetime, SUM(total - sale - deleted) as total_sale from cash_report where date LIKE '${thisYear}%' and store_id = '${store}' GROUP BY datetime`;

    var lastYearQuery = `SELECT
    (CASE
    WHEN date LIKE '${lastYear}-01%' then '${lastYear}-01'
    WHEN date LIKE '${lastYear}-02%' then '${lastYear}-02'
    WHEN date LIKE '${lastYear}-03%' then '${lastYear}-03'
    WHEN date LIKE '${lastYear}-04%' then '${lastYear}-04'
    WHEN date LIKE '${lastYear}-05%' then '${lastYear}-05'
    WHEN date LIKE '${lastYear}-06%' then '${lastYear}-06'
    WHEN date LIKE '${lastYear}-07%' then '${lastYear}-07'
    WHEN date LIKE '${lastYear}-08%' then '${lastYear}-08'
    WHEN date LIKE '${lastYear}-09%' then '${lastYear}-09'
    WHEN date LIKE '${lastYear}-10%' then '${lastYear}-10'
    WHEN date LIKE '${lastYear}-11%' then '${lastYear}-11'
    WHEN date LIKE '${lastYear}-12%' then '${lastYear}-12'
    END) as datetime, SUM(total - sale - deleted) as total_sale from cash_report where date LIKE '${lastYear}%' and store_id = '${store}' GROUP BY datetime`;

    var subYearQuery = `SELECT
    (CASE
    WHEN date LIKE '${subYear}-01%' then '${subYear}-01'
    WHEN date LIKE '${subYear}-02%' then '${subYear}-02'
    WHEN date LIKE '${subYear}-03%' then '${subYear}-03'
    WHEN date LIKE '${subYear}-04%' then '${subYear}-04'
    WHEN date LIKE '${subYear}-05%' then '${subYear}-05'
    WHEN date LIKE '${subYear}-06%' then '${subYear}-06'
    WHEN date LIKE '${subYear}-07%' then '${subYear}-07'
    WHEN date LIKE '${subYear}-08%' then '${subYear}-08'
    WHEN date LIKE '${subYear}-09%' then '${subYear}-09'
    WHEN date LIKE '${subYear}-10%' then '${subYear}-10'
    WHEN date LIKE '${subYear}-11%' then '${subYear}-11'
    WHEN date LIKE '${subYear}-12%' then '${subYear}-12'
    END) as datetime, SUM(total - sale - deleted) as total_sale from cash_report where date LIKE '${subYear}%' and store_id = '${store}' GROUP BY datetime`;

    db.query(thisYearQuery, async (err, thisYearSale) => {
        if(err) {
            throw err;
        }
        db.query(lastYearQuery, async (err, lastYearSale) => {
            if(err) {
                throw err;
            }
            db.query(subYearQuery, async (err, subYearSale) => {
                if(err) {
                    throw err;
                }

                var t = [], l = [], s = [];
                for (let i = 1; i <= 12; i++) {
                    var a;
                    if (i < 10) {
                        a = `0${i}`;
                    } else {
                        a = `${i}`;
                    }
                    var c = false;
                    thisYearSale.forEach(el => {
                        if(el.datetime == `${thisYear}-${a}`) {
                            c = true;
                            t.push(el.total_sale);
                        }
                    });
                    if(!c) {
                        t.push(0);
                    }

                    c = false;

                    lastYearSale.forEach(el => {
                        if(el.datetime == `${lastYear}-${a}`) {
                            c = true;
                            l.push(el.total_sale);
                        }
                    });
                    if(!c) {
                        l.push(0);
                    }

                    c = false;

                    subYearSale.forEach(el => {
                        if(el.datetime == `${subYear}-${a}`) {
                            c = true;
                            s.push(el.total_sale);
                        }
                    });
                    if(!c) {
                        s.push(0);
                    }
                }

                res.json({
                    result: 'success',
                    t,
                    s,
                    l
                });
            });
        });
    });
}


exports.getMainSaleByYear = async (req, res) => {
    var thisYear = new Date().getFullYear();
    var lastYear = new Date().getFullYear() - 1;
    var subYear = new Date().getFullYear() - 2;
    var thisYearQuery = `SELECT
    (CASE
    WHEN date LIKE '${thisYear}-01%' then '${thisYear}-01'
    WHEN date LIKE '${thisYear}-02%' then '${thisYear}-02'
    WHEN date LIKE '${thisYear}-03%' then '${thisYear}-03'
    WHEN date LIKE '${thisYear}-04%' then '${thisYear}-04'
    WHEN date LIKE '${thisYear}-05%' then '${thisYear}-05'
    WHEN date LIKE '${thisYear}-06%' then '${thisYear}-06'
    WHEN date LIKE '${thisYear}-07%' then '${thisYear}-07'
    WHEN date LIKE '${thisYear}-08%' then '${thisYear}-08'
    WHEN date LIKE '${thisYear}-09%' then '${thisYear}-09'
    WHEN date LIKE '${thisYear}-10%' then '${thisYear}-10'
    WHEN date LIKE '${thisYear}-11%' then '${thisYear}-11'
    WHEN date LIKE '${thisYear}-12%' then '${thisYear}-12'
    END) as datetime, SUM(total - sale - deleted) as total_sale from cash_report where date LIKE '${thisYear}%' GROUP BY datetime`;

    var lastYearQuery = `SELECT
    (CASE
    WHEN date LIKE '${lastYear}-01%' then '${lastYear}-01'
    WHEN date LIKE '${lastYear}-02%' then '${lastYear}-02'
    WHEN date LIKE '${lastYear}-03%' then '${lastYear}-03'
    WHEN date LIKE '${lastYear}-04%' then '${lastYear}-04'
    WHEN date LIKE '${lastYear}-05%' then '${lastYear}-05'
    WHEN date LIKE '${lastYear}-06%' then '${lastYear}-06'
    WHEN date LIKE '${lastYear}-07%' then '${lastYear}-07'
    WHEN date LIKE '${lastYear}-08%' then '${lastYear}-08'
    WHEN date LIKE '${lastYear}-09%' then '${lastYear}-09'
    WHEN date LIKE '${lastYear}-10%' then '${lastYear}-10'
    WHEN date LIKE '${lastYear}-11%' then '${lastYear}-11'
    WHEN date LIKE '${lastYear}-12%' then '${lastYear}-12'
    END) as datetime, SUM(total - sale - deleted) as total_sale from cash_report where date LIKE '${lastYear}%' GROUP BY datetime`;

    var subYearQuery = `SELECT
    (CASE
    WHEN date LIKE '${subYear}-01%' then '${subYear}-01'
    WHEN date LIKE '${subYear}-02%' then '${subYear}-02'
    WHEN date LIKE '${subYear}-03%' then '${subYear}-03'
    WHEN date LIKE '${subYear}-04%' then '${subYear}-04'
    WHEN date LIKE '${subYear}-05%' then '${subYear}-05'
    WHEN date LIKE '${subYear}-06%' then '${subYear}-06'
    WHEN date LIKE '${subYear}-07%' then '${subYear}-07'
    WHEN date LIKE '${subYear}-08%' then '${subYear}-08'
    WHEN date LIKE '${subYear}-09%' then '${subYear}-09'
    WHEN date LIKE '${subYear}-10%' then '${subYear}-10'
    WHEN date LIKE '${subYear}-11%' then '${subYear}-11'
    WHEN date LIKE '${subYear}-12%' then '${subYear}-12'
    END) as datetime, SUM(total - sale - deleted) as total_sale from cash_report where date LIKE '${subYear}%' GROUP BY datetime`;

    db.query(thisYearQuery, async (err, thisYearSale) => {
        if(err) {
            throw err;
        }
        db.query(lastYearQuery, async (err, lastYearSale) => {
            if(err) {
                throw err;
            }
            db.query(subYearQuery, async (err, subYearSale) => {
                if(err) {
                    throw err;
                }

                var t = [], l = [], s = [];
                for (let i = 1; i <= 12; i++) {
                    var a;
                    if (i < 10) {
                        a = `0${i}`;
                    } else {
                        a = `${i}`;
                    }
                    var c = false;
                    thisYearSale.forEach(el => {
                        if(el.datetime == `${thisYear}-${a}`) {
                            c = true;
                            t.push(el.total_sale);
                        }
                    });
                    if(!c) {
                        t.push(0);
                    }

                    c = false;

                    lastYearSale.forEach(el => {
                        if(el.datetime == `${lastYear}-${a}`) {
                            c = true;
                            l.push(el.total_sale);
                        }
                    });
                    if(!c) {
                        l.push(0);
                    }

                    c = false;

                    subYearSale.forEach(el => {
                        if(el.datetime == `${subYear}-${a}`) {
                            c = true;
                            s.push(el.total_sale);
                        }
                    });
                    if(!c) {
                        s.push(0);
                    }
                }

                res.json({
                    result: 'success',
                    t,
                    s,
                    l
                });
            });
        });
    });
}