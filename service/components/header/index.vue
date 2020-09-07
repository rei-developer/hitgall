<template>
    <div>
        <nav>
            <!-- main part -->
            <ul>
                <!-- logo -->
                <li class='logo' v-shortkey.once='["m"]' @shortkey='move("/")' @click='forceUpdate'>
                    <nuxt-link to='/'>
                        HitGall.com
                    </nuxt-link>
                </li>
                <!-- sidebar -->
                <li class='sidebar mobile-only' v-b-toggle.sidebar-backdrop>
                    <span>
                        <font-awesome-icon icon='bars'/>
                     </span>
                </li>
                <!-- menu -->
                <!-- <li v-shortkey.once='["h"]' @shortkey='move("/hit")' @click='forceUpdate'>
                    <nuxt-link to='/hit'>
                        <font-awesome-icon icon='star'/>
                        HIT
                    </nuxt-link>
                </li>
                <li @click='forceUpdate'>
                    <nuxt-link to='/all'>
                        <font-awesome-icon icon='folder-open'/>
                        전체글
                    </nuxt-link>
                </li>
                <li v-shortkey.once='["y"]' @shortkey='move("/gallery")' @click='forceUpdate'>
                    <nuxt-link to='/gallery'>
                        <font-awesome-icon icon='camera'/>
                        짤수집
                    </nuxt-link>
                </li> -->
                <li v-shortkey.once='["t"]' @shortkey='move("/sticker")' @click='forceUpdate'>
                    <nuxt-link to='/sticker'>
                        <font-awesome-icon icon='smile'/>
                        힛갤콘
                    </nuxt-link>
                </li>
                <li @click='forceUpdate'><nuxt-link to='/board/request'>갤러리 개설 신청</nuxt-link></li>
                <li v-if='$store.state.user.isLogged'><nuxt-link to='/board/admin'>갤러리 관리</nuxt-link></li>
            </ul>
            <!-- login part -->
            <ul class='right'>
                <li v-if='$store.state.user.isLogged'>
                    <nuxt-link to='/user/edit'>
                        <!-- <div class='profile'>
                            <img :src='$store.state.user.profileImageUrl' @error='imageUrlAlt'>
                        </div> -->
                        <!-- <img :src='`/level/${$store.state.user.level}.png`'> -->
                        <img alt="icon" :src='`/icon/${$store.state.user.icon}`' v-if='$store.state.user.icon !== ""'>
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
        <div class='openSidebar desktop-only'>
            <b-button pill size='lg' variant='primary' v-b-toggle.sidebar-backdrop>
                <!-- <font-awesome-icon icon='bars'/>   -->
                Menu
             </b-button>
        </div>
        <div class='appInstall desktop-only'>
            <b-button pill size='lg' v-if='installed' variant='info' @click='install()'>
                <!-- <font-awesome-icon icon='bars'/>   -->
                install
             </b-button>
        </div>
        <b-sidebar
            id='sidebar-backdrop'
            v-model='visible'
            backdrop
            shadow>
            <ul>
                <!-- <li @click='forceUpdate'><nuxt-link to='/hit'>HIT</nuxt-link></li> -->
                <!-- <li @click='forceUpdate'><nuxt-link to='/gallery'>짤수집</nuxt-link></li> -->
                <li @click='forceUpdate'><nuxt-link to='/board/girl'>연예인</nuxt-link></li>
                <li @click='forceUpdate'><nuxt-link to='/board/anime'>애니메이션</nuxt-link></li>
                <!-- <li @click='forceUpdate'><nuxt-link to='/board/python'>Python</nuxt-link></li> -->
                <li @click='forceUpdate'><nuxt-link to='/board/programming'>프로그래밍</nuxt-link></li>
                <li @click='forceUpdate'><nuxt-link to='/board/lastorigin'>라스트 오리진</nuxt-link></li>
                <!-- <li @click='forceUpdate'><nuxt-link to='/board/lydia'>리디아</nuxt-link></li> -->
                <li @click='forceUpdate'><nuxt-link to='/board/epic7'>에픽세븐</nuxt-link></li>
                <!-- <li @click='forceUpdate'><nuxt-link to='/board/gfl'>소녀전선</nuxt-link></li> -->
                <!-- <li @click='forceUpdate'><nuxt-link to='/board/ar_knights'>명일방주</nuxt-link></li> -->
                <li @click='forceUpdate'><nuxt-link to='/board/koikatsu'>코이카츠</nuxt-link></li>
                <!-- <li @click='forceUpdate'><nuxt-link to='/board/skyrim'>베데스다</nuxt-link></li> -->
                <!-- <li @click='forceUpdate'><nuxt-link to='/board/theaterdays'>밀리시타</nuxt-link></li> -->
                <li @click='forceUpdate'><nuxt-link to='/board/monmusu'>몬무스</nuxt-link></li>
                <!-- <li @click='forceUpdate'><nuxt-link to='/board/yandere'>얀데레</nuxt-link></li> -->
                <li @click='forceUpdate'><nuxt-link to='/board/notice'>공지사항</nuxt-link></li>
                <li @click='forceUpdate'><nuxt-link to='/board/feedback'>문의/건의</nuxt-link></li>
                <li @click='forceUpdate'><nuxt-link to='/board/request'>갤러리 신청</nuxt-link></li>
                <li><nuxt-link to='/board/admin'>갤러리 관리</nuxt-link></li>
                <li><nuxt-link to='/sticker'>힛갤콘</nuxt-link></li>
                <li class='install' v-if='installed' @click='install()'><font-awesome-icon icon='cloud-download-alt'/> 앱 설치</li>
            </ul>
        </b-sidebar>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                visible: false,
                installPromptEvent: '',
                installed: false
            }
        },
        mounted() {
          this.check()
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
            },
            check(){
              window.addEventListener('beforeinstallprompt', (e) => {
                  e.preventDefault()
                  this.installPromptEvent = e
                  console.log(e)
                  this.installed = true
              })
            },
           install() {
               console.log(this.installPromptEvent)
               this.installPromptEvent.prompt()
               this.installPromptEvent.userChoice.then((choice) => {
                   if (choice.outcome === 'accepted') {
                      console.log('User accepted the A2HS prompt');
                      this.installed = false
                      location.reload()
                    } else {
                       console.log('User dismissed the A2HS prompt');
                    }
               })
               this.installPromptEvent = null
            }
    }
}
</script>

