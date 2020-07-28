<template>
    <div>
		<b-form-group class='mb-3'>
            <nuxt-link :to='`/save`'>
                <b-button size='sm' variant='primary' @click='forceUpdate'>
                    <font-awesome-icon icon='file-alt'/>
                    목록
                </b-button>
            </nuxt-link>
        </b-form-group>
        <!-- <b-form-group class='mb-3' v-if='categories.length > 0'>
            <b-form-radio-group
                size='sm'
                v-model='category'
                :options='categories'
                button-variant='primary'
                buttons
                name='radios-btn-default'/>
        </b-form-group> -->
        <article class='topic-list'>
            <div class='loading-bar'>
                <div class='subject'>수집글</div>
                <!-- <div class='counter'>
                    <strong>{{ numberWithCommas(counts.count) }}</strong> (오늘 {{ counts.today }})
                </div> -->
                <client-only>
                    <ScaleLoader
                        :height='16'
                        :width='4'
                        magin='2px'
                        color='#fff'
                        v-if='loading'/>
                </client-only>
            </div>
            <div class='desktop-only'>
                <h6>
                    <div>#</div>
                    <div class='subject'>제목</div>
                    <div>글쓴이</div>
                    <div>날짜</div>
                    <div>조회</div>
                    <div>추천</div>
                </h6>
                <ul>
                    <li
                        :class='id == item.id ? "view" : ""'
                        v-for='(item, index) in topics' :key='index'>
                        <nuxt-link :to='`/${item.id}?page=${page}${category !== "" ? "&category=" + category : ""}`'>
                            <div>
                                <span v-if='id == item.id'>
                                    <font-awesome-icon icon='angle-right'/>
                                </span>
                                <span v-else>
                                    {{ item.id }}
                                </span>
                            </div>
                            <div class='subject'>
                                <div class='thumb' v-if='item.imageUrl'>
                                    <img :src='`/img/thumb/${item.imageUrl}`' @error='imageUrlAlt'>
                                </div>
                                <div>
                                    <span :style='item.color !== "" ? `color: #${item.color}` : ""'>
                                        <span class='category' v-if='item.category'>{{ item.category }}</span>
                                        {{ item.title }}
                                        <span class='newest' v-if='$moment().add(9, "hours").diff($moment(item.created).add(9, "hours"), "days") <= 1'>N</span>
                                    </span>
                                    <span v-if='item.postsCount > 0'>
                                        [{{ item.postsCount }}]
                                    </span>
                                    <span v-if='item.isImage > 0'>
                                        <font-awesome-icon icon='image'/>
                                    </span>
                                </div>
                            </div>
                            <div class='author'>
                                <img :src='`/level/${item.level}.png`'>
                                <img class='icon' :src='`/icon/${item.icon}`' v-if='item.icon !== ""'>
                                {{ item.author }}
                            </div>
                            <div>{{ getCreated(item.created) }}</div>
                            <div>{{ numberWithCommas(item.hits) }}</div>
                            <div>{{ numberWithCommas(item.likes) }}</div>
                        </nuxt-link>
                    </li>
                </ul>
            </div>
            <div class='mobile-only'>
                <ul v-if='topics.length > 0'>
                    <li
                        :class='id == item.id ? "view" : ""'
                        v-for='item in topics' :key='item.id'>
                        <nuxt-link :to='`/${item.id}?page=${page}${category !== "" ? "&category=" + category : ""}`'>
                            <div class='content'>
                                <div class='image'>
                                    <img :src='item.imageUrl ? `/img/thumb/${item.imageUrl}` : "/default.png"' @error='imageUrlAlt'>
                                </div>
                                <div class='subject'>
                                    <span class='category' v-if='item.category'>{{ item.category }}</span>
                                    <span :style='item.color !== "" ? `color: #${item.color}` : ""'>
                                        {{ item.title }}
                                    </span>
                                    <span class='newest' v-if='$moment().add(9, "hours").diff($moment(item.created).add(9, "hours"), "days") <= 1'>N</span>
                                    <div class='info'>
                                        <span>
                                            <font-awesome-icon icon='history'/>
                                            {{ $moment(item.created).add(9, "hours").fromNow() }}
                                        </span>
                                        <span>
                                            <font-awesome-icon icon='eye'/>
                                            {{ numberWithCommas(item.hits) }}
                                        </span>
                                        <span v-if='item.likes > 0'>
                                            <font-awesome-icon icon='star'/>
                                            {{ numberWithCommas(item.likes) }}
                                        </span>
                                    </div>
                                    <div class='author'>
                                        <img :src='`/level/${item.level}.png`'>
                                        <img class='icon' :src='`/icon/${item.icon}`' v-if='item.icon !== ""'>
                                        {{ item.author }}
                                    </div>
                                </div>
                                <div class='comment'>
                                    <div v-if='item.postsCount > 0'>
                                        <span :class='item.postsCount >= 5 ? "hot" : ""'>
                                            {{ item.postsCount }}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </nuxt-link>
                    </li>
                </ul>
                <div class='load-more' @click='getLoadMore'>
                    <span v-if='loading'>
                        <font-awesome-icon class='fa-spin' icon='circle-notch'/>
                    </span>
                    <span v-else>
                        <font-awesome-icon icon='chevron-down'/>
                    </span>
                </div>
            </div>
            <div class='bottom'>
                <b-pagination-nav
                    :link-gen='linkGen'
                    :limit='10'
                    :number-of-pages='100'
                    v-model='page'
                    size='sm'/>
                <div>
                    <b-button size='sm' @click='scrollToTop'>
                        <font-awesome-icon icon='arrow-up'/>
                    </b-button>
                </div>
            </div>
            <b-input-group size='sm' class='mb-3 search-box'>
                <template v-slot:prepend>
                    <b-dropdown
                        :text='getSearchLabel()'
                        variant='primary'
                        size='sm'>
                        <b-dropdown-item @click='searches.select = 0'>제목</b-dropdown-item>
                        <b-dropdown-item @click='searches.select = 1'>본문</b-dropdown-item>
                        <b-dropdown-item @click='searches.select = 2'>전체</b-dropdown-item>
                        <b-dropdown-item @click='searches.select = 3'>작성자</b-dropdown-item>
                    </b-dropdown>
                </template>
                <b-form-input
                    v-b-tooltip.focus title='잠시 갱신이 중단됩니다.'
                    placeholder='2글자 이상'
                    v-on:keyup.enter='search'
                    v-model='searches.text'
                    @focus='searches.state = true'
                    @blur='searches.state = false'/>
                <template v-slot:append>
                    <b-button
                        variant='primary'
                        size='sm'
                        @click='search'>
                        <font-awesome-icon icon='search'/>
                        검색
                    </b-button>
                </template>
            </b-input-group>
        </article>
    </div>
