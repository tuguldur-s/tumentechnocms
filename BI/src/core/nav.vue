<template>
	<el-menu 
		:default-active.sync="activeLink" 
		:mode="mode" 
		@select="goto" 
		:collapse="isCollapse" 
		:unique-opened="true"
		background-color="transparent"
		class="main-navigation-menu"
		:class="{'nav-collapsed':isCollapse}"
	>
		<div class="el-menu-item-group__title" style="padding-top: 4px;"><span>Үйлдлүүд</span></div>
		<el-menu-item index="/dashboard">
			<i class="mdi mdi-gauge"></i><span slot="title">Хяналтын самбар</span>
		</el-menu-item>
		<el-menu-item v-if="user.posID < 6" index="/reports">
			<i class="mdi mdi-book"></i><span slot="title">Кассын тайлан</span>
		</el-menu-item>
		<el-menu-item index="/shops" v-if="user.posID == 1 || user.posID == 2 || user.posID == 4">
			<i class="mdi mdi-city-variant-outline"></i><span slot="title">Салбарын жагсаалт</span>
		</el-menu-item>
		<el-menu-item style="margin-top: 10%;">
			<div>
                <a href="https://www.hurdanhuruu.mn" target="_blank" class="d-block"><img class="img-fluid" src="@/assets/images/hh.jpg" alt="hurdanhuruu.mn" :style="{'border-radius': '10px', 'width': '100%', 'height': 'auto'}"></a>
            </div>
		</el-menu-item>
	</el-menu>	
	
