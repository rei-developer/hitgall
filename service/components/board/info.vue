<template>
  <div>
    <b-overlay
      :show='!board.name'
      rounded='sm'
    >
      <div class='desktop-only content-box'>
        <div class='board-title'>{{ board.name }} 갤러리</div>
        <div class='board-info'>
          <div class='image'>
            <img alt='thumb' :src='`https://cdn.hitgall.com/img/thumb/${board.imageUrl}`' @error='imageUrlAlt'>
          </div>
          <div class='description'>
            {{ board.description }}
          </div>
          <div class='manager'>
            <div class='label'>
              <div class='rows master'>· 관리자</div>
              <div class='rows managers' v-if='managers.length > 0'>· 부관리자</div>
            </div>
            <div class='content'>
              <div class='rows master'>
                <img class='icon' :src='`/user11.png`' alt='icon'>
                {{ board.masterName }}
              </div>
              <div class='rows managers custom-scroll-box' v-if='managers.length > 0'>
                <ul>
                  <li v-for='(item, index) in managers' :key='index'>
                    <img class='icon' :src='`/user1${item.level || 0}.png`' alt=''>
                    {{ item.nickname }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </b-overlay>
  </div>
</template>

<style lang='less' scoped>
@primary: #EDA7B2;

.content-box {
  height: 142px;
  margin: 1rem 0;
  border-radius: 2px;
  background: #FFF;
  box-shadow: 1px 0 10px rgba(0, 0, 0, .1);
  > .board-title {
    height: 30px;
    line-height: 28px;
    padding-left: 8px;
    background-color: @primary;
    color: #fff;
    font-size: 16px;
    font-weight: bold;
  }
  > .board-info {
    display: flex;
    margin: 5px;
    color: #000;
    font-size: 14px;
    border: 1px solid rgba(0, 0, 0, .1);
    > .image {
      > img {
        width: 100px;
        height: 100px;
        padding: 5px;
      }
    }
    > .description {
      flex: 1;
      margin: 5px;
      color: #333;
      font-size: 13px;
    }
    > .manager {
      display: flex;
      height: 100px;
      font-size: 12px;
      > .label {
        width: 60px;
        padding-right: 3px;
        font-weight: bold;
        > .rows {
          &.master {height: 20px}
        }
      }
      > .content {
        padding: 0 3px;
        > .rows {
          &.master {height: 20px}
          &.managers {height: 80px}
          > ul {
            margin: 0;
            padding: 0;
            list-style: none;
          }
        }
      }
    }
  }
}
</style>

<script>
export default {
  name: 'BoardInfo',
  props: {
    domain: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      board: {
        name: '',
        description: '',
        imageUrl: null,
        masterName: ''
      },
      managers: []
    }
  },
  async mounted() {
    await this.getData()
  },
  methods: {
    async getData() {
      const {board, managers} = await this.$axios.$get(`/api/board/${this.domain}`)
      if (board) {
        this.board = board
        if (this.board.description === '')
          this.board.description = '갤러리 설명이 비어있습니다. 관리자 설정에서 갤러리 설명을 기입해주세요.'
      }
      if (managers)
        this.managers = managers.filter(item => item.level > 1)
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