</template>

<script>
    import Library from '~/assets/lib.js'

    export default {
        props: ['id', 'purePage'],
        data() {
            return {
                category: '',
                categories: [],
                topics: [],
                counts: {
                    today: 0,
                    count: 0
                },
                searches: {
                    text: '',
                    select: 0,
                    state: false
                },
				page: Number(this.purePage),
				loading: false
            }
        },
        watch: { 
            '$store.state.forceUpdate': function() {
                this.getData(true, true)
				this.getCount()
            },
            category: function() {
                this.page = 1
                this.getData(true, true)
                this.getCount()
            }
        },
        mounted() {
            this.category = this.$route.query.category || ''
            this.getData()
			this.getCount()
            this.realtimeUpdate()
        },
        methods: {
            getData: async function(clear = true, forceUpdate = false) {
                if (this.$nuxt.$route.name !== 'save-id' && this.$nuxt.$route.name !== 'save-list')
                    return
				this.loading = true
                this.$store.commit('setLoading', true)
                if (forceUpdate)
                    this.page = 1
                const data = await this.$axios.$post(
                    '/api/save/list',
                    {
                        category: this.category,
                        searches: this.searches,
                        page: this.page - 1
                    }
                )
                this.categories = []
                if (data.categories)
                    this.categories = data.categories
                if (clear)
                    this.topics = data.topics
                else
                    data.topics.map(topic => this.topics.push(topic))
				this.counts.count = data.count
				this.loading = false
                this.$store.commit('setLoading')
            },
            getLoadMore() {
                if (this.loading)
                    return
                this.page++
                this.getData(false)
            },
            getCount: async function() {
                // const data = await this.$axios.$get(`/api/save/count`)
                // if (data.status === 'fail')
				// 	return
                // this.counts.today = this.numberWithCommas(data.today)
            },
            getCreated(created) {
                const nowFormat = this.$moment(new Date()).add(9, "hours").format('YYYY.MM.DD') 
                const createdFormat = this.$moment(created).add(9, "hours").format('YYYY.MM.DD')
                return nowFormat === createdFormat
                    ? this.$moment(created).add(9, "hours").format('HH:mm:ss')
                    : createdFormat
            },
            getSearchLabel() {
                const labels = ['제목', '본문', '전체', '작성자']
                return labels[this.searches.select]
            },
            search() {
                if (this.searches.text === '')
                    return this.toast('검색어를 입력하세요.', 'danger')
                if (this.searches.text.length < 2)
                    return this.toast('검색어는 2글자 이상 입력하세요.', 'danger')
                this.page = 1
                this.getData(true, true)
                this.getCount()
            },
            move(item) {
                this.$router.push({ path: `/save/${item.id}?page=${this.page}${this.category !== '' ? '&category=' + this.category : ''}` })
            },
            scrollToTop() {
                this.$nextTick(() => {
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    })
                })
            },
            linkGen(page) {
                return `/save?page=${page}${this.category !== '' ? '&category=' + this.category : ''}`
            },
            forceUpdate() {
                this.$store.commit('forceUpdate')
            },
            realtimeUpdate() {
                const update = setTimeout(async () => {
                    if (this.$nuxt.$route.name !== 'save-id' && this.$nuxt.$route.name !== 'save-list')
                        return clearTimeout(update)
                    if (this.page === 1 && !this.searches.state) {
					    this.getData()
                        this.getCount()
                    }
                }, 30000)
            },
            numberWithCommas(x) {
                    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            },
            imageUrlAlt(event) {
                event.target.src = '/default.png'
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

<style lang='less' scoped>
    @primary: #30425f;
    
    article.topic-list {
        > .loading-bar {
            height: 32px;
            border-bottom: 1px solid rgba(0, 0, 0, .2);
            border-radius: 10px 10px 0 0;
            background-color: @primary;
            position: relative;
            > .subject {
                position: absolute;
                top: 0;
                left: 5px;
                color: #fff;
                font-size: 21px;
                font-weight: 700;
                text-shadow: #666 1px 1px;
            }
            > .counter {
                position: absolute;
                top: 6px;
                right: 6px;
                padding: 0 10px 1px;
                color: @primary;
                font-size: 12px;
                border-radius: 7px;
                background-color: #fff;
                > strong { font-size: 13px }
            }
            > div:nth-child(3) {
                width: 40px;
                margin: 0 auto;
                padding-top: 6px;
            }
        }
        > .desktop-only {
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
                    &:nth-child(3) { width: 160px }
                    &:nth-child(4) { width: 90px }
                    &:nth-child(5) { width: 60px }
                    &:nth-child(6) { width: 50px }
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
                    > a {
                        display: flex;
                        &:hover {
                            text-decoration: none;
                            background-color: #f9f9f9;
                            > .subject > .thumb { visibility: visible }
                        }
                        &:visited > .subject > div > span:nth-child(1) { color: #999 }
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
                            }
                            &:nth-child(1) { width: 70px }
                            &:nth-child(3) { width: 160px }
                            &:nth-child(4) { width: 90px }
                            &:nth-child(5) { width: 60px }
                            &:nth-child(6) { width: 50px }
                        }
                        > .subject { flex: 1 }
                    }
                }
		    }
        }
        > .mobile-only {
            background-color: #fff;
            > ul {
                margin: 0;
                padding: 0;
                list-style: none;
                &.notice > li { background-color: #f7f8fa }
                > li {
                    height: 73px;
                    border-bottom: 1px solid #e9ecef;
                    &.view {
                        height: 76px;
                        border-top: 2px solid @primary;
                        border-bottom: 2px solid @primary;
                        > a > .content > .subject {
                            color: #333 !important;
                            font-weight: bold;
                        }
                    }
                    > a {
                        color: #333;
                        font-size: 12px;
                        text-decoration: none;
                        &:visited { color: #999 }
                        > .content {
                            display: flex;
                            > .image {
                                > img {
                                    width: 72px;
                                    height: 72px;
                                    padding: 5px;
                                    border-radius: 10px;
                                }
                            }
                            > .subject {
                                position: relative;
                                flex: 1;
                                max-width: calc(100vw - 100px);
                                padding: .5rem 0 .5rem .5rem;
                                color: #212529;
                                font-size: 14px;
                                white-space: nowrap;
                                text-overflow: ellipsis;
                                overflow: hidden;
                                > span.notice, > span.category, > span.newest {
                                    margin-right: 2px;
                                    padding: 2px 4px;
                                    color: @primary;
                                    font-size: 11px;
                                    font-weight: 700;
                                    border-radius: 2px;
                                    background-color: #e9ecef;
                                }
                                > span.notice {
                                    color: #fff;
                                    background-color: #cc0000;
                                }
                                > span.newest {
                                    margin-left: 2px;
                                    color: #fff;
                                    background-color: @primary;
                                }
                                > .info {
                                    margin-top: 2px;
                                    color: #666;
                                    font-size: 11px;
                                    font-weight: normal;
                                    > span:nth-child(2) { margin: 0 .5rem }
                                }
                                > .author {
                                    position: absolute;
                                    right: 0;
                                    bottom: 5px;
                                    margin-right: 5px;
                                    color: @primary;
                                    font-weight: bold;
                                    > img:nth-child(1) { margin-top: -3px }
                                    > img:nth-child(2) {
                                        width: 16px;
                                        height: 16px;
                                        margin-top: -3px;
                                        border-radius: 2px;
                                    }
                                }
                            }
                            > .comment {
                                width: 40px;
                                background-color: #f7f8fa;
                                > div {
                                    width: 30px;
                                    height: 30px;
                                    margin: 21px 0 0 5px;
                                    padding-top: 5px;
                                    color: @primary;
                                    font-size: 12px;
                                    font-weight: 700;
                                    text-align: center;
                                    border: 1px solid #e9ecef;
                                    border-radius: 5px;
                                    background-color: #fff;
                                    > span.hot { color: #cc0000 }
                                }
                            }
                        }
                    }
                }
            }
            > .load-more {
                padding: .5rem;
                color: #fff;
                font-size: 13px;
                font-weight: 700;
                text-align: center;
                background-color: @primary;
                cursor: pointer;
            }
        }
        > .bottom {
            margin: 1rem 0;
            nav {
                display: inline-block !important;
                height: 31px !important;
            }
            > div {
                margin-left: 5px;
                float: right;
            }
        }
        > .search-box {
            width: 380px;
            margin: 0 auto;
        }
    }

    // mobile
    @media (max-width: 380px) {
        article.topic-list > .search-box { width: 100% }
    }
</style>