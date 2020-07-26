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
			<div class='article' v-if='menu === "default"'>
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
						<font-awesome-icon icon='image'/>
						기준 정보
					</label>
					<b-form-group class='mb-sm-2'>
						<b-input-group size='sm'>
							<b-input-group-prepend is-text>
								개념글 기준
							</b-input-group-prepend>
							<b-form-input
                                type='number'
								:placeholder='board.bestLimit'
								v-model='board.bestLimit'
								autofocus/>
						</b-input-group>
                    </b-form-group>
                    <b-form-group class='mb-sm-2'>
                        <b-input-group size='sm'>
							<b-input-group-prepend is-text>
								공지사항 노출 개수
							</b-input-group-prepend>
							<b-form-input
                                type='number'
								:placeholder='board.noticeLimit'
								v-model='board.noticeLimit'
								autofocus/>
						</b-input-group>
					</b-form-group>
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
			<div class='article' v-if='menu === "blind"'>
				<b-form @submit='onSubmit'>
					<label>
						<font-awesome-icon icon='book'/>
						차단 목록
					</label>
					<div class='desktop-only-test'>
						<h6>
							<div>#</div>
							<div>닉네임(ID)</div>
							<div>IP</div>
							<div class='subject'>사유</div>
							<div>차단 기간</div>
							<div>처리일</div>
							<div>해제</div>
						</h6>
						<ul v-if='blinds.length > 0'>
							<li v-for='(item, index) in blinds' :key='index'>
								<div>
									<div>{{ item.id }}</div>
									<div>{{ item.author }}</div>
									<div>{{ item.ip }}</div>
									<div class='subject'>
										<div>
											<span>
												{{ item.description }}
											</span>
										</div>
									</div>
									<div>{{ $moment(item.blockDate).format("YY/MM/DD HH:mm:ss") }}</div>
									<div>{{ $moment(item.created).format("YY/MM/DD HH:mm:ss") }}</div>
									<div>
										<b-button
											size='sm'
											variant='danger'
											@click='unblock(item.ip)'>
											해제
										</b-button>
									</div>
								</div>
							</li>
						</ul>
						<ul v-else>
							<li>
								현재 이 갤러리에는 차단된 유저가 없습니다.
							</li>
						</ul>
					</div>
				</b-form>
			</div>
			<div class='article' v-if='menu === "remove"'>
				<b-form @submit='onSubmit'>
					<label>
						<font-awesome-icon icon='book'/>
						삭제 목록
					</label>
					<div class='desktop-only-test'>
						<h6>
							<div>#</div>
							<div>닉네임(ID)</div>
							<div>IP</div>
							<div class='subject'>사유</div>
							<div>처리일</div>
							<div>처리자</div>
						</h6>
						<ul v-if='removes.length > 0'>
							<li v-for='(item, index) in removes' :key='index'>
								<div>
									<div>{{ item.id }}</div>
									<div>{{ item.author }}</div>
									<div>{{ item.ip }}</div>
									<div class='subject'>
										<div>
											<span>
												{{ item.description }}
											</span>
										</div>
									</div>
									<div>{{ $moment(item.created).format("YY/MM/DD HH:mm:ss") }}</div>
									<div>임시</div>
								</div>
							</li>
						</ul>
						<ul v-else>
							<li>
								현재 이 갤러리에는 삭제된 글이 없습니다.
							</li>
						</ul>
					</div>
				</b-form>
			</div>
			<div class='article' v-if='menu === "submanager"'>
				현재 부매니저 위임은 개발중에 있습니다.
			</div>
			<div class='article' v-if='menu === "manager"'>
				매니저 위임은 운영진에게 문의해주세요. 현재 개발중입니다.
			</div>
		</b-overlay>
    </div>
</template>


