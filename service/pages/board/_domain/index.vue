<template>
  <div class='content-box'>
    <BoardInfo :domain='domain'/>
    <BoardList :id='0' :purePage='$route.query.page || 1' :domain='domain'/>
  </div>
</template>

<style lang='less' scoped>
.content-box {
  margin-bottom: 1rem;
  padding: .5rem;
  border-radius: 2px;
  background: #FFF;
  box-shadow: 1px 0 10px rgba(0, 0, 0, .1);
}
</style>

<script>
import BoardInfo from '~/components/board/info.vue'
import BoardList from '~/components/board/list.vue'
import Library from '~/assets/lib.js'

export default {
  components: {
    BoardInfo,
    BoardList
  },
  async asyncData({params}) {
    const domain = params.domain
    return {domain}
  }
}
</script>
