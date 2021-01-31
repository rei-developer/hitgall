<template>
  <div class='backdrop'>
    <drag-it-dude :style='{left: `${window.x}px`, top: `${window.y}px`}'>
      <div
        ref='novelGamePopup'
        class='dialog'
        :style='getCustomCSSOptions("dialog")'
      >
        <div class='header'>
          <font-awesome-icon icon='gamepad'/>
          {{ getGameTitle }}
          <div class='close' @click='close'>
            <font-awesome-icon icon='times'/>
          </div>
        </div>
        <div :style='getCustomCSSOptions("content")'>
          <NovelGameTitle
            :script='script'
            :token='token'
            :isDebug='isDebug'
            v-if='state === "TITLE"'
          />
          <NovelGameContent
            :novelIdx='novel.IDX'
            :novelVer='novel.VERSION'
            :script='script'
            :token='token'
            :isDebug='isDebug'
            v-if='state === "CONTENT"'
          />
        </div>
      </div>
    </drag-it-dude>
  </div>
</template>

<style lang='less' scoped>
@primary: #5F5476;
@primary-hover: #EDE3EB;
@font-color: #EDA7B2;

.backdrop {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, .6);
  z-index: 1000;
}

.drag-it-dude {
  position: fixed;
  > .dialog {
    min-height: 100px;
    font-size: 13px;
    border: 1px solid #000;
    background: #FFF;
    box-shadow: 1px 0 10px rgba(0, 0, 0, .1);
    cursor: move;
    animation: fadein 1s;
    -moz-animation: fadein 1s;
    -webkit-animation: fadein 1s;
    -o-animation: fadein 1s;
    > .header {
      height: 25px;
      line-height: 21px;
      padding: 0 .5rem;
      color: #FFF;
      background: @primary;
      > .close {
        padding-top: 3px;
        color: #FFF;
        font-size: 18px;
        cursor: pointer;
      }
    }
  }
}
</style>

<script>
import DragItDude from 'vue-drag-it-dude'
import NovelGameTitle from '@/components/novel/game/title'
import NovelGameContent from '@/components/novel/game/content'
import {CDN_HOST} from '@/data/novel/config.json'

let BGM = null
let BGS = null

export default {
  name: 'NovelGameIndex',
  components: {
    DragItDude,
    NovelGameTitle,
    NovelGameContent
  },
  data() {
    return {
      window: {
        w: 320,
        h: 400,
        x: 0,
        y: 0
      },
      savedBGMUrl: null,
      savedBGSUrl: null,
      novel: {},
      customCSSOptions: [],
      script: {},
      token: null,
      state: null,
      isUseTitle: false,
      isDebug: false,
      loading: false
    }
  },
  created() {
    BGM = new Audio()
    BGS = new Audio()
  },
  mounted() {
    document.body.addEventListener('keydown', e => {
      if (e.keyCode === 27)
        this.close()
    })
    this.$eventBus.$on('playBGM', url => this.playBGM(url))
    this.$eventBus.$on('playBGS', url => this.playBGS(url))
    this.$eventBus.$on('playSound', url => this.playSound(url))
    this.$eventBus.$on('stopBGM', url => this.stopBGM())
    this.$eventBus.$on('stopBGS', url => this.stopBGS())
  },
  beforeDestroy() {
    this.$eventBus.$off('playBGM')
    this.$eventBus.$off('playBGS')
    this.$eventBus.$off('playSound')
    this.$eventBus.$off('stopBGM')
    this.$eventBus.$off('stopBGS')
  },
  computed: {
    getGameTitle() {
      return `${this.novel.TITLE} (ver. ${this.novel.VERSION})`
    }
  },
  methods: {
    async show(idx, version, isDebug = false) {
      this.isDebug = isDebug
      this.token = this.$store.state.user.token || ''
      const {
        status,
        message,
        novel,
        customCSSOptions
      } = await this.$axios.$post(
        `/api/v2/novel/${idx}/${version}`,
        {token: this.token},
        {headers: {'x-access-token': this.token}}
      )
      if (status === 'FAIL')
        return this.$toast(message)
      this.novel = novel
      if (this.novel.IS_USE_TITLE === 1)
        this.isUseTitle = true
      if (this.novel.IS_USE_CUSTOM_CSS)
        this.customCSSOptions = customCSSOptions
      await this.init()
    },
    async init() {
      await this.clearSize()
      if (this.isUseTitle)
        return this.setTitle()
      this.setContent()
    },
    getCustomCSSOptions(part) {
      const data = {
        dialog: {
          width: `${this.window.w + 2}px`,
          height: `${this.window.h + 27}px`
        },
        content: {
          width: `${this.window.w}px`,
          height: `${this.window.h}px`
        }
      }
      return data[part] || undefined
    },
    setTitle() {
      this.state = 'TITLE'
    },
    setContent() {
      this.state = 'CONTENT'
    },
    playBGM(url) {
      if (this.savedBGMUrl === url)
        return
      this.savedBGMUrl = url
      BGM.src = `${CDN_HOST}/novel/audio/bgm/${url}`
      BGM.loop = true
      BGM.play()
    },
    playBGS(url) {
      if (this.savedBGSUrl === url)
        return
      this.savedBGSUrl = url
      BGS.src = `${CDN_HOST}/novel/audio/bgm/${url}`
      BGS.loop = true
      BGS.play()
    },
    playSound(url) {
      const sound = new Audio()
      sound.src = `${CDN_HOST}/novel/audio/se/${url}`
      sound.play()
    },
    stopBGM() {
      BGM.pause()
      BGM = new Audio()
    },
    stopBGS() {
      BGS.pause()
      BGS = new Audio()
    },
    async clearSize() {
      await this.$nextTick()
      const ch = this.$refs.novelGamePopup.clientHeight
      this.window.x = (window.innerWidth / 2) - (this.window.w / 2)
      this.window.y = (window.innerHeight / 2) - (ch / 2)
    },
    close() {
      this.stopBGM()
      this.stopBGS()
      this.$eventBus.$emit('gameEnd')
    }
  }
}
</script>
