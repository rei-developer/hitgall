<template>
    <article class='widget'>
        <!-- <div class='desktop-only'>
            <h6>
                <span>HIT 갤러리</span>
                <nuxt-link to='/hit'>더보기</nuxt-link>
            </h6>
            <div>
                <ul>
                    <li v-for='(item, index) in topics' :key='index'>
                        <nuxt-link :to='`/${item.id}`'>
                            <img :src='`https://storage.googleapis.com/hitgall/img/thumb/${item.imageUrl}`' @error='imageUrlAlt'>
                            <strong>{{ getBoardName(item.boardDomain) }}</strong>
                            <div>{{ item.title }}</div>
                        </nuxt-link>
                    </li>
                </ul>
            </div>
        </div> -->
        <div class='mobile-only-test'>
            <h6>
                <nuxt-link to='/hit'>
                    <font-awesome-icon icon='star'/>
                    HIT 갤러리
                </nuxt-link>
            </h6>
            <ul v-if='topics.length > 0'>
                <li v-for='item in topics' :key='item.id'>
                    <nuxt-link :to='`/${item.id}`'>
                        <div class='content'>
                            <div class='image'>
                                <img :src='item.imageUrl ? `https://storage.googleapis.com/hitgall/img/thumb/${item.imageUrl}` : "/default.png"' @error='imageUrlAlt'>
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
        </div>
    </article>
</template>

<script>
    import Library from '~/assets/lib.js'

    export default {
        props: ['limit'],
        data() {
            return {
                topics: []
            }
        },
        watch: {
            '$store.state.forceUpdate': function() {
                this.getData(true)
            }
        },
        mounted() {
            this.getData()
            this.realtimeUpdate()
        },
        methods: {
            getBoardName(domain) {
                return Library.getBoardName(domain)
            },
            async getData(forceUpdate = false) {
                if (this.$nuxt.$route.name !== 'index')
                    return
                if (forceUpdate)
                    this.topics = []
                const data = await this.$axios.$post(
                    '/api/topic/list/widget',
                    { domain: 'best', limit: this.limit }
                )
                if (!data.topics)
                    return
                this.topics = data.topics
                return data
            },
            realtimeUpdate() {
				const update = setTimeout(async () => {
                    if (this.$nuxt.$route.name !== 'index')
                        return clearTimeout(update)
                    this.getData()
                    this.realtimeUpdate()
                }, 60000)
            },
            imageUrlAlt(event) {
                event.target.src = '/default.png'
            }
        }
    }
</script>

<style lang='less' scoped>
    @primary: #30425f;

    article.widget {
        width: 100%;
        // > .desktop-only {
        //     border: 1px solid #ccc;
        //     > h6 {
        //         background-color: #fbfbfb;
        //         height: 24px;
        //         line-height: 24px;
        //         margin: 0;
        //         padding: 0 5px;
        //         > span {
        //             color: rgb(45, 153, 225);
        //             font-size: 14px;
        //             font-weight: 700;
        //         }
        //         > a {
        //             float: right;
        //             color: rgb(85, 85, 85);
        //             font-size: 12px;
        //             text-decoration: none;
        //             cursor: pointer;
        //         }
        //     }
        //     > div {
        //         padding: 5px;
        //         border-top: 1px solid rgb(204, 204, 204);
        //         > ul {
        //             display: flex;
        //             justify-content: space-between;
        //             margin: 0;
        //             padding: 0;
        //             list-style: none;
        //             > li {
        //                 width: 179.5px;
        //                 > a {
        //                     position: relative;
        //                     text-decoration: none;
        //                     > img {
        //                         width: 100%;
        //                         height: 135px;
        //                         border-radius: 4px;
        //                     }
        //                     > strong {
        //                         position: absolute;
        //                         left: 0;
        //                         bottom: 53px;
        //                         width: 100%;
        //                         padding: 2px 0 3px;
        //                         color: #fff;
        //                         font-size: 12px;
        //                         font-weight: 400;
        //                         text-align: center;
        //                         border-top-left-radius: 4px;
        //                         border-top-right-radius: 4px;
        //                         background-color: #000;
        //                         opacity: .6;
        //                     }
        //                     > div {
        //                         margin-top: 4px;
        //                         color: #333;
        //                         font-size: 12px;
        //                         text-overflow: ellipsis;
        //                         white-space: nowrap;
        //                         word-wrap: normal;
        //                         overflow: hidden;
        //                     }
        //                 }
        //             }
        //         }
        //     }
        // }
        > .mobile-only-test {
            background-color: #fff;
            > h6 {
                height: 32px;
                margin: 0;
                padding: .5rem 0 0 5px;
                font-size: 14px;
                border-bottom: 1px solid rgba(0, 0, 0, .2);
                border-top-left-radius: 10px;
                border-top-right-radius: 10px;
                background-color: @primary;
                > a {
                    color: #fff;
                    text-decoration: none;
                }
            }
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
        }
    }
</style>