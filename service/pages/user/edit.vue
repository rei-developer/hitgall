<template>
	<div class='accountForm'>
		<b-overlay
			:show='loading'
			rounded='sm'>
			<div class='profile' :style='$store.state.user.backgroundImageUrl ? `background-image: url(${$store.state.user.backgroundImageUrl})` : ""'>
				<div class='background'/>
				<div class='nickname'>
					<img :src='`/level/${$store.state.user.level}.png`'>
					{{ $store.state.user.nickname }}
				</div>
				<!-- <div class='upload' v-b-tooltip.hover title='배경 사진을 변경합니다.'>
					<font-awesome-icon icon='camera' />
					<input type='file' @change='backgroundImageUpload' />
				</div> -->
				<div class='image'>
					<img :src='$store.state.user.profileImageUrl || "/profile.png"'>
					<!-- <input type='file' @change='profileImageUpload' v-b-tooltip.hover title='프로필 사진을 변경합니다.'/> -->
				</div>
			</div>
			<div class='article'>
				<b-form @submit='onSubmit'>
					<label>
						<font-awesome-icon icon='user-circle'/>
						기본 정보
					</label>
					<b-form-group class='mb-sm-2'>
						<b-input-group size='sm'>
							<b-input-group-prepend is-text>
								ID
							</b-input-group-prepend>
							<b-form-input
								:placeholder='$store.state.user.username'
								v-model='username'/>
						</b-input-group>
					</b-form-group>
					<b-form-group class='mb-sm-2'>
						<b-input-group size='sm'>
							<b-input-group-prepend is-text>
								닉네임
							</b-input-group-prepend>
							<b-form-input
								:placeholder='$store.state.user.nickname'
								v-model='nickname'
								autofocus/>
						</b-input-group>
					</b-form-group>
					<b-form-group class='mb-sm-2'>
						<b-input-group size='sm'>
							<b-input-group-prepend is-text>
								이메일
							</b-input-group-prepend>
							<b-form-input
								type='email'
								:value='$store.state.user.email'
								readonly/>
						</b-input-group>
					</b-form-group>
					<hr>
					<label>
						<font-awesome-icon icon='key'/>
						암호 변경
					</label>
					<b-form-group class='mb-sm-2'>
						<b-input-group size='sm'>
							<b-input-group-prepend is-text>
								새 암호
							</b-input-group-prepend>
							<b-form-input
								type='password'
								placeholder='20자 제한'
								v-model='newPassword'
								show-password/>
						</b-input-group>
					</b-form-group>
					<b-form-group class='mb-sm-2'>
						<b-input-group size='sm'>
							<b-input-group-prepend is-text>
								새 암호 확인
							</b-input-group-prepend>
							<b-form-input
								type='password'
								placeholder='20자 제한'
								v-model='newPassword2'
								show-password/>
						</b-input-group>
					</b-form-group>
					<hr>
					<label>
						<font-awesome-icon icon='gift'/>
						포인트 정보
					</label>
					<b-form-group class='mb-sm-2'>
						<b-input-group size='sm'>
							<b-input-group-prepend is-text>
								포인트
							</b-input-group-prepend>
							<b-form-input
								:value='numberWithCommas($store.state.user.point)'
								readonly/>
						</b-input-group>
					</b-form-group>
					<b-form-group class='mb-sm-2'>
						<b-input-group size='sm'>
							<b-input-group-prepend is-text>
								레벨
							</b-input-group-prepend>
							<b-form-input
								:value='$store.state.user.level'
								readonly/>
						</b-input-group>
					</b-form-group>
					<b-form-group class='mb-sm-2'>
						<b-progress
							:value='per'
							variant='danger'
							show-progress
							animated>
							<b-progress-bar :value='per' :label='`${numberWithCommas(exp)} / ${numberWithCommas(maxExp)} (${per}%)`'/>
						</b-progress>
					</b-form-group>
					<hr>
					<label>
						<font-awesome-icon icon='calendar-check'/>
						날짜 정보
					</label>
					<b-form-group class='mb-sm-2'>
						<b-input-group size='sm'>
							<b-input-group-prepend is-text>
								계정 생성일
							</b-input-group-prepend>
							<b-form-input
								:value='`${$moment($store.state.user.registerDate).format("YYYY/MM/DD HH:mm:ss")} (${numberWithCommas($moment().diff($moment($store.state.user.registerDate), "days"))}일)`'
								readonly/>
						</b-input-group>
					</b-form-group>
					<b-form-group class='mb-sm-2'>
						<b-input-group size='sm'>
							<b-input-group-prepend is-text>
								이용 제한일
							</b-input-group-prepend>
							<b-form-input
								:value='$moment($store.state.user.blockDate).format("YYYY/MM/DD")'
								readonly/>
						</b-input-group>
					</b-form-group>
					<b-button
						type='submit'
						variant='primary'
						block>
						프로필 편집
					</b-button>
					<b-button
						variant='primary'
						@click='signOut'
						block>
						로그아웃
					</b-button>
					<b-button
						variant='danger'
						block>
						회원 탈퇴 (개발중)
					</b-button>
				</b-form>
			</div>
		</b-overlay>
    </div>
