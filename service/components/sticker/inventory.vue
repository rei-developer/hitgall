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
          내 힛갤콘
          <div class='close' @click='close'>
            <font-awesome-icon icon='times'/>
          </div>
        </div>
        <div class='content sticker-inventory'>
          <div class='item custom-scroll-box'>
            <img
              :src='`https://cdn.hitgall.com/seal/${item.id}/1.webp`'
              alt=''
              @click='view(item)'
              v-for='(item, index) in inventory' :key='index'
            >
          </div>
          <div class='itemList custom-scroll-box' v-if='sticker'>
            <div
              class='box-lazy'
              v-for='index in sticker.number' :key='index'
            >
              <div class='no'>{{ index }}</div>
              <img
                :src='`https://cdn.hitgall.com/seal/${sticker.id}/${index}.webp`'
                alt=''
                @click='use(sticker, index)'
              >
            </div>
          </div>
        </div>
        <div class='footer'>
          <b-button squared variant='primary' size='sm' @click='close'>닫기</b-button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang='less' scoped>
@primary: #EDA7B2;

.sticker-inventory {
  > .item {
    height: 60px;
    overflow-x: scroll;
    overflow-y: hidden;
    white-space: nowrap;
    > img {
      width: 50px;
      height: 50px;
      &:hover {
        opacity: .8;
        cursor: pointer;
      }
    }
  }
  > .itemList {
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
        cursor: pointer;
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
</style>

<script>
export default {
  name: 'StickerInventory',
  data() {
    return {
      w: 332,
      h: 459,
      x: 0,
      y: 0,
      saveX: 0,
      saveY: 0,
      inventory: [],
      sticker: null,
      visible: false
    }
  },
  mounted() {
    window.addEventListener('keydown', event => event.key === 'Escape' && this.close())
  },
  methods: {
    async show() {
      this.visible = true
      await this.$nextTick()
      const ch = this.$refs.dialog.clientHeight
      this.x = (window.innerWidth / 2) - (this.w / 2)
      this.y = (window.innerHeight / 2) - (ch / 2)
      await this.getData()
    },
    async getData() {
      const token = this.$store.state.user.token || ''
      const {status, inventory} = await this.$axios.$get(
        `/api/sticker/list`,
        {headers: {'x-access-token': token}}
      )
      if (status === 'fail' || !inventory)
        return
      this.inventory = inventory
      this.sticker = this.inventory[0]
    },
    view(item) {
      this.sticker = item
    },
    use(item, index) {
      this.$emit('use', item, index)
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
