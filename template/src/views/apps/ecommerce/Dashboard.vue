<template>
	<div class="page-ecommerce-dashboard scrollable">
		<vue-html2pdf
			:show-layout="false"
			:float-layout="true"
			:enable-download="true"
			:preview-modal="false"
			:filename="'Бонус дэлгэрэнгүй'"
			:pdf-quality="3"
			:manual-pagination="true"
			:paginate-elements-by-height="1"
			pdf-format="a4"
			pdf-orientation="portrait"
			pdf-content-width="794px"
			ref="html2Pdf"
		>
			<section slot="pdf-content">
            	<section class="pdf-content">
					<div class="p-20">
						<table class="styled striped hover">
							<thead>
								<tr>
									<th>Огноо</th>
									<th align="right">Борлуулалт</th>
									<th align="right">Төлөвлөгөө</th>
									<th align="right">Бодогдох дүн</th>
									<th align="right">Ээлж</th>
									<th align="right">Бонус</th>
								</tr>
							</thead>
							<tbody>
								<tr v-for="item in sales.bonusList" :key="item.id" :style="{'cursor': 'pointer'}">
									<td>
										<div class="item-box item-customer">
											<p class="m-0 o-060">{{item.date}}</p>
										</div>
									</td>
									<td align="right">
										<div class="item-box item-customer">
											<p class="m-0 o-060">{{item.sale}}</p>
										</div>
									</td>
									<td align="right">
										<div class="item-box item-customer">
											<p class="m-0 o-060">{{item.plan}}</p>
										</div>
									</td>
									<td align="right">
										<div class="item-box item-customer">
											<p class="m-0 o-060">{{item.sale - (item.plan / item.cnt)}}</p>
										</div>
									</td>
									<td align="right">
										<div class="item-box item-customer">
											<p class="m-0 o-060">{{item.cnt}}</p>
										</div>
									</td>
									<td align="right">
										<div class="item-box item-customer">
											<p class="m-0 o-060">{{parseInt((item.sale - (item.plan / item.cnt)) * 0.07)}}</p>
										</div>
									</td>
								</tr>
								<tr>
									<td><b>НИЙТ</b></td>
									<td align="right"><b>{{totalSale}}</b></td>
									<td align="right"><b>{{totalPlan}}</b></td>
									<td align="right"><b>{{totalDiff}}</b></td>
									<td></td>
									<td align="right"><b>{{totalBonus}}</b></td>
								</tr>
							</tbody>
						</table>
					</div>
				</section>
			</section>
		</vue-html2pdf>
		<resize-observer @notify="__resizeHanlder" />
		<div class="card-base card-alt" v-loading.fullscreen.lock="loading">
			<el-row :gutter="30">
				<el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
					<div class="widget p-20">
						<div class="text-uppercase text-right flex">
							<div class="box grow">
								<h3 class="m-0">{{badges.workedDay}} хоног</h3>
								<p class="m-0">Ажилласан хоног</p>
							</div>
							<div class="icon-box ph-15 accent-text">
								<i class="mdi mdi-cart-outline"></i>
							</div>
						</div>
						<div class="progress-box mt-10" v-if="badges.defaultWorkDay > 0">
							<el-progress :percentage="parseInt((badges.workedDay * 100) / badges.defaultWorkDay)" class="themed"></el-progress>
						</div>
					</div>
				</el-col>
				<el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
					<div class="widget p-20">
						<div class="text-uppercase text-right flex">
							<div class="box grow">
								<h3 class="m-0" v-if="badges.workedTime != 0">{{String(badges.workedTime).split('.')[0]}}</h3>
								<h3 class="m-0" v-else>0</h3>
								<p class="m-0">Ажилласан цаг</p>
							</div>
							<div class="icon-box ph-15 accent-text">
								<i class="mdi mdi-currency-usd"></i>
							</div>
						</div>
						<div class="progress-box mt-10" v-if="badges.defaultWorkDay > 0">
							<el-progress :percentage="parseInt((badges.workedDay * 100) / badges.defaultWorkDay)" class="themed"></el-progress>
						</div>
					</div>
				</el-col>
				<el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
					<div class="widget p-20">
						<div class="text-uppercase text-right flex">
							<div class="box grow">
								<h3 class="m-0" v-if="badges.lostTime != 0 && badges.lostTime != null && badges.lostTime != ''">{{String(badges.lostTime).split('.')[0]}}</h3>
								<h3 class="m-0" v-else>0</h3>
								<p class="m-0">Хоцорсон цаг</p>
							</div>
							<div class="icon-box ph-15 accent-text">
								<i class="mdi mdi-cart-outline"></i>
							</div>
						</div>
						<!-- <div class="progress-box mt-10">
							<el-progress :percentage="23" class="themed"></el-progress>
						</div> -->
					</div>
				</el-col>
				<el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
					<div class="widget p-20">
						<div class="text-uppercase text-right flex">
							<div class="box grow">
								<h3 class="m-0">{{Number(badges.mealMoney).toLocaleString()}} ₮</h3>
								<p class="m-0">Хоолны мөнгө</p>
							</div>
							<div class="icon-box ph-15 accent-text">
								<i class="mdi mdi-currency-usd"></i>
							</div>
						</div>
						<div class="progress-box mt-10">
							<el-progress :percentage="37" class="themed"></el-progress>
						</div>
					</div>
				</el-col>
			</el-row>
		</div>
		
		<div class="card-base card-shadow--medium bg-white black-text ph-5 p-0 pb-20 mt-20">
			<el-row>
				<el-col :xs="24" :sm="12" :md="12" :lg="16" :xl="16">
					<div>
						<div id="chart" :style="{height:'500px',width:'100%'}"></div>
					</div>
				</el-col>
				<el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
					<!-- <div>
						<div id="pie" :style="{height:'500px',width:'100%'}"></div>
					</div> -->
					<el-row :gutter="20">
						<el-col :xs="24" :sm="24" :md="42" :lg="24" :xl="24">
							<div>
								<div align="center">
									<div style="position: relative;"><p style="font-size: 20px; margin-top: 20%;">Таны <strong>БОНУС</strong></p> 
									<el-tooltip class="item" effect="dark" content="Дэлгэрэнгүй" placement="top">
										<el-button @click="$refs.html2Pdf.generatePdf();" style="position: absolute; top: 0; left: 50%; margin-left: 70px;" icon="el-icon-download" size="mini" circle></el-button>
									</el-tooltip>
								</div>
									<el-button type="warning" size="mini" round style="width: 40%; font-size: 20px; padding: 20px; margin-top: -12px;"><strong>₮{{Number(badges.bonus.toFixed(0)).toLocaleString()}}</strong></el-button>
									<!-- <p style="font-size: 20px; margin-top: 5px;"><strong>БОНУС</strong> байна</p> -->
								</div>
								<div align="center">
									<p v-if="badges.planToday.length == 0" style="font-size: 20px; margin-top: 20%;">Танд өнөөдрийн ажлын хуваарь<br>тавигдаагүй байна.!</p>
									<el-row v-else style="margin-top: 50px;" class="registerBtns">
										<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" align="center">
											<el-dropdown trigger="click" v-if="!timeRegister.started" style="font-size: 20px;">
												<span class="el-dropdown-link">
													{{shops.selected.name}} <i class="el-icon-arrow-down el-icon--right" style="cursor: pointer;"></i>
												</span>
												<el-dropdown-menu slot="dropdown">
													<el-dropdown-item v-for="(i, index) in shops.list" :key="index" @click.native="changeDropdown(i)">{{i.name}}</el-dropdown-item>
												</el-dropdown-menu>
											</el-dropdown>
										</el-col>
										<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" style="font-size: 20px;" align="center">
											Хоцорсон цаг: <strong>{{timeRegister.lost}}</strong>
										</el-col>
										<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" style="margin-top: 20px; margin-bottom: 30px;">
											<el-button v-if="!timeRegister.started" size="mini" type="success" round style="width: 40%; font-size: 20px; padding: 20px;" :loading="loadingBtn.starttime" @click="startTime"><strong>00:00:00</strong></el-button>
											<el-button v-else type="danger" size="mini" round style="width: 40%; font-size: 20px; padding: 20px;" :loading="loadingBtn.endtime" @click="endTime"><strong>{{timeRegister.working}}</strong></el-button>
										</el-col>
									</el-row>
								</div>
							</div>
						</el-col>
					</el-row>
				</el-col>
			</el-row>
		</div>

		<div class="table-box card-base card-shadow--medium scrollable only-x mt-20">
			<table class="styled striped">
				<tbody>
					<tr v-for="(i, index) in buildUsers()" :key="index" style="vertical-align: middle;">
						<td width="5%">
							<i class="el-icon-trophy" v-if="index == 0" style="color: #ffd700;"></i>
							<i class="el-icon-trophy" v-else-if="index == 1" style="color: #c4cace;"></i>
							<i class="el-icon-trophy" v-else-if="index == 2" style="color: #a97142;"></i>
							<span v-else>{{index + 1}}</span>
						</td>
						<td width="10%">
							<div class="block mt-5">
								<el-avatar :size="30" :src="$appUrl+'/images/local/user/'+i.image">
									<img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"/>
								</el-avatar>
							</div>
						</td>
						<td>{{i.name}}</td>
						<td>
							<el-tooltip class="item" effect="dark" content="Тасаг" placement="top">
								<span class="o-050">{{i.shop}}</span>
							</el-tooltip>
						</td>
						<td>
							<el-tooltip class="item" effect="dark" content="Ажилтан" placement="top">
								<span class="o-050">{{i.rate}}</span>
							</el-tooltip>
						</td>
						<td>
							<el-tooltip class="item" effect="dark" content="Борлуулалт" placement="top">
								<span class="o-050">{{i.sale}}</span>
							</el-tooltip>
						</td>
						<td>
							<el-tooltip class="item" effect="dark" content="Хоцролт" placement="top">
								<span class="o-050">{{i.lost}}</span>
							</el-tooltip>
						</td>
						<td>
							<el-tooltip class="item" effect="dark" content="Санал гомдол" placement="top">
								<span class="o-050">{{i.feedback}}</span>
							</el-tooltip>
						</td>
						<td>
							<el-tooltip class="item" effect="dark" content="Тасаг орхилт" placement="top">
								<span class="o-050">{{i.response}}</span>
							</el-tooltip>
						</td>
						<td>
							<el-tooltip class="item" effect="dark" content="Дундаж" placement="top">
								<span class="o-100"><b>{{i.avg}}</b></span>
							</el-tooltip>
						</td>
					</tr>
				</tbody>
			</table>
        </div>

		<vue-scroll class="mt-20">
			<el-row :gutter="30">
				<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="table-box card-base card-outline">
					<table class="styled striped hover">
					<thead>
						<tr>
							<th>Ажилтан</th>
							<th>Үүсгэсэн огноо</th>
							<th>Захиалгын дугаар</th>
							<th>Төлөв</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="item in lastOrders" :key="item.id" :style="{'cursor': 'pointer'}" @click="goOrder(item.order_number)">
							<td>
								<div class="item-box item-product">
									<div class="product-image">
										<el-avatar :size="40" :src="$appUrl+'/images/local/user/'+item.img">
											<img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"/>
										</el-avatar>
									</div>
									<div>
										<h4 class="m-0">{{item.name}}</h4>
										<p class="m-0">{{item.shop}}</p>
									</div>
								</div>
							</td>
							<td>
								<div class="item-box item-customer">
									<h4 class="m-0 o-080">{{item.created_at.replaceAll('T', ' ').replaceAll('.000Z', ' ')}}</h4>
									<!-- <p class="m-0"><a>{{item.created_at}}</a></p> -->
								</div>
							</td>
							<td>
								<div class="item-box item-location">
									<!-- <h4 class="m-0 mb-5">{{item.address}}</h4> -->
									<p class="m-0 o-060">{{item.order_number}}</p>
								</div>
							</td>
							<td style="max-width: 150px;">
								<div class="item-box item-status" v-bind:class="{'status-Pending': item.stat == 1, 'status-Complete': item.stat == 2, 'status-Returned': item.stat == 3}">
									<h4 class="m-0 mb-5" v-if="item.stat == 1">Хүлээгдэж байгаа</h4>
									<h4 class="m-0 mb-5" v-else-if="item.stat == 2">Зөвшөөрөгдсөн</h4>
									<h4 class="m-0 mb-5" v-else-if="item.stat == 3">Татгалзсан</h4>
									<p class="m-0 o-060" v-if="item.stat == 2 || item.stat == 3">{{item.updated_at.replaceAll('T', ' ').replaceAll('.000Z', ' ')}}</p>
									<p class="m-0 o-060" v-else>-</p>
								</div>
							</td>
						</tr>
					</tbody>
				</table>
				</el-col>
			</el-row>
        </vue-scroll>
	
	</div>
