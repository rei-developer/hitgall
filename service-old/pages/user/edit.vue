<template>
    <div>
        <button @click='signOut'>로그아웃</button>
    </div>
</template>

<script>
    export default {
        methods: {
            signOut() {
                if (this.$store.state.user.isLogged)
                    this.$store.commit('user/signOut')
                this.$router.push({ path: '/' })
            }
        }
    }
</script>