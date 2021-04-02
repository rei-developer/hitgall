<template>
  <article class='comment-write'>
    <div>
      <StickerInventory
        v-on:use='use'
        v-on:close='close'
        v-if='!stickers.hide'/>
      <div class='header' v-if='author'>
        <div class='author'>
          <font-awesome-icon icon='at'/>
          {{ author }}
        </div>
        <div class='label'>에게 대댓글 작성</div>
      </div>
      <div class='name-box' v-if='!$store.state.user.isLogged'>
        <input
          maxlength='20'
          class='writer'
          placeholder='닉네임'
          v-model='writer'/>
        <input
          maxlength='200'
          type='password'
          class='password'
          placeholder='비밀번호'
          v-model='password'/>
      </div>
      <div class='content'>
        <div class='write-box'>
          <textarea
            rows='3'
            placeholder='이곳에 내용을 입력하세요.'
            v-model='content'
            v-on:keyup.ctrl.enter='submit'/>
        </div>
        <div class='commit'>
          <div class='sticker' @click='stickers.hide = false'>스티커</div>
          <div class='submit' @click='submit'>
            <input type='hidden'>
            <span v-if='loading'>
              <font-awesome-icon class='fa-spin' icon='circle-notch'/>
            </span>
            <span v-else>
              <font-awesome-icon icon='pencil-alt'/>
            </span>
          </div>
        </div>
      </div>
      <div class='footer'>
        <button
          :class='[
            "voice-reply",
            recorder ? "active" : undefined
          ]'
          @click='onClickVoiceReply'
        >
          <font-awesome-icon icon='microphone-alt'/>
        </button>
        <button
          class='voice-reply'
          @click='onClickVoiceReplyPlay'
          v-if='voice'
        >
          <font-awesome-icon icon='play'/>
        </button>
        <button
          class='voice-reply'
          @click='onClickVoiceReplyDelete'
          v-if='voice'
        >
          <font-awesome-icon icon='trash'/>
        </button>
        <div class='sticker'
             @click='clear'
             v-if='stickers.sticker'
        >
          <div class='item'>
            <div class='image'>
              <img
                :src='`https://cdn.hitgall.com/sticker/${stickers.sticker.id}/${stickers.select}.${stickers.sticker.ext}`'
                @error='imageUrlAlt'>
            </div>
            {{ stickers.sticker.name }}
            <div class='remove'>
              <font-awesome-icon icon='times'/>
            </div>
          </div>
        </div>
      </div>
    </div>
  </article>
</template>

<script>
import moment from 'moment'
import StickerInventory from '~/components/sticker/inventory.vue'

export default {
  components: {StickerInventory},
  props: ['id', 'edit', 'pureContent', 'author', 'topicUserId', 'postUserId', 'postRootId', 'postParentId', 'domain'],
  data() {
    return {
      writer: '',
      password: '',
      content: this.pureContent,
      stickers: {
        sticker: null,
        select: 0,
        hide: true
      },
      voice: null,
      recorder: null,
      isRunningVoice: false,
      loading: false
    }
  },
  watch: {
    writer: function () {
      localStorage.setItem('notUserID', this.writer)
    },
    password: function () {
      localStorage.setItem('notUserPW', this.password)
    }
  },
  mounted() {
    this.writer = localStorage.notUserID || 'ㅇㅇ'
    this.password = localStorage.notUserPW || ''
  },
  beforeDestroy() {
    this.recorder = null
  },
  methods: {
    async submit() {
      if (this.loading)
        return
      if (!this.stickers.sticker && this.content.trim() === '')
        return
      let voiceFilename
      if (this.voice) {
        voiceFilename = await this.uploadVoiceData(this.voice.audioBlob)
      }
      const token = this.$store.state.user.token || ''
      this.loading = true
      let result
      if (this.edit) {
        result = await this.$axios.$patch(
          '/api/topic/edit/post',
          {
            id: this.id,
            writer: this.writer,
            password: this.password,
            content: this.content,
            sticker: {
              id: this.stickers.sticker ? this.stickers.sticker.id : 0,
              select: this.stickers.sticker ? `${this.stickers.select}.${this.stickers.sticker.ext}` : ''
            },
            voice: voiceFilename
          },
          {headers: {'x-access-token': token}}
        )
      } else {
        result = await this.$axios.$post(
          '/api/topic/write/post',
          {
            domain: this.domain,
            writer: this.writer,
            password: this.password,
            topicId: this.id,
            topicUserId: this.topicUserId,
            postUserId: this.postUserId,
            postRootId: this.postRootId,
            postParentId: this.postParentId,
            content: this.content,
            sticker: {
              id: this.stickers.sticker ? this.stickers.sticker.id : 0,
              select: this.stickers.sticker ? `${this.stickers.select}.${this.stickers.sticker.ext}` : ''
            },
            voice: voiceFilename
          },
          {headers: {'x-access-token': token}}
        )
      }
      if (result.status === 'fail') {
        this.loading = false
        return this.toast(result.message || '오류가 발생했습니다.', 'danger')
      }
      this.$store.commit('forceUpdate')
      this.content = ''
      this.clear()
      this.loading = false
    },
    close() {
      this.stickers.hide = true
    },
    clear() {
      this.stickers = {
        sticker: null,
        select: 0,
        hide: true
      }
      this.voice = null
    },
    use(item, select) {
      this.stickers = {
        sticker: item,
        select: select,
        hide: true
      }
    },
    async recordAudio() {
      return new Promise(async resolve => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({audio: true})
          console.log('A')
          const mediaRecorder = new MediaRecorder(stream)
          console.log('B')
          const audioChunks = []
          mediaRecorder.addEventListener('dataavailable', event => audioChunks.push(event.data))
          const start = () => mediaRecorder.start()
          const stop = () =>
            new Promise(resolve => {
              mediaRecorder.addEventListener('stop', () => {
                const audioBlob = new Blob(audioChunks, {type: 'audio/mpeg'})
                const audioUrl = URL.createObjectURL(audioBlob)
                const audio = new Audio(audioUrl)
                const play = () => audio.play()
                resolve({audioBlob, audioUrl, play})
              })
              mediaRecorder.stop()
            })
          const end = () => stream.getTracks().forEach(track => track.stop())
          resolve({start, stop, end})
        } catch (e) {
          this.toast('마이크 또는 헤드폰, 헤드셋을 장착하십시오')
          this.isRunningVoice = false
        }
      })
    },
    async onClickVoiceReply() {
      this.isRunningVoice = !this.isRunningVoice
      if (this.isRunningVoice) {
        this.recorder = await this.recordAudio()
        this.recorder.start()
      } else {
        if (!this.recorder)
          return
        const audio = await this.recorder.stop()
        audio.play()
        this.voice = audio
        await this.recorder.end()
        this.recorder = null
      }
    },
    onClickVoiceReplyPlay() {
      const audio = new Audio()
      audio.src = this.voice.audioUrl
      audio.play()
    },
    onClickVoiceReplyDelete() {
      this.voice = null
    },
    async uploadVoiceData(blob) {
      const formData = new FormData()
      formData.append('voice', blob, `${moment().format()}.mpeg`)
      const {status, filename} = await this.$axios.$post(
        '/api/cloud/voice',
        formData
      )
      return status === 'ok'
        ? filename
        : false
    },
    imageUrlAlt(event) {
      event.target.src = '/default.png'
    },
    toast(text, variant = 'default') {
      this.$bvToast.toast(text, {
        title: '알림',
        toaster: 'b-toaster-top-center',
        variant: variant,
        solid: true
      })
    }
  }
}
</script>

