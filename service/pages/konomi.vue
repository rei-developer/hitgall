<template>
  <div>
    <b-overlay
      rounded='sm'
      :show='loading'
    >
      <div class='view' v-if='content'>
        <img id='img' :src='content' alt='image'/>
        <div class='bottom'>
          <b-button
            variant='success'
            @click='onChoiceClick'
          >
            인공지능 취향 검사
          </b-button>
          <b-button
            variant='primary'
            @click='fetch'
          >
            새로 불러오기
          </b-button>
        </div>
        <div class='result' v-if='predictions.length > 0'>
          <ul class='header'>
            <li>NO</li>
            <li>태그</li>
            <li>정확도</li>
          </ul>
          <ul
            v-for='(item, index) in predictions'
            :key='index'
          >
            <li>{{ index + 1 }}</li>
            <li class='tags'>
              <b-badge
                variant='primary'
                v-for='(i, id) in item.className.split(", ")'
                :key='id'
              >
                {{ i }}
              </b-badge>
            </li>
            <li>{{ Math.floor(item.probability * 100) }}%</li>
          </ul>
        </div>
      </div>
    </b-overlay>
  </div>
</template>

<style lang='less' scoped>
.view {
  > img {
    margin-bottom: 1rem;
    border-radius: .5rem;
  }
  > .bottom {margin-bottom: 1rem}
  > .result {
    word-break: break-all;
    border-bottom: 1px solid rgba(0, 0, 0, .1);
    > ul {
      display: flex;
      margin: 0;
      padding: 0;
      border-top: 1px solid rgba(0, 0, 0, .1);
      list-style: none;
      &.header {background: #FAFAFA}
      > li {
        display: flex;
        flex: 1;
        align-items: center;
        justify-content: center;
        padding: .5rem 0;
        color: #333;
        font-size: 13px;
        &.tags > span:not(:last-child) {margin-right: .25rem}
      }
    }
  }
}
</style>

<script>
export default {
  name: 'Konomi',
  data() {
    return {
      content: null,
      predictions: [],
      loading: false
    }
  },
  mounted() {
    this.fetch()
  },
  methods: {
    async fetch() {
      if (this.loading)
        return this.$toast('현재 결과를 불러오는 중입니다')
      this.loading = true
      const data = await this.$axios.$get('/api/random')
      this.content = data.content
      this.loading = false
    },
    async onChoiceClick() {
      if (!this.content)
        return this.$toast('데이터가 없습니다')
      if (this.loading)
        return this.$toast('현재 결과를 불러오는 중입니다')
      this.predictions = []
      this.loading = true
      const img = document.getElementById('img')
      const model = await mobilenet.load()
      this.predictions = await model.classify(img)
      console.log(this.predictions)
      this.loading = false
    }
  }
}
</script>
