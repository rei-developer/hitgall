<template>
	<div class='board-admin-page'>
        <b-form-group class='mb-3'>
            <b-form-radio-group
                size='sm'
                v-model='menu'
                :options='menuList'
                button-variant='primary'
                buttons
                name='radios-btn-default'/>
        </b-form-group>
		<b-overlay
			:show='loading'
			rounded='sm'>
			<div class='article'>
				<b-form @submit='onSubmit'>
					<label>
						<font-awesome-icon icon='book'/>
						기본 정보
					</label>
					<b-form-group class='mb-sm-2'>
						<b-input-group size='sm'>
							<b-input-group-prepend is-text>
								이름
							</b-input-group-prepend>
							<b-form-input
								:placeholder='board.name'
                                readonly/>
						</b-input-group>
					</b-form-group>
					<b-form-group class='mb-sm-2'>
						<b-input-group size='sm'>
							<b-input-group-prepend is-text>
								설명
							</b-input-group-prepend>
							<b-form-input
								:placeholder='board.description'
								v-model='board.description'
								autofocus/>
						</b-input-group>
					</b-form-group>
					<b-form-group class='mb-sm-2'>
						<b-input-group size='sm'>
							<b-input-group-prepend is-text>
								주소
							</b-input-group-prepend>
							<b-form-input
								:placeholder='`https://www.hitgall.com/board/${$route.params.domain}`'
								readonly/>
						</b-input-group>
					</b-form-group>
                    <b-form-group class='mb-sm-2'>
						<b-input-group size='sm'>
							<b-input-group-prepend is-text>
								카테고리
							</b-input-group-prepend>
							<b-form-input
								:placeholder='board.category'
                                readonly/>
						</b-input-group>
					</b-form-group>
					<hr>
					<label>
						<font-awesome-icon icon='image'/>
						이미지 정보
					</label>
					<div>
						곧 오픈 예정
					</div>
					<hr>
					<label>
						<font-awesome-icon icon='calendar-check'/>
						날짜 정보
					</label>
					<b-form-group class='mb-sm-2'>
						<b-input-group size='sm'>
							<b-input-group-prepend is-text>
								갤러리 생성일
							</b-input-group-prepend>
							<b-form-input
								:value='`${$moment(board.created).format("YYYY/MM/DD HH:mm:ss")} (${numberWithCommas($moment().diff($moment(board.created), "days"))}일)`'
								readonly/>
						</b-input-group>
					</b-form-group>
					<b-button
						type='submit'
						variant='primary'
						block>
						설정 완료
					</b-button>
					<b-button
						variant='danger'
						block>
						갤러리 폐쇄 신청 (개발중)
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
				loading: false,
				domain: '',
                board: {},
                menu: 'default',
                menuList: [
                    {
                        text: '기본 설정',
                        value: 'default'
                    },
                    {
                        text: '차단 목록',
                        value: 'notice'
                    },
                    {
                        text: '삭제 목록',
                        value: 'feedback'
                    },
                    {
                        text: '부매니저',
                        value: 'request'
                    },
                    {
                        text: '매니저 위임',
                        value: 'request'
                    }
                ]
			}
        },
        mounted() {
            this.getData()
        },
		methods: {
            async getData() {
                const domain = this.$route.params.domain || ''
                const token = this.$store.state.user.isLogged ? this.$store.state.user.token : ''
                const data = await this.$axios.$get(
                    `/api/board/admin/${domain}`,
                    { headers: { 'x-access-token': token } }
				)
                if (data.status === 'fail')
                    this.error = {
                        state: true,
                        title: '오류가 발생했습니다.',
                        content: data.message
					}
				this.domain = domain
                this.board = data.board
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
				this.toast('대문 사진을 업로드했습니다.', 'success')
				this.$store.commit('user/setBackgroundImageUrl', url)
			},
			onSubmit: async function(evt) {
				evt.preventDefault()
				if (!this.$store.state.user.isLogged)
					return this.toast('로그인하세요.', 'danger')
				const token = this.$store.state.user.token
				this.$store.commit('setLoading', true)
				const data = await this.$axios.$patch(
					`/api/board/admin/${this.domain}/edit`,
					{
						description: this.board.description
					},
					{ headers: { 'x-access-token': token } }
				)
				if (data.status === 'fail') {
					this.$store.commit('setLoading')
					return this.toast(data.message || '오류가 발생했습니다.', 'danger')
				}
				this.toast('갤러리를 편집했습니다.', 'success')
				this.$store.commit('setLoading')
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
  .board-admin-page {
    width: 100%;
    margin: 0 auto;
  }
  .board-admin-page .header {
    margin: 1rem auto;
    color: #3D5AFE;
    font-size: 1.5rem;
    font-weight: bold;
    text-align: center;
  }
  .board-admin-page .profile {
    position: relative;
    border: 1px solid #EEE;
    border-top-left-radius: .5rem;
    border-top-right-radius: .5rem;
  }
  .board-admin-page .profile .image img {
    width: 5rem;
    height: 5rem;
    margin: .5rem;
    padding: 2px;
    border: 1px solid #CCC;
    border-radius: 500rem;
    background: #FFF;
  }
  .board-admin-page .profile .image input {
    position: absolute;
    width: 5rem;
    height: 5rem;
    top: 0;
    left: .5rem;
    opacity: 0;
  }
  .board-admin-page .profile .upload {
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
  .board-admin-page .profile .upload input {
    position: absolute;
    width: 2.2rem;
    height: 2.2rem;
    right: 0;
    bottom: 0;
    opacity: 0;
  }
  .board-admin-page .profile .image input:hover,
  .board-admin-page .profile .upload input:hover {
    cursor: pointer;
  }
  .board-admin-page .profile .background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    /* background: linear-gradient(to top, rgba(0, 0, 0, .5), transparent); */
  }
  .board-admin-page .profile .nickname {
    position: absolute;
    left: 6rem;
    bottom: .2rem;
    color: #333;
    font-size: 1.4rem;
    font-weight: bold;
  }
  .board-admin-page .profile .upload:hover {
    cursor: pointer;
    opacity: 1;
  }
  .board-admin-page .article {
    width: 100%;
    padding: .5rem;
    margin-bottom: 4rem;
    border: 1px solid #EEE;
    border-top: 0;
    background: #FFF;
  }
  .board-admin-page .article:last-child {
    margin-bottom: 1rem;
  }
  .board-admin-page .article .title {
    margin-bottom: .5rem;
    color: #3D5AFE;
    font-size: .9rem;
  }
  .board-admin-page .article hr {
	  margin-top: 0;
  }
</style>