<style lang='less' scope>
@primary: #EDA7B2;
@primary-focus: #5F5476;

article.comment-write {
  padding: 5px;
  border: 1px solid #eee;
  border-left: 0;
  border-right: 0;
  background-color: #fff;
  > div {
    > .header {
      font-size: .75rem;
      > .author {
        display: inline-block;
        width: fit-content;
        margin-bottom: .5rem;
        padding: 0 .5rem;
        color: #fff;
        border-radius: 500rem;
        background-color: @primary;
      }
      > .label {
        display: inline-block;
        color: @primary;
        font-weight: normal;
      }
    }
    > .name-box {
      > input {
        width: 120px;
        margin: 0 0 5px 0;
        padding: .25rem .5rem;
        color: #000;
        font-size: 14px;
        border: 1px solid #ccc;
        outline: none;
      }
    }
    > .content {
      display: flex;
      > .profile {
        margin-right: .25rem;
        > img {
          width: 72px;
          height: 72px !important;
          padding: 3px;
          border: 1px solid #ccc;
        }
      }
      > .write-box {
        display: flex;
        flex: 1;
        flex-direction: column;
        > textarea {
          height: 4.5rem;
          padding: .5rem;
          font-size: 14px;
          border: 1px solid #ccc;
          outline: none !important;
        }
      }
      > .commit {
        margin-left: .25rem;
        text-align: center;
        cursor: pointer;
        > .sticker {
          width: 4.5rem;
          padding: .25rem 0;
          background-color: #f7f8fa;
          color: @primary;
          font-size: .8rem;
        }
        > .submit {
          width: 4.5rem;
          height: 45px;
          line-height: 44px;
          background-color: @primary;
          color: #FFF;
          font-size: 1.5rem;
          &:hover {background-color: @primary-focus}
        }
      }
    }
    > .footer {
      display: flex;
      > .voice-reply {
        width: 32px;
        height: 32px;
        margin: 5px 5px 0 0;
        border: 0;
        background-color: @primary;
        color: #fff;
        font-size: 20px;
        &:hover, &:active {background-color: @primary-focus}
        &.active {color: red}
      }
      > .sticker {
        margin-top: .5rem;
        > .item {
          display: flex;
          width: fit-content;
          padding: 3px;
          padding-right: .5rem;
          border-radius: 500rem;
          background-color: @primary;
          color: #fff;
          font-size: 11px;
          justify-content: center;
          align-items: center;
          cursor: pointer;
          &.item:hover {background-color: @primary-focus}
          > .image {
            margin-right: .5rem;
            > img {
              width: 2rem;
              height: 2rem;
              border-radius: 500rem;
            }
          }
          > .remove {margin-left: .5rem}
        }
      }
    }
    .signin-box {
      width: 100%;
      padding: .5rem 0;
      border-radius: .5rem;
      font-size: .8rem;
      text-align: center;
      cursor: pointer;
      &:hover {
        background-color: @primary-focus;
        > a {color: #fff}
      }
      > a {
        color: @primary;
        text-decoration: none;
      }
    }
  }
}
</style>