</template>


<script>
	export default {
		data() {
			return {
				username: '',
				nickname: '',
				email: '',
				newPassword: '',
				newPassword2: '',
				exp: 0,
				maxExp: 0,
				per: 0,
				loading: false
			}
		},
		watch: {
			'$store.state.user.level': function() {
				this.getStatus()
			},
			'$store.state.user.exp': function() {
				this.getStatus()
			}
		},
		mounted() {
			this.getStatus()
		},
		methods: {
			getStatus() {
				this.exp = this.$store.state.user.exp
				this.maxExp = Math.pow(this.$store.state.user.level, 2) * 90
				this.per = (this.exp / this.maxExp * 100).toFixed(2)
			},
			profileImageUpload: async function(e) {
				if (this.loading || e.target.files.length < 1)
					return
				if (!this.$store.state.user.isLogged)
					return this.toast('로그인하세요.', 'danger')
				const token = this.$store.state.user.token
				const LIMITS = 10485760
				const file = e.target.files[0]
				const formData = new FormData()
				formData.append('type', 'file')
				formData.append('image', file, file.name)
				if (!/(.png|.jpg|.jpeg)/i.test(file.name))
					return this.toast('이미지 업로드 실패... (png, jpg, jpeg만 가능)', 'danger')
				if (file.size > LIMITS)
					return this.toast('이미지 업로드 실패... (10MB 이하만 업로드 가능)', 'danger')
				this.loading = true
				this.$store.commit('setLoading', true)
				const data = await this.$axios.$post(
					'/api/cloud/profile',
					formData,
					{ headers: { 'content-type': 'multipart/form-data' } }
				)
				if (data.status === 'fail') {
					this.loading = false
					this.$store.commit('setLoading')
					return this.toast(data.message || '오류가 발생했습니다.', 'danger')
				}
				this.editByProfileImage(token, data.filename)
			},
			backgroundImageUpload: async function(e) {
				if (this.loading || e.target.files.length < 1)
					return
				if (!this.$store.state.user.isLogged)
					return this.toast('로그인하세요.', 'danger')
				const token = this.$store.state.user.token
				const LIMITS = 10485760
				const file = e.target.files[0]
				const formData = new FormData()
				formData.append('type', 'file')
				formData.append('image', file, file.name)
				if (!/(.png|.jpg|.jpeg)/i.test(file.name))
					return this.toast('이미지 업로드 실패... (png, jpg, jpeg만 가능)', 'danger')
				if (file.size > LIMITS)
					return this.toast('이미지 업로드 실패... (10MB 이하만 업로드 가능)', 'danger')
				this.loading = true
				this.$store.commit('setLoading', true)
				const data = await this.$axios.$post(
					'/api/cloud/background',
					formData,
					{ headers: { 'content-type': 'multipart/form-data' } }
				)
				if (data.status === 'fail') {
					this.loading = false
					this.$store.commit('setLoading')
					return this.toast(data.message || '오류가 발생했습니다.', 'danger')
				}
				this.editByBackgroundImage(token, data.filename)
			},
			editByProfileImage: async function(token, url) {
				const data = await this.$axios.$patch(
					'/api/auth/edit/profile',
					{ url },
					{ headers: { 'x-access-token': token } }
				)
				this.loading = false
				this.$store.commit('setLoading')
				if (data.status === 'fail')
					return this.toast(data.message || '오류가 발생했습니다.', 'danger')
				this.toast('프로필 사진을 업로드했습니다.', 'success')
				this.$store.commit('user/setProfileImageUrl', url)
			},
			editByBackgroundImage: async function(token, url) {
				const data = await this.$axios.$patch(
					'/api/auth/edit/background',
					{ url },
					{ headers: { 'x-access-token': token } }
				)
				this.loading = false
				this.$store.commit('setLoading')
				if (data.status === 'fail')
					return this.toast(data.message || '오류가 발생했습니다.', 'danger')
				this.toast('배경사진을 업로드했습니다.', 'success')
				this.$store.commit('user/setBackgroundImageUrl', url)
			},
			onSubmit: async function(evt) {
				evt.preventDefault()
				if (this.newPassword !== this.newPassword2)
					return this.toast('새 암호가 서로 다릅니다.', 'danger')
				if (!this.$store.state.user.isLogged)
					return this.toast('로그인하세요.', 'danger')
				const token = this.$store.state.user.token
				this.$store.commit('setLoading', true)
				const data = await this.$axios.$patch(
					'/api/auth/edit',
					{
						username: this.username,
						nickname: this.nickname,
						newPassword: this.newPassword,
						newPassword2: this.newPassword2
					},
					{ headers: { 'x-access-token': token } }
				)
				if (data.status === 'fail') {
					this.$store.commit('setLoading')
					return this.toast(data.message || '오류가 발생했습니다.', 'danger')
				}
				this.toast('프로필을 편집했습니다.', 'success')
				if (this.username !== '')
					this.$store.commit('user/setUsername', this.username)
				if (this.nickname !== '')
					this.$store.commit('user/setNickname', this.nickname)
				this.$store.commit('setLoading')
			},
			signOut() {
                if (!this.$store.state.user.isLogged)
                    return
				this.$store.commit('user/signOut')
				this.$router.push({ path: '/' })
			},
			numberWithCommas(x) {
                    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            },
			toast(text, variant = 'default') {
                this.$bvToast.toast(text, {
                    title: '알림',
                    toaster: 'b-toaster-top-center',
                    variant: variant,
                    solid: true,
                    appendToast: true
                })
            }
		}
	}
