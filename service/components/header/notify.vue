<template>
  <article class='notify'>
    <h6 @click='toggle'>
      <strong>{{ $store.state.user.nickname }}</strong>님, 읽지 않은 알림이 <span>{{ $store.state.user.noticeCount }}개</span>
      있습니다.
    </h6>
    <ul v-if='visible'>
      <li v-for='(item, index) in notices' :key='index' @click='forceUpdate'>
        <nuxt-link :to='`/${item.topicId}?postId=${item.postId}`'>
          <!--          <div class='profile'>-->
          <!--            <img :src='item.profile ? "/profile/" + item.profile : "/profile.png"' @error='imageUrlAlt'>-->
          <!--          </div>-->
          <div class='content'>
            <div class='author'>
              <img :src='`/level/${item.level}.png`'>
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
                <img :src='`/sticker/${item.stickerId}/${item.stickerSelect}`' @error='imageUrlAlt'>
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
    forceUpdate() {
      this.visible = false
      this.$store.commit('forceUpdate')
    },
    toggle() {
      if (!this.visible)
        this.getData(true)
      this.visible = !this.visible
    },
    getData: async function (forceUpdate = false) {
      if (!this.$store.state.user.isLogged)
        return this.toast('로그인하세요.', 'warning')
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
    read: async function (item) {
      if (!this.$store.state.user.isLogged)
        return this.toast('로그인하세요.', 'warning')
      const token = this.$store.state.user.token
      this.$store.commit('setLoading', true)
      const data = await this.$axios.$put(
        `/api/notice/readed/${item.id}/${item.confirm > 0 ? 0 : 1}`,
        {success: true},
        {headers: {'x-access-token': token}}
      )
      if (data.status === 'fail')
        return this.toast(data.message || '오류가 발생했습니다.', 'danger')
      this.notices = this.notices.map(post => {
        if (post.id === item.id)
          post.confirm = item.confirm > 0 ? 0 : 1
        return post
      })
      let count = this.$store.state.user.noticeCount
      this.toast('알림을 읽음 처리했습니다.', 'success')
      this.$store.commit('user/setNoticeCount', item.confirm > 0 ? --count : ++count)
      this.$store.commit('setLoading')
    },
    readAll: async function () {
      if (!this.$store.state.user.isLogged)
        return this.toast('로그인하세요.', 'warning')
      const token = this.$store.state.user.token
      this.$store.commit('setLoading', true)
      const data = await this.$axios.$put(
        '/api/notice/readed',
        {success: true},
        {headers: {'x-access-token': token}}
      )
      if (data.status === 'fail')
        return this.toast(data.message || '오류가 발생했습니다.', 'danger')
      this.notices = this.notices.map(notice => {
        notice.confirm = 1
        return notice
      })
      this.toast('알림을 모두 읽음 처리했습니다.', 'success')
      this.$store.commit('user/setNoticeCount', 0)
      this.$store.commit('setLoading')
    },
    trash: async function (item) {
      if (!this.$store.state.user.isLogged)
        return this.toast('로그인하세요.', 'warning')
      const token = this.$store.state.user.token
      this.$store.commit('setLoading', true)
      const data = await this.$axios.$delete(
        `/api/notice/clear/${item.id}`,
        {headers: {'x-access-token': token}}
      )
      if (data.status === 'fail')
        return this.toast(data.message || '오류가 발생했습니다.', 'danger')
      this.notices = this.notices.filter(notice => notice.id !== item.id)
      let count = this.$store.state.user.noticeCount
      this.toast('알림을 삭제했습니다.', 'success')
      this.$store.commit('user/setNoticeCount', item.confirm > 0 ? count : --count)
      this.$store.commit('setLoading')
    },
    trashAll: async function () {
      if (!this.$store.state.user.isLogged)
        return this.toast('로그인하세요.', 'warning')
      const token = this.$store.state.user.token
      this.$store.commit('setLoading', true)
      const data = await this.$axios.$delete(
        '/api/notice/clear',
        {headers: {'x-access-token': token}}
      )
      if (data.status === 'fail')
        return this.toast(data.message || '오류가 발생했습니다.', 'danger')
      this.notices = []
      this.page = 0
      this.toast('알림을 모두 삭제했습니다.', 'success')
      this.$store.commit('user/setNoticeCount', 0)
      this.$store.commit('setLoading')
    },
    playSound(sound) {
      if (!sound)
        return
      const audio = new Audio(sound)
      audio.play()
    },
    numberWithCommas(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    },
    imageUrlAlt(event) {
      event.target.src = '/default.png'
    },
    toast(text, variant = 'default') {
      this.$bvToast.toast(text, {
        title: '알림',
        toaster: 'b-toaster-top-center',
        variant: variant,
        solid: true,
        appendToast: true
      })
    }
  }
}
</script>

<style lang='less' scoped>
article.notify {
  cursor: pointer;

  > h6 {
    width: 100%;
    margin: 0;
    padding: 8px 10px;
    color: #fff;
    font-size: 13px;
    background-color: rgba(0, 0, 0, .9);

    > span {
      margin: 0 4px;
      padding: 0 4px 2px 4px;
      border-radius: 4px;
      background-color: #CC0000;
    }
  }

  > ul {
    position: absolute;
    top: 31px;
    left: 0;
    width: 100%;
    margin: 0;
    padding: 0;
    background-color: rgba(0, 0, 0, .9);
    list-style: none;
    z-index: 300000;

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

        &:hover {
          color: #fff
        }
      }

      > .trashAll {
        float: right;
        cursor: pointer;

        &:hover {
          color: #fff
        }
      }
    }

    > li {
      > a {
        display: flex;
        color: #fff;
        text-decoration: none;
        border-top: 1px solid rgba(255, 255, 255, .1);

        &:hover {
          background-color: #000;
        }

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

            > img:nth-child(1) {
              margin-top: -3px;
            }

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
              border-radius: 4px;
              background-color: #CC0000;
            }

            > .sticker {
              > img {
                width: 64px;
                height: 64px;
                border-radius: 4px;
              }
            }
          }
        }
      }
    }
  }
}

@media (min-width: 1160px) {
  article.notify > ul {
    width: 360px
  }
}
</style>