</template>

<script>
import echarts from 'echarts'
import Chance from 'chance'
import VueHtml2pdf from 'vue-html2pdf'
const chance = new Chance()
var timer = null;
var working = null;
export default {
	name: 'EcommerceDashboard',
	components: {
		VueHtml2pdf
	},
	data () {
		return {
			chart: null,
			pie: null,
			gridData: [],
			loadingBtn: {
				starttime: false,
				endtime: false
			},
			loading: false,
			sales: {
				last: [],
				this: [],
				default: [],
				bonusList: []
			},
			badges: {
				workedDay: 0,
				workedTime: 0,
				lostTime: 0,
				mealMoney: 0,
				defaultWorkDay: 0,
				orderStatus: [],
				orderProduct: [],
				bonus: 0,
				planToday: []
			},
			shops: {
				selected: {
					name: '',
					code: '',
					start: '',
					second_part: ''
				},
				list: []
			},
			timeRegister: {
				started: false,
				data: [],
				lost: '00:00:00',
				starttime: '00:00:00',
				working: '00:00:00'
			},
			lastOrders: [],
			rowWidth: 24,
			showDownloadProduct: false,
			registerAvailable: true,
			rank: {
				lose: [],
				sale: [],
				shopReviews: [],
				userReviews: []
			}
		}
	},
	created() {
		// this.initGridData()
	},
	mounted() {
		// var raw = navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./);
		// console.log(raw, raw ? parseInt(raw[2], 10) : false);
		window.addEventListener('resize', this.__resizeHanlder)
		var user = JSON.parse(localStorage.user);
		if(user.posID == 1 || user.posID == 2) {
			this.rowWidth = 18;
			this.showDownloadProduct = true;
		}
		this.getDashboard();
		this.getShops();
	},
	beforeDestroy() {
		if (!this.chart) {
			return
		}

		if (!this.pie) {
			return
		}
		
		window.removeEventListener('resize', this.__resizeHanlder)
		this.chart.dispose()
		this.pie.dispose()
		this.chart = null
		this.pie = null
	},
	beforeRouteLeave (to, from , next) {
        clearInterval(timer);
		clearInterval(working);
        next();
    },
	computed: {
		totalSale() {
			var total = 0;
			this.sales.bonusList.forEach(el => {
				total += el.sale;
			});
			return total;
		},
		totalPlan() {
			var total = 0;
			this.sales.bonusList.forEach(el => {
				total += el.plan;
			});
			return total;
		},
		totalDiff() {
			var total = 0;
			this.sales.bonusList.forEach(el => {
				total += el.sale - (el.plan / el.cnt);
			});
			return total;
		},
		totalBonus() {
			var total = 0;
			this.sales.bonusList.forEach(el => {
				total += (el.sale - (el.plan / el.cnt)) * 0.07;
			});
			return parseInt(total);
		}
	},
	methods: {
		getShopReview(item) {
            var rate = 0, index = 0;
            this.rank.shopReviews.forEach(el => {
                if(el.storeId == item) {
                    rate += el.total_shop;
                    index++;
                }
            });
            if(index > 0) {
                return parseInt(rate / index);
            }
            return 0;
        },
		buildUsers() {
            var users = [];
            this.rank.lose.forEach(el => {
                var lost = 0, rate = 0, sale = 0;
                if(el.losttime == 0) {
                    lost = 100;
                } else if(el.losttime >= 60) {
                    lost = 0;
                } else {
                    var e = el.losttime * 100 / 60;
                    lost = parseInt(100 - e);
                }
                this.rank.userReviews.forEach(u => {
                    if(u.userId == el.user_id) {
                        rate = u.percent;
                    }
                });

                this.rank.sale.forEach(s => {
                    if(s.user_id == el.user_id) {
                        if(s.percent > 100) {
                            sale = 100;
                        } else {
                            sale = s.percent;
                        }
                    }
                });

				var calcSale = sale * 40 / 100;
				var calcLost = lost * 5 / 100;
				var calcRate = rate * 18 / 100;
				var calcFeed = el.feedback * 6 / 100;
				var calcRes = el.response * 10 / 100;
				var calcShop = this.getShopReview(el.call_store) * 15 / 100;
				
                users.push({name: el.name, image: el.img, userId: el.user_id, avg: (calcSale + calcLost + calcRate + calcFeed + calcRes + calcShop + 6).toFixed(1), lost, rate, sale, feedback: el.feedback, response: el.response, shop: this.getShopReview(el.call_store)});
            });
            function compare(a, b) {
				if (a.avg > b.avg)
					return -1;
				if (a.avg < b.avg)
					return 1;
				return 0;
			}
			users =  users.sort(compare);
            return users;
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
                    rts.loading = false;
					if(data.data.result == 'success') {
                        rts.rank.lose = data.data.lose;
                        rts.rank.sale = data.data.EmpSale;
                        rts.rank.shopReviews = data.data.shopReview;
                        rts.rank.userReviews = data.data.reviewUsers;
                        // rts.buildUsers();
					}
					
				}).catch(error => {
					console.log(error);
                    rts.loading = false;
				});
			}
        },
		goOrder(ordernumber) {
			this.$router.push({name:'ecommerce-show-order', params: {id: ordernumber}})
		},
		endTime() {
			var location = localStorage['cache-system-id'];
			if(location === undefined) {
				this.$notify({
					title: 'Амжилтгүй',
					dangerouslyUseHTMLString: true,
					message: `Бүртгэлтэй төхөрөөмжөөс хандана уу`,
					type: 'error'
				});
			} else {
				var dt = new Date();
				var min = dt.getMinutes();
				var hour = dt.getHours();
				var sec = dt.getSeconds();
				if(hour < 10) {
					hour = '0' + hour; 
				}
				if(min < 10) {
					min = '0' + min;
				}
				if(sec < 10) {
					sec = '0' + sec;
				}
				var endtime = hour + ':' + min + ':' + sec;
				var rts = this;
				const token = localStorage.getItem('token');
				this.loadingBtn.endtime = true;
				if(token) {
					this.$axios({
						method: 'post',
						url: rts.$appUrl +`/api/user/end-time-register`,
						headers: {
							"Authorization": `Bearer ${token}`
						},
						data: {
							endtime
						}
					}).then(data => {
						rts.loadingBtn.endtime = false;
						if(data.data.result == 'success') {
							rts.$notify({
								title: 'Амжилттай',
								dangerouslyUseHTMLString: true,
								message: `Цаг хаагдлаа`,
								type: 'success'
							});
							clearInterval(working);
							rts.timeRegister.started = false;
							rts.timeRegister.workingTimeUpdate = '00:00:00';
							rts.timeRegister.lost = '00:00:00';
						}
					});
				}
			}
		},
		
		startTime() {
			var location = localStorage['cache-system-id'];
			if(location === undefined) {
				this.$notify({
					title: 'Амжилтгүй',
					dangerouslyUseHTMLString: true,
					message: `Бүртгэлтэй төхөрөөмжөөс хандана уу`,
					type: 'error'
				});
			} else {
				if(location == this.shops.selected.code) {
					if(this.registerAvailable) {
						var dt = new Date();
						var min = dt.getMinutes();
						var hour = dt.getHours();
						var sec = dt.getSeconds();
						if(hour < 10) {
							hour = '0' + hour; 
						}
						if(min < 10) {
							min = '0' + min;
						}
						if(sec < 10) {
							sec = '0' + sec;
						}
						this.timeRegister.starttime = hour + ':' + min + ':' + sec;

						var rts = this;
						const token = localStorage.getItem('token');
						this.loadingBtn.starttime = true;
						if(token) {
							this.$axios({
								method: 'post',
								url: rts.$appUrl +`/api/user/start-time-register`,
								headers: {
									"Authorization": `Bearer ${token}`
								},
								data: {
									start: this.timeRegister.starttime,
									address: this.shops.selected.code,
									lost: this.timeRegister.lost,
									address_name: this.shops.selected.name
								}
							}).then(data => {
								rts.loadingBtn.starttime = false;
								if(data.data.result == 'success') {
									console.log(data);
									rts.$notify({
										title: 'Амжилттай',
										dangerouslyUseHTMLString: true,
										message: `Цаг бүртгэгдлээ`,
										type: 'success'
									});
									clearInterval(timer);
									this.timeRegister.started = true;
									working = setInterval(this.workingTimeUpdate, 1000);

								} else if(data.data.result == 'registered') {

									rts.$notify({
										title: 'Амжилтгүй',
										dangerouslyUseHTMLString: true,
										message: `Аль хэдийн бүртгэгдсэн`,
										type: 'error'
									});

								} else if (data.data.result == 'noreport') {

									rts.$notify({
										title: 'Амжилтгүй',
										dangerouslyUseHTMLString: true,
										message: `<strong>${data.data.lostDay}</strong> өдрийн тайлан илгээгдээгүй байна`,
										type: 'error'
									});

								}
							});
						}
					}
				} else {
					this.$notify({
						title: 'Амжилтгүй',
						dangerouslyUseHTMLString: true,
						message: `Буруу байршил`,
						type: 'error'
					});
				}
			}
		},
		changeDropdown(shop) {
			this.shops.selected = shop;
		},
		checkRegister() {
			// console.log(this.shops.selected);
			if(this.timeRegister.data.length == 0) {
				this.timeUpdate();
				timer = setInterval(this.timeUpdate, 1000);
			} else {
				var started = false;
				this.timeRegister.data.forEach(el => {
					if(el.endtime == '0') {
						this.timeRegister.started = true;
						this.timeRegister.lost = el.lost;
						this.timeRegister.starttime = el.starttime;
						working = setInterval(this.workingTimeUpdate, 1000);
						started = false;
					}
				});
			}
		},
		workingTimeUpdate() {
			var dt = new Date();
			var min = dt.getMinutes();
			var hour = dt.getHours();
			var sec = dt.getSeconds();

			var now = new Date("01/01/2007 " + hour + ':' + min + ':' + sec);
			var started = new Date("01/01/2007 " + this.timeRegister.starttime);
			var diff = Math.abs(Math.round((now.getTime() - started.getTime()) / 1000));
			var hour = Math.floor(diff / 3600);
			var min = Math.floor( (diff - (hour * 3600)) / 60);
			var sec = diff % 60;
				if(sec < 10) {
                    sec = '0' + sec;
                }
				if (hour < 10) {
					hour = '0' + hour;
				}
				if(min < 10) {
					min = '0' + min;
				}
			this.timeRegister.working = hour + ':' + min + ':' + sec;
		},
		timeUpdate() {
			// console.log(this.shops.selected.start);
			var dt = new Date();
			// s = s.getFullYear() + '-' + ((s.getMonth() > 8) ? (s.getMonth() + 1) : ('0' + (s.getMonth() + 1))) + '-' + ((s.getDate() > 9) ? s.getDate() : ('0' + s.getDate())) + ' 00:00:00';
			var min = (dt.getMinutes() > 9) ? dt.getMinutes() : ('0' + dt.getMinutes());
			var hour = (dt.getHours() > 9) ? dt.getHours() : ('0' + dt.getHours());
			var sec = (dt.getSeconds() > 9) ? dt.getSeconds() : ('0' + dt.getSeconds());
			var v = hour + ':' + min + ':' + sec;
			var defaultTime;
			if(this.shops.selected.second_part == 'none') {
				defaultTime = this.shops.selected.start;
			} else {
				var check1 = new Date("01/01/2007 " + v);
				var check2 = new Date("01/01/2007 " + this.shops.selected.second_part);
				if(check2 < check1) {
					defaultTime = this.shops.selected.second_part;
				} else {
					var check_diff = Math.abs(Math.round((check2.getTime() - check1.getTime()) / 1000));
					var check_hour = Math.floor(check_diff / 3600);
					if(check_hour > 1) {
						defaultTime = this.shops.selected.start;
					} else {
						defaultTime = this.shops.selected.second_part;
					}
				}
			}
			if(defaultTime >= v) {
				this.timeRegister.lost = '00:00:00';
			} else {
				var now = new Date("01/01/2007 " + v);
				var def = new Date("01/01/2007 " + defaultTime);
				var diff = Math.abs(Math.round((now.getTime() - def.getTime()) / 1000));
				var hour = Math.floor(diff / 3600);
				var min = Math.floor( (diff - (hour * 3600)) / 60);
				var sec = diff % 60;
				if(sec < 10) {
                    sec = '0' + sec;
                }
				if (hour < 10) {
					hour = '0' + hour;
				}
				if(min < 10) {
					min = '0' + min;
				}
				this.timeRegister.lost = hour + ':' + min + ':' + sec;
			}
		},
		getDashboard() {
			var rts = this;
			this.loading = true;
			const token = localStorage.getItem('token');
			if(token) {
				this.$axios({
					method: 'post',
					url: rts.$appUrl +`/api/dashboard/ecommerce`,
					headers: {
						"Authorization": `Bearer ${token}`
					}
				})
				.then(function(data){
					rts.loading = false;
					if(data.data.result == 'success') {
						rts.sales.bonusList = data.data.bonusList;
						rts.sales.last = data.data.subMonthAmount;
						rts.sales.this = data.data.thisMonthAmount;
						rts.sales.default = data.data.defaultAmount;
						rts.badges.defaultWorkDay = data.data.defaultWorkDay;
						rts.badges.workedDay = data.data.worked;
						if(data.data.time.length > 0) {
							rts.badges.workedTime = data.data.time[0].total_time;
							rts.badges.lostTime = data.data.time[0].total_lost_time;
						}
						rts.badges.mealMoney = data.data.meal * 4000;
						rts.badges.bonus = data.data.bonus;
						rts.badges.planToday = data.data.plan;
						rts.shops.list = data.data.shops;
						if (data.data.shops.length > 0) {
							rts.shops.selected = data.data.shops[0];
						}
						rts.timeRegister.data = data.data.register;
						rts.lastOrders = data.data.orders;
						rts.initChart();
						rts.checkRegister();
						// rts.initPie()
					}
				}).catch(error => {
					rts.loading = false;
					console.log(error);
				});
			}
		},
		__resizeHanlder: _.throttle(function (e) {
			if (this.chart) {
				this.chart.resize()
			}
			if (this.pie) {
				this.pie.resize()
			}
		}, 700),
		initChart() {
			
			this.chart = echarts.init(document.getElementById('chart'))
			this.chart.setOption({
				//backgroundColor: '#394056',
				title: {
					top: 20,
					text: 'Sales',
					textStyle: { fontWeight: 'normal', fontSize: 16, fontFamily:'Nunito Sans' /*color: '#F1F1F3'*/ },
					left: '1%'
				},
				tooltip: {
					trigger: 'axis',
					axisPointer: { lineStyle: { /*color: '#57617B'*/ } }
				},
				legend: {
					top: 40,
					icon: 'rect',
					itemWidth: 14,
					itemHeight: 5,
					itemGap: 13,
					data: ['This month', 'Last month', 'Daily plan'],
					right: '4%',
					textStyle: { fontSize: 12, fontFamily:'Nunito Sans' /*color: '#F1F1F3'*/ }
				},
				grid: {
					top: 100,
					left: '-5px',
					right: '30px',
					bottom: '2%',
					containLabel: true
				},
				xAxis: [{
					type: 'category',
					boundaryGap: false,
					axisLine: { lineStyle: { /*color: '#57617B'*/ } },
					data: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31]
				}],
				yAxis: [{
					show: false,
					type: 'value',
					name: '(%)',
					axisTick: { show: false },
					axisLine: { lineStyle: { /*color: '#57617B'*/ } },
					axisLabel: {
						margin: 10,
						textStyle: { fontSize: 14 }
					},
					splitLine: { lineStyle: { color: '#eee' /*color: '#57617B'*/ } }
				}],
				series: [{
					name: 'This month',
					type: 'line',
					smooth: true,
					symbol: 'circle',
					symbolSize: 5,
					showSymbol: false,
					lineStyle: { normal: { width: 1 } },
					areaStyle: {
						normal: {
							color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
								offset: 0,
								color: 'rgba(19, 206, 102, 0.3)'
							}, {
								offset: 0.8,
								color: 'rgba(19, 206, 102, 0)'
							}], false),
							shadowColor: 'rgba(0, 0, 0, 0.1)',
							shadowBlur: 10
						}
					},
					itemStyle: {
						normal: {
							color: 'rgb(19, 206, 102)',
							borderColor: 'rgba(19, 206, 102, 0.27)',
							borderWidth: 12
						}
					},
					data: this.sales.this
				}, {
					name: 'Last month',
					type: 'line',
					smooth: true,
					symbol: 'circle',
					symbolSize: 5,
					showSymbol: false,
					lineStyle: { normal: { width: 1 } },
					areaStyle: {
						normal: {
							color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
								offset: 0,
								color: 'rgba(95, 143, 223, 0.3)'
							}, {
								offset: 0.8,
								color: 'rgba(95, 143, 223, 0)'
							}], false),
							shadowColor: 'rgba(0, 0, 0, 0.1)',
							shadowBlur: 10
						}
					},
					itemStyle: {
						normal: {
							color: 'rgb(95, 143, 223)',
							borderColor: 'rgba(95, 143, 223, 0.2)',
							borderWidth: 12
						}
					},
					data: this.sales.last
				}, {
					name: 'Daily plan',
					type: 'line',
					smooth: true,
					symbol: 'circle',
					symbolSize: 5,
					showSymbol: false,
					lineStyle: { normal: { width: 1 } },
					areaStyle: {
						normal: {
							color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
								offset: 0,
								color: 'rgba(236, 32, 95, 0.3)'
							}, {
								offset: 0.8,
								color: 'rgba(236, 32, 95, 0)'
							}], false),
							shadowColor: 'rgba(0, 0, 0, 0.1)',
							shadowBlur: 10
						}
					},
					itemStyle: {
						normal: {
							color: 'rgb(236, 32, 95)',
							borderColor: 'rgba(236, 32, 95, 0.2)',
							borderWidth: 12
						}
					},
					data: this.sales.default
				}]
			})
		},
		initPie() {
			this.pie = echarts.init(document.getElementById('pie'))
			var colors = ['rgb(95, 143, 223)','rgb(19, 206, 102)','rgb(247, 186, 43)','rgb(204, 57, 57)'];
			var colors2 = ['#3f84f6', '#4c8bf7', '#5a95f7', '#70a3f8', '#8ab4fa', '#a3c4fb', '#bfd6fc', '#d4e4fd', '#d7e4f7', '#e6eefa'];
			var vals = []; var vals2 = [];
			this.orderStatus.forEach((el, index) => {
				if(index == 0) {
					vals.push({value: el.count, name: el.position_name, selected: true, itemStyle: { normal: { color: colors[index]}}});
				} else {
					vals.push({value: el.count, name: el.position_name, selected: false, itemStyle: { normal: { color: colors[index]}}});
				}
			});

			this.orderProduct.forEach((el, index) => {
				vals2.push({value: el.qty, name: el.model, itemStyle: { normal: { color: colors2[index]}}});
			});

			this.pie.setOption({
				title: {
					top: 20,
					text: 'ORDER STATUS',
					textStyle: { fontWeight: 'normal', fontSize: 16, fontFamily:'Nunito Sans' /*color: '#F1F1F3'*/ },
					left: '1%'
				},
				tooltip: {
					trigger: 'item',
					formatter: "{a} <br/>{b}: {c} ({d}%)"
				},
				series: [
					{
						name:'Status',
						type:'pie',
						selectedMode: 'single',
						radius: [0, '35%'],

						label: {
							normal: {
								position: 'inner'
							}
						},
						labelLine: {
							normal: {
								show: false
							}
						},
						data: vals,
					},
					{
						name:'Products',
						type:'pie',
						radius: ['45%', '60%'],
						
						data: vals2,

						itemStyle: {
							normal: {
								color: 'rgb(19, 206, 102)',
							}
						},
					}
				]
			})
		},
		initGridData() {
			const year = new Date().getFullYear()
			const status_list = ['Complete', 'Pending', 'Returned', 'Paid']

			_.times(10, (number) => {
				let price = chance.floating({ min: 1, max: 100, fixed: 2 })
				let qnt = chance.integer({ min: 1, max: 5 })
				let amount = price * qnt

				this.gridData.push({
					customer: chance.name(),
					photo: '/static/images/shop/'+chance.integer({ min: 0, max: 19 })+'.jpg',
					city: chance.city(),
					address: chance.address(),
					email: chance.email(),
					product: chance.sentence({ words: 3 }),
					price: _.replace(price.toFixed(2).toString(), '.', ','),
					qnt,
					amount: _.replace(amount.toFixed(2).toString(), '.', ','),
					status: status_list[chance.integer({ min: 0, max: 3 })],
					date: chance.date({string: true, year: year}),
					id: number
				})
			})
		}
	}
}
</script>

<style lang="scss">
@import '../../../assets/scss/_variables';

.page-ecommerce-dashboard {
	.widget {
		.icon-box {
			font-size: 30px;
		}
	}

	.table-box {
		.item-box {
			&.item-product {
				.product-image {
					width: 50px;
					margin-right: 15px;
					float: left;

					img {
						width: 100%;
					}
				}
			}

			&.item-status {
				padding: 5px 10px;

				&.status- {
					&Complete { background: rgba(44, 196, 120, 0.25); }
					&Pending { background: rgba(247, 186, 42, 0.25); }
					&Returned { background: rgba(243, 24, 71, 0.25); }
					&Paid { background: rgba(45, 109, 211, 0.25); }
				}
			}
		}
	}
}

@media (max-width: 768px) {
  .registerBtns {
    visibility: hidden;
    display: none;
  }
}

</style>


