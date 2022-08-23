import {
    post,
    get,
    put,
    delete1,
    putParam
} from '../../http/index'

const request = {
	state: {
		token: '',
		ssoPath: '',
		projectId:'',
		appNo:'',
		jwtToken:'',
		routerPath:'',
		modalId:'1435833682391838720',
		clusterHeader: '',
		superAdmin: false,
		userInfo:{},
	},
	getters: {},
	mutations: {
		getToken: (state, data) => {
			state.token = data
		},
		getRouterPath: (state, data) => {
			state.routerPath = data
		},
		getSuperAdmin: (state, data) => {
		    state.superAdmin = data
		},
		getUserInfo: (state, data) => {
			state.userInfo = data
		},
		getJwtToken: (state, data) => {
			state.jwtToken = data
		},
		getClusterHeader: (state, data) => {
			state.clusterHeader = data
		},
		modalId:(state, data) => {
			state.modalId = data
		},
		cmdbAppNo: (state, data) => {
			state.appNo = data
		},
		getProjectId: (state, data) => {
			state.projectId = data
		},
		getSsoPath: (state, data) => {
		  state.ssoPath = data
		},
	},
	// 异步方法
	actions: {
        // post请求
        httpPost({
                     commit,
                     state
                 }, _data) {
            const curl = _data.curl
            delete _data.curl
            const data = _data
            return new Promise((resolve, reject) => {
                post({
                    // url: curl.indexOf("http://") != -1 || curl.indexOf("https://") != -1 ? curl :  window.configUrl + curl,
                    url: curl,
                    data: data
                }, function (res) {
                    resolve(res)
                }, function (err, message) {
                    reject(err)
                })
            })
        },
        // put请求
        httpPut({
                    commit,
                    state
                }, _data) {
            const curl = _data.curl
            delete _data.curl
            const data = _data
            return new Promise((resolve, reject) => {
                put({
                    // url: curl.indexOf("http://") != -1 || curl.indexOf("https://") != -1 ? curl :  window.configUrl + curl,
                    url: curl,
                    data: data
                }, function (res) {
                    resolve(res)
                }, function (err, message) {
                    reject(err)
                })
            })
        },
        httpPutParam({
                    commit,
                    state
                }, _data) {
            const curl = _data.curl
            delete _data.curl
            const data = _data
            return new Promise((resolve, reject) => {
                putParam({
                    // url: curl.indexOf("http://") != -1 || curl.indexOf("https://") != -1 ? curl :  window.configUrl + curl,
                    url: curl,
                    data: data
                }, function (res) {
                    resolve(res)
                }, function (err, message) {
                    reject(err)
                })
            })
        },
        // delete请求
        httpDelete({
                       commit,
                       state
                   }, _data) {
            const curl = _data.curl
            delete _data.curl
            const data = _data
            return new Promise((resolve, reject) => {
                delete1({
                    // url: curl.indexOf("http://") != -1 || curl.indexOf("https://") != -1 ? curl :  window.configUrl + curl,
                    url: curl,
                    data: data
                }, function (res) {
                    resolve(res)
                }, function (err, message) {
                    reject(err)
                })
            })
        },
        // get请求
        httpGet({
                    commit,
                    state
                }, _data) {
            const curl = _data.curl
            delete _data.curl
            const data = _data
            return new Promise((resolve, reject) => {
                get({
                    //url: curl.indexOf("http://") != -1  || curl.indexOf("https://") != -1 ? curl :  window.configUrl + curl,
                    url: curl,
                    data: data
                }, function (res) {
                    resolve(res)
                }, function (err, message) {
                    reject(err)
                })
            })
        },

    }
}

export default request
