<template>
  <div class='wrapper'>
    <SidebarMenu v-if='isSidebar'/>
    <header
      :class='[
        "desktop-only",
        top >= 100 ? "fixed" : undefined
      ]'
    >
      <ul>
        <nuxt-link to='/'>
          <li class='logo'>
            <div>
              <img :src='`/logo${logo}.png`' alt='힛갤'>
            </div>
            <div>
              <div>HITGALL.com</div>
              <div>Re:제로부터 시작하는</div>
            </div>
          </li>
        </nuxt-link>
        <li class='right'>
          <b-button-group v-if='$store.state.user.isLogged'>
            <b-button squared size='sm' variant='primary' to='/user/edit'>
              <font-awesome-icon icon='cog'/>
              {{ $store.state.user.nickname }}
            </b-button>
          </b-button-group>
          <b-button-group v-else>
            <b-button squared size='sm' variant='primary' to='/signin'>
              <font-awesome-icon icon='sign-in-alt'/>
              로그인
            </b-button>
            <b-button squared size='sm' variant='outline-primary' to='/signup'>회원가입</b-button>
          </b-button-group>
        </li>
      </ul>
    </header>
    <header class='mobile-only'/>
    <nav
      :class='[
        "desktop-only",
        top >= 100 ? "fixed" : undefined
      ]'
    >
      <ul>
        <nuxt-link
          :to='`/board/${item.field}`'
          v-for='(item, index) in boardList'
          :key='index'
        >
          <li @click='forceUpdate($event, item.field)'>
            <div class='icon'/>
            {{ item.name }}
          </li>
        </nuxt-link>
        <nuxt-link to='/board/admin' v-if='$store.state.user.isLogged'>
          <li>
            갤러리 관리
          </li>
        </nuxt-link>
        <nuxt-link to='/gallery'>
          <li @click='forceUpdate'>
            <font-awesome-icon icon='camera'/>
            갤러리
          </li>
        </nuxt-link>
        <nuxt-link to='/seal'>
          <li v-shortkey.once='["t"]' @shortkey='move("/seal")' @click='forceUpdate'>
            <font-awesome-icon icon='smile'/>
            힛갤콘
          </li>
        </nuxt-link>
        <nuxt-link to='/help'>
          <li>
            <font-awesome-icon icon='question-circle'/>
            도움말
          </li>
        </nuxt-link>
      </ul>
    </nav>
    <nav class='mobile-only fixed'>
      <ul>
        <nuxt-link class='logo' to='/'>
          <li>
            <img src='/icon.png' alt='힛갤'>
          </li>
        </nuxt-link>
        <nuxt-link to='/gallery'>
          <li @click='forceUpdate'>
            <font-awesome-icon icon='camera'/>
            갤러리
          </li>
        </nuxt-link>
        <nuxt-link to='/help'>
          <li>
            <font-awesome-icon icon='question-circle'/>
            도움말
          </li>
        </nuxt-link>
        <nuxt-link class='right' :to='$store.state.user.isLogged ? "/user/edit" : "/signin"'>
          <li v-if='$store.state.user.isLogged'>
            <font-awesome-icon icon='cog'/>
          </li>
          <li v-else>
            <font-awesome-icon icon='sign-in-alt'/>
          </li>
        </nuxt-link>
      </ul>
    </nav>
    <b-button
      class='side-menu'
      variant='dark'
      @click='onSidebarClick'
    >
      <font-awesome-icon icon='bars'/>
    </b-button>
    <b-button
      class='scroll-top'
      variant='dark'
      @click='onScrollTopClick'
      v-if='top >= 100'
    >
      <font-awesome-icon icon='chevron-up'/>
    </b-button>
  </div>
</template>

<style lang='less' scoped>
@primary: #5F5476;
@primary-hover: #EDE3EB;
@font-color: #EDA7B2;

