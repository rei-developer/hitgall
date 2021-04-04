<template>
  <div>
    <adsbygoogle ad-format='horizontal'/>
    <BoardInfo :domain='domain'/>
    <BoardList :id='0' :purePage='$route.query.page || 1' :domain='domain'/>
  </div>
</template>

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