</script>

<style>
  .accountForm {
    width: 330px;
    margin: 0 auto;
  }
  .accountForm .header {
    margin: 1rem auto;
    color: #3D5AFE;
    font-size: 1.5rem;
    font-weight: bold;
    text-align: center;
  }
  .accountForm .profile {
    position: relative;
    border: 1px solid #EEE;
    border-top-left-radius: .5rem;
    border-top-right-radius: .5rem;
  }
  .accountForm .profile .image img {
    width: 5rem;
    height: 5rem;
    margin: .5rem;
    padding: 2px;
    border: 1px solid #CCC;
    border-radius: 500rem;
    background: #FFF;
  }
  .accountForm .profile .image input {
    position: absolute;
    width: 5rem;
    height: 5rem;
    top: 0;
    left: .5rem;
    opacity: 0;
  }
  .accountForm .profile .upload {
    position: absolute;
    right: .5rem;
    bottom: .5rem;
    width: 2.2rem;
    height: 2.2rem;
    line-height: 2rem;
    border-radius: 500rem;
    background: #3D5AFE;
    color: #FFF;
    font-size: 1.2rem;
    text-align: center;
    opacity: .75;
    z-index: 1;
  }
  .accountForm .profile .upload input {
    position: absolute;
    width: 2.2rem;
    height: 2.2rem;
    right: 0;
    bottom: 0;
    opacity: 0;
  }
  .accountForm .profile .image input:hover,
  .accountForm .profile .upload input:hover {
    cursor: pointer;
  }
  .accountForm .profile .background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    /* background: linear-gradient(to top, rgba(0, 0, 0, .5), transparent); */
  }
  .accountForm .profile .nickname {
    position: absolute;
    left: 6rem;
    bottom: .2rem;
    color: #333;
    font-size: 1.4rem;
    font-weight: bold;
  }
  .accountForm .profile .upload:hover {
    cursor: pointer;
    opacity: 1;
  }
  .accountForm .article {
    width: 100%;
    padding: .5rem;
    margin-bottom: 4rem;
    border: 1px solid #EEE;
    border-top: 0;
    background: #FFF;
  }
  .accountForm .article:last-child {
    margin-bottom: 1rem;
  }
  .accountForm .article .title {
    margin-bottom: .5rem;
    color: #3D5AFE;
    font-size: .9rem;
  }
  .accountForm .article hr {
	  margin-top: 0;
  }
</style>