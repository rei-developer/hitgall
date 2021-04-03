<template>
  <div id='error' class='container'>
    <h1 v-if='error.statusCode === 404'>404</h1>
    <h1 v-else>{{ error.statusCode }}</h1>
    <h6>오류코드는 자동으로 기록됩니다.</h6>
    <h6>이용에 큰 지장을 초래할경우 관리자에게 알려주세요.</h6>
    <hr/>
    <nuxt-link to='/'>
      <b-button size='sm' variant='primary'>돌아가기</b-button>
    </nuxt-link>
    <div class='img' :style='{backgroundImage: "url(/404.png)"}'/>
  </div>
</template>

<script>
export default {
  props: ['error']
}
</script>

<style lang='less' scoped>
#error {
  display: flex;
  flex-direction: column;
  align-items: center;
  &.container {
    border-radius: 2px;
    background: #FFF;
    box-shadow: 1px 0 10px rgba(0, 0, 0, .1);
  }
  > hr {margin: .5rem 0}
  > .img {
    display: flex;
    width: inherit;
    height: 50vh;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
  }
}
</style>
