<template>
  <div>
    <section>
      <Widget
        type='magazine'
        name='연예 갤러리 인기글'
        :data='girlImageList'
      />
      <Widget
        type='magazine'
        name='애니메이션 갤러리 인기글'
        :data='animeImageList'
      />
    </section>
    <section>
      <Widget
        :data='girlList'
        icon='star'
        name='연예 갤러리'
      />
      <Widget
        :data='otherList'
        icon='clock'
        name='기타 갤러리'
      />
    </section>
  </div>
</template>

<style lang='less' scoped>
section {
  display: flex;
  justify-content: space-between;
  &:not(:last-child) {margin-bottom: 1rem}
  > .content-box {width: calc((900px - 1.5rem) / 2)}
}

@media (max-width: 1199px) {
  section {
    flex-direction: column;
    > .content-box {
      width: 100vw;
      &:not(:last-child) {margin-bottom: 1rem}
    }
  }
}
</style>

<script>
import Widget from '@/components/widget'
import {getTopicWidgetList} from '@/api/topic'

export default {
  name: 'Index',
  components: {Widget},
  data() {
    return {
      girlImageList: [],
      animeImageList: [],
      girlList: [],
      otherList: []
    }
  },
  async asyncData({$axios}) {
    const {
      girlImageList,
      animeImageList,
      girlList,
      otherList
    } = await getTopicWidgetList($axios)
    return {
      girlImageList,
      animeImageList,
      girlList,
      otherList
    }
  }
}
</script>
