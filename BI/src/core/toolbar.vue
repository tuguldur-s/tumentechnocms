<template>
	<div class="toolbar flex align-center justify-space-between" v-loading.fullscreen.lock="loading">
		<div class="box-left box grow flex">
			<button @click="toggleSidebar" v-if="menuBurger !== 'right'" class="toggle-sidebar card-base card-shadow--small">
				<i class="mdi mdi-menu"></i>
			</button>

			<img class="logo-mini" src="@/assets/images/sm-logo.png"  alt="logo"/>

			<search class="hidden-xs-only"></search>
		</div>
		<div class="box-right flex align-center pl-10">
			<el-badge :is-dot="false" class="notification-icon-badge" v-if="user.posID == 1 || user.posID == 2 || user.posID == 4">
				<el-popover placement="bottom" :width="popoverWidth2" trigger="click">
					<div>
						<el-row class="cart-box" :gutter="20">
							<el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8" align="center" class="downloadItems" style="padding-top: 15px; padding-bottom: 15px; border-radius: 5px;">
								<a href="javascript:;" @click="downloadProductImage" style="text-decoration: none; color: #6e6d6d; font-weight: 700;">
									<img src="@/assets/images/newphoto.png" :style="{'width': '30px', 'height': 'auto'}"><br>
									Зураг
								</a>
							</el-col>
							<el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8" align="center" class="downloadItems" style="padding-top: 15px; padding-bottom: 15px; border-radius: 5px;">
								<a href="javascript:;" @click="downloadShops" style="text-decoration: none; color: #6e6d6d; font-weight: 700;">
									<img src="@/assets/images/shop.png" :style="{'width': '30px', 'height': 'auto'}"><br>
									Салбар
								</a>
							</el-col>
							<el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8" align="center" class="downloadItems" style="padding-top: 15px; padding-bottom: 15px; border-radius: 5px;">
								<a href="javascript:;" @click="downloadProductQty" style="text-decoration: none; color: #6e6d6d; font-weight: 700;">
									<img src="@/assets/images/productqty.png" :style="{'width': '30px', 'height': 'auto'}"><br>
									Үлдэгдэл
								</a>
							</el-col>
						</el-row>
					</div>
					<el-button slot="reference" icon="el-icon-menu" class="notification-icon"></el-button>
				</el-popover>
			</el-badge>
			<button class="fullscreen-button" @click="toggleFullscreen">
				<i class="mdi mdi-fullscreen" v-if="!fullscreen"></i>
				<i class="mdi mdi-fullscreen-exit" v-if="fullscreen"></i>
			</button>
			<span class="username"><router-link to="/profile">{{user.name}}</router-link></span>
			<el-dropdown trigger="click" @command="onCommand">
				<span class="el-dropdown-link">
					<img :src="$appUrl+'/images/local/user/'+user.img" class="avatar" alt="avatar">
				</span>
				<el-dropdown-menu slot="dropdown">
					<el-dropdown-item command="/profile"><i class="mdi mdi-account mr-10"></i> Хувийн мэдээлэл</el-dropdown-item>
					<!-- <el-dropdown-item command="/calendar"><i class="mdi mdi-calendar mr-10"></i> Calendar</el-dropdown-item>
					<el-dropdown-item command="/contacts"><i class="mdi mdi-account-multiple mr-10"></i> Contacts</el-dropdown-item> -->
					<el-dropdown-item command="logout" divided><i class="mdi mdi-logout mr-10"></i> Гарах</el-dropdown-item>
				</el-dropdown-menu>
			</el-dropdown>

			<button @click="toggleSidebar" v-if="menuBurger === 'right'" class="toggle-sidebar toggle-sidebar__right card-base card-shadow--small">
				<i class="mdi mdi-menu"></i>
			</button>
		</div>
	</div>
</template>

