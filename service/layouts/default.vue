<template>
  <div>
    <div class='wrapper-body'>
      <Notify class='notify' v-if='$store.state.user.isLogged && $store.state.user.noticeCount > 0'/>
      <Header/>
      <main>
        <div class='content'>
          <b-alert variant='dark' dismissible show>
            힛갤 서버 운영비 후원 계좌번호 - 카카오뱅크 (예금주: 백O영) 3333-05-8635798
          </b-alert>
          <Nuxt/>
        </div>
        <div
          class='side'
          :style='{marginTop: `${top >= 100 ? top - 100 : 0}px`}'
          v-if='$store.state.isDesktop'
        >
          <SidebarWidget/>
          <SidebarThumb/>
        </div>
      </main>
      <div class='background' v-if='$store.state.isDesktop'/>
    </div>
    <Footer/>
  </div>
</template>

<style lang='less' scoped>
@font-color: #EDA7B2;

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
    width: 100%;
    height: 100%;
    position: fixed;
    top: 8rem;
    left: 0;
    //background-image: url('/background.jpg');
    background-size: 25%;
    opacity: .1;
    z-index: -1;
  }
}

@media (max-width: 1199px) {
  .wrapper-body > main {width: 100%}
  .notify {
    position: fixed;
    width: 100%;
    z-index: 100000;
  }
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
  data() {
    return {
      top: 0
    }
  },
  async created() {
    await this.$nextTick()
    window.addEventListener('scroll', this.handleScroll)
  },
  async mounted() {
    await this.$nextTick()
    await this.onResize()
    await this.checkLogged()
    await this.getNotices()
    this.updateNotices()
    window.addEventListener('resize', this.onResize)
  },
  async beforeDestroy() {
    await this.$nextTick()
    window.removeEventListener('resize', this.onResize)
  },
  async destroyed() {
    await this.$nextTick()
    window.removeEventListener('scroll', this.handleScroll)
  },
  methods: {
    async onResize() {
      await this.$nextTick()
      this.$store.commit('screenWidth', window.innerWidth)
    },
    async handleScroll() {
      await this.$nextTick()
      this.top = window.top.scrollY
    },
    checkLogged: async function () {
      const token = localStorage._token
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
      const token = localStorage._token
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
