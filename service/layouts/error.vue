<template>
    <div class='container'>
        <h2 v-if='error.statusCode === 404'>공사중이거나 없는 페이지입니다.</h2>
        <div id="error" v-if='error.statusCode === 404'> <img alt="404" src='/404.jpg'> </div>
        <h1 v-else>An error occurred</h1>
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