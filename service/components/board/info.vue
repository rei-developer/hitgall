<template>
  <div class='desktop-only'>
    <div class='board-title'>{{ board.name }} 갤러리</div>
    <div class='board-info'>
      <div class='image'>
        <img alt="thumb" :src='`https://cdn.hitgall.com/img/thumb/${board.imageUrl}`' @error='imageUrlAlt'>
      </div>
      <div class='description'>
        {{ board.description }}
      </div>
      <div class='manager'>
        <strong>매니저</strong> :
        <div>
          <img class='icon' alt="icon" :src='`/user11.png`'>
          {{ board.masterName }}
        </div>
        <div class='sub-manager' v-if='managers.length > 0'>
          <div><strong>부매니저</strong> :</div>
          <ul>
            <li v-for='(item, index) in managers' :key='index'>
              <img class='icon' alt="" :src='`/user1${item.level || 0}.png`'>
              {{ item.nickname }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['domain'],
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
  mounted() {
    this.getData()
  },
  methods: {
    getData: async function () {
      const data = await this.$axios.$get(`/api/board/${this.domain}`)
      if (data.board) {
        this.board = data.board
        if (this.board.description === '')
          this.board.description = '갤러리 설명이 비어있습니다. 관리자 설정에서 갤러리 설명을 기입해주세요.'
      }
      if (data.managers)
        this.managers = data.managers.filter(item => item.level > 1)
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
@primary: #EFA7B0;

.board-title {
  color: @primary;
  font-size: 20px;
  font-weight: bold;
}

.board-info {
  display: flex;
  margin: 0 0 1rem;
  padding: .5rem;
  color: #000;
  font-size: 13px;
  border: 1px solid rgba(0, 64, 128, .1);
  border-radius: .5rem;

  > .image {
    margin-right: .5rem;

    > img {
      width: 120px;
      height: 100px;
      border-radius: .25rem;
    }
  }

  > .description {
    flex: 1;
    margin-right: .5rem;
    color: #000;
    font-size: 13px;
  }

  > .manager > .sub-manager {
    height: 61px;
    overflow-y: auto;

    > ul {
      margin: 0;
      padding: 0;
      list-style: none;
    }
  }
}
</style>
