<template>
  <div v-if='error'>
    <h3>{{ topic.title }}</h3>
    <p>{{ topic.content }}</p>
  </div>
  <div v-else>
    <b-modal
      id='bv-remove-modal'
      @ok='remove'
      title='알림'
      title-tag='h6'
      cancel-title='취소'
      ok-title='확인'
      size='sm'
      auto-focus-button='ok'
      centered>
      <div>정말로 글을 삭제하시겠습니까?</div>
      <b-form-group class='mt-1' v-if='topic.userId < 1'>
        <b-form-input
          type='password'
          placeholder='비밀번호'
          v-model='removePassword'
          required/>
      </b-form-group>
    </b-modal>
    <b-modal
      id='bv-blind-modal'
      @ok='ban'
      title='알림'
      title-tag='h6'
      cancel-title='취소'
      ok-title='확인'
      size='sm'
      auto-focus-button='ok'
      centered>
      <div>
        <strong>{{ topic.author }}</strong> 차단
      </div>
      <b-form-group class='mt-1'>
        <b-form-input
          placeholder='차단 사유'
          v-model='blindDescription'
          required/>
      </b-form-group>
      <b-form-group>
        <b-form-datepicker v-model='blindBlockDate'/>
      </b-form-group>
    </b-modal>
    <adsbygoogle />
    <b-form-group class='mt-3 mb-3'>
      <nuxt-link :to='`/board/${topic.boardDomain}`'>
        <b-button size='sm' variant='primary'>
          <font-awesome-icon icon='file-alt'/>
          목록
        </b-button>
      </nuxt-link>
      <!-- <b-button size='sm' variant='primary'>
          <font-awesome-icon icon='arrow-up'/>
          인기글
      </b-button> -->
      <span v-if='topic.boardDomain !== "all"'>
        <nuxt-link :to='`/board/${topic.boardDomain}/write`'>
          <b-button
            class='float-right'
            size='sm'
            variant='primary'>
              <font-awesome-icon icon='pencil-alt'/>
              쓰기
          </b-button>
        </nuxt-link>
      </span>
    </b-form-group>
    <article class='topic-view content-box'>
      <h6>
        <!-- <div class='regdate'>
             <span class='desktop-only'><span>{{ $moment(topic.created).format("YY/MM/DD HH:mm:ss") }}</span>
        </span></div> -->
        <div class='category' v-if='topic.category'>{{ topic.category }}</div>
        <div class='subject' :style='topic.color !== "" ? `color: #${topic.color}` : ""'>{{ topic.title }}</div>
      </h6>
      <div class='profile'>
        <!-- <div class='image'>
           <img :src='`https://cdn.hitgall.com/img/${topic.imageUrl}`' @error='imageUrlAlt'>
       </div>  -->
        <div class='author'>
          <!-- <img :src='`/level/${topic.level}.png`'> -->
          <img class='icon' alt='icon'
               :src='`/${topic.admin ? "admin" : "user" + (topic.userId > 0 ? 1 : 0) + (topic.boardLevel || 0)}.png`'>
          {{ topic.author }}
          <span class='ip' v-if='topic.userId < 1 && topic.ip !== ""'>({{ topic.ip }})</span>
        </div>
        <div class='info'>
          <div>
            <span class='desktop-only'>조회 <strong>{{ numberWithCommas(topic.hits) }}</strong></span>
            <!-- <span class='desktop-only'>댓글 <strong>1</strong></span> -->
            <span>개념 <strong>{{ numberWithCommas(topic.likes) }}</strong></span>
            <span>비추 <strong>{{ numberWithCommas(topic.hates) }}</strong></span>
          </div>
          <div>
            <span @click='copyLink(`https://www.hitgall.com/${ id }`)'>https://www.hitgall.com/{{ id }}</span>
          </div>
          <div class='regdate'>
            <span>{{ $moment(topic.created).format('YY/MM/DD HH:mm:ss') }}</span>
          </div>
        </div>
      </div>
      <div class='content' v-viewer='{ title: false }'>
        <div v-if='boardImageUrl'>
          <p><img alt='topicimage' :src='`https://cdn.hitgall.com/img/${boardImageUrl}`' @error='imageUrlAlt'></p>
        </div>
        <Poll :id='id' v-if='topic.isPoll'/>
        <span v-html='topic.content'/>
      </div>
      <div class='bottom-box'>
        <div class='likes' @click='votes()'>
          <div>
            <font-awesome-icon icon='star'/>
          </div>
          <div>개념<span>{{ numberWithCommas(topic.likes) }}</span></div>
        </div>
        <div class='hates' @click='votes(false)'>
          <div>
            <font-awesome-icon icon='arrow-down'/>
          </div>
          <div>비추<span>{{ numberWithCommas(topic.hates) }}</span></div>
        </div>
        <div class='qrcode'>
          <client-only>
            <qriously
              foreground='#EDA7B2'
              :padding='0'
              :value='`https://www.hitgall.com/${id}`'
              :size='80'/>
          </client-only>
        </div>
      </div>
      <div class='file-list' v-if='images.length > 0'>
        <h6>
          <div>#</div>
          <div class='subject'>파일 이름</div>
          <div>다운로드</div>
        </h6>
        <ul>
          <li v-for='(item, index) in images' :key='index'>
            <div>{{ index + 1 }}</div>
            <div class='subject'>{{ item.name }}</div>
            <div @click='downloadWithAxios(item.imageUrl, item.name)'>
              <font-awesome-icon icon='download'/>
            </div>
          </li>
        </ul>
      </div>
    </article>
    <b-form-group class='mt-3'>
      <nuxt-link :to='`/board/${topic.boardDomain}`'>
        <b-button size='sm' variant='primary'>
          <font-awesome-icon icon='file-alt'/>
          목록
        </b-button>
      </nuxt-link>
      <nuxt-link :to='`/board/${topic.boardDomain}/write?id=${id}`'>
        <b-button
          v-if='!$store.state.user.isLogged || this.topic.userId == $store.state.user.id || $store.state.user.isAdmin'
          size='sm'>
          <font-awesome-icon icon='edit'/>
          수정
        </b-button>
      </nuxt-link>
      <b-button
        v-if='!$store.state.user.isLogged || this.topic.userId == $store.state.user.id || $store.state.user.isAdmin'
        size='sm' @click='removeHandler'>
        <font-awesome-icon icon='trash'/>
        삭제
      </b-button>
      <b-button-group class='float-right'>
        <b-button size='sm' @click='scrollToTop'>
          <font-awesome-icon icon='arrow-up'/>
        </b-button>
        <b-button size='sm' @click='scrollToBoardList'>
          <font-awesome-icon icon='arrow-down'/>
        </b-button>
      </b-button-group>
      <b-button-group class='float-right mr-1' v-if='boardLevel > 0'>
        <b-button size='sm' @click='notice'>
          <font-awesome-icon icon='newspaper'/>
          공지
        </b-button>
      </b-button-group>
      <b-button-group class='float-right mr-1' v-if='boardLevel > 0'>
        <b-button size='sm' variant='danger' @click='$bvModal.show("bv-blind-modal")'>
          <font-awesome-icon icon='ban'/>
          차단
        </b-button>
      </b-button-group>
    </b-form-group>
    <div class='comment mb-3'>
      <BoardCommentList :id='id' :topic='topic'/>
    </div>
    <div ref='boardList'>
      <BoardList :id='id' :purePage='$route.query.page || 1' :domain='topic.boardDomain'/>
    </div>
  </div>
