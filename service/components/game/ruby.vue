<template>
  <div
    class='backdrop'
    @click.self='close'
  >
    <drag-it-dude :style='{left: `${x}px`, top: `${y}px`}'>
      <div
        ref='rubyGamePopup'
        class='dialog'
        :style='{width: `${w}px`}'
      >
        <div class='header'>
          <font-awesome-icon icon='gamepad'/>
          소녀를 찾아서 (개발중인 컨텐츠)
          <div class='close' @click='close'>
            <font-awesome-icon icon='times'/>
          </div>
        </div>
        <div
          class='content'
          :style='{backgroundImage: `url(/game/ruby/background/${background})`}'
        >
          <div class='actor' v-if='actor'>
            <img :src='`/game/ruby/actor/${actor}`'/>
          </div>
          <div class='select' v-if='selectList.length > 0'>
            <ul>
              <li
                v-for='(item, index) in selectList'
                :key='index'
                @click='choice(item.move)'
              >
                {{ item.text }}
              </li>
            </ul>
          </div>
          <div class='message-box' v-if='text'>
            <div class='name'>{{ name }}</div>
            <p v-html='text'/>
          </div>
        </div>
        <div class='footer'>
          <b-button squared variant='primary' size='sm' @click.prevent='next'>
            <span v-if='loading || selectList.length > 0'>
              <font-awesome-icon class='fa-spin' icon='circle-notch'/>
            </span>
            <span v-else>
              {{ isEnd ? '처음으로' : '다음' }}
            </span>
          </b-button>
          <b-button squared variant='dark' size='sm' @click.prevent='close' v-if='isEnd'>
            닫기 (ESC)
          </b-button>
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
    > .content {
      width: 100%;
      min-height: 400px;
      position: relative;
      background-color: #000;
      background-size: cover;
      word-break: break-all;
      overflow: hidden;
      > .actor {
        position: absolute;
        right: -12.5rem;
        bottom: -12.5rem;
        width: 200%;
        height: auto;
        animation: fadein 2s;
        -moz-animation: fadein 2s;
        -webkit-animation: fadein 2s;
        -o-animation: fadein 2s;
      }
      > .select {
        width: calc(100% - 3rem);
        position: absolute;
        left: 1.5rem;
        top: 11rem;
        > ul {
          margin: 0;
          padding: 0;
          list-style: none;
          > li {
            margin-bottom: .25rem;
            padding: .2rem .5rem .35rem;
            color: #FFF;
            text-align: center;
            text-shadow: 1px 1px #000;
            border: 1px solid @font-color;
            background: rgba(0, 0, 0, .6);
            &:hover {
              font-size: 16px;
              font-weight: bold;
              cursor: pointer;
            }
          }
        }
      }
      > .message-box {
        width: calc(100% - 1rem);
        height: 94px;
        padding: 3px .5rem 0;
        position: absolute;
        left: .5rem;
        bottom: .5rem;
        color: #FFF;
        text-shadow: 1px 1px #000;
        border: 1px solid @font-color;
        background: rgba(0, 0, 0, .6);
        > .name {
          color: @font-color;
          font-size: 16px;
          font-weight: bold;
        }
        > p {margin: 0}
      }
    }
    > .footer {
      display: flex;
      flex: 1;
      justify-content: flex-end;
      padding: .5rem;
      > button {margin-left: 5px}
    }
  }
}
</style>

<script>
/*
http://amachamusic.chagasi.com/mp3/ouun.mp3
http://amachamusic.chagasi.com/mp3/nagagutsudeodekake.mp3
 */
import DragItDude from 'vue-drag-it-dude'
import Script from '@/data/game/ruby/script'

const init = {
  scriptId: 'hello',
  scriptLine: 0,
  actor: null,
  name: null,
  text: null,
  background: null,
  isEnd: false
}

let audio = null
let timer = null