<script>
	export default {
		data() {
			return {
				page: 0,
				loading: false,
				domain: '',
				board: {},
				blinds: {
					id: 0,
					author: '',
					ip: '',
					description: '',
					blockDate: null,
					created: null
                },
                removes: {
                    id: 0,
					author: '',
					ip: '',
					description: '',
					created: null
                },
                menu: 'default',
                menuList: [
                    {
                        text: '기본 설정',
                        value: 'default'
                    },
                    {
                        text: '차단 목록',
                        value: 'blind'
                    },
                    {
                        text: '삭제 목록',
                        value: 'remove'
                    },
                    {
                        text: '부매니저',
                        value: 'submanager'
                    },
                    {
                        text: '매니저 위임',
                        value: 'manager'
                    }
                ]
			}
		},
		watch: { 
            menu: function() {
				switch (this.menu) {
                case 'blind':
                    this.getBlinds()
                    break
                case 'remove':
                    this.getRemoves()
                    break
				default:
                    this.getData()
					break
				}
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
            async getBlinds() {
                const domain = this.$route.params.domain || ''
                const token = this.$store.state.user.isLogged ? this.$store.state.user.token : ''
                const data = await this.$axios.$get(
                    `/api/board/admin/${domain}/blind/list`,
                    { headers: { 'x-access-token': token } }
                )
                if (data.status === 'fail')
                    this.error = {
                        state: true,
                        title: '오류가 발생했습니다.',
                        content: data.message
                    }
                if(data.blinds)
                    this.blinds = data.blinds
            },
            async getRemoves() {
                const domain = this.$route.params.domain || ''
                const token = this.$store.state.user.isLogged ? this.$store.state.user.token : ''
                const data = await this.$axios.$get(
                    `/api/board/admin/${domain}/remove/list`,
                    { headers: { 'x-access-token': token } }
                )
                if (data.status === 'fail')
                    this.error = {
                        state: true,
                        title: '오류가 발생했습니다.',
                        content: data.message
                    }
                if(data.removes)
                    this.removes = data.removes
            },
            unblock: async function(ip) {
   				const domain = this.$route.params.domain || ''
                const token = this.$store.state.user.isLogged ? this.$store.state.user.token : ''
                this.$store.commit('setLoading', true)
                const data = await this.$axios.$delete(
                    `/api/board/admin/${domain}/blind/remove`,
                    {
                        data: { ip },
                        headers: { 'x-access-token': token }
                    }
                )
                if (data.status === 'fail')
                    return this.toast(data.message || '오류가 발생했습니다.', 'danger')
                this.blinds = this.blinds.filter(blind => blind.ip !== ip)
                this.toast('차단 해제 성공!', 'success')
                this.$store.commit('setLoading')
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
                        description: this.board.description,
                        bestLimit: this.board.bestLimit,
                        noticeLimit: this.board.noticeLimit
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
                try {
                    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                } catch {
                    return x
                }
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

<style lang='less' scope>
    @primary: #30425f;
    
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


        .desktop-only-test {
            margin-bottom: .5rem;
            > h6 {
                display: flex;
                margin: 0;
                border-top: 1px solid #e9ecef;
                border-bottom: 2px solid #e9ecef;
                > div {
                    padding: .5rem;
                    font-size: 13px;
                    font-weight: 700;
                    text-align: center;
                    white-space: nowrap;
                  	&:nth-child(1) { width: 70px }
					&:nth-child(2) { width: 150px }
					&:nth-child(3) { width: 100px }
					&:nth-child(5) { width: 120px }
					&:nth-child(6) { width: 120px }
					&:nth-child(7) { width: 65px }
                    &.subject { flex: 1 }
                }
            }
            > ul {
                margin: 0;
                padding: 0;
                list-style: none;
                &.notice > li {
                    font-weight: 700;
                    border-bottom: 1px solid #e9ecef;
                    background-color: #f7f8fa;
                    &:hover { background-color: #f1f2f6 }
                }
                > li {
                    border-bottom: 1px solid #e9ecef;
                    background-color: #fff;
                    cursor: pointer;
                    &.view > {
                        border: 2px solid @primary;
                        border-left: 0;
                        border-right: 0;
                        > a > .subject > div > span:nth-child(1) {
                            color: #000 !important;
                            font-weight: bold;
                        }
                    }
                    > div {
                        display: flex;
                        &:hover {
                            text-decoration: none;
                            background-color: #f9f9f9;
                            > .subject > .thumb { visibility: visible }
                        }
                        &:visited > .subject > div > span:nth-child(1) { color: #770088 }
                        > div {
                            padding: .5rem;
                            color: #212529;
                            font-size: 13px;
                            text-align: center;
                            white-space: nowrap;
                            &.subject {
                                text-align: left;
                                position: relative;
                                > .thumb {
                                    position: absolute;
                                    left: -100px;
                                    top: -35px;
                                    z-index: 10;
                                    visibility: hidden;
                                    > img {
                                        width: 100px;
                                        height: 100px;
                                        padding: 3px;
                                        border: 1px solid @primary;
                                        border-radius: 4px;
                                        background-color: #fff;
                                    }
                                }
                                > div {
                                    > span {
                                        color: #6c757d;
                                        &:nth-child(1) {
                                            color: #212529;
                                            text-decoration: none;
                                            white-space: normal;
                                            word-break: break-all;
                                        }
                                        > span.category, > span.newest {
                                            margin-right: 2px;
                                            padding: 2px 4px;
                                            color: @primary;
                                            font-size: 11px;
                                            font-weight: 700;
                                            border-radius: 2px;
                                            background-color: #e9ecef;
                                        }
                                        > span.newest {
                                            margin-left: 2px;
                                            color: #fff;
                                            background-color: @primary;
                                        }
                                    }
                                }
                            }
                            &.author {
                                text-align: left;
                                > img:nth-child(1) { margin-top: -3px }
                                > img:nth-child(2) {
                                    width: 16px;
                                    height: 16px;
                                    margin-top: -3px;
                                    border-radius: 2px;
                                }
                                > span.ip {
                                    color: #666;
                                    font-size: 11px;
                                }
                            }
                           	&:nth-child(1) { width: 70px }
							&:nth-child(2) { width: 150px }
							&:nth-child(3) { width: 100px }
							&:nth-child(5) { width: 120px }
							&:nth-child(6) { width: 120px }
							&:nth-child(7) { width: 65px }
                        }
                        > .subject { flex: 1 }
                    }
                }
		    }
        }

</style>