<template>
    <div>
        <article class='best'>
            <h2>
                <span>HIT</span>
                <nuxt-link to='/hit'>
                    <font-awesome-icon icon='plus'/>
                </nuxt-link>
            </h2>
            <div class='list'>
                <ul>
                    <li v-for='(item, index) in topics' :key='index'>
                        <nuxt-link :to='`/${item.id}`'>{{ item.title }}</nuxt-link>
                    </li>
                </ul>
            </div>
        </article>
        <!-- <article class='counter'>
            <span>
                <font-awesome-icon icon='file-alt'/>
                {{ counts.count }} (<span>+{{counts.today}}</span>)
            </span>
        </article> -->
        <article class='side'>
            <ul>
                <li @click='forceUpdate'><nuxt-link to='/board/notice'>공지사항</nuxt-link></li>
                <li @click='forceUpdate'><nuxt-link to='/board/feedback'>건의사항</nuxt-link></li>
                <li @click='forceUpdate'><nuxt-link to='/board/request'>갤러리 신청</nuxt-link></li>
            </ul>
        </article>
        <article class='side'>
            <ul>
                <li @click='forceUpdate'><nuxt-link to='/board/girl'>연예 갤러리</nuxt-link></li>
                <li @click='forceUpdate'><nuxt-link to='/board/anime'>애니메이션 갤러리</nuxt-link></li>
                <li @click='forceUpdate'><nuxt-link to='/board/lastorigin'>라스트 오리진 갤러리</nuxt-link></li>
                <li @click='forceUpdate'><nuxt-link to='/board/gfl'>소녀전선 갤러리</nuxt-link></li>
                <li @click='forceUpdate'><nuxt-link to='/board/koikatsu'>코이카츠 갤러리</nuxt-link></li>
                <li @click='forceUpdate'><nuxt-link to='/board/skyrim'>베데스다 갤러리</nuxt-link></li>
                <li @click='forceUpdate'><nuxt-link to='/board/honkai3'>붕괴3 갤러리</nuxt-link></li>
                <li @click='forceUpdate'><nuxt-link to='/board/ar_knights'>명일방주 갤러리</nuxt-link></li>
                <li @click='forceUpdate'><nuxt-link to='/board/epic7'>에픽세븐 갤러리</nuxt-link></li>
                <li @click='forceUpdate'><nuxt-link to='/board/pmmm'>마법소녀 마도카 마기카 갤러리</nuxt-link></li>
                <li @click='forceUpdate'><nuxt-link to='/board/counterside'>카운터사이드 갤러리</nuxt-link></li>
                <li @click='forceUpdate'><nuxt-link to='/board/monmusu'>몬무스 갤러리</nuxt-link></li>
                <li @click='forceUpdate'><nuxt-link to='/board/bang_dream'>BanG Dream 갤러리</nuxt-link></li>
                <li @click='forceUpdate'><nuxt-link to='/board/stwitch'>스트라이크 위치스 갤러리</nuxt-link></li>
                <li @click='forceUpdate'><nuxt-link to='/board/azur_lane'>벽람항로 갤러리</nuxt-link></li>
                <li @click='forceUpdate'><nuxt-link to='/board/manjuu'>Manjuu 갤러리</nuxt-link></li>
                <li @click='forceUpdate'><nuxt-link to='/board/tsukuru'>쯔꾸르 갤러리</nuxt-link></li>
                <li @click='forceUpdate'><nuxt-link to='/board/yandere'>얀데레 갤러리</nuxt-link></li>
                <li @click='forceUpdate'><nuxt-link to='/board/girlcafe'>걸 카페 건 갤러리</nuxt-link></li>
                <li @click='forceUpdate'><nuxt-link to='/board/mmd'>MMD 갤러리</nuxt-link></li>
                <li @click='forceUpdate'><nuxt-link to='/board/ai_girl'>AI 소녀 갤러리</nuxt-link></li>
                <li @click='forceUpdate'><nuxt-link to='/board/langrisser'>랑그릿사 갤러리</nuxt-link></li>
            </ul>
        </article>
        <!-- <article class='service'>
            <nuxt-link to='/'>
                <font-awesome-icon icon='music'/>
                RADIO
            </nuxt-link>
        </article> -->
        <article class='shortcut'>
            <nuxt-link to='/1'>
                <font-awesome-icon icon='check-square'/>
                힛갤 단축키 안내
            </nuxt-link>
        </article>
    </div>
