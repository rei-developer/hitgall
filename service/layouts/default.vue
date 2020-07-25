<template>
    <!-- container -->
    <div class='containerBox'>
        <!-- notify -->
        <Notify v-if='$store.state.user.isLogged && $store.state.user.noticeCount > 0'/>
        <!-- header -->
        <header class='header'>
            <aside/>
            <section>
                <Header/>
            </section>
            <aside/>
        </header>
        <!-- main -->
        <main>
            <aside/>
            <section class='panel'>
                <!-- inner -->
                <article class='inner'>
                    <nuxt/>
                </article>
                <!-- sidebar -->
                <article class='sidebar'>
                    <Sidebar/>
                </article>
            </section>
            <aside/>
        </main>
        <!-- footer -->
        <footer>
            <aside/>
            <section>
                <Footer/>
            </section>
            <aside/>
        </footer>
        <!-- music player -->
        <!-- <Aplayer v-if='$store.state.user.isLogged && ( $store.state.user.level > 1 || $store.state.user.point > 300 || $store.state.user.isAdmin > 0 )' /> -->
    </div>
</template>

<script>
    import Notify from '~/components/header/notify.vue'
    import Header from '~/components/header'
    import Sidebar from '~/components/sidebar.vue'
    import Footer from '~/components/footer.vue'
    // import Aplayer from '~/components/aplayer.vue'
    
    export default {
        components: {
            Notify,
            Header,
            Sidebar,
            Footer,
            // Aplayer
        },
        data() {
            return {
                ver: {
                    backend: 0,
                    frontend: 343
                }
            }
        },
        beforeMount() {
            // this.$socket.on('newBest', data => {
            //     this.$toast(`[HIT] ${data.title}`, {
            //         timeout: 5000,
            //         icon: false,
            //         onClick: () => this.move(data)
            //     })
            //     this.playSound('/bb1.mp3')
            // })
            // this.$socket.on('newTopic', data => {
            //     this.$toast(data.title, {
            //         timeout: 5000,
            //         icon: false,
            //         onClick: () => this.move(data)
            //     })
            //     this.playSound('/bb1.mp3')
            // })
        },
        mounted() {
            this.checkVersion()
            this.checkLogged()
            this.getNotices()
            this.updateNotices()
        },
        beforeDestroy() {
            // this.$socket.removeAllListeners()
            // this.$socket.clear()
        },
        methods: {
            checkVersion: async function() {
                const data = await this.$axios.$get('/api/version')
                this.ver.backend = data.version || 0
            },
            checkLogged: async function() {
                const token = localStorage.tk
                if (!token)
                    return
                const data = await this.$axios.$get(
                    '/api/auth/check',
                    { headers: { 'x-access-token': token } }
                )
                if (data.status === 'fail')
                    return
                data.token = token
                this.$store.commit('user/setUser', data)
            },
            getNotices: async function() {
                const token = localStorage.tk
                if (!token)
                    return
                const data = await this.$axios.$get(
                    '/api/notice',
                    { headers: { 'x-access-token': token } }
                )
                if (data.count)
                    this.$store.commit('user/setNoticeCount', data.count)
            },
            updateNotices() {
                setTimeout(async () => {
                    this.getNotices()
                    this.updateNotices()
                }, 10000)
            },
            move(item) {
                this.$router.push({ path: `/${item.id}` })
            },
            playSound(sound) {
                if (!sound)
                    return
                const audio = new Audio(sound)
                audio.play()
            }
        }
    }
</script>

<style lang='less' scope>
    body { background-color: #F9F9F9 }

    section {
        max-width: 1160px;
        margin: 0 auto;
    }

    header.header {
        margin-bottom: 1rem;
        background-color: #30425f;
        // background-image: url(/navbg.jpg);
        box-shadow: 1px 1px 8px rgba(0, 0, 0, .25);
    }

    main {
        flex: 1;
        > section.panel {
            display: flex;
            > article.sidebar {
                flex-basis: 210px;
                flex-shrink: 0;
                margin-left: 10px;
            }
            > article.inner { flex: 1 }
        }
    }

    footer {
        padding: 15px 0;
        color: #fff;
        background-color: #57617B;
    }

    // container
    .containerBox {
        display: flex;
        min-height: 100vh;
        flex-direction: column;
    }
</style>