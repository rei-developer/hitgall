<template>
    <div>
        <div v-if='error.state'>
            <h3>{{ error.title }}</h3>
            <p>{{ error.content }}</p>
        </div>
        <article class='topic-list'>
            <div class='loading-bar'>
                <div class='subject'>갤러리 관리 목록</div>
                <!-- <div class='counter'>
                    <strong>{{ numberWithCommas(counts.count) }}</strong> (오늘 {{ counts.today }})
                </div> -->
            </div>
            <div class='desktop-only-test'>
                <h6>
                    <div>#</div>
                    <div class='subject'>갤러리 이름</div>
                    <div>관리</div>
                </h6>
                <ul v-if='boards'>
                    <li v-for='(item, index) in boards' :key='index'>
                        <div>
                            <div>{{ index + 1 }}</div>
                            <div class='subject'>
                                <!-- <div class='thumb' v-if='item.imageUrl'>
                                    <img :src='`https://cdn.hitgall.com/img/thumb/${item.imageUrl}`' @error='imageUrlAlt'>
                                </div> -->
                                <div>
                                    <span>
                                        <img class='icon' alt="" :src='`/user1${item.boardLevel || 0}.png`'>
                                        {{ item.name }}
                                    </span>
                                </div>
                            </div>
                            <div>
                                <nuxt-link :to='`/board/admin/${item.domain}`'>
                                    <b-button
                                        size='sm'
                                        variant='primary'>
                                        <font-awesome-icon icon='star'/>
                                        설정
                                    </b-button>
                                </nuxt-link>
                            </div>
                        </div>
                    </li>
                </ul>
                <ul v-else>
                    <li>
                        관리하는 갤러리가 아직 없습니다. 갤러리를 신청하세요.
                    </li>
                </ul>
            </div>
        </article>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                boards: [],
                error: {
                    state: false,
                    title: '',
                    content: ''
                }
            }
        },
        async asyncData ({ app, params, store, $axios }) {
            const token = store.state.user.isLogged ? store.state.user.token : ''
            const data = await $axios.$get(
                `/api/board/admin/list`,
                { headers: { 'x-access-token': token } }
            )
            if (data.status === 'fail')
                return {
                    error: {
                        state: true,
                        title: '오류가 발생했습니다.',
                        content: data.message
                    }
                }
            return {
                boards: data.boards
            }
        },
        methods: {
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
    @primary: #004080;
    
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
        > .desktop-only-test {
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
    }
</style>