<style lang='less'>
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
                outline: none;
                > a, span {
                    font-size: 15px;
                    color: #004080;
                    text-decoration: none;
                    display: block;
                    padding: 0 1rem;
                    &:hover {
                        color: #004080;
                        text-decoration: none;
                    }
                }
                > span {
                    font-size: 24px;
                    // padding: 7px 14px;
                }
                &.logo {
                    > a {
                        font-family: 'rubik';
                        font-size: 18px;
                        font-weight: bold;
                    }
                }
            }
        }
    }
    .b-sidebar-header {
        > .close { color: #fff !important }
        background-color: #004080;
    }
    .b-sidebar-body {
        > ul {
            margin: 0;
            padding: 0;
            background-color: #fff;
            list-style: none;
            > li {
                padding: 0px;
                border-bottom: 1px solid #eee;
                &.active {
                    background-color: #7F859A;
                    > a {
                        color: #fff;
                    }
                }
                > a {
                    display: block;
                    padding: 10px 20px;
                    line-height: 20px;
                    color: rgb(119, 119, 119);
                    font-size: 14px;
                    text-decoration: none;
                }
            }
            > li.install {
                display: block;
                padding: 10px 20px;
                line-height: 20px;
                color: rgb(119, 119, 119);
                font-size: 17px;
                text-decoration: none;
            }
        }
    }
    .openSidebar {
        position: fixed;
        right: 3rem;
        bottom: 3rem;
        z-index: 10;
    }
    .appInstall{
        position: fixed;
        right: 3rem;
        bottom: 7rem;
        z-index: 10;
    }
</style>