</template>
<script>
import { detect } from 'detect-browser'
const browser = detect()
var timer = null;
export default {
	name: 'Nav',
	props: ['mode', 'isCollapse'],
	data() {
		return {
			isIe: true,
			isEdge: true,
			activeLink: null,
			user: {
				posID: 0
			},
			badges: {
				order: 0,
				movement: 0
			}
		}
	},
	methods: {
		checkInvoice() {
			var rts = this;
			const token = localStorage.getItem('token');
			if(token) {
				this.$axios({
					method: 'post',
					url: rts.$appUrl +`/api/invoice/check-invoice`,
					headers: {
						"Authorization": `Bearer ${token}`
					}
				})
				.then(function(data){
					if (data.data.result == 'success') {
						rts.$router.push({name: 'edit-invoice', params: {id: data.data.invoiceNumber}});
					}
				}).catch(error => {
					console.log(error);
				});
			}
		},
		checkOfficial() {
			var rts = this;
			const token = localStorage.getItem('token');
			if(token) {
				this.$axios({
					method: 'post',
					url: rts.$appUrl +`/api/offer/check-official`,
					headers: {
						"Authorization": `Bearer ${token}`
					}
				})
				.then(function(data){
					console.log(data);
					if (data.data.result == 'success') {
						rts.$router.push({name: 'edit-official', params: {id: data.data.officialIndex}});
					}
				}).catch(error => {
					console.log(error);
				});
			}
		},
		checkExpend() {
			var rts = this;
			const token = localStorage.getItem('token');
			if(token) {
				this.$axios({
					method: 'post',
					url: rts.$appUrl +`/api/expend/check-expend`,
					headers: {
						"Authorization": `Bearer ${token}`
					}
				})
				.then(function(data){
					if (data.data.result == 'success') {
						rts.$router.push({name: 'edit-expend', params: {id: data.data.expendNumber}});
					}
				}).catch(error => {
					console.log(error);
				});
			}
		},
		checkOffer() {
			var rts = this;
			const token = localStorage.getItem('token');
			if(token) {
				this.$axios({
					method: 'post',
					url: rts.$appUrl +`/api/offer/check-offer`,
					headers: {
						"Authorization": `Bearer ${token}`
					}
				})
				.then(function(data){
					if (data.data.result == 'success') {
						rts.$router.push({name: 'edit-offer', params: {id: data.data.offerNumber}});
					}
				}).catch(error => {
					console.log(error);
				});
			}
		},
		goto(index, indexPath) {
			if(index.charAt(0) === '/') {
				this.$router.push(index)
				this.$emit('push-page', {page:index})
			}

		},
		setLink(path) {
			this.activeLink = path
		},
		getUser() {
			this.user = JSON.parse(localStorage.user);
		},
		getBadges() {
			var rts = this;
			const token = localStorage.getItem('token');
			if(token) {
				this.$axios({
					method: 'post',
					url: rts.$appUrl +`/api/user/get-badges`,
					headers: {
						"Authorization": `Bearer ${token}`
					}
				})
				.then(function(data){
					if (data.data.result == 'success') {
						if(data.data.movement > 9) {
							rts.badges.movement = '9+';
						} else {
							rts.badges.movement = data.data.movement;
						}
					}
				}).catch(error => {
					console.log(error);
				});
			}	
		}
	},
	created() {
		if(browser.name !== 'ie') this.isIe = false
		if(browser.name !== 'edge') this.isEdge = false

		this.setLink(this.$router.currentRoute.path)
		this.$router.afterEach((to, from) => {
			this.setLink(this.$router.currentRoute.path)
			//console.log('afterEach', to, from)
		})
		//console.log('this.$router.currentRoute.path', this.$router.currentRoute.path)
	},
	mounted() {
		//console.log('nav component mounted')		
		this.getUser();		
		this.getBadges();
		timer = setInterval(this.getBadges, 120000);
	}
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/_variables';
.el-menu {
	border: none;
}
.el-menu::before, .el-menu::after {
	display: none;
}
.el-submenu, .el-menu-item {
	.mdi {
		vertical-align: middle;
		margin-right: 5px;
		display: inline-block;
		width: 24px;
		text-align: center;
		font-size: 18px;
	}
}
</style>

<style lang="scss">
@import '../assets/scss/_variables';

.main-navigation-menu {
	transition: width .5s;

	&:not(.el-menu--collapse) {
		.el-submenu__title, .el-menu-item {
			height: 40px;
			line-height: 40px;
			background-color: transparent !important;
		}

		&:not(.el-menu--horizontal) {
			.el-menu-item, .el-submenu {
				position: relative;
				
				&::before {
					content: '';
					display: block;
					width: 0px;
					height: 1px;
					position: absolute;
					bottom: 10px;
					left: 30px;
					background: $text-color;
					z-index: 1;
					opacity: 0;
					transition: all .7s cubic-bezier(.55,0,.1,1);
				}
				&:hover {
					&::before {
						width: 100px;
						opacity: 1;
						//left: 50px;
						transform: translate(20px, 0);
					}
				}

				&.is-active {
					&::before {
						background: $text-color-accent;
					}
				}
			}
		}

		.el-submenu.is-opened {
			//background: #edf1f6 !important;
			//background: rgba(223, 228, 234, 0.38) !important;
			position: relative;

			&::after {
				content: '';
				display: block;
				width: 2px;
				position: absolute;
				top: 40px;
				bottom: 10px;
				left: 31px;
				background: $text-color;
				z-index: 1;
			}

			&::before {
				display: none;
			}

			.el-menu-item, .el-submenu {
				&::before, &::after {
					display: none;
				}
			}
		}

		.el-menu-item-group__title {
			padding: 15px 0 0px 20px;
			color: transparentize($text-color, 0.65);
		}
	}

	.el-submenu__title, .el-menu-item:not(.is-active) {
		color: $text-color;
		
		i {		
			color: $text-color;
		}
	}

	&.el-menu--collapse {
		.el-menu-item-group__title {
			padding: 15px 0 0px 0px;
			width: 100%;
			text-align: center;
		}

		.el-submenu__title:hover, .el-menu-item:hover {
			background-color: rgba(0, 0, 0, 0.05) !important;
		}
	}

	&.el-menu--horizontal {
		white-space: nowrap;
		/*width: fit-content;
		width: max-content;*/
		overflow: hidden;
		display: table;

		& > * {
			float: inherit !important;
			display: inline-block;
		}
	}

	&.nav-collapsed {
		.el-menu-item,.el-submenu__title {
			& > span {
				display: none;
			}
		}
	}
}

.main-navigation-submenu { 
	.el-menu {
		background: #fff !important;

		.el-menu-item:not(.is-active) {
			color: $text-color;
		}
		.el-menu-item:hover {
			background-color: transparentize($background-color, 0.3) !important;
		}
	}
}
</style>