<script>
// import NotificationBox from '@/components/NotificationBox'
import Search from '@/components/Search'
var timer = null;
export default {
	name: 'Toolbar',
	props: ['menuBurger'],
	data() {
		return {
			popoverWidth: 300,
			popoverWidth2: 250,
			fullscreen: false,
			lang: 'us',
			user: {
				img: 'default.jpg',
				name: 'undefined'
			},
			loading: false,
			orders: [],
			otherOrder: [],
			notifications: [
				{
					id: 1,
					title: 'New order',
					icon: 'mdi mdi-cart-outline',
					desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam in diam sit amet felis ultricies ultricies vitae et tortor. Proin dapibus justo felis, ut imperdiet lacus accumsan quis.',
					date: 'Just now!'
				},
				{
					id: 2,
					title: 'New Schedule Realease',
					icon: 'mdi mdi-calendar',
					desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam in diam sit amet felis ultricies ultricies vitae et tortor. Proin dapibus justo felis, ut imperdiet lacus accumsan quis.',
					date: '2 Min Ago'
				},
				{
					id: 3,
					title: 'New message from David',
					icon: 'mdi mdi-email-outline',
					desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam in diam sit amet felis ultricies ultricies vitae et tortor. Proin dapibus justo felis, ut imperdiet lacus accumsan quis.',
					date: '30 Min Ago'
				}
			]
		}
	},
	methods: {
		downloadProductImage() {
			var rts = this;
			const token = localStorage.getItem('token');
			if(token) {
				this.loading = true;
				this.$axios({
					method: 'post',
					url: rts.$appUrl +`/api/dashboard/download-image`,
					headers: {
						"Authorization": `Bearer ${token}`
					}
				}).then(data => {
					rts.loading = false;
					if(data.data.result == 'success') {
						rts.$notify({
							title: 'Амжилттай',
							dangerouslyUseHTMLString: true,
							message: `Зураг шинэчлэгдлээ`,
							type: 'success'
						});
					}
				}).catch(err => {
					console.log(err);
					rts.loading = false;
				});
			}
		},
		downloadProductQty() {
			var rts = this;
			const token = localStorage.getItem('token');
			if(token) {
				this.loading = true;
				this.$axios({
					method: 'post',
					url: rts.$appUrl +`/api/product/update-product-quanity`,
					headers: {
						"Authorization": `Bearer ${token}`
					}
				}).then(data => {
					rts.loading = false;
					if(data.data.result == 'success') {
						rts.$notify({
							title: 'Амжилттай',
							dangerouslyUseHTMLString: true,
							message: `Үлдэгдэл татагдлаа`,
							type: 'success'
						});
					}
				}).catch(err => {
					console.log(err);
					rts.loading = false;
				});
			}
		},
		downloadShops() {
			var rts = this;
			const token = localStorage.getItem('token');
			if(token) {
				this.loading = true;
				this.$axios({
					method: 'post',
					url: rts.$appUrl +`/api/product/update-shops`,
					headers: {
						"Authorization": `Bearer ${token}`
					}
				}).then(data => {
					rts.loading = false;
					if(data.data.result == 'success') {
						rts.$notify({
							title: 'Амжилттай',
							dangerouslyUseHTMLString: true,
							message: `Салбар татагдлаа`,
							type: 'success'
						});
					}
				}).catch(err => {
					console.log(err);
					rts.loading = false;
				});
			}
		},
		onCommandLang(lang) {
			if(lang.charAt(0) === '/')
				this.onCommand(lang)
			else
				this.lang = lang
		},
		onCommand(path) {
			if(path == 'logout') {
				this.logout();
			} else {
				this.$router.push(path)
			}
		},
		toggleSidebar() {
			this.$emit('toggle-sidebar')
		},
		resizePopoverWidth() {
			if(window.innerWidth <= 768) {
				this.popoverWidth = 250	
			} else {
				this.popoverWidth = 300	
			}
		},
		toggleFullscreen() {
			this.$fullscreen.toggle(document.querySelector('body'), {
				wrap: false,
				callback: () => {this.fullscreen = this.$fullscreen.getState()}
			})
		},
		getUser() {
			this.user = JSON.parse(localStorage.user);
		},
		logout() {
			localStorage.removeItem('user');
			localStorage.removeItem('token');
			this.$router.push('/login');
		}
	},
	components: {
		// NotificationBox,
		Search
	},
	mounted() {
		this.fullscreen = this.$fullscreen.getState()
		this.resizePopoverWidth();
		window.addEventListener('resize', this.resizePopoverWidth);
		this.getUser();
	},
	beforeDestroy() {
		window.removeEventListener('resize', this.resizePopoverWidth);
	}
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/_variables';
@import '../assets/scss/_mixins';

.downloadItems:hover {
	border: 1px solid #a9aaab;
}

.notification-box {
	color: $text-color;
	
	.notify {
		margin-bottom: 20px;
		max-height: 70px;
		overflow: hidden;
		position: relative;

		&::after {
			content: '';
			display: block;
			position: absolute;
			bottom: 0;
			left: 0;
			right: 0;
			width: 100%;
			height: 20px;
			// box-shadow: 0px -20px 20px -10px $background-color inset;
		}

		.n-title {
			text-align: left;
			padding-right: 10px;
		}
		.n-desc {
			color: transparentize($text-color, 0);
		}

		&:hover {
			color: $text-color-accent;

			.n-desc {
				color: transparentize($text-color-accent, 0);
			}
		}
	}

	.see-all {
		&:hover {
			color: $text-color-accent;
		}
	}
}

.toolbar {
	width: 100%;
	height: 100%;
	padding: 0 20px;
	box-sizing: border-box;

	.username {
		margin-left: 20px;
		font-weight: bold;
		@include text-bordered-shadow();
		
		a {
			color: $text-color;
			text-decoration: none;

			&:hover {
				color: $text-color-accent;
			}
		}
	}

	.avatar {
		border-radius: 50%;
		width: 35px;
		height: 35px;
		border: 1px solid #FFF;
		margin-left: 20px;
		box-sizing: border-box;
		display: block;
		cursor: pointer;
		box-shadow: 0 2px 5px 0 rgba(49,49,93,.1), 0 1px 2px 0 rgba(0,0,0,.08);
		transition: box-shadow .5s;

		&:hover {
			box-shadow: 0px 3px 10px 0 rgba(49, 49, 93, 0.08), 0px 2px 7px 0 rgba(0, 0, 0, 0.08);
		}
	}

	.notification-icon {
		font-size: 20px;
		outline: none;
		padding: 0;
		background: transparent;
		border: none;
		margin-left: 20px;
		//color: #aab7c5;
		color: transparentize($text-color, 0.7);
		@include text-bordered-shadow();

		&:hover {
			color: $text-color-accent;
		}
	}

	.toggle-sidebar {
		border: 1px solid transparent;
		height: 32px;
		min-height: 32px;
		line-height: 32px;
		width: 32px;
		min-width: 32px;
		max-width: 32px;
		box-sizing: border-box;
		text-align: center;
		margin: 0;
		outline: none;
		margin-right: 5px;
		font-size: 24px;
		padding: 0;
		cursor: pointer;
		display: inline-block;
		color: $text-color;
		background: white;
		display: none;
		opacity: 0;
		transition: all .5s;

		&__right {
			margin-right: 0px;
			margin-left: 5px;
		}

		&:hover, &:focus, &:active {
			color: $text-color-accent;
			border-color: $text-color-accent;
		}
	}

	.fullscreen-button {
		font-size: 24px;
		cursor: pointer;
		outline: none;
		padding: 0;
		background: transparent;
		border: none;
		margin-left: 20px;
		//color: #aab7c5;
		color: transparentize($text-color, 0.7);
		@include text-bordered-shadow();

		&:hover {
			color: $text-color-accent;
		}
	}

	.logo-mini {
		width: 32px;
		height: 32px;
		display: none;
	}

	.el-dropdown {
		.flag-icon {
			box-shadow: 0 2px 5px 0 rgba(49,49,93,.1), 0 1px 2px 0 rgba(0,0,0,.08);
			cursor: pointer;
			border: 1px solid lighten($background-color, 20%);
			background-color: lighten($background-color, 20%);
		}
	}
}

@media (max-width: 650px) {
	.toolbar {
		.username {
			display: none;
		}
	}
}

@media (max-width: 768px) {
	.toolbar {
		padding: 0 10px;

		.toggle-sidebar {
			display: block;
			opacity: 1;
		}

		.fullscreen-button {
			display: none;
		}

		.logo-mini {
			display: inherit;
		}
	}
}
</style>
