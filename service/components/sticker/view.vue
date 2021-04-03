<template>
  <div
    class='backdrop'
    @click.self='close'
    v-if='visible'
  >
    <div class='dialog-wrapper' :style='{left: `${x}px`, top: `${y}px`}'>
      <div
        ref='dialog'
        class='dialog'
        :style='{width: `${w}px`, height: `${h}px`}'
      >
        <div class='header'>
          <font-awesome-icon icon='smile'/>
          힛갤콘
          <div class='close' @click='close'>
            <font-awesome-icon icon='times'/>
          </div>
        </div>
        <div class='content sticker-inventory'>
          <div class='item-info'>
            <div class='name'>{{ sticker.name }}</div>
            <hr/>
            <div class='comment'>{{ description }}</div>
            <div class='expiry' v-if='lastDays > 0'><strong>{{ numberWithCommas(lastDays) }}</strong>일 남음</div>
          </div>
          <div class='item-list custom-scroll-box' v-if='sticker'>
            <div
              class='box-lazy'
              v-for='index in sticker.number' :key='index'
            >
              <div class='no'>{{ index }}</div>
              <img
                :src='`https://cdn.hitgall.com/seal/${sticker.id}/${index}.webp`'
                alt=''
              >
            </div>
          </div>
        </div>
        <div class='footer'>
          <div class='info'>
            (기간제 {{ sticker.days || 0 }}일)
          </div>
          <b-button variant='primary' size='sm' @click='buy'>
            <span v-if='loading'>
              <font-awesome-icon class='fa-spin' icon='circle-notch'/>
            </span>
            <span v-else>
              구매
              <font-awesome-icon icon='gift'/>
              {{ numberWithCommas(sticker.price || 0) }}
            </span>
          </b-button>
          <b-button squared variant='dark' size='sm' @click='close'>닫기</b-button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang='less' scoped>
@primary: #EDA7B2;

.sticker-inventory {
  > .item-info {
    position: relative;
    height: 95px;
    margin: 5px;
    padding: 5px;
    border: 1px solid rgba(0, 0, 0, .1);
    color: #333;
    white-space: nowrap;
    > hr {margin: 5px 0 2px}
    > .name {font-weight: bold}
    > .comment {font-size: 12px}
    > .expiry {
      position: absolute;
      right: 5px;
      bottom: 5px;
      padding: 0 4px 1px;
      background-color: #29313D;
      color: #fff;
      font-size: 11px;
    }
  }
  > .item-list {
    height: 320px;
    padding: 5px 0 0 5px;
    overflow-y: scroll;
    > .box-lazy {
      position: relative;
      width: 100px;
      height: 100px;
      margin: 0 5px 5px 0;
      border: 1px solid @primary;
      background-color: #efefef;
      float: left;
      &:hover {
        border: 1px solid #333;
        opacity: .8;
      }
      > .no {
        position: absolute;
        width: 16px;
        height: 16px;
        background-color: @primary;
        color: #fff;
        font-size: 11px;
        text-align: center;
      }
    }
  }
}
.footer {
  display: flex;
  align-items: center;
  > .info {
    color: #999;
    font-size: 11px;
  }
}
</style>

<script>
export default {
  name: 'StickerView',
  data() {
    return {
      w: 332,
      h: 499,
      x: 0,
      y: 0,
      saveX: 0,
      saveY: 0,
      sticker: {},
      buyNum: 1,
      lastDays: 0,
      loading: false,
      visible: false
    }
  },
  mounted() {
    window.addEventListener('keydown', event => event.key === 'Escape' && this.close())
  },
  computed: {
    description() {
      return this.sticker.description !== ''
        ? this.sticker.description
        : this.sticker.name
    }
  },
  methods: {
    async show(item) {
      if (!this.$store.state.user.isLogged)
        return this.$toast.warning('로그인하세요')
      this.visible = true
      await this.$nextTick()
      const ch = this.$refs.dialog.clientHeight
      this.x = (window.innerWidth / 2) - (this.w / 2)
      this.y = (window.innerHeight / 2) - (ch / 2)
      await this.getData(item)
    },
    async getData(item) {
      if (item.id < 1)
        return
      const token = this.$store.state.user.token
      this.id = item.id
      this.sticker = item
      this.lastDays = 0
      const {status, days} = await this.$axios.$get(
        `/api/sticker/list/${this.id}`,
        {headers: {'x-access-token': token}}
      )
      if (status === 'fail')
        return
      this.lastDays = days
    },
    async buy() {
      if (this.loading || this.id < 1)
        return
      if (!this.$store.state.user.isLogged)
        return this.$toast.warning('로그인하세요.')
      const token = this.$store.state.user.token
      this.loading = true
      const {status, message, date} = await this.$axios.$post(
        '/api/sticker/buy',
        {id: this.id, buyNum: this.buyNum},
        {headers: {'x-access-token': token}}
      )
      this.loading = false
      if (status === 'fail')
        return this.$toast.error(message)
      this.$toast.success(`구매 완료 (${date})`)
      this.$store.commit('user/setUpPoint', -(this.sticker.price * this.buyNum))
      this.lastDays += ((this.sticker.days * this.buyNum) - 1)
    },
    close() {
      this.visible = false
    },
    numberWithCommas(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    }
  }
}
</script>


