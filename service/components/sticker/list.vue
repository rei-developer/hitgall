<template>
  <div>
    <sticker-view
      ref='sticker'
      @close='close'
      v-if='isStickerViewPopupOpened'
    />
    <div class='h-seal-wrapper'>
      <div
        class='item'
        @click='view(item)'
        v-for='(item, index) in stickers' :key='index'
      >
        <div class='preview'>
          <img :src='`https://cdn.hitgall.com/seal/${item.id}/1.webp`' :alt='item.name'>
        </div>
        <div class='info-box'>
          <div class='name'>{{ item.name }}</div>
          <div class='price'>
            <font-awesome-icon icon='gift'/>
            {{ numberWithCommas(item.price) }}
          </div>
        </div>
      </div>
    </div>
    <div class='pagination'>
      <b-pagination
        size='sm'
        v-model='page'
        :total-rows='count'
      />
    </div>
  </div>
</template>

<style lang='less' scoped>
@primary: #EDA7B2;

.h-seal-wrapper {
  display: flex;
  flex-flow: wrap;
  justify-content: center;
  padding: 10px 5px 5px 10px;
  border-radius: 2px;
  background: #FFF;
  box-shadow: 1px 0 10px rgba(0, 0, 0, .1);
  > .item {
    display: inline-block;
    margin: 0 5px 5px 0;
    border: 1px solid #29313D;
    &:hover {
      background: rgba(245, 245, 245, .5);
      cursor: pointer;
    }
    > .preview {
      width: 102px;
      height: 102px;
      > img {padding: 2px}
    }
    > .info-box {
      > .name {
        width: 102px;
        height: 23px;
        line-height: 21px;
        color: #fff;
        font-size: 12px;
        text-align: center;
        background-color: @primary;
        overflow: hidden;
      }
      > .price {
        margin: 0 auto;
        padding-right: 5px;
        background: #29313D;
        color: #FFF;
        font-size: 11px;
        text-align: right;
      }
    }
  }
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: .5rem;
}
</style>

<script>
import StickerView from '@/components/sticker/view.vue'

export default {
  components: {StickerView},
  data() {
    return {
      id: 0,
      tags: '전체',
      sticker: {},
      stickers: [],
      count: 0,
      page: 1,
      isStickerViewPopupOpened: false
    }
  },
  watch: {
    tags() {
      this.page = 1
      this.getData()
    },
    page() {
      this.getData()
    }
  },
  async mounted() {
    await this.getData()
  },
  methods: {
    async getData() {
      this.$store.commit('setLoading', true)
      const data = await this.$axios.$post(
        '/api/sticker/list',
        {page: this.page - 1, tags: this.tags}
      )
      this.stickers = data.stickers
      this.count = data.count
      this.$store.commit('setLoading')
    },
    async view(item) {
      this.isStickerViewPopupOpened = true
      await this.$nextTick()
      this.$refs.sticker.show(item)
    },
    close() {
      this.isStickerViewPopupOpened = false
    },
    numberWithCommas(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    }
  }
}
</script>
