<template>
    <BoardList :id='0' :purePage='$route.query.page || 1' :domain='domain'/>
</template>

<script>
    import BoardList from '~/components/board/list.vue'
    import Library from '~/assets/lib.js'
    
    export default {
        components: {
            BoardList
        },
        async asyncData ({ params }) {
            const domain = params.domain
            return { domain }
        }
    }
</script>