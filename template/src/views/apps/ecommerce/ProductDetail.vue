<template>
	<div class="page-ecommerce-product-detail scrollable only-y" v-loading.fullscreen.lock="loading">
		
		<el-breadcrumb separator="/" class="themed">
			<el-breadcrumb-item :to="'/products'">Бүтээгдэхүүний жагсаалт</el-breadcrumb-item>
			<el-breadcrumb-item>{{product.detail.model}}</el-breadcrumb-item>
		</el-breadcrumb>

		<el-row class="mt-30">
			<el-col>
				<div class="item-box card-shadow--medium">
					<el-row>
						<el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
							<div class="gallery-box">
								<div class="main-photo" ref="imageDiv" style="padding: 0;">
									<!-- <img 
										:src="$imgUrl+product.detail.image"
										:data-zoom="$imgUrl+product.detail.image"
									> -->
									<el-carousel indicator-position="none" :style="{'width': '100%', height: imageHeight + 'px', 'overflow': 'hidden'}" arrow="hover">
										<el-carousel-item v-for="item in 4" :key="item" :style="{'width': '100%', height: imageHeight + 'px', 'display': 'flex'}">
											<img 
												:src="$imgUrl+product.detail['image'+item]"
												style="width: 80%; margin: auto;"
											>
										</el-carousel-item>
									</el-carousel>
								</div>
							</div>
						</el-col>
						<el-col :xs="24" :sm="12" :md="12" :lg="16" :xl="16">
							<div class="detail-box">
								<h1 class="title">{{product.detail.name}}</h1>
								<h4 class="title"><span id="model-tag">{{product.detail.model}}</span><span class="o-080"> {{product.detail.color_name}}</span></h4>
								<div class="rate">
									<el-rate v-model="rate" style="width: 120px; display: inline-block;" disabled></el-rate>
									<span class="review fs-12 o-070">(0 customer review)</span>
								</div>
								<div class="price-box">
									<span class="discounted-price" id="sale-price-tag" v-if="loggedUser.posID < 6">₮ {{Number(product.detail.sale_price).toLocaleString()}}</span> 
									<span class="discounted-price" id="sale-price-tag" v-else>₮ {{Number(product.detail.wholesale_price).toLocaleString()}}</span> 
									<span class="discounted-price o-060" :style="{'color': 'black', 'font-size': '15px', 'margin-left': '-10px'}" v-if="loggedUser.posID < 6">₮ {{Number(product.detail.wholesale_price).toLocaleString()}}</span> 
									<span class="discount" v-if="product.detail.discount > 0">{{product.detail.discount}}% off</span>
								</div>
								<div class="price-box" :style="{'margin-top': '-20px'}">
									Нийт үлдэгдэл: 
									<strong v-if="product.detail.total > 200">200+</strong>
									<strong v-else>{{Number(product.detail.total).toLocaleString()}}</strong>
								</div>
								<div class="description">
									{{product.detail.description}}
								</div>
								<div class="actions-box">
									<el-input-number v-model="qnt" controls-position="right" :min="1" :max="product.detail.total" class="themed mr-10"></el-input-number>
									<!-- <el-button class="themed mb-10 ml-0" type="primary" plain><i class="mdi mdi-heart-outline"></i> Хадгалах</el-button> -->
									<el-button-group v-if="loggedUser.posID == 1 || loggedUser.posID == 2 || loggedUser.posID == 4">
										<el-button @click="addToCart(product.detail.id, product.detail.model)" class="mb-2 themed mr-10 " type="primary" plain><i class="mdi mdi-cart-outline"></i> Сагсанд нэмэх</el-button>
										<el-button icon="el-icon-setting" v-if="loggedUser.posID == 1 || loggedUser.posID == 2 || loggedUser.posID == 4" @click="modals.drawer = true" circle></el-button>
										<el-button icon="el-icon-download" v-if="loggedUser.posID == 1 || loggedUser.posID == 2 || loggedUser.posID == 4" @click="modals.chooseTemplate = true" circle></el-button>
										<el-button icon="el-icon-delete" v-if="loggedUser.posID == 1 || loggedUser.posID == 2 || loggedUser.posID == 4" @click="deleteProduct" circle></el-button>
									</el-button-group>
									<el-button v-else @click="addToCart(product.detail.id, product.detail.model)" class="mb-2 themed mr-10 " type="primary" plain><i class="mdi mdi-cart-outline"></i> Сагсанд нэмэх</el-button>
								</div>
							</div>
						</el-col>
					</el-row>
				</div>
			</el-col>
		</el-row>

		<el-row class="mt-20" v-if="loggedUser.posID < 6">
			<el-col>
				<div class="item-box p-30">
					<el-tabs v-model="activeTab" class="themed">
						<el-tab-pane label="Салбарын үлдэгдэлүүд" name="description">
							<div class="table-box card-base card-shadow--medium scrollable only-x">
								<table class="styled striped">
									<thead>
										<tr :style="{'font-size': '14px'}">
											<th>Салбарын нэр</th>
											<th>Үлдэгдэл</th>
											<th>Гэмтэлтэй</th>
											<th>Нийт үлдэгдлээс эзлэх хувь</th>
										</tr>
									</thead>
									<tbody>
										<tr v-for="item in location" :key="item.code">
											<td>{{item.name}}</td>
											<td>{{Number(product.detail[item.code]).toLocaleString()}}</td>
											<td>{{getRma(item)}}</td>
											<td>
												<!-- {{Number((product.detail[item.code]) * 100 / product.detail.total).toLocaleString()}} -->
												<el-progress v-if="product.detail.total > 0" :percentage="(product.detail[item.code]) * 100 / product.detail.total" :show-text="false" :color="customColors"></el-progress>
												<el-progress v-else :percentage="0" :show-text="false" :color="customColors"></el-progress>
											</td>
										</tr>
									</tbody>
								</table>
							</div>
						</el-tab-pane>
						<el-tab-pane label="Reviews (0)" name="reviews">
							Leave a review
						</el-tab-pane>
					</el-tabs> 
				</div>
			</el-col>
		</el-row>

		<el-drawer
		title="Бүтээгдэхүүн засварлах"
		:visible.sync="modals.drawer"
		:size="drawerWidth+'%'">
			<div class="ml-20 mr-20">
				<el-row :gutter="10">
					<el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12" class="mt-10">
						<el-input placeholder="Бүтээгдэхүүний нэр" v-model="product.detail.name" clearable> </el-input>
					</el-col>
					<el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12" class="mt-10">
						<el-input placeholder="Бүтээгдэхүүний модель" v-model="product.detail.model" clearable> </el-input>
					</el-col>
					<el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12" class="mt-10">
						<el-input placeholder="Бар код" v-model="product.detail.code" clearable> </el-input>
					</el-col>
					<el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12" class="mt-10">
						<el-input placeholder="Үлдэгдэл" v-model="product.detail.remain" clearable> </el-input>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mt-10">
						<el-input placeholder="Тайлбар" type="textarea" :rows="5" v-model="product.detail.description" clearable> </el-input>
					</el-col>
					<el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8" class="mt-10">
						<el-input placeholder="Өртөг үнэ" v-model="product.detail.cost_price" clearable> </el-input>
					</el-col>
					<el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8" class="mt-10">
						<el-input placeholder="Бөөний үнэ" v-model="product.detail.wholesale_price" clearable> </el-input>
					</el-col>
					<el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8" class="mt-10">
						<el-input placeholder="Худалдах үнэ" v-model="product.detail.sale_price" clearable> </el-input>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mt-10">
						<el-select v-model="product.detail.brand" filterable placeholder="Брэнд" style="width: 100%">
							<el-option
							v-for="(item, index) in brands"
							:key="index"
							:label="item.brandname"
							:value="item.id">
							</el-option>
						</el-select>
					</el-col>
					<el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12" class="mt-10">
						<el-select v-model="product.detail.type" filterable placeholder="Үндсэн категори" style="width: 100%">
							<el-option
							v-for="(item, index) in category"
							:key="index"
							:label="item.category_name"
							:value="item.id">
							</el-option>
						</el-select>
					</el-col>
					<el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12" class="mt-10">
						<el-select v-model="product.detail.category_sub_id" filterable placeholder="Дэд категори" style="width: 100%">
							<el-option
							v-for="(item, index) in filterSub"
							:key="index"
							:label="item.sub_category_name"
							:value="item.id">
							</el-option>
						</el-select>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mt-10" align="center">
						<el-button type="info" plain style="width: 100%;" @click="editProduct">Хадгалах</el-button>
					</el-col>
				</el-row>
			</div>
		</el-drawer>
		<!-- <img class="image-logo" src="@/assets/images/frame.jpg" alt="logo" id="sample" hidden/> -->
		<div style="display: none;">
			<canvas id='textCanvas' height="100" width="200"></canvas>
			<img id='imageCreate'>

			<canvas id='textCanvasModel' height="100" width="200"></canvas>
			<img id='imageModelCreate'>	
			<img id="backgroundImageSlot">
			<canvas id='CanvasBackground' height="1000" width="1000"></canvas>
		</div>

		<el-dialog title="Загвараа сонгоно уу" :visible.sync="modals.chooseTemplate" :width="templateWidth+'%'">
			<el-carousel :interval="5000" type="card" height="460px">
				<el-carousel-item v-for="(item, index) in templates" :key="index">
					<div style="position: relative;" align="center">
						<img :src="$appUrl + '/images/local/template/' + item.image" ref="imgWidth" alt="" style="width: 460px; height: auto;" @click="selectTemplate(item)">
						<h3 class="medium" style="font-weight: 700; margin-top: -260px;">{{ item.name }}</h3>
					</div>
				</el-carousel-item>
			</el-carousel>
		</el-dialog>
		
		<el-dialog title="Өнгө сонгох" :visible.sync="modals.chooseBackground" :width="templateWidth+'%'">
			<div align="center">
				<div class="mb-10">
					<el-input-number v-model="table.width" placeholder="Хүснэгтийн өргөн" :min="1"></el-input-number>
					<el-input-number class="ml-5" v-model="table.top" placeholder="Дээрээс авах зай" :min="1"></el-input-number>
					<el-input-number class="ml-5" v-model="table.right" placeholder="Баруун талаас авах зай" :min="1"></el-input-number>
					<el-input-number class="ml-5" v-model="table.size" placeholder="Фонт" :min="1"></el-input-number>
				</div>
				<div style="width: 800px; height: auto; position: relative;" ref="convertMe">
					<table :style="{'position': 'absolute', 'color': `${table.color}`, right: `${table.right}px`, top: `${table.top}px`, 'font-size': `${table.size}px`}" :width="table.width + 'px'">
						<tr><th colspan="2">Техникийн үзүүлэлт</th></tr>
						<tr>
                            <th class="px-4 px-xl-5 border-top-0" width="50%" align="right">Brand</th>
                            <td class="border-top-0 pl-10" width="50%">{{product.detail.brandname}}</td>
                        </tr>
                        <tr>
                            <th class="px-4 px-xl-5" width="50%" align="right">Model</th>
                        	<td class="pl-10" width="50%">{{product.detail.model}}</td>
                        </tr>
                        <tr>
                            <th class="px-4 px-xl-5" width="50%" align="right">Color</th>
                            <td class="pl-10" width="50%">{{product.detail.color_name}}</td>
                        </tr>
						<tr v-for="(item) in checkSpecs()" :key="item">
                            <th class="px-4 px-xl-5" width="50%" align="right">{{item.replace('_', ' ')}}</th>
                            <td class="pl-10" width="50%" >{{specs[0][item]}}</td>
                        </tr>
					</table>
					<img style="width: 100%; height: auto" :src="backgroundBs64">
				</div>
				<div class="block" style="position: absolute; right: 50px; top: 50px;">
					<el-color-picker v-model="color" @change="changeColor"></el-color-picker>
					<el-color-picker v-model="table.color"></el-color-picker>
				</div>
			</div>
			<span slot="footer" class="dialog-footer">
				<el-button @click="modals.chooseBackground = false">Болих</el-button>
				<el-button type="primary" @click="convertCanvas">Татах</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import Drift from 'drift-zoom'
