<template>
  <div>
    <article class='gallery' v-viewer='{ title: false }'>
      <client-only>
        <waterfall
          :line-gap='235'
          :min-line-gap='100'
          :max-line-gap='235'
          :single-max-width='235'
          :watch='items'
        >
          <waterfall-slot
            move-class='item-move'
            :width='item.width'
            :height='item.height'
            :order='index'
            v-for='(item, index) in items' :key='index'
          >
            <img
              :src='`https://cdn.hitgall.com/img/${item.imageUrl}`'
              alt='이미지'
              @error='imageUrlAlt'
              @click='playSound("/se3.mp3")'
            >
          </waterfall-slot>
        </waterfall>
      </client-only>
    </article>
  </div>
</template>

<style lang='less' scoped>
@primary: #EDA7B2;

article.gallery {
  padding: 10px 0 0 10px;
  border-radius: 2px;
  background: #FFF;
  box-shadow: 1px 0 10px rgba(0, 0, 0, .1);
}

.vue-waterfall-slot {
  > img {
    width: calc(100% - 10px);
    height: calc(100% - 10px);
    cursor: pointer;
    &:hover {opacity: .8}
  }
}

.item-move {
  transition: all .3s cubic-bezier(.55, 0, .1, 1);
  -webkit-transition: all .3s cubic-bezier(.55, 0, .1, 1);
}
</style>

<script>
export default {
  data() {
    return {
      items: [],
      page: 0,
      bottom: false,
      isBusy: false
    }
  },
  watch: {
    '$store.state.forceUpdate': function () {
      this.addItems()
    },
    bottom: function (bottom) {
      if (bottom)
        this.addItems()
    }
  },
  mounted() {
    if (process.browser)
      window.addEventListener('scroll', () => this.bottom = this.bottomVisible())
    this.addItems()
  },
  methods: {
    async addItems(forceUpdate = false) {
      if (!this.isBusy && this.items.length < 500) {
        this.isBusy = true
        if (forceUpdate) {
          this.items = []
          this.page = 0
        }
        const data = await this.$axios.$post(
          '/api/topic/list/image',
          {page: this.page++}
        )
        if (!data.items)
          return this.isBusy = false
        data.items.map(item => this.items.push(item))
        this.isBusy = false
      }
    },
    shuffle() {
      this.items.sort(() => Math.random() - 0.5)
    },
    reflowed() {
      this.isBusy = false
    },
    bottomVisible() {
      if (process.browser) {
        const scrollY = window.pageYOffset
        const visible = document.documentElement.clientHeight
        const pageHeight = document.documentElement.scrollHeight
        const bottomOfPage = visible + scrollY >= pageHeight
        return bottomOfPage || pageHeight < visible
      }
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
  }
}
</script>