</template>

<script>
    import Library from '~/assets/lib.js'

    export default {
        data() {
            return {
                topics: [],
                counts: {
                    today: 0,
                    count: 0
                }
            }
        },
        watch: {
            '$store.state.forceUpdate': function() {
                this.getData(true)
            }
        },
        mounted() {
            this.getData()
            // this.getCount()
        },
        methods: {
            forceUpdate() {
                this.$store.commit('forceUpdate')
            },
            getData: async function(forceUpdate = false) {
                if (forceUpdate)
                    this.topics = []
                const data = await this.$axios.$post(
                    '/api/topic/list/widget',
                    { domain: 'best', limit: 5 }
                )
                if (!data.topics)
                    return
                data.topics.map(topic => this.topics.push(topic))
                return data
            },
            getCount: async function() {
                const data = await this.$axios.$get(`/api/topic/count/all`)
                if (data.status === 'fail')
                    return
                this.counts.today = this.numberWithCommas(data.today)
                this.counts.count = this.numberWithCommas(data.count)
            },
            numberWithCommas(x) {
                    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            },
        }
    }
</script>

<style lang='less' scoped>
    article.best {
        border: 1px solid #eee;
        background-color: #fff;
        > h2 {
            height: 30px;
            line-height: 30px;
            margin-bottom: 5px;
            padding: 0px 10px;
            font-size: 14px;
            border-bottom: 1px solid #ddd;
            > span {
                color: #666;
                font-weight: bold;
            }
            > a {
                float: right;
                color: #999;
            }
        }
        > .list {
            padding: 0px 5px;
            > ul {
                margin: 0;
                padding: 0;
                list-style: none;
                > li > a {
                    height: 26px;
                    line-height: 26px;
                    padding: 1px 5px;
                    color: #333;
                    font-size: 12px;
                    text-decoration: none;
                    overflow: hidden;
                }
            }
        }
    }

    article.side {
        margin-top: 10px;
        border: 1px solid #eee;
        border-radius: 2px;
        background-color: #fff;
        > ul {
            margin: 0;
            padding: 0;
            list-style: none;
            > li {
                padding: 10px 20px;
                &.active {
                    background-color: #7F859A;
                    > a { color: #fff }
                }
                > a {
                    display: block;
                    line-height: 20px;
                    color: rgb(119, 119, 119);
                    font-size: 14px;
                    text-decoration: none;
                }
            }
        }
    }

    article.counter {
        margin-top: 10px;
        padding: 0px;
        border: 1px solid rgb(45, 153, 225);
        border-radius: 2px;
        background-color: #fff;
        > span {
            line-height: 2;
            margin: 5px;
            color: rgb(45, 153, 225);
            font-size: 15px;
            font-weight: bold;
            > svg {
                font-size: 14px;
            }
            > span {
                color: rgb(45, 180, 0);
            }
        }
    }

    article.service {
        margin-top: 10px;
        a:nth-child(1) {
            display: inline-block;
            width: 100%;
            line-height: 22px;
            padding: 8px 16px;
            color: #fff;
            font-size: 20px;
            text-align: center;
            text-decoration: none;
            border: 1px solid #4A89DC;
            border-radius: 4px;
            background-color: #5D9CEC;
            cursor: pointer;
        }
    }

    article.shortcut {
        margin-top: 10px;
        padding-left: 6px;
        border: 1px solid #BCE8F1;
        border-radius: 3px;
        background-color: #D9EDF7;
        a {
            color: #3A87AD;
            font-size: 13px;
            font-weight: bold;
            text-decoration: none;
        }
    }
</style>