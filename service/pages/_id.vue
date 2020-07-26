<template>
    <div v-if='error'>
        <h3>{{ topic.title }}</h3>
        <p>{{ topic.content }}</p>
    </div>
    <div v-else>
        <b-modal
            id='bv-remove-modal'
            @ok='remove'
            title='알림'
            title-tag='h6'
            cancel-title='취소'
            ok-title='확인'
            size='sm'
            auto-focus-button='ok'
            centered>
            <div>정말로 글을 삭제하시겠습니까?</div>
            <b-form-group class='mt-1' v-if='!$store.state.user.isLogged'>
                <b-form-input
                    type='password'
                    placeholder='비밀번호'
                    v-model='removePassword'
                    required/>
            </b-form-group>
        </b-modal>
        <b-form-group class='mb-3'>
            <nuxt-link :to='`/board/${topic.boardDomain}`'>
                <b-button size='sm' variant='primary'>
                    <font-awesome-icon icon='file-alt'/>
                    목록
                </b-button>
            </nuxt-link>
            <!-- <b-button size='sm' variant='primary'>
                <font-awesome-icon icon='arrow-up'/>
                인기글
            </b-button> -->
            <span v-if='topic.boardDomain !== "all"'>
                <nuxt-link :to='`/board/${topic.boardDomain}/write`'>
                    <b-button
                        class='float-right'
                        size='sm'
                        variant='primary'>
                        <font-awesome-icon icon='pencil-alt'/>
                        쓰기
                    </b-button>
                </nuxt-link>
            </span>
        </b-form-group>
        <article class='topic-view'>
            <h6>
                <div class='regdate'>
                    <span>{{ $moment(topic.created).format("YY/MM/DD HH:mm:ss") }}</span>
                </div>
                <div class='category' v-if='topic.category'>{{ topic.category }}</div>
                <div class='subject' :style='topic.color !== "" ? `color: #${topic.color}` : ""'>{{ topic.title }}</div>
            </h6>
            <div class='profile'>
                <div class='image'>
                    <img :src='`https://storage.googleapis.com/hitgall/img/${topic.imageUrl}`' @error='imageUrlAlt'>
                </div>
                <div class='author'>
                    <!-- <img :src='`/level/${topic.level}.png`'> -->
                    <img class='icon' :src='`/${topic.admin ? "admin" : "user" + (topic.userId > 0 ? 1 : 0) + (topic.boardLevel || 0)}.png`'>
                    {{ topic.author }}
                    <span class='ip' v-if='topic.userId < 1 && topic.ip !== ""'>({{ topic.ip }})</span>
                </div>
                <div class='info'>
                    <div>
                        <span class='desktop-only'>조회 <strong>{{ numberWithCommas(topic.hits) }}</strong></span>
                        <!-- <span class='desktop-only'>댓글 <strong>1</strong></span> -->
                        <span>개념 <strong>{{ numberWithCommas(topic.likes) }}</strong></span>
                        <span>비추 <strong>{{ numberWithCommas(topic.hates) }}</strong></span>
                    </div>
                    <div>
                        <span @click='copyLink(`https://www.hitgall.com/{{ id }}`)'>https://www.hitgall.com/{{ id }}</span>
                    </div>
                </div>
            </div>
            <div class='content' v-viewer='{ title: false }'>
                <Poll :id='id' v-if='topic.isPoll'/>
                <span v-html='topic.content'/>
            </div>
            <div class='bottom-box'>
                <div class='likes' @click='votes()'>
                    <div>
                        <font-awesome-icon icon='star'/>
                    </div>
                    <div>개념<span>{{ numberWithCommas(topic.likes) }}</span></div>
                </div>
                <div class='hates' @click='votes(false)'>
                    <div>
                        <font-awesome-icon icon='arrow-down'/>
                    </div>
                    <div>비추<span>{{ numberWithCommas(topic.hates) }}</span></div>
                </div>
                <div class='qrcode'>
                    <client-only>
                        <qriously
                            foreground='#30425f'
                            :padding='0'
                            :value='`https://www.hitgall.com/${id}`'
                            :size='80'/>
                    </client-only>
                </div>
            </div>
            <div class='file-list' v-if='images.length > 0'>
                <h6>
                    <div>#</div>
                    <div class='subject'>파일 이름</div>
                    <div>다운로드</div>
                </h6>
                <ul>
                    <li v-for='(item, index) in images' :key='index'>
                        <div>{{ index + 1 }}</div>
                        <div class='subject'>{{ item.name }}</div>
                        <div @click='downloadWithAxios(item.imageUrl, item.name)'>
                            <font-awesome-icon icon='download'/>
                        </div>
                    </li>
                </ul>
            </div>
        </article>
        <b-form-group class='mt-3'>
            <nuxt-link :to='`/board/${topic.boardDomain}`'>
                <b-button size='sm' variant='primary'>
                    <font-awesome-icon icon='file-alt'/>
                    목록
                </b-button>
            </nuxt-link>
            <nuxt-link :to='`/board/${topic.boardDomain}/write?id=${id}`'>
                <b-button size='sm'>
                    <font-awesome-icon icon='edit'/>
                    수정
                </b-button>
            </nuxt-link>
            <b-button size='sm' @click='removeHandler'>
                <font-awesome-icon icon='trash'/>
                삭제
            </b-button>
            <b-button-group class='float-right'>
                <b-button size='sm' @click='scrollToBoardList'>
                    <font-awesome-icon icon='arrow-down'/>
                </b-button>
                <b-button size='sm' @click='scrollToTop'>
                    <font-awesome-icon icon='arrow-up'/>
                </b-button>
            </b-button-group>
        </b-form-group>
        <div class='comment mb-3'>
            <BoardCommentList :id='id' :topic='topic'/>
        </div>
        <div ref='boardList'>
            <BoardList :id='id' :purePage='$route.query.page || 1' :domain='topic.boardDomain'/>
        </div>
    </div>
