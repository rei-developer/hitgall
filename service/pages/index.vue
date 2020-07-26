<template>
    <div>
        <adsbygoogle/>
        <!-- <div class='articles desktop-only'>
            <div class='article-box'>
                <HitArticle :limit='5'/>
            </div>
            <div class='article-box'>
                <Article domain='girl' :limit='5'/>
                <Article domain='anime' :limit='5'/>
            </div>
            <div class='article-box'>
                <Article domain='kawai3' :limit='5'/>
                <Article domain='lastorigin' :limit='5'/>
            </div>
            <div class='article-box'>
                <PhotoArticle domain='girl' :limit='6'/>
                <PhotoArticle domain='anime' :limit='6'/>
            </div>
        </div> -->
        <div class='articles'>
            <b-form-group class='mb-3'>
                <b-form-radio-group
                    size='sm'
                    v-model='domain'
                    :options='domainList'
                    button-variant='primary'
                    buttons
                    name='radios-btn-default'/>
            </b-form-group>
            <HitArticle :limit='3'/>
            <Article domain='all' :limit='20'/>
        </div>
    </div>
</template>

<script>
    import Article from '~/components/article'
    import HitArticle from '~/components/article/hit.vue'
    // import PhotoArticle from '~/components/article/photo.vue'

    export default {
        components: {
			Article,
            HitArticle,
            // PhotoArticle
        },
        data() {
            return {
                domain: 'all',
                domainList: [
                    {
                        text: '전체',
                        value: 'all'
                    },
                    {
                        text: '공지사항',
                        value: 'notice'
                    },
                    {
                        text: '건의사항',
                        value: 'feedback'
                    },
                    {
                        text: '갤러리 신청',
                        value: 'request'
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
        // padding: 5px;
        // background-color: #fff;
        // &.mobile-only {
        //     padding: 0;
        //     background-color: #F9F9F9;
        // }
    }
    .article-box {
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;
        &:last-child { margin: 0 }
    }
</style>