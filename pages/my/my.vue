<template>
	<view class="page">
		<view v-if="!isLogin || !userInfo">
			<button open-type="getUserInfo" @tap="getUserProfile">微信登录</button>
		</view>
		<view v-else>
			<u-avatar :src="userInfo.avatarUrl"></u-avatar>
			<view>昵称：{{userInfo.nickName}}</view>
		</view>
	</view>
</template>

<script>
	import {
		config
	} from '@/common/config.js'
	export default {
		data() {
			return {
				isLogin: false,
				userInfo: null,
			};
		},
		onLoad() {
			this.init()
		},
		methods: {
			init() {
				uni.getStorage({
					key: 'openid',
					success: (res) => {
						this.isLogin = true
						this.getInfo(res.data);
					},
					fail: () => {
						this.isLogin = false
					}
				});
			},
			// 微信获取用户信息
			getUserProfile() {
				this.wxlogin()
				this.$nextTick(function() {
						wx.getUserProfile({
							desc: '用于完善信息',
							success: (res) => {
								uni.getStorage({
									key: 'openid',
									success: openid => {
										this.$ajax.post('/user/setinfo', {openid: openid.data, avatarUrl: res.userInfo.avatarUrl, nickName: res.userInfo.nickName}, (resData) => {
											if(resData.data.code === 1) {
												console.log(resData)
												this.userInfo = resData.data.data
											} else {
												uni.showToast({
													title: "保存信息失败",
													icon: "none"
												})
											}
										}, errData => {
											uni.showToast({
												title: "保存信息失败",
												icon: "none"
											})
										})
									},
									fail: err => {
										uni.showToast({
											title: "微信授权失败",
											icon: "none"
										})
									}
								});
							},
							fail: (err) => {
								console.log(err)
							}
						})
				})
			},
			// 获取用户信息
			getInfo(openid) {
				this.$ajax.get('/user/getinfo', {
					openid
				}, (res) => {
					console.log(res)
					this.userInfo = res.data
				}, (err) => {
					console.log(err)
				})
			},
			// 微信授权
			wxlogin() {
				uni.login({
					provider: 'weixin',
					success: (loginRes) => {
						uni.request({
							url: config.weChat.getcodeUrl,
							data: {
								appid: config.weChat.appid,
								secret: config.weChat.secret,
								js_code: loginRes.code,
								grant_type: 'authorization_code'
							},
							success: (res) => {
								if (res.statusCode === 200) {
									try {
										uni.setStorageSync('openid', res.data.openid);
									} catch (e) {
										console.log(e)
									}
								} else {
									uni.showToast({
										title: "微信授权失败",
										icon: "none",
									})
								}
							},
							fail: (err) => {
								uni.showToast({
									title: "微信授权失败",
									icon: "none",
								})
							}
						})
					},
					fail: (err) => {
						uni.showToast({
							title: "微信授权失败",
							icon: "none"
						})
					}
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page {
		margin-top: 50rpx;
	}
</style>
