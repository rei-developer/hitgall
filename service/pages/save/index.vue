<template>
    <SaveList :id='0' :purePage='$route.query.page || 1'/>
</template>

<script>
    import SaveList from '~/components/board/list.vue'

    export default {
        components: {
            SaveList
        }
    }
</script>