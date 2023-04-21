<template>
    <div class="scrollable">
        <div class="page-ecommerce-orders flex column" v-loading.fullscreen.lock="loading">
            <div class="page-header">
                <div class="flex justify-space-between">
                    <el-breadcrumb separator="/" class="mb-10">
                        <el-breadcrumb-item :to="{ path: '/dashboard' }"><i class="mdi mdi-home-outline"></i></el-breadcrumb-item>
                        <el-breadcrumb-item>Салбарын жагсаалт</el-breadcrumb-item>
                    </el-breadcrumb>
                </div>
            </div>
        </div>
        <div class="page-ecommerce-dashboard">
		    <div class="table-box card-base card-outline" :style="{'overflow': 'auto'}">
                <table class="styled striped hover mobile-text">
                    <thead>
                        <tr>
                            <th>Салбарын нэр</th>
                            <th>Өдрийн төлөвлөгөө</th>
                            <th>Сарын төлөвлөгөө</th>
                            <th>Борлуулалт</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr style="background: #5f8fdf; color: #fff;">
                            <td colspan="4"> <span style="font-weight: 700;">ҮНДСЭН САЛБАРУУД</span> </td>
                        </tr>
                        <tr v-for="item in mainShops" :key="item.id" :style="{'cursor': 'pointer'}" @click="goRoute(item.code)">
                            <td>
                                <div class="item-box item-customer">
                                    <h4 class="m-0 o-080">{{item.name}}</h4>
                                </div>
                            </td>
                            <td>
                                <div class="item-box item-customer">
                                    <h4 class="m-0 o-080">{{Number(item.sale_plan_day).toLocaleString()}}</h4>
                                </div>
                            </td>
                            <td>
                                <div class="item-box item-customer">
                                    <h4 class="m-0 o-080">{{Number(item.sale_plan).toLocaleString()}}</h4>
                                </div>
                            </td>
                            <td>
                                <div class="item-box item-customer">
                                    <h4 class="m-0 o-080">{{selectSale(item.code)}}</h4>
                                    <el-progress :color="customColors" :percentage="selectPercentage(item.code, item.sale_plan)" class="themed"></el-progress>
                                    <el-progress :color="customColors" :percentage="selectPercentageQuality(item.code, item.sale_plan)" :format="format" class="themed"></el-progress>
                                </div>
                            </td>
                        </tr>
                        <tr style="border-top: 1px solid #5f8fdf;">
                            <td>
                                <div class="item-box item-customer">
                                    <h4 class="m-0 o-080">НИЙТ</h4>
                                </div>
                            </td>
                            <td colspan="2">
                                <div class="item-box item-customer">
                                    <h4 class="m-0 o-080">{{totalPlan}}</h4>
                                </div>
                            </td>
                            <td>
                                <div class="item-box item-customer">
                                    <h4 class="m-0 o-080">{{totalSale}}</h4>
                                    <el-progress :color="customColors" v-if="totalPercentage > 0" :percentage="totalPercentage" class="themed"></el-progress>
                                    <el-progress :color="customColors" v-if="totalPercentageQuality > 0" :percentage="totalPercentageQuality" class="themed"></el-progress>
                                </div>
                            </td>
                        </tr>
                        <tr style="background: #5f8fdf; color: #fff;">
                            <td colspan="4"> <span style="font-weight: 700;">ГЭРЭЭТ САЛБАРУУД</span> </td>
                        </tr>
                        <tr v-for="item in subShops" :key="item.id" :style="{'cursor': 'pointer'}" @click="goRoute(item.code)">
                            <td>
                                <div class="item-box item-customer">
                                    <h4 class="m-0 o-080">{{item.name}}</h4>
                                </div>
                            </td>
                            <td>
                                <div class="item-box item-customer">
                                    <h4 class="m-0 o-080">{{Number(item.sale_plan_day).toLocaleString()}}</h4>
                                </div>
                            </td>
                            <td>
                                <div class="item-box item-customer">
                                    <h4 class="m-0 o-080">{{Number(item.sale_plan).toLocaleString()}}</h4>
                                </div>
                            </td>
                            <td>
                                <div class="item-box item-customer">
                                    <h4 class="m-0 o-080">{{selectSale(item.code)}}</h4>
                                    <el-progress :color="customColors" :percentage="selectPercentage(item.code, item.sale_plan)" class="themed"></el-progress>
                                    <el-progress :color="customColors" :percentage="selectPercentageQuality(item.code, item.sale_plan)" :format="format" class="themed"></el-progress>
                                </div>
                            </td>
                        </tr>
                        <!-- <tr style="background: #525252; color: #fff;"> -->
                        <tr style="border-top: 1px solid #5f8fdf;">
                            <td>
                                <div class="item-box item-customer">
                                    <h4 class="m-0 o-080">НИЙТ</h4>
                                </div>
                            </td>
                            <td colspan="2">
                                <div class="item-box item-customer">
                                    <h4 class="m-0 o-080">{{totalPlan2}}</h4>
                                </div>
                            </td>
                            <td>
                                <div class="item-box item-customer">
                                    <h4 class="m-0 o-080">{{totalSale2}}</h4>
                                    <el-progress :color="customColors" v-if="totalPercentage2 > 0" :percentage="totalPercentage2" class="themed"></el-progress>
                                    <el-progress :color="customColors" v-if="totalPercentageQuality2 > 0" :percentage="totalPercentageQuality2" class="themed"></el-progress>
                                </div>
                            </td>
                        </tr>

                        <tr style="background: #c6d9fd;">
                            <td>
                                <div class="item-box item-customer">
                                    <h4 class="m-0 o-080">НИЙТ</h4>
                                </div>
                            </td>
                            <td colspan="2">
                                <div class="item-box item-customer">
                                    <h4 class="m-0 o-080">{{totalPlan2}}</h4>
                                </div>
                            </td>
                            <td>
                                <div class="item-box item-customer">
                                    <h4 class="m-0 o-080">{{totalSaleMain}}</h4>
                                    <el-progress :color="customColors" v-if="totalPercentageMain > 0" :percentage="totalPercentageMain" class="themed"></el-progress>
                                    <el-progress :color="customColors" v-if="totalPercentageQualityMain > 0" :percentage="totalPercentageQualityMain" class="themed"></el-progress>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            shops: {
                selected: [],
                list: [],
                sale: []        
            },
            loading: false,
            modals: {
                editItem: false
            },
            customColors: [
                {color: '#f56c6c', percentage: 20},
                {color: '#e6a23c', percentage: 40},
                {color: '#5cb87a', percentage: 60},
                {color: '#1989fa', percentage: 80},
                {color: '#6f7ad3', percentage: 100}
            ],
            totalPercentage: 0,
            totalPercentageQuality: 0,
            totalPercentage2: 0,
            totalPercentageQuality2: 0,
            totalPercentageMain: 0,
            totalPercentageQualityMain: 0
        }
    },
    mounted() {
        this.getShops();
    },
    computed: {
        totalSale() {
            var sale  = 0, plan = 0;
            this.shops.list.forEach( el => {
                if(el.tpe == 1) {
                    plan += el.sale_plan;
                    this.shops.sale.forEach(elm => {
                        if(elm.store_id == el.code) {
                            sale += elm.total_sale;
                        }
                    });
                }
            });
            
            var per = parseInt((sale * 100) / plan);
            var d = new Date().getDate();
            this.totalPercentage = per;
            this.totalPercentageQuality = parseInt((sale * 100) / (plan / 30 * d));

            return Number(sale).toLocaleString();
        },
        totalSale2() {
            var sale  = 0, plan = 0;
            this.shops.list.forEach( el => {
                if(el.tpe == 2) {
                    plan += el.sale_plan;
                    this.shops.sale.forEach(elm => {
                        if(elm.store_id == el.code) {
                            sale += elm.total_sale;
                        }
                    });
                }
            });
            
            var per = parseInt((sale * 100) / plan);
            this.totalPercentage2 = per;
            var d = new Date().getDate();            
            this.totalPercentageQuality2 = parseInt((sale * 100) / (plan / 30 * d));

            return Number(sale).toLocaleString();
        },
        totalSaleMain() {
            var sale  = 0, plan = 0;
            this.shops.list.forEach( el => {
                plan += el.sale_plan;
                this.shops.sale.forEach(elm => {
                    if(elm.store_id == el.code) {
                        sale += elm.total_sale;
                    }
                });
            });
            
            var per = parseInt((sale * 100) / plan);
            this.totalPercentageMain = per;
            var d = new Date().getDate();            
            this.totalPercentageQualityMain = parseInt((sale * 100) / (plan / 30 * d));

            return Number(sale).toLocaleString();
        },
        totalPlan() {
            var sale = 0;
            this.shops.list.forEach(el => {
                if(el.tpe == 1) {
                    sale += el.sale_plan;
                }
            });
            return Number(sale).toLocaleString();
        },
        totalPlan2() {
            var sale = 0;
            this.shops.list.forEach(el => {
                if(el.tpe == 2) {
                    sale += el.sale_plan;
                }
            });
            return Number(sale).toLocaleString();
        },
        mainShops() {
            var shops = [];
            this.shops.list.forEach(el => {
                if(el.tpe == 1) {
                    shops.push(el);
                }
            });
            return shops;
        },
        subShops() {
            var shops = [];
            this.shops.list.forEach(el => {
                if(el.tpe == 2) {
                    shops.push(el);
                }
            });
            return shops;
        }
    },
    methods: {
        format(percentage) {
            return `${percentage}%`;
        },
        goRoute(code) {
            this.$router.push({name:'shop-detail', params: {id: code}})
        },
        selectSale(name) {
            var sale = 0;
            this.shops.sale.forEach(el => {
                if(el.store_id == name) {
                    sale = el.total_sale;
                }
            });
            return Number(sale).toLocaleString();
        },
        selectPercentage(name, plan) {
            var sale = 0;
            this.shops.sale.forEach(el => {
                if(el.store_id == name) {
                    // sale = el.total_sale;
                    sale = parseInt((el.total_sale * 100) / plan);
                }
            });
            return sale;
        },
        selectPercentageQuality(name, plan) {
            var d = new Date().getDate();
            var sale = 0;
            this.shops.sale.forEach(el => {
                if(el.store_id == name) {
                    // sale = el.total_sale;
                    sale = parseInt((el.total_sale * 100) / (plan / 30 * d));
                }
            });

            return sale;
        },
        getShops() {
            this.loading = true;
            var rts = this;
			const token = localStorage.getItem('token');
			if(token) {
				this.$axios({
					method: 'post',
					url: rts.$appUrl +`/api/usefull/shops`,
					headers: {
						"Authorization": `Bearer ${token}`
					}
				})
				.then(function(data){
                    console.log(data);
                    rts.loading = false;
					if(data.data.result == 'success') {
						rts.shops.list = data.data.shops;
                        rts.shops.sale = data.data.sale;
					}
					
				}).catch(error => {
					console.log(error);
                    rts.loading = false;
				});
			}
        }
    }
}
</script>
<style scoped>
.color-white {
    color: #fff;
}
@media (max-width: 768px) {
	.mobile-text {
        font-size: 14px;
    }
}
</style>