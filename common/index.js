import {
	version
} from './../package.json'
import store from '../store/index'
import {
	config
} from './config'

const ajax = {
	get: function(url, data, doSuccess, doFail, options = {}) {
		let header = {
			"content-type": "application/json"
		}
		header.Gtzplatform = store.state.systemInfo.platform || ''
		header.CLIENTVERSION = version
		if (uni.getStorageSync('openid')) {
			//params.token = uni.getStorageSync('token') //后台需要在请求参数上传递token
			header.Authorization = uni.getStorageSync('openid')
		}
		if (url[0] === '/') {
			url = config.apiDomain + url
		} else {
			url = config.apiDomain + config.apiBase + url
		}
		uni.request({
			url,
			data,
			header,
			method: 'GET',
			success: (res) => {
				if (res.statusCode == 500) {
					uni.showToast({
						title: "服务器内部错误",
						icon: "none",
						duration: 2000
					})
					doFail && doFail(res)
					return
				}
				doSuccess(res)
			},
			fail: (err) => {
				doFail && doFail(err)
				return
			}
		})
	},
	post: function(url, data, doSuccess, doFail, options = {}) {
		let header = {
			"content-type": "application/json"
		}
		header.Gtzplatform = store.state.systemInfo.platform || ''
		header.CLIENTVERSION = version
		if (uni.getStorageSync('openid')) {
			//params.token = uni.getStorageSync('token') //后台需要在请求参数上传递token
			header.Authorization = uni.getStorageSync('openid')
		}
		if (url[0] === '/') {
			url = config.apiDomain + url
		} else {
			url = config.apiDomain + config.apiBase + url
		}
		uni.request({
			url,
			data,
			header,
			method: 'POST',
			success: (res) => {
				if (res.statusCode == 500) {
					uni.showToast({
						title: "服务器内部错误",
						icon: "none",
						duration: 2000
					})
					doFail && doFail(res)
					return
				}
				doSuccess(res)
			},
			fail: (err) => {
				doFail && doFail(res)
				return
			}
		})
	}
}

module.exports = {
	ajax,
}
