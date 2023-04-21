import Vue from 'vue'
import Router from 'vue-router'
import Dashboard from '../views/apps/Dashboard.vue'
import Login from '../views/pages/authentication/Login.vue'
import Reports from '../views/apps/document/reports.vue'
import Report from '../views/apps/document/viewReport.vue'
import NotFound from '../views/pages/NotFound.vue'
import Shops from '../views/apps/Shops.vue'
import ShopDetail from '../views/apps/ShopDetail.vue'
import layouts from '../layout'
import store from '../store'
import Profile from '../views/apps/ecommerce/Account.vue'
Vue.use(Router)

const router = new Router({
	mode: 'history',
	//base: '/sub-path/',
	routes: [
		{
			path: '/profile',
			name: 'profile',
			component: Profile,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: false,
				title: 'Хувийн мэдээлэл',
				permission: [1,2,3,4,5,6]
			}
		},
		{
			path: '/shops',
			name: 'shops',
			component: Shops,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				title: 'Салбарын жагсаалт',
				permission: [1,2,4]
			}
		},
		{
			path: '/shop-detail/:id',
			name: 'shop-detail',
			component: ShopDetail,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				title: 'Салбарын дэлгэрэнгүй',
				permission: [1,2,4]
			}
		},
		{
			path: '/reports',
			name: 'reports',
			component: Reports,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: true,
				title: 'Кассын тайлан',
				permission: [1,2,3,4,5]
			}
		},
		{
			path: '/dashboard',
			name: 'analytic-dashboard',
			component: Dashboard,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: false,
				title: 'Хяналтын самбар',
				permission: [1,2,4]
			}
		},
		{
			path: '',
			name: 'analytic-dashboard',
			component: Dashboard,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: false,
				title: 'Хяналтын самбар',
				permission: [1,2,4]
			}
		},
		{
			path: '/report/:id',
			name: 'report',
			component: Report,
			meta: {
				auth: true,
				layout: layouts.navLeft,
				searchable: false,
				title: 'Кассын тайлангийн дэлгэрэнгүй',
				permission: [1,2,3,4]
			}
		},
		{
			path: '/login',
			name: 'login',
			component: Login,
			meta: {
				layout: layouts.contenOnly,
				title: 'Нэвтрэх',
				permission: [1,2,3,4,5,6]
			}
		},
		{
			path: '*',
			name: 'not-found',
			component: NotFound,
			meta: {
				layout: layouts.contenOnly,
				searchable: true,
				title: 'Алдаа',
				permission: [1,2,3,4,5,6]
			}
		}
	]
})


const l = {
	contenOnly(){
		store.commit('setLayout', layouts.contenOnly)
	},
	navLeft(){
		store.commit('setLayout', layouts.navLeft)
	},
	navRight(){
		store.commit('setLayout', layouts.navRight)
	},
	navTop(){
		store.commit('setLayout', layouts.navTop)
	},
	navBottom(){
		store.commit('setLayout', layouts.navBottom)
	},
	set(layout){
		store.commit('setLayout', layout)
	}	
}

//insert here login logic
const auth = {
	loggedIn() {
		var token = localStorage.getItem("token");
		if (token) {
			return true;
		} else {
			return false;
		}
		// return store.getters.isLogged
	},
	logout() {
		store.commit('setLogout')
	}
}

router.beforeEach((to, from, next) => {
	document.title = to.meta.title;
	let authrequired = false
	if(to && to.meta && to.meta.auth)
		authrequired = true

	//console.log('authrequired', authrequired, to.name)
	if(authrequired) {
		if(auth.loggedIn()) {
			var per = JSON.parse(localStorage.user).posID;
			if(to.meta.permission.includes(per)) {
				if(to.name === 'login') {
					window.location.href = '/products'
					return false
				} else { 
					next()
				}	
			} else {
				window.location.href = '/not-found'
			}
		} else {
			if(to.name !== 'login'){
				window.location.href = '/login'
				return false
			}
			next()
		}
	} else {
		if(auth.loggedIn() && to.name === 'login'){
			window.location.href = '/products'
			return false
		} else {
			next()
		}
	}

	if(to && to.meta && to.meta.layout){
		l.set(to.meta.layout)
	}	
})

router.afterEach((to, from) => {
	setTimeout(()=>{
		store.commit('setSplashScreen', false)
	}, 500)
})

export default router