</template>

<script>
import Poll from '~/components/board/poll.vue'
import BoardList from '~/components/board/list.vue'
import BoardCommentList from '~/components/board/comment/list.vue'
import 'viewerjs/dist/viewer.css'

export default {
  components: {
    Poll,
    BoardList,
    BoardCommentList
  },
  validate({params}) {
    return /^\d+$/.test(params.id)
  },
  data() {
    return {
      id: 0,
      topic: {
        userId: 0,
        boardDomain: '',
        category: '',
        author: '',
        title: '',
        content: '',
        ip: '',
        header: '',
        created: '',
        updated: '',
        hits: 0,
        likes: 0,
        hates: 0,
        isPoll: false,
        isImage: false,
        isBest: false,
        isNotice: false,
        profile: '',
        admin: 0,
        boardLevel: 0
      },
      boardImageUrl: null,
      boardLevel: 0,
      removePassword: '',
      blindDescription: '',
      blindBlockDate: null,
      images: [],
      error: false,
      loading: true
    }
  },
  async asyncData({app, params, store, $axios}) {
    const id = params.id
    const token = store.state.user.isLogged ? store.state.user.token : ''
    const data = await $axios.$get(
      `/api/topic/read/${id}`,
      {headers: {'x-access-token': token}}
    )
    if (data.status === 'fail')
      return {
        topic: {
          title: '오류가 발생했습니다.',
          content: data.message
        },
        error: true
      }
    if (store.state.user.isLogged)
      store.commit('user/setNoticeCount', data.count)
    const regex = /<p><\/p>/gim
    data.topic.content = data.topic.content.replace(regex, '<p><br></p>')
    // const regex = /<img[^>]*src=[\"']?([^>\"']+)[\"']?[^>]*>/mig
    // data.topic.content = data.topic.content.replace(regex, `<img src="$1">`
    return {
      id,
      topic: data.topic,
      images: data.images,
      boardImageUrl: data.boardImageUrl,
      boardLevel: data.boardLevel
    }
  },
  beforeMount() {
    // this.$socket.emit('join', this.id)
    // this.$socket.on('vote', data => {
    //     this.topic.likes = data.likes
    //     this.topic.hates = data.hates
    // })
  },
  beforeDestroy() {
    // this.$socket.emit('leave', this.id)
    // this.$socket.removeAllListeners()
  },
  mounted() {
    this.blindBlockDate = this.$moment().add(1, 'year').format('YYYY-MM-DD')
  },
  methods: {
    // handleClick(e) {
    //     if (e.target.matches('img')) {
    //         console.log(e)
    //         console.log(e.target.className)
    //     }
    // },
    votes: async function (flag = true) {
      if (this.id < 1)
        return
      // if (!this.$store.state.user.isLogged)
      //     return this.$toast.warning('로그인하세요.')
      const token = this.$store.state.user.token || ''
      this.$store.commit('setLoading', true)
      const data = await this.$axios.$post(
        '/api/topic/vote',
        {domain: this.topic.boardDomain, id: this.id, likes: flag},
        {headers: {'x-access-token': token}}
      )
      if (data.status === 'fail') {
        this.$store.commit('setLoading')
        return this.$toast.error(data.message || '오류가 발생했습니다.')
      }
      if (data.move === 'BEST')
        this.$toast.info('HIT 갤러리로 이전됐습니다.')
      this.topic.likes = data.likes + (flag ? 1 : 0)
      this.topic.hates = data.hates + (flag ? 0 : 1)
      this.$store.commit('setLoading')
    },
    copyLink: async function (link) {
      this.$toast.success('링크를 복사했습니다.')
      this.$copyText(link)
    },
    forceFileDownload(blob, name) {
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', name)
      document.body.appendChild(link)
      link.click()
    },
    async downloadWithAxios(url, name) {
      await fetch(
        `https://cdn.hitgall.com/img/${url}`,
        {
          headers: {'Accept': 'image/*'},
          responseType: 'arraybuffer'
        }
      )
        .then(response => {
          if (response.ok)
            return response.blob()
        })
        .then(blob => {
          this.forceFileDownload(blob, name)
        })
    },
    removeHandler: async function () {
      if (this.id < 1)
        return
      this.$bvModal.show('bv-remove-modal')
    },
    remove: async function () {
      const token = this.$store.state.user.token || ''
      this.$store.commit('setLoading', true)
      const data = await this.$axios.$delete(
        '/api/topic/delete',
        {
          data: {
            id: this.id,
            password: this.removePassword
          },
          headers: {'x-access-token': token}
        }
      )
      if (data.status === 'fail') {
        this.$store.commit('setLoading')
        return this.$toast.error(data.message || '오류가 발생했습니다.')
      }
      this.$toast.success('글을 삭제했습니다.')
    },
    ban: async function () {
      const token = this.$store.state.user.token || ''
      this.$store.commit('setLoading', true)
      const data = await this.$axios.$post(
        `/api/board/admin/${this.topic.boardDomain}/blind/add`,
        {topicId: this.id, description: this.blindDescription, blockDate: this.blindBlockDate},
        {headers: {'x-access-token': token}}
      )
      if (data.status === 'fail')
        return this.$toast.error(data.message || '오류가 발생했습니다.')
      this.$toast.success('차단 성공!')
      this.$store.commit('setLoading')
    },
    notice: async function () {
      if (this.id < 1)
        return
      const token = this.$store.state.user.token || ''
      this.$store.commit('setLoading', true)
      const data = await this.$axios.$patch(
        '/api/topic/edit/notice',
        {id: this.id, domain: this.topic.boardDomain},
        {headers: {'x-access-token': token}}
      )
      if (data.status === 'fail') {
        this.$store.commit('setLoading')
        return this.$toast.error(data.message || '오류가 발생했습니다.')
      }
      this.topic.isNotice = !this.topic.isNotice
      this.topic.isNotice
        ? this.$toast.info('공지로 적용했습니다.')
        : this.$toast.success('공지를 해제했습니다.')
      this.$store.commit('setLoading')
    },
    scrollToTop() {
      this.$nextTick(() => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        })
      })
    },
    scrollToBoardList() {
      this.$nextTick(() => {
        window.scrollTo({
          top: this.$refs.boardList?.offsetTop,
          behavior: 'smooth'
        })
      })
    },
    numberWithCommas(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    },
    imageUrlAlt(event) {
      event.target.src = '/default.png'
    },
    playSound(sound) {
      if (!sound)
        return
      const audio = new Audio(sound)
      audio.play()
    }
  },
  head() {
    return {
      title: `${this.topic.title} - 힛갤`,
      meta: [
        {property: 'og:site_name', content: '힛갤'},
        {property: 'og:title', content: this.topic.title},
        {property: 'og:description', content: this.topic.content.substr(0, 200)},
        {
          property: 'og:image',
          content: this.topic.imageUrl ? `https://cdn.hitgall.com/img/${this.topic.imageUrl}` : '/default.png'
        },
        {property: 'og:type', content: 'website'},
        {property: 'og:updated_time', content: this.topic.updated},
        {hid: `${this.id}`, name: `${this.topic.content.substr(0, 100)}`, content: '힛갤'}
      ]
    }
  }
}
</script>

