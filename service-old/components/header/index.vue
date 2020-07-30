<template>
    <div>
        <nav>
            <!-- main part -->
            <ul>
                <!-- logo -->
                <li class='logo' v-shortkey.once='["m"]' @shortkey='move("/")' @click='forceUpdate'>
                    <nuxt-link to='/'>
                        <img src='/icon.png'>
                    </nuxt-link>
                </li>
                <!-- menu -->
                <li v-shortkey.once='["h"]' @shortkey='move("/hit")' @click='forceUpdate'>
                    <nuxt-link to='/hit'>
                        <font-awesome-icon icon='star'/>
                        HIT
                    </nuxt-link>
                </li>
                <li v-shortkey.once='["y"]' @shortkey='move("/gallery")' @click='forceUpdate'>
                    <nuxt-link to='/gallery'>
                        <font-awesome-icon icon='camera'/>
                        갤러리
                    </nuxt-link>
                </li>
                <li v-shortkey.once='["t"]' @shortkey='move("/board/talk")' @click='forceUpdate'><nuxt-link to='/board/talk'>토크</nuxt-link></li>
                <li v-shortkey.once='["g"]' @shortkey='move("/board/girl")' @click='forceUpdate'><nuxt-link to='/board/girl'>연예</nuxt-link></li>
                <!-- <li v-shortkey.once='["a"]' @shortkey='move("/board/anime")' @click='forceUpdate'><nuxt-link to='/board/anime'>애니</nuxt-link></li> -->
                <li v-shortkey.once='["s"]' @shortkey='move("/sticker")' ><nuxt-link to='/sticker'>스티커</nuxt-link></li>
            </ul>
            <!-- login part -->
            <ul class='right'>
                <li v-if='$store.state.user.isLogged'>
                    <nuxt-link to='/user/edit'>
                        <div class='profile'>
                            <img :src='$store.state.user.profileImageUrl' @error='imageUrlAlt'>
                        </div>
                        <img :src='`/level/${$store.state.user.level}.png`'>
                        <img :src='`/icon/${$store.state.user.icon}`' v-if='$store.state.user.icon !== ""'>
                        <strong>{{ $store.state.user.nickname }}</strong>
                    </nuxt-link>
                </li>
                <li v-shortkey.once='["l"]' @shortkey='move("/signin")' v-else>
                    <nuxt-link to='/signin'>
                        로그인
                        <font-awesome-icon icon='sign-in-alt'/>
                    </nuxt-link>
                </li>
            </ul>
        </nav>
        <div class='openSidebar'>
            <b-button pill size='lg' variant='primary' v-b-toggle.sidebar-backdrop>
                <font-awesome-icon icon='bars'/>
            </b-button>
        </div>
        <b-sidebar
            id='sidebar-backdrop'
            v-model='visible'
            right
            backdrop
            shadow>
            <ul>
                <li @click='forceUpdate'><nuxt-link to='/hit'>HIT</nuxt-link></li>
                <li @click='forceUpdate'><nuxt-link to='/gallery'>갤러리</nuxt-link></li>
                <li @click='forceUpdate'><nuxt-link to='/board/talk'>토크</nuxt-link></li>
                <li @click='forceUpdate'><nuxt-link to='/board/girl'>연예</nuxt-link></li>
                <!-- <li @click='forceUpdate'><nuxt-link to='/board/anime'>애니</nuxt-link></li> -->
                <li @click='forceUpdate'><nuxt-link to='/board/notice'>공지사항</nuxt-link></li>
                <li @click='forceUpdate'><nuxt-link to='/board/feedback'>건의사항</nuxt-link></li>
                <li><nuxt-link to='/sticker'>스티커</nuxt-link></li>
            </ul>
        </b-sidebar>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                visible: false
            }
        },
        methods: {
            forceUpdate() {
                this.visible = false
                this.$store.commit('forceUpdate')
            },
            move(path) {
                if (this.$nuxt.$route.name === 'board-domain-write')
                    return
                this.forceUpdate()
                this.$router.push({ path })
            },
            imageUrlAlt(event) {
                event.target.src = '/default.png'
            },
            signOut() {
                if (!this.$store.state.user.isLogged)
                    return
                this.$store.commit('user/signOut')
            }
        }
    }
</script>

<style lang='less'>
    @primary: #9BA9FB;
    
    nav {
        display: flex;
        position: relative;
        height: 50px;
        ul, li {
            margin: 0;
            padding: 0;
            list-style: none;
        }
        ul {
            flex: none;
            &.right {
                margin-left: auto;
                > li > a {
                    > .profile {
                        position: absolute;
                        top: 10px;
                        left: -40px;
                        > img {
                            width: 40px;
                            height: 40px;
                            margin: -5px 5px 0;
                            padding: 2px;
                            border: 1px solid #333;
                            border-radius: 500rem;
                            background-color: #fff;
                        }
                    }
                    > img:nth-child(2) { margin-bottom: 4px }
                    > img:nth-child(3) {
                        width: 16px;
                        height: 16px;
                        margin-bottom: 4px;
                        border-radius: 2px;
                    }
                }
            }
        }
        > ul {
            > li {
                float: left;
                position: relative;
                > a {
                    font-size: 14px;
                    color: #fff;
                    text-decoration: none;
                    display: block;
                    padding: 14px 14px 15px;
                    &:hover {
                        color: #fff;
                        text-decoration: none;
                    }
                }
                &.logo {
                    > a {
                        padding: 5px 14px 0 0;
                        img {
                            width: 40px;
                            height: 40px;
                        }
                        &:hover img { opacity: .5 }
                    }
                }
            }
        }
    }
    .b-sidebar-header {
        > .close { color: #fff !important }
        background-color: @primary;
    }
    .b-sidebar-body {
        > ul {
            margin: 0;
            padding: 0;
            background-color: #fff;
            list-style: none;
            > li {
                padding: 10px 20px;
                border-bottom: 1px solid #eee;
                &.active {
                    background-color: #7F859A;
                    > a {
                        color: #fff;
                    }
                }
                > a {
                    display: block;
                    line-height: 20px;
                    color: rgb(119, 119, 119);
                    font-size: 14px;
                    text-decoration: none;
                }
            }
        }
    }

    .openSidebar {
        position: fixed;
        right: 1rem;
        bottom: 1rem;
        z-index: 10;
    }
</style>