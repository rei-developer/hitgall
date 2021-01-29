<template>
  <div>
    <div class='wrapper-body'>
      <Notify v-if='$store.state.user.isLogged && $store.state.user.noticeCount > 0'/>
      <Header/>
      <main>
        <div class='content'>
          <b-alert variant='dark' dismissible>
            주소 변경 공지사항은 테스트.com 으로 접속해주세요.
          </b-alert>
          <Nuxt/>
        </div>
        <div class='side' v-if='$store.state.isDesktop'>
          <SidebarWidget/>
          <SidebarThumb/>
        </div>
      </main>
<!--      <div class='background' v-if='$store.state.isDesktop'/>-->
    </div>
    <Footer/>
  </div>
</template>

<style lang='less' scoped>
@font-color: #EFA7B0;

.wrapper-body {
  min-height: calc(100vh - 44px - 1rem);
  > main {
    display: flex;
    width: 1200px;
    margin: 0 auto;
    > .content {
      flex: 1;
      max-width: 892px;
      > .alert-dismissible {
        width: 100%;
        margin-bottom: .5rem;
        padding-top: .6rem;
        padding-bottom: .8rem;
        border: 0;
        border-radius: 0;
        background: #333;
        color: #FFF;
        font-size: 13px;
        font-weight: bold;
        text-align: center;
      }
    }
    > .side {
      width: 300px;
      margin-left: .5rem;
    }
  }

  > .background {
    width: 904px;
    height: 904px;
    position: fixed;
    right: -20rem;
    bottom: -8rem;
    background-image: url('/background.png');
    opacity: .1;
    z-index: -1;
  }
}

@media (max-width: 1199px) {
  .wrapper-body > main {width: 100%}
}
</style>

<script>
import Notify from '@/components/header/notify'
import Header from '@/components/header'
import SidebarWidget from '@/components/sidebar/widget'
import SidebarThumb from '@/components/sidebar/thumb'
import Footer from '@/components/footer'

export default {
  components: {
    Notify,
    Header,
    SidebarWidget,
    SidebarThumb,
    Footer
  },
  async mounted() {
    await this.$nextTick()
    await this.onResize()
    this.checkLogged()
    this.getNotices()
    this.updateNotices()
    window.addEventListener('resize', this.onResize)
  },
  async beforeDestroy() {
    await this.$nextTick()
    window.removeEventListener('resize', this.onResize)
  },
  methods: {
    async onResize() {
      await this.$nextTick()
      this.$store.commit('screenWidth', window.innerWidth)
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
