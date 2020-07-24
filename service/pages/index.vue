<template>
    <div>
        <div class='articles desktop-only'>
            <div class='article-box'>
                <HitArticle :limit='5'/>
            </div>
            <div class='article-box'>
                <Article domain='anime' :limit='5'/>
                <Article domain='game' :limit='5'/>
            </div>
            <div class='article-box'>
                <Article domain='news' :limit='5'/>
                <Article domain='review' :limit='5'/>
            </div>
            <div class='article-box'>
                <PhotoArticle domain='nendo' :limit='6'/>
                <PhotoArticle domain='draw' :limit='6'/>
            </div>
        </div>
        <div class='articles mobile-only'>
            <b-form-group class='mb-3'>
                <b-form-radio-group
                    size='sm'
                    v-model='domain'
                    :options='domainList'
                    button-variant='primary'
                    buttons
                    name='radios-btn-default'/>
                <span v-if='$store.state.user.isLogged'>
                    <nuxt-link :to='`/board/anime/write`'>
                        <b-button
                            class='float-right'
                            size='sm'
                            variant='primary'
                            @shortkey='$router.push({ path: "/board/anime/write" })'>
                            <font-awesome-icon icon='pencil-alt'/>
                            쓰기
                        </b-button>
                    </nuxt-link>
                </span>
            </b-form-group>
            <HitArticle :limit='3'/>
            <Article domain='all' :limit='20'/>
        </div>
    </div>
</template>

<script>
    import Article from '~/components/article'
    import HitArticle from '~/components/article/hit.vue'
    import PhotoArticle from '~/components/article/photo.vue'

    export default {
        components: {
			Article,
            HitArticle,
            PhotoArticle
        },
        data() {
            return {
                domain: 'anime',
                domainList: [
                    {
                        text: '애니동',
                        value: 'anime'
                    },
                    {
                        text: '게임동',
                        value: 'game'
                    },
                    {
                        text: '넨도동',
                        value: 'nendo'
                    },
                    {
                        text: '그림동',
                        value: 'draw'
                    }
                ]
            }
        },
        watch: { 
            domain: function() {
                this.$router.push({ path: `/board/${this.domain}` })
            }
        }
    }
</script>

<style lang='less' scoped>
    .articles {
        padding: 5px;
        background-color: #fff;
        &.mobile-only {
            padding: 0;
            background-color: #F9F9F9;
        }
    }
    .article-box {
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;
        &:last-child { margin: 0 }
    }
</style>