<template>
  <div>
    <div class='content-box'>
      <ul class='header'>
        <li>순위</li>
        <li>사진</li>
        <li>이름</li>
        <li class='w200'>그룹명</li>
        <li class='remarks'>비고</li>
        <li>투표</li>
      </ul>
      <ul
        v-for='(item, index) in dataSource'
        :key='index'
      >
        <li class='rank'>{{ index + 1 }}</li>
        <li>
          <div class='img' :style='{backgroundImage: `url(${item.profile})`}'/>
        </li>
        <li>{{ item.name }}</li>
        <li class='w200'>{{ item.groupname }}</li>
        <li class='remarks'></li>
        <li>
          <b-button
            size='sm'
            variant='primary'
            @click='vote(item.id)'
          >
            투표
          </b-button>
        </li>
      </ul>
    </div>
  </div>
</template>


<style lang='less' scoped>
.content-box {
  > ul {
    display: flex;
    margin: 0;
    padding: 0;
    border-top: 1px solid rgba(0, 0, 0, .1);
    list-style: none;
    &.header {
      font-weight: bold;
      background: #FAFAFA;
    }
    &:not(:first-child) {border-bottom: 1px solid rgba(0, 0, 0, .1)}
    > li {
      display: flex;
      align-items: center;
      justify-content: center;
      min-width: 100px;
      padding: .25rem .5rem;
      &.rank {font-size: 2rem}
      &.remarks {flex: 1}
      &.w200 {width: 200px}
      > .img {
        width: 80px;
        height: 80px;
        border-radius: 5px;
        background-color: #999;
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center;
      }
    }
  }
}
</style>

<script>
const REST_API_KEY = 'aa7f303969993750f8c188c33e241ab2'
const REDIRECT_URI = '/api/auth/kakao'

export default {
  name: 'VoteIndex',
  data() {
    return {
      count: 0,
      dataSource: []
    }
  },
  async asyncData({$axios}) {
    const data = await $axios.$post(
      '/api/pick/list',
      {page: 0, limit: 100}
    )
    return {
      count: data.count,
      dataSource: data.picks
    }
  },
  methods: {
    async vote(id) {
      const url = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${location.origin}${REDIRECT_URI}&response_type=code`
      await this.$nextTick()
      window.open(url, '카카오톡 로그인', 'width=420, height=600')
    }
  }
}
</script>
