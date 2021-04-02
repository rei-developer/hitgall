<template>
  <article class='notify'>
    <h6 @click='toggle'>
      <font-awesome-icon icon='bell'/>
      <span>{{ $store.state.user.noticeCount }}</span>
    </h6>
    <ul v-if='visible'>
      <div>
        <div class='getData' @click='visible = false'>닫기</div>
      </div>
      <li v-for='(item, index) in notices' :key='index' @click='forceUpdate(item)'>
        <nuxt-link :to='`/${item.topicId}?postId=${item.postId}`'>
          <!--          <div class='profile'>-->
          <!--            <img :src='item.profile ? "/profile/" + item.profile : "/profile.png"' @error='imageUrlAlt'>-->
          <!--          </div>-->
          <div class='content'>
            <div class='author'>
              <img :src='`/icon/${item.icon}`' v-if='item.icon !== ""'>
              {{ item.author }}
            </div>
            <div class='regdate'>
              {{ $moment(item.updated).format('YYYY/MM/DD HH:mm:ss') }}
            </div>
            <div class='text'>
              <div class='tagUser' v-if='item.tagAuthor'>
                <font-awesome-icon icon='at'/>
                {{ item.tagAuthor }}
              </div>
              <div class='sticker' v-if='item.stickerId > 0'>
                <img :src='`https://cdn.hitgall.com/sticker/${item.stickerId}/${item.stickerSelect}`'>
              </div>
              <span v-html='item.content'/>
            </div>
          </div>
        </nuxt-link>
      </li>
      <div>
        <div class='getData' @click='getData'>더 불러오기</div>
        <div class='trashAll' @click='trashAll'>모두 삭제</div>
      </div>
    </ul>
  </article>
</template>

<script>
export default {
  data() {
    return {
      notices: [],
      page: 0,
      visible: false
    }
  },
  methods: {
    forceUpdate(item) {
      this.read(item)
      this.visible = false
      this.$store.commit('forceUpdate')
    },
    toggle() {
      if (!this.visible)
        this.getData(true)
      this.visible = !this.visible
    },
    async getData(forceUpdate = false) {
      if (!this.$store.state.user.isLogged)
        return this.$toast.warning('로그인하세요.')
      const token = this.$store.state.user.token
      this.$store.commit('setLoading', true)
      if (forceUpdate) {
        this.notices = []
        this.page = 0
      }
      const data = await this.$axios.$post(
        '/api/notice/list',
        {page: this.page++},
        {headers: {'x-access-token': token}}
      )
      if (!data.notices)
        return this.$store.commit('setLoading')
      data.notices.map(notice => this.notices.push(notice))
      this.$store.commit('setLoading')
      return data
    },
    async read(item) {
      if (!this.$store.state.user.isLogged)
        return this.$toast.warning('로그인하세요.')
      const token = this.$store.state.user.token
      this.$store.commit('setLoading', true)
      const {status, count} = await this.$axios.$put(
        `/api/notice/readed/${item.id}/${item.confirm > 0 ? 0 : 1}`,
        {success: true},
        {headers: {'x-access-token': token}}
      )
      if (status !== 'ok')
        return
      this.notices = this.notices.map(post => {
        if (post.id === item.id)
          post.confirm = item.confirm > 0 ? 0 : 1
        return post
      })
      this.$toast.success('알림을 읽음 처리했습니다.')
      this.$store.commit('user/setNoticeCount', count)
      this.$store.commit('setLoading')
    },
    async readAll() {
      if (!this.$store.state.user.isLogged)
        return this.$toast.warning('로그인하세요.')
      const token = this.$store.state.user.token
      this.$store.commit('setLoading', true)
      const data = await this.$axios.$put(
        '/api/notice/readed',
        {success: true},
        {headers: {'x-access-token': token}}
      )
      if (data.status === 'fail')
        return this.$toast.error(data.message || '오류가 발생했습니다.')
      this.notices = this.notices.map(notice => {
        notice.confirm = 1
        return notice
      })
      this.$toast.success('알림을 모두 읽음 처리했습니다.')
      this.$store.commit('user/setNoticeCount', 0)
      this.$store.commit('setLoading')
    },
    async trash(item) {
      if (!this.$store.state.user.isLogged)
        return this.$toast.warning('로그인하세요.')
      const token = this.$store.state.user.token
      this.$store.commit('setLoading', true)
      const data = await this.$axios.$delete(
        `/api/notice/clear/${item.id}`,
        {headers: {'x-access-token': token}}
      )
      if (data.status === 'fail')
        return this.$toast.error(data.message || '오류가 발생했습니다.')
      this.notices = this.notices.filter(notice => notice.id !== item.id)
      let count = this.$store.state.user.noticeCount
      this.$toast.success('알림을 삭제했습니다.')
      this.$store.commit('user/setNoticeCount', item.confirm > 0 ? count : --count)
      this.$store.commit('setLoading')
    },
    async trashAll() {
      if (!this.$store.state.user.isLogged)
        return this.$toast.warning('로그인하세요.')
      const token = this.$store.state.user.token
      this.$store.commit('setLoading', true)
      const data = await this.$axios.$delete(
        '/api/notice/clear',
        {headers: {'x-access-token': token}}
      )
      if (data.status === 'fail')
        return this.$toast.error(data.message || '오류가 발생했습니다.')
      this.notices = []
      this.page = 0
      this.$toast.success('알림을 모두 삭제했습니다.')
      this.$store.commit('user/setNoticeCount', 0)
      this.$store.commit('setLoading')
    },
    numberWithCommas(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    },
    imageUrlAlt(event) {
      event.target.src = '/default.png'
    }
  }
}
</script>

