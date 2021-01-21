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
    <main class='single'>
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
    <Aplayer/>
  </div>
</template>

<script>
import Notify from '~/components/header/notify.vue'
import Header from '~/components/header'
import Sidebar from '~/components/sidebar.vue'
import Footer from '~/components/footer.vue'
import Aplayer from '~/components/aplayer.vue'

export default {
  components: {
    Notify,
    Header,
    Sidebar,
    Footer,
    Aplayer
  },
  data() {
    return {
      ver: {
        backend: 0,
        frontend: 354
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
    checkVersion: async function () {
      const data = await this.$axios.$get('/api/version')
      this.ver.backend = data.version || 0
    },
    checkLogged: async function () {
      const token = localStorage.tk
      if (!token)
        return
      const data = await this.$axios.$get(
        '/api/auth/check',
        {headers: {'x-access-token': token}}
      )
      if (data.status === 'fail')
        return
      data.token = token
      this.$store.commit('user/setUser', data)
    },
    getNotices: async function () {
      const token = localStorage.tk
      if (!token)
        return
      const data = await this.$axios.$get(
        '/api/notice',
        {headers: {'x-access-token': token}}
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
      this.$router.push({path: `/${item.id}`})
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
body {
  background-color: #F9F9F9
}

section {
  max-width: 1640px;
  margin: 0 auto;
}

header.header {
  margin-bottom: 1rem;
  // background-color: #dbe2ef;
  // // background-image: url(/navbg.jpg);
  box-shadow: 1px 1px 8px rgba(0, 0, 0, .25);

  width: 100%;
  height: 50px;
  line-height: 50px;
  // position: fixed;
  // z-index: 2;
  // top: 0;
  background-color: #fff;
  box-shadow: 0 5px 10px 0 rgba(0, 64, 128, .05);
}

main {
  flex: 1;

  > section.panel {
    display: flex;

    > article.sidebar {
      flex-basis: 250px;
      flex-shrink: 0;
    }

    > article.inner {
      flex: 1;
      margin: 8px;
      border-radius: 6px;
      padding: 15px;
      box-sizing: border-box;
      position: relative;
      animation-name: item;
      animation-duration: .4s;
      display: inline-block;
      text-align: left;
      animation-fill-mode: backwards;
      box-shadow: 0 10px 40px -10px rgba(0, 64, 128, .2);
      transition: box-shadow .3s;
    }
  }

  &.single {
    background-color: #fdfdfd;
    margin: 0;
    color: #263646;
    font-family: rubik, arial;
    font-size: 14px;
    // padding: 60px 0 100px;
    animation-name: fade;
    animation-duration: .5s;
  }
}

@media (max-width: 1159px) {
  main {
    > section.panel {
      > article.inner {
        margin: 0;
        padding: 15px 0;
      }
    }
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