</template>

<script>
    import Poll from '~/components/board/poll.vue'
    import BoardList from '~/components/board/list.vue'
    import BoardCommentList from '~/components/board/comment/list.vue'
    import 'viewerjs/dist/viewer.css'

    export default {
        components: {
            Poll,
            BoardList,
            BoardCommentList
        },
        validate ({ params }) {
            return /^\d+$/.test(params.id)
        },
        data() {
            return {
                id: 0,
                topic: {
                    userId: 0,
                    boardDomain: '',
                    category: '',
                    author: '',
                    title: '',
                    content: '',
                    ip: '',
                    header: '',
                    created: '',
                    updated: '',
                    hits: 0,
                    likes: 0,
                    hates: 0,
                    isPoll: false,
                    isImage: false,
                    isBest: false,
                    isNotice: false,
                    profile: '',
                    admin: 0,
                    boardLevel: 0
                },
                removePassword: '',
                images: [],
                error: false,
                loading: true
            }
        },
        async asyncData ({ app, params, store, $axios }) {
            const id = params.id
            const token = store.state.user.isLogged ? store.state.user.token : ''
            const data = await $axios.$get(
                `/api/topic/read/${id}`,
                { headers: { 'x-access-token': token } }
            )
            if (data.status === 'fail')
                return {
                    topic: {
                        title: '오류가 발생했습니다.',
                        content: data.message
                    },
                    error: true
                }
            if (store.state.user.isLogged)
                store.commit('user/setNoticeCount', data.count)
            const regex = /<p><\/p>/gim
            data.topic.content = data.topic.content.replace(regex, '<p><br></p>')
            // const regex = /<img[^>]*src=[\"']?([^>\"']+)[\"']?[^>]*>/mig
            // data.topic.content = data.topic.content.replace(regex, `<img src="$1">`)
            return {
                id,
                topic: data.topic,
                images: data.images
            }
        },
        beforeMount() {
            // this.$socket.emit('join', this.id)
            // this.$socket.on('vote', data => {
            //     this.topic.likes = data.likes
            //     this.topic.hates = data.hates
            // })
        },
        beforeDestroy() {
            // this.$socket.emit('leave', this.id)
            // this.$socket.removeAllListeners()
        },
        methods: {
            // handleClick(e) {
            //     if (e.target.matches('img')) {
            //         console.log(e)
            //         console.log(e.target.className)
            //     }
            // },
            votes: async function(flag = true) {
                if (this.id < 1)
                    return
                if (!this.$store.state.user.isLogged)
                    return this.toast('로그인하세요.', 'warning')
                const token = this.$store.state.user.token
                this.$store.commit('setLoading', true)
                const data = await this.$axios.$post(
                    '/api/topic/vote',
                    { id: this.id, likes: flag },
                    { headers: { 'x-access-token': token } }
                )
                if (data.status === 'fail') {
                    this.$store.commit('setLoading')
                    return this.toast(data.message || '오류가 발생했습니다.', 'danger')
                }
                data.move === 'BEST' ? this.toast('HIT 게시판으로 이전되었습니다!', 'primary') : this.toast('투표했습니다.', 'success')
                this.$store.commit('setLoading')
            },
            copyLink: async function(link) {
                this.toast('링크를 복사했습니다.', 'success')
                this.$copyText(link)
            },
            forceFileDownload(blob, name) {
                const url = window.URL.createObjectURL(blob)
                const link = document.createElement('a')
                link.href = url
                link.setAttribute('download', name)
                document.body.appendChild(link)
                link.click()
            },
            async downloadWithAxios(url, name) {
                await fetch(
                    `https://storage.googleapis.com/hitgall/img/${url}`,
                    {
                        headers: { 'Accept': 'image/*', },
                        responseType: 'arraybuffer'
                    }
                )
                .then(response => {
                    if (response.ok)
                        return response.blob()
                })
                .then(blob => {
                    this.forceFileDownload(blob, name)
                })
            },
            removeHandler: async function() {
                if (this.id < 1)
                    return
                this.$bvModal.show('bv-remove-modal')
            },
            remove: async function() {
                const token = this.$store.state.user.token || ''
                this.$store.commit('setLoading', true)
                const data = await this.$axios.$delete(
                    '/api/topic/delete',
                    {
                        data: {
                            id: this.id,
                            password: this.removePassword
                        },
                        headers: { 'x-access-token': token }
                    }
                )
                if (data.status === 'fail') {
                    this.$store.commit('setLoading')
                    return this.toast(data.message || '오류가 발생했습니다.', 'danger')
                }
                this.toast('글을 삭제했습니다.', 'success')
            },
            scrollToTop() {
                this.$nextTick(() => {
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    })
                })
            },
            scrollToBoardList() {
                this.$nextTick(() => {
                    window.scrollTo({
                        top: this.$refs.boardList.offsetTop,
                        behavior: 'smooth'
                    })
                })
            },
            numberWithCommas(x) {
                return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            },
            imageUrlAlt(event) {
                event.target.src = '/default.png'
            },
            playSound(sound) {
                if (!sound)
                    return
                const audio = new Audio(sound)
                audio.play()
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
        },
        head () {
            return {
                title: `${this.topic.title} - 힛갤`,
                meta: [
                    { property: 'og:site_name', content: '힛갤' },
                    { property: 'og:title', content: this.topic.title },
                    { property: 'og:description', content: this.topic.content.substr(0, 200) },
                    { property: 'og:image', content: this.topic.imageUrl ? `https://storage.googleapis.com/hitgall/img/${this.topic.imageUrl}` : '/default.png' },
                    { property: 'og:type', content: 'website' },
                    { property: 'og:updated_time', content: this.topic.updated },
                    { hid: `${this.id}`, name: `${this.topic.content.substr(0, 100)}`, content: '힛갤' }
                ]
            }
        }
    }