import mergeImages from 'merge-images';
export default {
	name: 'EcommerceProductDetail',
	data () {
		return {
			table: {
				width: 280,
				color: '#fff',
				right: 10,
				top: 70,
				size: 14
			},
			bgOutput: null,
			color: '#373435',
			backgroundBs64: '',
			specs: [],
			MoreDetail: [],
			templates: [],
			template: {
				image: 'frame.jpg',
				marginX: 0,
				marginY: 0,
				logoX: 0,
				logoY: 0,
				descX: 0,
				descY: 0,
				modelX: 0,
				modelY: 0,
				priceX: 0,
				priceY: 0,
				showLogo: false,
				showDesc: false
			},
			rate: 4,
			drawerWidth: 30,
			templateWidth: 70,
			imageHeight: 100,
			loading: false,
			qnt: 1,
			activeTab: 'description',
			product: {
				id: 0,
				detail: []
			},
			location: [],
			modals: {
				drawer: false,
				chooseTemplate: false,
				chooseBackground: false
			},
			customColors: [
				{color: '#f56c6c', percentage: 20},
				{color: '#e6a23c', percentage: 40},
				{color: '#5cb87a', percentage: 60},
				{color: '#1989fa', percentage: 80},
				{color: '#6f7ad3', percentage: 100}
			],
			loggedUser: [],
			rma: [],
			brands: [],
			category: [],
			sub: []
		}
	},
	mounted() {
		const mainPhoto = document.querySelector('.main-photo img')
		const paneContainer = document.querySelector('.main-photo')
		this.loggedUser = JSON.parse(localStorage.getItem('user'));
		new Drift(mainPhoto, {
			paneContainer: paneContainer,
			inlinePane: false,
			zoomFactor: 2
		});

		this.product.id = this.$route.params.id;
		this.getInfo();
		this.resizePopoverWidth();
		window.addEventListener('resize', this.resizePopoverWidth);
	},

	beforeDestroy() {
		window.removeEventListener('resize', this.resizePopoverWidth);
	},
	computed: {
		filterSub() {
			var arr = [];
			this.sub.forEach(el => {
				if(el.categoryID == this.product.detail.type) {
					arr.push(el);
				}
			});
			return arr;
		}
	},
	methods: {
		checkSpecs() {
            if(this.specs.length > 0) {
				return this.MoreDetail[0].specs.split('#');
			} else {
				return 0;
			}
        },
		async convertCanvas() {
			
			function convertImageToBase64(img, outputFormat) {
				var originalWidth = img.style.width;
				var originalHeight = img.style.height;

				img.style.width = "auto";
				img.style.height = "auto";
				img.crossOrigin = "Anonymous";
				
				var canvas = document.createElement("canvas");
				canvas.width = img.width;
				canvas.height = img.height;

				var ctx = canvas.getContext("2d");
				ctx.drawImage(img, 0, 0);

				img.style.width = originalWidth;
				img.style.height = originalHeight;
				
				
				var dataUrl = canvas.toDataURL(outputFormat);

				
				return dataUrl;
			}

			function convertImageUrlToBase64(url, callback, outputFormat){
				var img = new Image();
				img.crossOrigin = 'anonymous';
				img.onload = function(){
					callback(convertImageToBase64(this, outputFormat));
				};
				img.src = url;
			}

			var rts = this;
			var bCtx = document.getElementById('CanvasBackground').getContext('2d'),
			bElem = document.getElementById('backgroundImageSlot');
			bCtx.fillStyle = this.color;
			bCtx.fillRect(0, 0, document.getElementById('CanvasBackground').width, document.getElementById('CanvasBackground').height);
			bElem.src = bCtx.canvas.toDataURL();
			var b64 = bElem.src;


			var tCtx = document.getElementById('textCanvas').getContext('2d'),
    		imageElem = document.getElementById('imageCreate');

			var MtCtx = document.getElementById('textCanvasModel').getContext('2d'),
    		imageElemModel = document.getElementById('imageModelCreate');

			tCtx.clearRect(0,0,200,100);
			MtCtx.clearRect(0,0,200,100);

			tCtx.font = "25px 'Exo 2', sans-serif";
			var p = Number(this.product.detail.sale_price).toLocaleString() + '₮';
			tCtx.fillText(p, 10, 50);
			imageElem.src = tCtx.canvas.toDataURL();
			var b64Price = imageElem.src;

			var tModel = document.getElementById('model-tag').textContent;
			tModel = tModel.split('-');
			var model = '';

			for (let i = 0; i < tModel.length - 1; i++) {
				if(model == '') {
					model += tModel[i];
				} else {
					model += '-' + tModel[i];
				}
			}

			MtCtx.font = "25px 'Exo 2', sans-serif";
			MtCtx.fillText(model, 10, 50);
			imageElemModel.src = MtCtx.canvas.toDataURL();
			var b64Model = imageElemModel.src;
			for (let i = 1; i < 5; i++) {
				this.loading = true;
				convertImageUrlToBase64(rts.$appUrl + '/images/local/template/' + rts.template.image, async function (url) {
				mergeImages([
					{
						src: b64
					},{
						src: url, x: 0, y: 0
					}])
				.then(b64 => {	
					convertImageUrlToBase64('https://api.tumentechno.mn/images/product/' + rts.product.detail['image' + i], async function (product) {
						mergeImages([
							{
								src: b64
							},{
								src: product, x: rts.template.marginX, y: rts.template.marginY
							}])
						.then(b64 => {
							mergeImages([
								{
									src: b64
								},{
									src: b64Price, x: rts.template.priceX, y: rts.template.priceY
								}])
								.then(b64 => {
									mergeImages([
									{
										src: b64
									},{
										src: b64Model, x: rts.template.modelX, y: 806
									}])
									.then(async b64 => {
										rts.backgroundBs64 = b64;
										const el = rts.$refs.convertMe;
										const options = {
											type: 'dataURL'
										}
										var img = await rts.$html2canvas(el, options);
										var a = document.createElement("a");
										a.href = img;
										a.download = rts.product.detail.model + "4.png";
										a.click();
										rts.loading = false;
									});
								});
							});
						});
					});
				});
			}
		},
		changeColor() {
			this.selectedManual();
		},
		selectTemplate(item) {
			this.template = item;
			this.DownloadImage();
		},
		getSpecs() {
			var rts = this;
				const token = localStorage.getItem('token');
				if(token) {
					this.$axios({
						method: 'post',
						url: 'https://api.tumentechno.mn/api/admin/product-detail',
						headers: {
							"Authorization": `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzksImlhdCI6MTYyODY1NTcxNX0.cLwwj94A4nJL64lxjW6Lp3ly43kQZ4HHTo5mc_3kymU`
						}, 
						data: {
							model: this.product.detail.model
						}
					})
					.then(function(data){
						if(data.data.result == 'success') {
							rts.specs = data.data.specs;
							rts.MoreDetail = data.data.single;
						}
					}).catch(error => {
						console.log(error);
					});
				}
		},
		getTemplates() {
			var rts = this;
				const token = localStorage.getItem('token');
				if(token) {
					this.$axios({
						method: 'post',
						url: rts.$appUrl +`/api/product/get-post-template`,
						headers: {
							"Authorization": `Bearer ${token}`
						}
					})
					.then(function(data){
						if(data.data.result == 'success') {
							rts.templates = data.data.templates;
							rts.getSpecs();
						}
					}).catch(error => {
						console.log(error);
					});
				}
		},
		async DownloadImage() {

			function convertImageToBase64(img, outputFormat) {
			var originalWidth = img.style.width;
			var originalHeight = img.style.height;

			img.style.width = "auto";
			img.style.height = "auto";
			img.crossOrigin = "Anonymous";
			
			var canvas = document.createElement("canvas");
			canvas.width = img.width;
			canvas.height = img.height;

			var ctx = canvas.getContext("2d");
			ctx.drawImage(img, 0, 0);

			img.style.width = originalWidth;
			img.style.height = originalHeight;
			
			
			var dataUrl = canvas.toDataURL(outputFormat);

			
			return dataUrl;
		}

			function convertImageUrlToBase64(url, callback, outputFormat){
				var img = new Image();
				img.crossOrigin = 'anonymous';
				img.onload = function(){
					callback(convertImageToBase64(this, outputFormat));
				};
				img.src = url;
			}
			var rts = this;
			var tCtx = document.getElementById('textCanvas').getContext('2d'),
    		imageElem = document.getElementById('imageCreate');

			var MtCtx = document.getElementById('textCanvasModel').getContext('2d'),
    		imageElemModel = document.getElementById('imageModelCreate');

			tCtx.clearRect(0,0,200,100);
			MtCtx.clearRect(0,0,200,100);

			tCtx.font = "19px 'Exo 2', sans-serif";
			var p = Number(this.product.detail.sale_price).toLocaleString() + '₮';
			tCtx.fillText(p, 10, 50);
			imageElem.src = tCtx.canvas.toDataURL();
			var b64Price = imageElem.src;

			var tModel = document.getElementById('model-tag').textContent;
			tModel = tModel.split('-');
			var model = '';

			for (let i = 0; i < tModel.length - 1; i++) {
				if(model == '') {
					model += tModel[i];
				} else {
					model += '-' + tModel[i];
				}
			}

			MtCtx.font = "19px 'Exo 2', sans-serif";
			MtCtx.fillText(model, 10, 50);
			imageElemModel.src = MtCtx.canvas.toDataURL();
			var b64Model = imageElemModel.src;
			if(this.template.showLogo == false) {
				if( this.template.showDesc == false ) {
					for (let i = 1; i < 5; i++) {
						convertImageUrlToBase64('https://api.tumentechno.mn/images/product/' + this.product.detail['image' + i], async function (url1) {
							convertImageUrlToBase64(rts.$appUrl + '/images/local/template/' + rts.template.image, async function (url2) {
								mergeImages([
									{
										src: url2
									},{
										src: url1, x: rts.template.marginX, y: rts.template.marginY
									}])
									.then(b64 => {
										mergeImages([
										{
											src: b64
										},{
											src: b64Price, x: rts.template.priceX, y: rts.template.priceY
										}])
										.then(b64 => {
											mergeImages([
											{
												src: b64
											},{
												src: b64Model, x: rts.template.modelX, y: rts.template.modelY
											}])
											.then(b64 => {
												var a = document.createElement("a");
												a.href = b64;
												a.download = rts.product.detail.model + "4.png";
												a.click();
											});
										});
									});
							});
						});	
					}
				} else {
					this.selectedManual();
					this.modals.chooseTemplate = false;
					this.modals.chooseBackground = true;
				}
			} else {
				var rts = this;
				for (let i = 1; i < 5; i++) {
					convertImageUrlToBase64('https://api.tumentechno.mn/images/product/' + rts.product.detail['image' + i], async function (product) {
						convertImageUrlToBase64(rts.$appUrl + '/images/local/template/' + rts.template.image, async function (frame) {
							convertImageUrlToBase64('https://api.tumentechno.mn/images/brand/' + rts.MoreDetail[0].images, async function (logo) {
								mergeImages([
									{
										src: frame
									},{
										src: product, x: rts.template.marginX, y: rts.template.marginY
									}])
									.then(b64 => {
										mergeImages([
										{
											src: b64
										},{
											src: b64Price, x: rts.template.priceX, y: rts.template.priceY
										}])
										.then(b64 => {
											mergeImages([
											{
												src: b64
											},{
												src: b64Model, x: rts.template.modelX, y: rts.template.modelY
											}])
											.then(b64 => {
												mergeImages([
												{
													src: b64
												},{
													src: logo, x: rts.template.logoX, y: rts.template.logoY
												}])
												.then(b64 => {
													var a = document.createElement("a");
													a.href = b64;
													a.download = rts.product.detail.model + "4.png";
													a.click();
												});
											});
										});
								});
							});
						});
					});	
				}
			}
		},
		selectedManual() {
			function convertImageToBase64(img, outputFormat) {
				var originalWidth = img.style.width;
				var originalHeight = img.style.height;

				img.style.width = "auto";
				img.style.height = "auto";
				img.crossOrigin = "Anonymous";
				
				var canvas = document.createElement("canvas");
				canvas.width = img.width;
				canvas.height = img.height;

				var ctx = canvas.getContext("2d");
				ctx.drawImage(img, 0, 0);

				img.style.width = originalWidth;
				img.style.height = originalHeight;
				
				
				var dataUrl = canvas.toDataURL(outputFormat);

				
				return dataUrl;
			}

			function convertImageUrlToBase64(url, callback, outputFormat){
				var img = new Image();
				img.crossOrigin = 'anonymous';
				img.onload = function(){
					callback(convertImageToBase64(this, outputFormat));
				};
				img.src = url;
			}

			var rts = this;
			var bCtx = document.getElementById('CanvasBackground').getContext('2d'),
			bElem = document.getElementById('backgroundImageSlot');
			bCtx.fillStyle = this.color;
			bCtx.fillRect(0, 0, document.getElementById('CanvasBackground').width, document.getElementById('CanvasBackground').height);
			bElem.src = bCtx.canvas.toDataURL();
			var b64 = bElem.src;


			var tCtx = document.getElementById('textCanvas').getContext('2d'),
    		imageElem = document.getElementById('imageCreate');

			var MtCtx = document.getElementById('textCanvasModel').getContext('2d'),
    		imageElemModel = document.getElementById('imageModelCreate');

			tCtx.clearRect(0,0,200,100);
			MtCtx.clearRect(0,0,200,100);

			tCtx.font = "25px 'Exo 2', sans-serif";
			var p = Number(this.product.detail.sale_price).toLocaleString() + '₮';
			tCtx.fillText(p, 10, 50);
			imageElem.src = tCtx.canvas.toDataURL();
			var b64Price = imageElem.src;

			var tModel = document.getElementById('model-tag').textContent;
			tModel = tModel.split('-');
			var model = '';

			for (let i = 0; i < tModel.length - 1; i++) {
				if(model == '') {
					model += tModel[i];
				} else {
					model += '-' + tModel[i];
				}
			}

			MtCtx.font = "25px 'Exo 2', sans-serif";
			MtCtx.fillText(model, 10, 50);
			imageElemModel.src = MtCtx.canvas.toDataURL();
			var b64Model = imageElemModel.src;

			convertImageUrlToBase64(rts.$appUrl + '/images/local/template/' + rts.template.image, async function (url) {
				mergeImages([
					{
						src: b64
					},{
						src: url, x: 0, y: 0
					}])
				.then(b64 => {	
					convertImageUrlToBase64('https://api.tumentechno.mn/images/product/' + rts.product.detail.image1, async function (product) {
						mergeImages([
							{
								src: b64
							},{
								src: product, x: rts.template.marginX, y: rts.template.marginY
							}])
						.then(b64 => {
							mergeImages([
								{
									src: b64
								},{
									src: b64Price, x: rts.template.priceX, y: rts.template.priceY
								}])
								.then(b64 => {
									mergeImages([
									{
										src: b64
									},{
										src: b64Model, x: rts.template.modelX, y: 806
									}])
									.then(b64 => {
										rts.backgroundBs64 = b64;
									});
								});
							});
						});
					});
				});

		},
		editProduct() {
			this.$confirm(`Хадгалахдаа итгэлтэй байна уу?`, 'Санамж', {
                confirmButtonText: 'Тийм',
                cancelButtonText: 'Үгүй',
                dangerouslyUseHTMLString: true,
                type: 'warning'
            }).then(() => {
                var rts = this;
                this.loading = true;
                const token = localStorage.getItem('token');
                if(token) {
                    this.$axios({
                        method: 'post',
                        url: rts.$appUrl +`/api/product/edit-product`,
                        headers: {
                            "Authorization": `Bearer ${token}`
                        },
                        data: {
                            product: this.product.detail,
							role: this.loggedUser.posID
                        }
                    })
                    .then(function(data){
                        rts.loading = false;
                        if(data.data.result == 'success') {
                            rts.$notify({
                                title: 'Амжилттай',
                                dangerouslyUseHTMLString: true,
                                message: `<strong>${rts.product.detail.model}</strong> шинэчлэгдлээ`,
                                type: 'success'
                            });
														rts.modals.drawer = false;
                        }

												rts.getInfo();
                            
                    }).catch(error => {
                        rts.loading = false;
                        console.log(error);
                    });
                }
            })
		},
		resizePopoverWidth() {
			if(window.innerWidth <= 768) {
				this.drawerWidth = 100	
				this.templateWidth = 90;
			} else {
				this.drawerWidth = 30	
				this.templateWidth = 70;
			}

			var width = this.$refs.imageDiv.offsetWidth;
			
			var height = (width / 100) * 92;
			this.imageHeight = height;
		},
		getRma(item) {
			var qty = 0;
			this.rma.forEach(el => {
				if(el.storeId == item.code) {
					qty = el.total;
				}
			});
			return qty;
		},
		deleteProduct() {
			this.$confirm(`Утсгахдаа итгэлтэй байна уу?`, 'Санамж', {
                confirmButtonText: 'Тийм',
                cancelButtonText: 'Үгүй',
                dangerouslyUseHTMLString: true,
                type: 'warning'
            }).then(() => {
                var rts = this;
                this.loading = true;
                const token = localStorage.getItem('token');
                if(token) {
                    this.$axios({
                        method: 'post',
                        url: rts.$appUrl +`/api/product/delete-product`,
                        headers: {
                            "Authorization": `Bearer ${token}`
                        },
                        data: {
                            id: this.product.id
                        }
                    })
                    .then(function(data){
                        rts.loading = false;
                        if(data.data.result == 'success') {
                            rts.$notify({
                                title: 'Амжилттай',
                                dangerouslyUseHTMLString: true,
                                message: `<strong>${rts.product.detail.model}</strong> устгагдлаа`,
                                type: 'success'
                            });
							rts.$router.push('/products');
                        }
                            
                    }).catch(error => {
                        rts.loading = false;
                        console.log(error);
                    });
                }
            })
		},
		addToCart(id, model) {
			if(this.qnt > this.product.detail.total) {
				this.$notify({
					title: 'Амжилтгүй',
					dangerouslyUseHTMLString: true,
					message: `Үлдэгдэл хүрэлцэхгүй байна`,
					type: 'error'
				});
			} else {
				var rts = this;
				const token = localStorage.getItem('token');
				if(token) {
					this.$axios({
						method: 'post',
						url: rts.$appUrl +`/api/product/add-cart`,
						headers: {
							"Authorization": `Bearer ${token}`
						}, 
						data: {
							id,
							qty: this.qnt
						}
					})
					.then(function(data){
						if(data.data.result == 'success') {
							rts.$notify({
								title: 'Амжилттай',
								dangerouslyUseHTMLString: true,
								message: `<strong>${model}</strong> бүтээгдэхүүн нэмэгдлээ`,
								type: 'success'
							});
						}
					}).catch(error => {
						console.log(error);
					});
				}
			}
		},
		getInfo() {
			var rts = this;
			const token = localStorage.getItem('token');
			if(token) {
				this.$axios({
					method: 'post',
					url: rts.$appUrl +`/api/product/product-detail`,
					headers: {
						"Authorization": `Bearer ${token}`
					}, 
					data: {
						id: this.product.id
					}
				})
				.then(function(data){
					if(data.data.result == 'success') {
						document.querySelector('head title').textContent = data.data.product.model + ' ' +data.data.product.name;
						rts.product.detail = data.data.product;
						rts.location = data.data.loc;
						rts.rma = data.data.rma;
						rts.brands = data.data.brands;
						rts.category = data.data.category;
						rts.sub = data.data.sub;
						rts.getTemplates();
					}
				}).catch(error => {
					console.log(error);
				});
			}
		}
	}
}
</script>

