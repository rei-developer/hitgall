<template>
  <div
    class='backdrop'
    @click.self='close'
  >
    <section>
      <div class='header'>
        <div
          class='close'
          @click='close'
        >
          <font-awesome-icon icon='times'/>
        </div>
      </div>
      <ul class="sidebar-menu">
        <nuxt-link
          :to='`/board/${item.field}`'
          v-for='(item, index) in boardList'
          :key='index'
        >
          <li class="sidebar-menu" @click='forceUpdate($event, item.field)'>
            <div class='icon'/>
            {{ item.name }}
          </li>
        </nuxt-link>
        <nuxt-link to='/board/admin' v-if='$store.state.user.isLogged'>
          <li class="sidebar-menu">
            <div class='icon'/>
            갤러리 관리
          </li>
        </nuxt-link>
        <nuxt-link to='/gallery'>
          <li class="sidebar-menu" @click='forceUpdate'>
            <div class='icon'>
              <font-awesome-icon icon='camera'/>
            </div>
            갤러리
          </li>
        </nuxt-link>
        <nuxt-link to='/seal'>
          <li class="sidebar-menu" v-shortkey.once='["t"]' @shortkey='move("/seal")' @click='forceUpdate'>
            <div class='icon'>
              <font-awesome-icon icon='smile'/>
            </div>
            힛갤콘
          </li>
        </nuxt-link>
        <!-- <nuxt-link to='/help'>
          <li>
            <div class='icon'>
              <font-awesome-icon icon='question-circle'/>
            </div>
            도움말
          </li>
        </nuxt-link> -->
        <li class="sidebar-menu" @click='toggle()'>
          <div class='icon'>
          <font-awesome-icon icon='leaf'/>
          </div>
          다크모드
        </li>
      </ul>
    </section>
  </div>
</template>

<style lang='less' scoped>
@primary: #5F5476;
@primary-hover: #EDE3EB;
@font-color: #EDA7B2;

.backdrop {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, .6);
  z-index: 1000;

  > section {
    width: 200px;
    height: 100%;
    font-size: 14px;
    background: #FFF;
    box-shadow: 1px 0 20px rgba(0, 0, 0, .2);
    > .header,
    > ul > li,
    > ul > a > li {
      display: flex;
      align-items: center;
      height: 40px;
      padding: 0 .75rem 3px 0;
      color: #FFF;
      background: @font-color;
    }
    > .header {
      display: flex;
      flex: 1;
      justify-content: flex-end;
      height: 44px;
      > .close {
        color: #FFF;
        cursor: pointer;
      }
    }
    > ul {
      height: calc(100% - 44px);
      margin: 0;
      padding: 0;
      background: #FAFAFA;
      list-style: none;
      overflow-y: auto;
      > a {text-decoration: none}
      > li, > a > li {
        display: flex;
        color: @primary;
        border-bottom: 1px solid rgba(0, 0, 0, .1);
        background: #FFF;
        cursor: pointer;
        &:hover {
          color: @primary-hover;
          background: @primary;
        }
        > .icon {
          display: flex;
          justify-content: center;
          width: 1.5rem;
          margin-left: .5rem;
          padding-top: 1px;
        }
      }
    }
  }
}
</style>

<script>
import BOARD_LIST from '@/data/board-list'

export default {
  name: 'SidebarMenu',
  data() {
    return {
      boardList: BOARD_LIST
        .filter(item => item.visible)
    }
  },
  methods: {
    forceUpdate(event, field = null) {
      const board = this.$nuxt.$route.params.board
      if (board === field)
        this.$store.commit('forceUpdate')
    },
    onRubyGameClick() {
      this.$eventBus.$emit('RunRubyGame')
    },
    close() {
      this.$eventBus.$emit('SetSidebar')
    },
    toggle() {
      this.darkmode.toggle()
    }
  }
}
</script>