<!--<template>-->
<!--  <div class='StickerView'>-->
<!--    <div class='title'>-->
<!--      <font-awesome-icon icon='info-circle'/>-->
<!--      힛갤콘 정보-->
<!--      <button class='close' @click='$emit("close")'>×</button>-->
<!--    </div>-->
<!--    <div class='content'>-->
<!--      <div class='head'>-->
<!--        <div class='name'>{{ sticker.name }}</div>-->
<!--        <div class='left' v-if='lastDays > 0'>내 남은 기간 : <strong>{{ lastDays }}</strong>일</div>-->
<!--        <div class='comment'>{{ sticker.description !== '' ? sticker.description : sticker.name }}</div>-->
<!--      </div>-->
<!--      <div class='item'>-->
<!--        <img-->
<!--          :src='`https://cdn.hitgall.com/seal/${id}/${index}.webp`'-->
<!--          v-for='index in sticker.number' :key='index'>-->
<!--      </div>-->
<!--      <div class='footer'>-->
<!--        <div class='buy'>-->
<!--          <b-button variant='primary' size='sm' @click='buy'>-->
<!--                        <span v-if='loading'>-->
<!--                            <font-awesome-icon class='fa-spin' icon='circle-notch'/>-->
<!--                        </span>-->
<!--            <span v-else>-->
<!--                            구매-->
<!--                        </span>-->
<!--          </b-button>-->
<!--        </div>-->
<!--        <div class='howMany'>-->
<!--          <b-input v-model='buyNum' type='range' min='1' max='20'></b-input>-->
<!--        </div>-->
<!--        <div class='info'>-->
<!--          <div>기간제 {{ sticker.days * buyNum }}일</div>-->
<!--          <div>-->
<!--            <font-awesome-icon icon='gift'/>-->
<!--            {{ numberWithCommas(sticker.price * buyNum) }}-->
<!--          </div>-->
<!--        </div>-->
<!--      </div>-->
<!--    </div>-->
<!--  </div>-->
<!--</template>-->

<!--<script>-->
<!--export default {-->
<!--  props: ['id', 'sticker'],-->
<!--  data() {-->
<!--    return {-->
<!--      lastDays: 0,-->
<!--      loading: false,-->
<!--      buyNum: 1-->
<!--    }-->
<!--  },-->
<!--  watch: {-->
<!--    'id': async function () {-->
<!--      this.getData()-->
<!--    }-->
<!--  },-->
<!--  mounted() {-->
<!--    this.getData()-->
<!--  },-->
<!--  methods: {-->

<!--    numberWithCommas(x) {-->
<!--      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')-->
<!--    }-->
<!--  }-->
<!--}-->
<!--</script>-->

<!--<style lang='less' scoped>-->
<!--.StickerView {-->
<!--  position: fixed;-->
<!--  left: 40%;-->
<!--  top: 6em;-->
<!--  width: 670px;-->
<!--  height: 495px;-->
<!--  margin: 0 0 0 -180px;-->
<!--  border: 1px solid #333;-->
<!--  border-radius: .5rem;-->
<!--  background-color: #FFF;-->
<!--  font-size: .9rem;-->
<!--  z-index: 20;-->
<!--  > .title {-->
<!--    margin: 0;-->
<!--    padding: 6px;-->
<!--    height: 29px;-->
<!--    background-color: #29313D;-->
<!--    color: #FFF;-->
<!--    font-size: .9rem;-->
<!--    font-weight: bold;-->
<!--  }-->
<!--  .close {-->
<!--    position: absolute;-->
<!--    top: 2px;-->
<!--    right: 2px;-->
<!--    width: 24px;-->
<!--    height: 24px;-->
<!--    line-height: 0;-->
<!--    margin: 0;-->
<!--    border: none;-->
<!--    background: transparent;-->
<!--    color: #FFF;-->
<!--    text-align: center;-->
<!--    cursor: pointer;-->
<!--    outline: none;-->
<!--  }-->
<!--  .content { padding: 12px }-->
<!--  .head {-->
<!--    margin-bottom: 6px;-->
<!--    padding: 8px;-->
<!--    background-color: #FAFAFA;-->
<!--  }-->
<!--  .name {-->
<!--    float: left;-->
<!--    margin-bottom: 6px;-->
<!--    font-weight: bold;-->
<!--    color: #29313D;-->
<!--  }-->
<!--  .left {-->
<!--    float: right;-->
<!--    margin-bottom: 6px;-->
<!--    color: #999;-->
<!--  }-->
<!--  .left strong {-->
<!--    padding: 0 3px;-->
<!--    color: #29313D;-->
<!--  }-->
<!--  .comment {-->
<!--    clear: both;-->
<!--    margin-top: 6px;-->
<!--    padding-top: 6px;-->
<!--    min-height: 40px;-->
<!--    border-top: 1px solid #D2D2D2;-->
<!--    color: #555;-->
<!--  }-->
<!--  .item {-->
<!--    height: 300px;-->
<!--    overflow: auto;-->
<!--  }-->
<!--  .item img {-->
<!--    float: left;-->
<!--    display: block;-->
<!--    margin: 2px;-->
<!--    width: 100px;-->
<!--    height: 100px;-->
<!--  }-->
<!--  .footer {-->
<!--    margin: 6px 0;-->
<!--    padding: 6px 0;-->
<!--    border-top: 1px solid #D2D2D2;-->
<!--    color: #A1A1A1;-->
<!--    font-size: .8rem;-->
<!--  }-->
<!--  .footer .buy {-->
<!--    float: left;-->
<!--    font-size: 13px;-->
<!--    padding: 1px 3px;-->
<!--  }-->
<!--  .footer .howMany {-->
<!--    float: left;-->
<!--  }-->
<!--  .footer .info {-->
<!--    display: inline-block;-->
<!--    text-align: right;-->
<!--    float: right;-->
<!--  }-->
<!--}-->

<!--@media (max-width: 1024px) {-->
<!--  .StickerView {-->
<!--    left: 50%;-->
<!--    width: 360px;-->
<!--    margin: 0 0 0 -180px;-->
<!--  }-->
<!--}-->
<!--</style>-->