<style lang="scss">
@import '../../../assets/scss/_variables';


.el-carousel__arrow {
	margin-top: 10%;
}
.page-ecommerce-product-detail {
	.item-box {
		border-radius: 4px;
		overflow: hidden;

		.main-photo {
			position: relative; 
			overflow: hidden;
			background: white;
			padding: 0px;

			img {
				width: 100%;
			}
		}
		.detail-box {
			padding: 30px;
			position: relative; 

			.title {
				margin: 0;
			}

			.price-box {
				margin-top: 20px;
				margin-bottom: 30px;

				.discounted-price {
					color: $text-color-accent;
					font-weight: bold;
					font-size: 25px;
					margin-right: 20px;
					display: inline-block;
				}
				.normal-price {
					opacity: .5;
					text-decoration: line-through;
					text-decoration-color: $text-color-accent;
					margin-right: 10px;
					display: inline-block;
				}
				.discount {
					color: $text-color-accent;
					display: inline-block;
				}
			}

			.actions-box {
				margin-top: 30px;

				.el-input-number {
					width: 100px;
			
					.el-input__inner {
						color: $text-color-accent;
						background-color: transparent;
						border-color: $text-color-accent;
						font-family: inherit;
						font-weight: bold;
						padding-left: 5px;
						padding-right: 45px;
					}
				}

				.el-button {
					font-family: inherit;
					margin-left: 0;
				}
			}
		}
	}
}

</style>