<style lang='less' scoped>
@primary: #EDA7B2;

article.notify {
  position: fixed;
  top: 50px;
  left: 6px;
  cursor: pointer;
  z-index: 5000000;
  > h6 {
    width: fit-content;
    margin: 0;
    padding: 8px 10px 10px;
    border-radius: 500rem;
    background-color: rgba(0, 0, 0, .9);
    color: #fff;
    font-size: 12px;
    > span {
      margin: 0 4px;
      padding: 0 4px 2px 4px;
      background-color: #CC0000;
    }
  }
  > ul {
    position: absolute;
    top: -6px;
    left: -6px;
    width: 100%;
    margin: 0;
    padding: 0;
    background-color: rgba(0, 0, 0, .9);
    list-style: none;
    > div {
      padding: 8px 10px;
      color: #ddd;
      font-size: 12px;
      border-top: 1px solid rgba(255, 255, 255, .1);
      cursor: default;
      > .getData {
        display: inline-block;
        font-weight: bold;
        cursor: pointer;
        &:hover {color: #fff}
      }
      > .trashAll {
        float: right;
        cursor: pointer;
        &:hover {color: #fff}
      }
    }
    > li {
      > a {
        display: flex;
        color: #fff;
        text-decoration: none;
        border-top: 1px solid rgba(255, 255, 255, .1);
        &:hover {background-color: #000}
        > .profile {
          width: 64px;
          height: 64px;
          padding: 7px;
          > img {
            width: 50px;
            height: 50px;
            padding: 2px;
            border: 1px solid #ccc;
            background-color: #fff;
          }
        }
        > .content {
          flex: 1;
          padding: 0 7px 7px 7px;
          > .author {
            display: inline-block;
            font-size: 13px;
            font-weight: bold;
            > img:nth-child(1) {margin-top: -3px}
            > img:nth-child(2) {
              width: 16px;
              height: 16px;
              margin-top: -3px;
              border-radius: 2px;
            }
          }
          > .regdate {
            display: inline-block;
            margin-left: 5px;
            font-size: 11px;
            color: #ddd;
          }
          > .text {
            font-size: 12px;
            > .tagUser {
              display: inline-block;
              margin-right: 5px;
              margin-bottom: 3px;
              padding: 1px 6px 2px 5px;
              font-weight: bold;
              border-radius: 500rem;
              background-color: @primary;
            }
            > .sticker {
              > img {
                width: 64px;
                height: 64px;
              }
            }
          }
        }
      }
    }
  }
}

@media (min-width: 1160px) {
  article.notify {
    top: 6px;
    left: 6px;
    > ul {
      top: 38px;
      left: -6px;
      width: 360px;
    }
  }
}
</style>