.wrapper {
  background: #fff;
  > header, nav {
    > ul {
      display: flex;
      align-items: center;
      width: 1200px;
      height: 100px;
      margin: 0 auto;
      padding: 0;
      list-style: none;
      > a {
        color: @font-color;
        font-size: 14px;
        text-decoration: none;
        > li.logo {
          display: flex;
          align-items: center;
          &:last-child {
            line-height: 1.2rem;
            div:first-child {
              margin-right: .5rem;
              font-size: 24px;
              font-weight: bold;
            }
          }
        }
      }
      > li {
        margin-left: 1rem;
        &.right {
          display: flex;
          flex: 1;
          justify-content: flex-end;
        }
      }
    }
  }
  > header.fixed {margin-bottom: calc(1rem + 44px)}
  > nav {
    margin-bottom: 1rem;
    color: #FFF;
    background: @font-color;
    box-shadow: 0 5px 10px 0 rgba(0, 64, 128, .2);
    &.fixed {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      z-index: 5;
    }
    > ul {
      height: 44px;
      > a, > li {
        height: 44px;
        line-height: 42px;
        margin: 0;
        padding: 0 .5rem;
        color: #FFF;
        font-size: 13px;
        font-weight: bold;
        text-decoration: none;
        white-space: nowrap;
        cursor: pointer;
        &:hover {
          color: @primary-hover;
          background: @primary;
        }
      }
    }
  }
  > button {
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    bottom: 1rem;
    width: 3rem;
    height: 3rem;
    font-size: 2rem;
    border-radius: 500rem;
    z-index: 1000;
    &.scroll-top {
      right: 4.5rem;
      > svg {margin-bottom: 2px}
    }
    &.side-menu {
      right: 1rem;
      font-size: 1.5rem;
    }
  }
}

.input-group > div:first-child {width: 300px}

@media (max-width: 1199px) {
  .wrapper > header.mobile-only {height: calc(1rem + 44px)}
  .wrapper > header,
  .wrapper > nav > ul {
    width: 100%;
    > a {
      &.logo > li > img { height: 40px; }
      &.logo:hover,
      &.right:hover {background: unset}
      &.right {
        display: flex;
        flex: 1;
        justify-content: flex-end;
        font-size: 1.5rem;
      }
      > li > img {margin-top: -2px}
    }
  }
}
</style>

<script>
import SidebarMenu from '@/components/sidebar/menu'
import BOARD_LIST from '@/data/board-list'

export default {
  name: 'Header',
  components: {SidebarMenu},
  data() {
    return {
      searchText: '',
      searchResult: [],
      boardList: BOARD_LIST
        .filter(item => item.visible),
      top: 0,
      logo: Math.floor(Math.random() * 4) + 1,
      isSidebar: false
    }
  },
  watch: {
    searchText() {
      this.search()
    }
  },
  async created() {
    try {
      await this.$nextTick()
      window.addEventListener('scroll', this.handleScroll)
    } catch (e) {
    }
  },
  mounted() {
    this.$eventBus.$on('SetSidebar', () => this.onSidebarClick())
  },
  beforeDestroy() {
    this.$eventBus.$off('SetSidebar')
  },
  async destroyed() {
    try {
      await this.$nextTick()
      window.removeEventListener('scroll', this.handleScroll)
    } catch (e) {
    }
  },
  methods: {
    forceUpdate(event, field = null) {
      const board = this.$nuxt.$route.params.board
      if (board === field)
        this.$store.commit('forceUpdate')
    },
    async handleScroll() {
      await this.$nextTick()
      this.top = window.top.scrollY
    },
    async onScrollTopClick() {
      await this.$nextTick()
      window.scrollTo(0, 0)
    },
    onSidebarClick() {
      this.isSidebar = !this.isSidebar
    },
    move(path) {
      if (this.$nuxt.$route.name === 'board-domain-write')
        return
      this.forceUpdate()
      this.$router.push({path})
    },
    imageUrlAlt(event) {
      event.target.src = '/default.png'
    },
    signOut() {
      if (!this.$store.state.user.isLogged)
        return
      this.$store.commit('user/signOut')
    },
    check() {
      window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault()
        this.installPromptEvent = e
        console.log(e)
        this.installed = true
      })
    },
    install() {
      console.log(this.installPromptEvent)
      this.installPromptEvent.prompt()
      this.installPromptEvent.userChoice.then((choice) => {
        if (choice.outcome === 'accepted') {
          console.log('User accepted the A2HS prompt')
          this.installed = false
          location.reload()
        } else {
          console.log('User dismissed the A2HS prompt')
        }
      })
      this.installPromptEvent = null
    }
  }
}
</script>