<style lang='less' scoped>
@primary: #EDA7B2;
@primary-focus: #5F5476;

.content-box {
  margin-bottom: 1rem;
  border-radius: 2px;
  background: #FFF;
  box-shadow: 1px 0 10px rgba(0, 0, 0, .1);
}

// desktop
article.topic-view {
  border-bottom: 1px solid #eee;
  background-color: #fff;

  > h6 {
    height: 100%;
    max-width: 1344px;
    margin: 0;
    padding: .3rem;
    color: #fff;
    border-bottom: 1px solid rgba(0, 0, 0, .2);
    //border-radius: 7px;
    background-color: @primary;

    > .category {
      display: inline-block;
      margin-bottom: 1px;
      padding: 4px 8px;
      color: @primary;
      font-size: 12px;
      font-weight: 700;
      border-radius: 5px;
      background-color: #f5f5f5;
    }

    > .subject {
      display: inline-block;
      margin-top: 3px;
      //max-width: calc(100vw - 80px);
      max-width: 1344px;
      font-size: 14px;
      //white-space: nowrap;
      //text-overflow: ellipsis;
      //overflow: hidden;
      word-break: break-all;
    }

    // > .regdate {
    //     //margin-top: -4px;
    //     display: inline;
    //     float: right;
    //     > span { font-size: 11px }
    // }
  }

  > .profile {
    min-height: 91px;
    border-bottom: 1px solid #eee;

    > .image {
      > img, > div {
        width: 80px;
        height: 80px;
        margin: 5px 0 5px 5px;
        padding: 3px;
        border: 1px solid #ddd;
        background-color: #fff;
        float: left;

        > div {
          padding: 3px
        }
      }
    }

    > .author {
      display: inline-block;
      padding: 8px 0 4px 8px;
      color: #333;
      font-size: 13px;

      > img:nth-child(1) {
        margin-top: -2px
      }

      > img:nth-child(2) {
        width: 16px;
        height: 16px;
        margin-top: -3px;
        border-radius: 2px;
      }

      > span.ip {
        color: #666;
        font-size: 11px;
      }
    }

    > .info {
      padding: 5px;
      text-align: right;
      float: right;

      > div:nth-child(1) > span {
        padding: 0 6px;
        color: #888;
        font-size: 13px;
        letter-spacing: -1px;

        > strong {
          padding-left: 2px;
          color: #666;
          letter-spacing: normal;
        }

        &:nth-child(3) > strong {
          color: #2D99E1
        }

        &:nth-child(4) > strong {
          color: #D83722
        }
      }

      > div:nth-child(2) > span {
        margin-top: -5px;
        padding: 0 6px;
        color: #999;
        font-size: 12px;
        cursor: pointer;
      }

      > .regdate {
        //margin-top: -4px;
        //float: right;
        color: #888;

        > span {
          font-size: 12px
        }
      }
    }
  }

  > .content {
    line-height: 1.5;
    padding: 20px;
    color: #000;
    font-size: 14px;
    word-break: break-all;
    overflow-wrap: break-word;
  }

  > .bottom-box {
    margin: 1rem 1rem 1rem 96px;
    text-align: center;

    > .likes, > .hates {
      display: inline-block;
      width: 80px;
      height: 80px;
      margin: 0 5px;
      padding: 2px;
      color: #fff;
      // border: 2px solid #ddd;
      border-radius: 500rem;
      background: @primary;
      cursor: pointer;
      // &:hover { border: 2px solid @primary }
      > div:nth-child(1) {
        width: 72px;
        height: 46px;
        font-size: 35px;
        border-radius: 500rem 500rem 0 0;

        > svg {
          padding-left: 3px
        }
      }

      > div:nth-child(2) {
        padding-top: 2px;
        font-size: 12px;
        font-weight: 700;

        > span {
          margin-left: 4px
        }
      }
    }

    > .likes > div:nth-child(2) > span {
      color: #D83722;
      font-size: 14px;
    }

    > .hates {
      background: #AAA;

      > div:nth-child(2) > span {
        color: #D83722;
        font-size: 14px;
      }
    }

    > .qrcode {
      height: 80px;
      float: right;
    }
  }

  > .file-list {
    > h6 {
      display: flex;
      margin: 0;
      border-top: 1px solid #e9ecef;
      border-bottom: 2px solid #e9ecef;

      > div {
        padding: .5rem;
        font-size: 13px;
        font-weight: 700;
        text-align: center;
        white-space: nowrap;

        &:nth-child(1) {
          width: 40px
        }

        &:nth-child(3) {
          width: 80px
        }
      }

      > .subject {
        flex: 1
      }
    }

    > ul {
      margin: 0;
      padding: 0;
      list-style: none;

      > li {
        display: flex;
        border-bottom: 1px solid #e9ecef;

        &:last-child {
          border: 0
        }

        > div {
          padding: .5rem;
          color: #212529;
          font-size: 13px;
          text-align: center;
          white-space: nowrap;

          &.subject {
            flex: 1;
            text-align: left;
            text-decoration: none;
            white-space: normal;
            word-break: break-all;
          }

          &:nth-child(1) {
            width: 40px
          }

          &:nth-child(3) {
            width: 80px;
            background-color: #f5f5f5;
            cursor: pointer;
          }
        }
      }
    }
  }
}

// mobile
@media (max-width: 380px) {
  article.topic-view > .bottom-box {
    margin: 1rem
  }
}
</style>
