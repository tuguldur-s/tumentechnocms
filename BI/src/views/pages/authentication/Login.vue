<template>
	<vue-scroll class="login-page align-vertical">
		<div class="form-wrapper align-vertical-middle">
			<div class="form-box card-base card-shadow--extraLarge" style="padding: 50px;">
				<form role="form" @submit.prevent="login">
					<img src="@/assets/images/icbc.png" style="width: 80px; height: auto;" alt="logo" class="image-logo"/>
					
					<float-label class="styled">
						<input type="email" placeholder="имэйл" v-model="form.email">
					</float-label>
					<float-label class="styled">
						<input type="password" placeholder="нууц үг" v-model="form.password">
					</float-label>
					
					<div class="flex">
						<div class="box grow text-right"><el-link type="info" @click="forgotPassword">Нууц үгээ мартсан уу?</el-link></div>
					</div>

					<div class="flex text-center center pt-30 pb-10">			
						<el-button native-type="submit" plain size="large" class="login-btn-2 tada animated" :loading="buttonLoading">
							Нэвтрэх
						</el-button>
					</div>
				</form>
			</div>
		</div>
	</vue-scroll>
</template>

<script>
export default {
	name: 'Login',
	data() {
		return {
			form: {
				email: '',
				password: '',
			},
			buttonLoading: false
		}
	},
	methods: {
		forgotPassword() {
			this.$prompt('Бүртгэлтэй имэйл хаягаа оруулна уу', 'Нууц үг сэргээх', {
				confirmButtonText: 'Илгээх',
				cancelButtonText: 'Болих',
				inputPattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
				inputErrorMessage: 'Буруу бичиглэл'
			}).then(({ value }) => {
				let rts = this;
				rts.$axios({
					method: 'POST',
					url: rts.$appUrl + '/api/user/bi-forgot-password',
					headers: {},
					data: {
						email: value
					}
				}).then(data => {
					if(data.data.result === 'success') {
						this.$notify({
							title: 'Амжилттай',
							dangerouslyUseHTMLString: true,
							message: 'Нууц үг шинэчлэгдлээ<br>Имэйл хаягаа шалгана уу',
							type: 'success'
						});
					} else {
						this.$notify({
							title: 'Амжилтгүй',
							message: 'Имэйл хаяг бүртгэлгүй',
							type: 'error'
						});
					}
				});
			});
		},
		login() {
			if(this.form.email == '' || this.form.password == '') {
				this.$notify({
					title: 'Алдаа',
					message: 'Талбараа бүрэн оруулна уу',
					type: 'warning'
				});
			} else {
				this.buttonLoading = true;
				let rts = this;
				rts.$axios({
					method: 'POST',
					url: rts.$appUrl + '/api/user/bi-login',
					headers: {},
					data: {
						email: this.form.email,
						password: this.form.password
					}
				}).then(data => {
					rts.buttonLoading = false;
					if(data.data.result === 'success') {
						localStorage.token = data.data.token;
						localStorage.user = JSON.stringify(data.data.user);
						this.$notify({
							title: 'Амжилттай',
							message: 'Симтемд	 нэвтэрлээ',
							type: 'success'
						});
						rts.$router.push('/dashboard');
					} else {
						this.$notify({
							title: 'Амжилтгүй',
							message: 'Хэрэглэгчийн нэр эсвэл нууц үг буруу',
							type: 'error'
						});
					}
				});
			}
			// this.$store.commit('setLogin')
		}
	}
}
</script>

<style lang="scss">
@import '../../../assets/scss/_variables';

.login-page {
	background: $text-color;
	margin-left: -30px;
	margin-right: -30px;

	.form-wrapper {
		width: 100%;
	}
	
	.form-box {
		width: 100%;
		max-width: 340px;
		padding: 30px;
		box-sizing: border-box;
		margin: 20px auto;

		a {
			font-size: 14px;
			color: $text-color-accent;
			text-decoration: none;
			font-weight: 500;
		}

		.image-logo {
			width: 80px;
			margin: 0px auto;
			margin-bottom: 30px;
			display: block;
		}

		.login-btn-2 {
			width: 100%;
			background-color: #4A596A;
			color: #fff;
		}

		.signin-box {
			font-size: 14px;
		}
	}
}

@media (max-width: 768px) {
	.layout-container .container .view.login-page {
		margin-left: -5px;
		margin-right: -5px;
		max-width: calc(100% + 10px);
	}
}
</style>
