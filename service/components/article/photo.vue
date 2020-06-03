<template>
    <article class='widget'>
        <h6>
            <span>{{ getBoardName(domain) }} 갤러리</span>
            <nuxt-link :to='`/board/${domain}`'>더보기</nuxt-link>
        </h6>
        <div>
            <ul>
                <li v-for='(item, index) in getTopics(0)' :key='index'>
                    <nuxt-link :to='`${item.id}`'>
                        <img :src='`/img/thumb/${item.imageUrl}`' @error='imageUrlAlt'>
                        <!-- <strong>OP</strong> -->
                        <div>{{ item.title }}</div>
                    </nuxt-link>
                </li>
            </ul>
            <ul>
                <li v-for='(item, index) in getTopics(3)' :key='index'>
                    <nuxt-link :to='`${item.id}`'>
                        <img :src='`/img/thumb/${item.imageUrl}`' @error='imageUrlAlt'>
                        <!-- <strong>OP</strong> -->
                        <div>{{ item.title }}</div>
                    </nuxt-link>
                </li>
            </ul>
        </div>
    </article>
</template>

<script>
    import Library from '~/assets/lib.js'

    export default {
        props: ['domain', 'limit'],
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
            getBoardName() {
                return Library.getBoardName(this.domain)
            },
            getTopics(no) {
                let list = []
                for (let i = no; i < no + 3; i++)
                    if (this.topics[i])
                        list.push(this.topics[i])
                return list
            },
            async getData(forceUpdate = false) {
                if (this.$nuxt.$route.name !== 'index')
                    return
                if (forceUpdate)
                    this.topics = []
                const data = await this.$axios.$post(
                    '/api/topic/list/widget',
                    { domain: this.domain, limit: this.limit }
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
                event.target.src = 'https://github.com/u3u.png'
            }
        }
    }
</script>

<style lang='less' scoped>
    article.widget {
        width: 461px;
        border: 1px solid #ccc;
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
                display: flex;
                justify-content: space-between;
                margin: 0;
                padding: 0;
                list-style: none;
                > li {
                    width: 146.5px;
                    > a {
                        position: relative;
                        text-decoration: none;
                        > img {
                            width: 100%;
                            height: 135px;
                            border-radius: 4px;
                        }
                        > strong {
                            position: absolute;
                            left: 0;
                            bottom: 53px;
                            width: 100%;
                            padding: 2px 0 3px;
                            color: #fff;
                            font-size: 12px;
                            font-weight: 400;
                            text-align: center;
                            border-top-left-radius: 4px;
                            border-top-right-radius: 4px;
                            background-color: #000;
                            opacity: .6;
                        }
                        > div {
                            margin-top: 4px;
                            color: #333;
                            font-size: 12px;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                            word-wrap: normal;
                            overflow: hidden;
                        }
                    }
                }
                &:last-child { margin-top: 5px }
            }
        }
    }
</style>