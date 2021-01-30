<template>
  <div
    class='backdrop'
    @click.prevent.self='close'
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
        <nuxt-link to='/board/request'>
          <li @click='forceUpdate'>
            <div class='icon'/>
            갤러리 신청
          </li>
        </nuxt-link>
        <nuxt-link to='/board/admin' v-if='$store.state.user.isLogged'>
          <li>
            <div class='icon'/>
            갤러리 관리
          </li>
        </nuxt-link>
        <nuxt-link to='/gallery'>
          <li @click='forceUpdate'>
            <div class='icon'>
              <font-awesome-icon icon='camera'/>
            </div>
            갤러리
          </li>
        </nuxt-link>
        <nuxt-link to='/sticker'>
          <li v-shortkey.once='["t"]' @shortkey='move("/sticker")' @click='forceUpdate'>
            <div class='icon'>
              <font-awesome-icon icon='smile'/>
            </div>
            힛갤콘
          </li>
        </nuxt-link>
        <li @click='onRubyGameClick'>
          <div class='icon'>
            <font-awesome-icon icon='gamepad'/>
          </div>
          소녀를 찾아서
        </li>
        <nuxt-link to='/chat'>
          <li @click='forceUpdate'>
            <div class='icon'>
              <font-awesome-icon icon='comments'/>
            </div>
            시루와 대화하기
          </li>
        </nuxt-link>
        <nuxt-link to='/konomi'>
          <li @click='forceUpdate'>
            <div class='icon'>
              <font-awesome-icon icon='image'/>
            </div>
            인공지능 2D 분석
          </li>
        </nuxt-link>
        <nuxt-link to='/help'>
          <li>
            <div class='icon'>
              <font-awesome-icon icon='question-circle'/>
            </div>
            도움말
          </li>
        </nuxt-link>
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
      > li, > a > li {
        display: flex;
        color: @primary;
        text-decoration: none;
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
    }
  }
}
</script>
