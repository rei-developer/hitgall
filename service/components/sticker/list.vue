<template>
  <div>
    <StickerView
      :id='id'
      :sticker='sticker'
      v-on:close='close'
      v-if='id > 0'/>
    <div class='containerSubject marginTop'>
      <font-awesome-icon icon='cart-arrow-down'/>
      힛갤콘샵 ({{ numberWithCommas(count) }})
      <div class='stickerPointInfo'>
        <font-awesome-icon icon='gift'/>
        <span class='bold'>{{ numberWithCommas($store.state.user.point) }}</span>
      </div>
    </div>
    <div class='stickerList'>
      <div
        class='item'
        @click='view(item)'
        v-for='(item, index) in stickers' :key='index'>
        <div class='image'>
          <img :src='`https://cdn.hitgall.com/seal/${item.id}/1.webp`'>
        </div>
        <div class='info'>
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
        :total-rows='count'
        v-model='page'
        size='sm'
        pills/>
    </div>
  </div>
</template>

<script>
import StickerView from '~/components/sticker/view.vue'

export default {
  components: {StickerView},
  data() {
    return {
      id: 0,
      tags: '전체',
      sticker: {},
      stickers: [],
      count: 0,
      page: 1
    }
  },
  watch: {
    tags: function () {
      this.page = 1
      this.getData()
    },
    page: function () {
      this.getData()
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    getData: async function () {
      this.$store.commit('setLoading', true)
      const data = await this.$axios.$post(
        '/api/sticker/list',
        {page: this.page - 1, tags: this.tags}
      )
      this.stickers = data.stickers
      this.count = data.count
      this.$store.commit('setLoading')
    },
    view(item) {
      this.id = item.id
      this.sticker = item
    },
    close() {
      this.id = 0
      this.sticker = {}
    },
    numberWithCommas(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    }
  }
}
</script>

<style lang='less' scoped>
/* Sticker Point Infomation */
.stickerPointInfo {
  margin-top: .3rem;
  padding: .1rem .5rem;
  border-radius: 500rem;
  background: #EAEAEA;
  color: #29313D;
  font-size: .75rem;
  float: right;
}

.stickerPointInfo span.bold { font-weight: bold }

/* Sticker List */
.stickerList .item {
  display: inline-block;
  margin: .5rem;
  border-bottom: 1px solid #F5F5F5;
  box-shadow: 1px 1px 8px rgba(0, 0, 0, 0.08);
  background: rgba(255, 255, 255, .5);
}

.stickerList .item:hover {
  background: rgba(245, 245, 245, .5);
  cursor: pointer;
}

.stickerList .item .image img {
  width: 100px;
  height: 100px;
  margin: .25rem;
  margin-bottom: 0;
  border-radius: .5rem;
}

.stickerList .item .info { padding-bottom: .25rem }

.stickerList .item .info .name {
  color: #409EFF;
  font-size: .8rem;
  font-weight: bold;
  text-align: center;
}

.stickerList .item .info .price {
  width: fit-content;
  margin: 0 auto;
  padding: 0 .5rem .1rem .5rem;
  border-radius: 500rem;
  background: #29313D;
  color: #FFF;
  font-size: .8rem;
  text-align: center;
}
</style>
