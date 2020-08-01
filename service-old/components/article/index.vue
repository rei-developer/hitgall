<template>
    <article class='widget'>
        <div class='desktop-only'>
            <h6>
                <span>{{ getBoardName(domain) }}</span>
                <nuxt-link :to='`/board/${domain}`'>더보기</nuxt-link>
            </h6>
            <div>
                <ul>
                    <li v-for='(item, index) in topics' :key='index'>
                        <nuxt-link :to='`${item.id}`'>
                            <span :style='item.color !== "" ? `color: #${item.color}` : ""'>
                                {{ item.title }}
                            </span>
                        </nuxt-link>
                        <span>{{ $moment(item.created).format('HH:mm:ss') }}</span>
                    </li>
                </ul>
            </div>
        </div>
        <div class='mobile-only'>
            <h6>
                <font-awesome-icon icon='folder-open'/>
                최신 게시물
            </h6>
            <ul v-if='topics.length > 0'>
                <li v-for='(item, index) in topics' :key='index'>
                    <nuxt-link :to='`/${item.id}`'>
                        <div class='content'>
                            <div class='image'>
                                <img :src='item.imageUrl ? `https://cdn.hitgall.com/img/thumb/${item.imageUrl}` : "/default.png"' @error='imageUrlAlt'>
                            </div>
                            <div class='subject'>
                                <span :style='item.color !== "" ? `color: #${item.color}` : ""'>
                                    {{ item.title }}
                                </span>
                                <span class='newest' v-if='$moment().diff($moment(item.created), "days") <= 1'>N</span>
                                <div class='info'>
                                    <span>
                                        <font-awesome-icon icon='history'/>
                                        {{ $moment(item.created).fromNow() }}
                                    </span>
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
    </article>
</template>

<script>
    import Library from '~/assets/lib.js'

    export default {
        props: ['domain', 'limit'],
        data() {
            return {
                topics: [],
                page: 0,
                loading: false
            }
        },
        watch: {
            '$store.state.forceUpdate': function() {
                this.getData(true, true)
            }
        },
        mounted() {
            this.getData()
            this.realtimeUpdate()
        },
        methods: {
            getBoardName() {
                return Library.getBoardName(this.domain)
            },
            async getData(clear = true, forceUpdate = false) {
                if (this.$nuxt.$route.name !== 'index')
                    return
                this.loading = true
                if (forceUpdate) {
                    this.topics = []
                    this.page = 0
                }
                const data = await this.$axios.$post(
                    '/api/topic/list/widget',
                    { domain: this.domain, page: this.page, limit: this.limit }
                )
                if (!data.topics)
                    return
                if (clear)
                    this.topics = data.topics
                else
                    data.topics.map(topic => this.topics.push(topic))
                this.loading = false
                return data
            },
            numberWithCommas(x) {
                return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            },
            getLoadMore() {
                if (this.loading)
                    return
                this.page++
                this.getData(false)
            },
            realtimeUpdate() {
				const update = setTimeout(async () => {
                    if (this.$nuxt.$route.name !== 'index')
                        return clearTimeout(update)
                    if (this.page === 0)
                        this.getData()
                    this.realtimeUpdate()
                }, 30000)
            },
            imageUrlAlt(event) {
                event.target.src = '/default.png'
            }
        }
    }
</script>

<style lang='less' scoped>
    @primary: #9BA9FB;

    article.widget {
        > .desktop-only {
            width: 461px;
            border: 1px solid #ccc;
            background-color: #fff;
            > h6 {
                background-color: #fbfbfb;
                height: 24px;
                line-height: 24px;
                margin: 0;
                padding: 0 5px;
                > span {
                    color: #333;
                    font-size: 13px;
                    font-weight: bold;
                }
                > a {
                    float: right;
                    color: rgb(85, 85, 85);
                    font-size: 12px;
                    text-decoration: none;
                    cursor: pointer;
                }
            }
            > div {
                padding: 5px;
                border-top: 1px solid rgb(204, 204, 204);
                > ul {
                    margin: 0;
                    padding: 0;
                    list-style: none;
                    > li {
                        > a {
                            display: inline-block;
                            width: 380px;
                            height: 26px;
                            line-height: 26px;
                            padding: 1px 5px;
                            vertical-align: top;
                            color: rgb(51, 51, 51);
                            font-size: 12px;
                            text-decoration: none;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                            word-wrap: normal;
                            overflow: hidden;
                            cursor: pointer;
                        }
                        > span {
                            display: inline-block;
                            width: 64px;
                            line-height: 1;
                            padding: 3px 6px;
                            color: #fff;
                            font-size: 10.8px;
                            font-weight: bold;
                            text-align: center;
                            vertical-align: baseline;
                            white-space: nowrap;
                            border-radius: 2.7px;
                            background-color: rgba(0, 0, 0, 0.2);
                        }
                    }
                }
            }
        }
        > .mobile-only {
            background-color: #fff;
            > h6 {
                height: 32px;
                margin: 0;
                padding: .5rem 0 0 5px;
                color: #fff;
                font-size: 14px;
                border-bottom: 1px solid rgba(0, 0, 0, .1);
                background-color: @primary;
            }
            > ul {
                margin: 0;
                padding: 0;
                list-style: none;
                > li {
                    height: 57px;
                    border-bottom: 1px solid #e9ecef;
                    > a {
                        color: #333;
                        font-size: 12px;
                        text-decoration: none;
                        > .content {
                            display: flex;
                            > .image {
                                > img {
                                    width: 56px;
                                    height: 56px;
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
                                > .info {
                                    margin-top: 2px;
                                    color: #666;
                                    font-size: 11px;
                                    font-weight: normal;
                                    > span:nth-child(2) { margin: 0 .5rem }
                                }
                            }
                            > .comment {
                                width: 40px;
                                background-color: #f7f8fa;
                                > div {
                                    width: 30px;
                                    height: 30px;
                                    margin: 13px 0 0 5px;
                                    padding-top: 5px;
                                    color: #333;
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
    }
</style>