export default {
  name: 'RubyGame',
  components: {DragItDude},
  data() {
    return {
      w: 320,
      x: 0,
      y: 0,
      saveX: 0,
      saveY: 0,
      scriptId: init.scriptId,
      scriptLine: init.scriptLine,
      selectList: [],
      actor: init.actor,
      name: init.name,
      text: init.text,
      background: init.background,
      isEnd: init.isEnd,
      loading: false
    }
  },
  created() {
    audio = new Audio()
  },
  mounted() {
    setTimeout(() => this.getText(), 1000)
    document.body.addEventListener('keydown', e => {
      if (e.keyCode === 27)
        this.close()
    })
  },
  methods: {
    async show() {
      await this.$nextTick()
      const ch = this.$refs.rubyGamePopup.clientHeight
      this.x = (window.innerWidth / 2) - (this.w / 2)
      this.y = (window.innerHeight / 2) - (ch / 2)
    },
    getText() {
      if (Script[this.scriptId].length <= this.scriptLine) {
        if (!!Script[this.scriptId][this.scriptLine - 1].move) {
          const move = Script[this.scriptId][this.scriptLine - 1].move
          console.log(move)
          this.scriptId = move[0]
          this.scriptLine = move[1]
        } else
          this.scriptLine = 0
      }
      if (!!Script[this.scriptId][this.scriptLine].name) {
        const name = Script[this.scriptId][this.scriptLine].name
        this.name = name === '[USER]'
          ? this.$store.state.user.nickname || '익명'
          : name
      }
      this.selectList = !!Script[this.scriptId][this.scriptLine].select
        ? Script[this.scriptId][this.scriptLine].select
        : this.selectList = []
      if (!!Script[this.scriptId][this.scriptLine].bgm) {
        audio.src = `/game/ruby/bgm/${Script[this.scriptId][this.scriptLine].bgm}`
        audio.loop = true
        audio.play()
      }
      if (!!Script[this.scriptId][this.scriptLine].se)
        this.play(Script[this.scriptId][this.scriptLine].se)
      if (!!Script[this.scriptId][this.scriptLine].actor)
        this.actor = Script[this.scriptId][this.scriptLine].actor
      else
        this.actor = null
      if (!!Script[this.scriptId][this.scriptLine].background)
        this.background = Script[this.scriptId][this.scriptLine].background
      if (!!Script[this.scriptId][this.scriptLine].isEnd)
        return this.end()
      this.printText(Script[this.scriptId][this.scriptLine].texts)
    },
    printText(texts, line = 0) {
      if (texts.length <= line)
        return this.loading = false
      this.loading = true
      const text = texts[line]
      for (let i = 0; i <= text.length; i++)
        timer = setTimeout(() => {
          const prefix = texts
            .filter((item, index) => index < line)
          const script = [text.substr(0, i)]
          this.text = prefix
            .concat(script)
            .join('<br>')
          if (i === text.length)
            return this.printText(texts, ++line)
        }, i * 20)
    },
    play(name) {
      const se = new Audio()
      se.src = `/game/ruby/se/${name}`
      se.play()
    },
    next() {
      if (this.loading || this.selectList.length > 0)
        return
      if (this.isEnd) {
        this.getText()
        this.isEnd = false
      } else {
        clearTimeout(timer)
        this.text = null
        ++this.scriptLine
        this.getText()
      }
    },
    choice(move) {
      clearTimeout(timer)
      this.text = null
      this.scriptId = move[0]
      this.scriptLine = move[1]
      this.getText()
    },
    end() {
      audio.pause()
      this.scriptId = init.scriptId
      this.scriptLine = init.scriptLine
      this.selectList = []
      this.actor = init.actor
      this.name = init.name
      this.text = init.text
      this.background = init.background
      this.isEnd = true
    },
    close() {
      audio.pause()
      clearTimeout(timer)
      this.$eventBus.$emit('RubyGameClose')
    }
  }
}
</script>
