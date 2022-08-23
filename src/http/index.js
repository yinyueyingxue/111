// const store = require('store') 可直接获取到store commonJs
import store from '../store/index' // 编译顺序不能直接获取到store
import router from '../router/index'
// import { Message } from 'bootstrap-vue'
import { Message } from 'element-ui'

const axios = require('axios')

// 详细文档请参照 https://github.com/axios/axios

// `timeout` 指定请求超时的毫秒数(0 表示无超时时间)
// 如果请求花费了超过 `timeout` 的时间，请求将被中断
axios.defaults.timeout = 300000

// `responseType` 表示服务器响应的数据类型，
//  可以是 'arraybuffer', 'blob', 'document', 'json', 'text', 'stream'
// axios.defaults.responseType = 'json'

// 允许请求时携带cookie
axios.defaults.withCredentials = false

// `validateStatus` 定义对于给定的HTTP 响应状态码是 resolve 或 reject  promise 。
// 如果 `validateStatus` 返回 `true` (或者设置为 `null` 或 `undefined`)，promise 将被 resolve;
// 否则，promise 将被 rejecte
axios.defaults.validateStatus = function(status) {
	return status >= 200 && status < 300 // 默认的
}

// 请求拦截
axios.interceptors.request.use(
	config => {
		config.headers["H3C-SSO-TKT"] = store.state.myRequest.token
        config.headers["k8s-cluster"] = store.state.myRequest.clusterHeader
		config.headers["projectId"] = store.state.myRequest.projectId
		if (store.state.myRequest.jwtToken && store.state.myRequest.jwtToken != '') {
			config.headers["Authorization"] = "Bearer " + store.state.myRequest.jwtToken
		}
		return config
	},
	err => {
		console.error(err)
	}
)

// 响应拦截器
axios.interceptors.response.use(
	response => {
		// if (isIE9()) {
		// 	// 特殊处理response
		// 	if (response.status == 200 && response.request) {
		// 		if (
		// 			response.request.responseType === 'json' &&
		// 			response.request.responseText
		// 		) {
		// 			response.data = JSON.parse(response.request.responseText)
		// 		}else{
		// 			response.data = response.request.responseText
		// 		}
		// 	}
		// }
		if(response.data != null){
			switch (response.data.code) {
				case 20206: // token过期，清除它,清除token信息并跳转到登录页面
					store.commit('getToken', '')
					store.commit('getJwtToken', '')
					router.replace({
						path: '/ssoLogin'
						// query: {
						//   redirect: router.currentRoute.fullPath//登录之后跳转到对应页面
						// }
					})
				return
				case 20204: // token过期，清除它,清除token信息并跳转到登录页面
					store.commit('getToken', '')
					store.commit('getJwtToken', '')
					router.replace({
						path: '/ssoLogin'
						// query: {
						//   redirect: router.currentRoute.fullPath//登录之后跳转到对应页面
						// }
					})
				return
				case 20203: // token过期，清除它,清除token信息并跳转到登录页面
					store.commit('getToken', '')
					store.commit('getJwtToken', '')
					router.replace({
						path: '/ssoLogin'
						// query: {
						//   redirect: router.currentRoute.fullPath//登录之后跳转到对应页面
						// }
					})
				return
			}
		}
		return response
	},
	error => {
		try {
			if (error.response) {
				switch (error.response.status) {
					case 20206: // token过期，清除它,清除token信息并跳转到登录页面
						store.commit('getToken', '')
						store.commit('getJwtToken', '')
						router.replace({
							path: '/ssoLogin'
							// query: {
							//   redirect: router.currentRoute.fullPath//登录之后跳转到对应页面
							// }
						})
						return
					case 20204:
						if (store.state.Login.lf == true) {
							Message({
								type: 'error',
								message: error.response.data.msg == undefined || error.response.data.msg == '' || error.response.data.msg == null ? '此账号被登出' : error.response.data.msg
							})
							store.commit('getToken', '')
							store.commit('getJwtToken', '')
							router.replace({
								path: '/ssoLogin'
							})
							window.location.reload() // 用户被踢出后能够重新加载资源文件
						}
						return
					case 20203: // 权限 没有权限跳到403页面 清除ssoPath
						Message({
							type: 'error',
							message: error.response.data.msg == undefined || error.response.data.msg == '' || error.response.data.msg == null ? '您没有权限' : error.response.data.msg
						})
						return
				}
				// }
			}
			return Promise.reject(error.response.data)
		} catch (e) {
			console.error(e)
		}
	})

function http(options, success, fail) {
	axios(options).then(function(response) {
		//  console.log(response)
		if (response.data || response.data == '') {
			response.data.status == '0' || response.data.status == undefined || response.data.status == null || response.data.status ==
				'302' || response.data.flag ? success(response.data) : (fail(response.data, response.data.message || '系统错误'),
					console.log(response.data || '系统错误'))
		} else {
			fail(null, '未收到返回数据')
		}
	}).catch(function(error) {
		fail({ msg: error }, '未收到返回数据')
	})
}

function get(options, success, fail) {
	var requestOption = Object.assign({
		method: 'get',
		params: options.data
	}, options)
	http(requestOption, success, fail)
}


function post(options, success, fail) {
	var requestOption = Object.assign({
		method: 'post'
	}, options)
	http(requestOption, success, fail)
}

function put(options, success, fail) {
	var requestOption = Object.assign({
		method: 'put'
	}, options)
	http(requestOption, success, fail)
}

function putParam(options, success, fail) {
	var requestOption = Object.assign({
		method: 'put',
		params: options.data
	}, options)
	http(requestOption, success, fail)
}

function delete1(options, success, fail) {
	var requestOption = Object.assign({
		method: 'delete'
	}, options)
	http(requestOption, success, fail)
}

function deleteParam(options, success, fail) {
	var requestOption = Object.assign({
		method: 'delete',
		params: options.data
	}, options)
	http(requestOption, success, fail)
}

// 导出下载的方法 为了获取response header
function httpExport(options, success, fail) {
	axios(options).then(function(response) {
		if (response.data || response.data == '') {
			response.data.status == '0' || response.data.status == undefined || response.data.status == null || response.data.status ==
				'302' ? success(response) : (fail(response, response.data.message || '系统错误'), console.log(response.data || '系统错误'))
			// response.headers.filename !=undefined?success(response):fail(response)  11.20
		} else {
			fail(null, '未收到返回数据')
		}
	}).catch(function(error) {
		fail(error)
	})
}

function getExport(options, success, fail) {
	var requestOption = Object.assign({
		method: 'get',
		params: options.data
	}, options)
	httpExport(requestOption, success, fail)
}

function postExport(options, success, fail) {
	var requestOption = Object.assign({
		method: 'post'
	}, options)
	httpExport(requestOption, success, fail)
}

function isIE9() {
	if (
		navigator.appName == 'Microsoft Internet Explorer' &&
		parseInt(
			navigator.appVersion
			.split(';')[1]
			.replace(/[ ]/g, '')
			.replace('MSIE', '')
		) <= 9
	) {
		return true
	}
	return false
}

export {
	get,
	post,
	put,
	putParam,
	delete1,
	deleteParam,
	getExport,
	postExport
}

// 2020.12.10新增 暴露axios对象
export {
	axios
}
