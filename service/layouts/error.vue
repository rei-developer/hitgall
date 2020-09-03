<template>
    <div class='container'>
        <h2 v-if='error.statusCode === 404'>공사중이거나 없는 페이지입니다.</h2>
        <h2 v-else>오류가 발생했습니다.<br><h5>오류코드는 자동으로 관리자에게 보고됩니다.<br><h5>이용에 큰 지장을 초래할경우 관리자에게 알려주세요.</h5></h5></h2>
        <div id="error"> <img alt="404" src='/404.jpg'> </div>
        <nuxt-link to='/'>
            <b-button variant='primary'>돌아가기</b-button>
        </nuxt-link>
    </div>
</template>

<script>
    export default {
        props: ['error']
    }
</script>

<style scoped>

img.error {
    width: 70%;
    height: auto;
}
</style>