</script>

<style lang='less' scoped>
    @primary: #30425f;
    @primary-focus: #29313E;

    // desktop
    article.topic-view {
        border-bottom: 1px solid #eee;
        background-color: #fff;
        > h6 {
            height: 32px;
            margin: 0;
            padding: .5rem;
            color: #fff;
            border-bottom: 1px solid rgba(0, 0, 0, .2);
            border-top-left-radius: 10px;
            border-top-right-radius: 10px;
            background-color: @primary;
            > .category {
                display: inline-block;
                margin-bottom: 2px;
                padding: 4px 8px;
                color: @primary;
                font-size: 12px;
                font-weight: 700;
                border-radius: 4px;
                background-color: #f5f5f5;
            }
            > .subject {
                display: inline-block;
                max-width: calc(100vw - 80px);
                font-size: 14px;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
            }
            > .regdate {
                margin-top: -4px;
                float: right;
                > span { font-size: 11px }
            }
        }
        > .profile {
            min-height: 91px;
            border-bottom: 1px solid #eee;
            > .image {
                 > img, > div {
                    width: 80px;
                    height: 80px;
                    margin: 5px 0 5px 5px;
                    padding: 3px;
                    border: 1px solid #ddd;
                    background-color: #fff;
                    float: left;
                    > div { padding: 3px }
                }
            }
            > .author {
                display: inline-block;
                padding: 8px 0 4px 8px;
                color: #333;
                font-size: 13px;
                > img:nth-child(1) { margin-top: -2px }
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
            > .info {
                padding: 5px;
                text-align: right;
                float: right;
                > div:nth-child(1) > span {
                    padding: 0 6px;
                    color: #888;
                    font-size: 13px;
                    letter-spacing: -1px;
                    > strong {
                        padding-left: 2px;
                        color: #666;
                        letter-spacing: normal;
                    }
                    &:nth-child(3) > strong { color: #2D99E1 }
                    &:nth-child(4) > strong { color: #D83722 }
                }
                > div:nth-child(2) > span {
                    margin-top: -5px;
                    padding: 0 6px;
                    color: #999;
                    font-size: 12px;
                    cursor: pointer;
                }
            }
        }
        > .content {
            line-height: 1.5;
            padding: 20px;
            color: #000;
            font-size: 14px;
            word-break: break-all;
            overflow-wrap: break-word;
        }
        > .bottom-box {
            margin: 1rem 1rem 1rem 96px;
            text-align: center;
            > .likes, > .hates {
                display: inline-block;
                width: 80px;
                height: 80px;
                margin: 0 5px;
                padding: 2px;
                color: #fff;
                // border: 2px solid #ddd;
                border-radius: 500rem;
                background: @primary;
                cursor: pointer;
                // &:hover { border: 2px solid @primary }
                > div:nth-child(1) {
                    width: 72px;
                    height: 46px;
                    font-size: 35px;
                    border-radius: 500rem 500rem 0 0;
                    > svg { padding-left: 3px }
                }
                > div:nth-child(2) {
                    padding-top: 2px;
                    font-size: 12px;
                    font-weight: 700;
                    > span { margin-left: 4px }
                }
            }
            > .likes > div:nth-child(2) > span { color: #2D99E1 }
            > .hates {
                background: #AAA;
                > div:nth-child(2) > span { color: #D83722 }
            }
            > .qrcode {
                height: 80px;
                float: right;
            }
        }
        > .file-list {
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
                    &:nth-child(1) { width: 40px }
                    &:nth-child(3) { width: 80px }
                }
                > .subject { flex: 1 }
            }
            > ul {
                margin: 0;
                padding: 0;
                list-style: none;
                > li {
                    display: flex;
                    border-bottom: 1px solid #e9ecef;
                    &:last-child { border: 0 }
                    > div {
                        padding: .5rem;
                        color: #212529;
                        font-size: 13px;
                        text-align: center;
                        white-space: nowrap;
                        &.subject {
                            flex: 1;
                            text-align: left;
                            text-decoration: none;
                            white-space: normal;
                            word-break: break-all;
                        }
                        &:nth-child(1) { width: 40px }
                        &:nth-child(3) {
                            width: 80px;
                            background-color: #f5f5f5;
                            cursor: pointer;
                        }
                    }
                }
            }
        }
    }

    // mobile
    @media (max-width: 380px) {
        article.topic-view > .bottom-box { margin: 1rem }
    }
</style>