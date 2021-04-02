<template>
  <article class='comment-write'>
    <div>
      <StickerInventory
        ref='sticker'
        @use='use'
        @close='close'
        v-if='!stickers.hide'
      />
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
            placeholder='이곳에 댓글 내용을 입력하세요.'
            v-model='content'
            v-on:keyup.ctrl.enter='submit'/>
        </div>
        <div class='commit'>
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
        <div
          v-b-tooltip.hover title='이미지 댓글'
          class='footer-event'
        >
          <font-awesome-icon icon='image'/>
          <div class='input-file'>
            <input id='replyImage' type='file' @change='onChangeReplyImage'/>
          </div>
        </div>
        <button
          v-b-tooltip.hover title='보이스 댓글'
          :class='[
            "footer-event",
            recorder ? "active" : undefined
          ]'
          @click='onClickVoiceReply'
        >
          <font-awesome-icon icon='microphone-alt'/>
        </button>
        <button
          class='footer-event'
          @click='onClickVoiceReplyPlay'
          v-if='voice'
        >
          <font-awesome-icon icon='play'/>
        </button>
        <button
          class='footer-event'
          @click='onClickVoiceReplyDelete'
          v-if='voice'
        >
          <font-awesome-icon icon='trash'/>
        </button>
        <button
          v-b-tooltip.hover title='스티커'
          class='footer-event'
          @click='onClickReplySticker'
        >
          <font-awesome-icon icon='smile'/>
        </button>
        <div
          class='sticker'
          @click='clear'
          v-if='stickers.sticker'
        >
          <div class='item'>
            <div class='image'>
              <img
                :src='`https://cdn.hitgall.com/sticker/${stickers.sticker.id}/${stickers.select}.${stickers.sticker.ext}`'
                :alt='stickers.sticker.name'
                @error='imageUrlAlt'
              >
            </div>
            {{ stickers.sticker.name }}
            <div class='remove'>
              <font-awesome-icon icon='times'/>
            </div>
          </div>
        </div>
      </div>
      <div class='footer' v-if='imagePreview'>
        <div class='image-preview' @click='onClickImagePreview'>
          <img :src='imagePreview' alt='이미지 미리보기'>
          <div class='remove'>
            <font-awesome-icon icon='times'/>
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
      imagePreview: null,
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
      const imageFilename = await this.uploadImageData()
      const voiceFilename = !!this.voice
        ? await this.uploadVoiceData(this.voice.audioBlob)
        : null
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
            image: imageFilename,
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
            image: imageFilename,
            voice: voiceFilename
          },
          {headers: {'x-access-token': token}}
        )
      }
      if (result.status === 'fail') {
        this.loading = false
        return this.$toast.error(result.message || '오류가 발생했습니다.')
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
          const mediaRecorder = new MediaRecorder(stream)
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
          this.$toast.warning('마이크 또는 헤드폰, 헤드셋을 장착하십시오')
          this.isRunningVoice = false
        }
      })
    },
    onChangeReplyImage(args) {
      if (args.target.files && args.target.files[0]) {
        const reader = new FileReader()
        reader.onload = e => this.imagePreview = e.target.result
        reader.readAsDataURL(args.target.files[0])
      }
    },
    onClickImagePreview() {
      const $el = document.getElementById('replyImage')
      if (!$el)
        return null
      $el.value = null
      this.imagePreview = null
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
    async onClickReplySticker() {
      this.stickers.hide = false
      await this.$nextTick()
      this.$refs.sticker.show({
        icon: 'exclamation-triangle',
        message: '정말로 모든 액션을 삭제할거니?',
        doEvent: 'sb.removeAll'
      })
    },
    async uploadImageData() {
      const $el = document.getElementById('replyImage')
      if (!$el)
        return null
      const files = $el.files
      if (!files || files.length < 1)
        return null
      const LIMITS = 21504000
      const file = files[0]
      const formData = new FormData()
      formData.append('type', 'file')
      formData.append('img', file, file.name)
      if (!/(.gif|.png|.jpg|.jpeg|.webp)/i.test(file.name)) {
        this.$toast.error(`이미지 업로드 실패... (gif, png, jpg, jpeg, webp만 가능)`)
        return null
      } else if (file.size > LIMITS) {
        this.$toast.error(`이미지 업로드 실패... (20MB 이하만 업로드 가능)`)
        return null
      }
      const {status, filename} = await this.$axios.$post(
        '/api/cloud/topic',
        formData,
        {headers: {'content-type': 'multipart/form-data'}}
      )
      $el.value = null
      this.imagePreview = null
      return status === 'ok'
        ? filename
        : null
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
    }
  }
}
</script>

<style lang='less' scoped>
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
        > .submit {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 4.5rem;
          height: 4.5rem;
          background-color: @primary;
          color: #FFF;
          font-size: 1.5rem;
          &:hover {background-color: @primary-focus}
        }
      }
    }
    > .footer {
      display: flex;
      > .footer-event {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        margin: 5px 5px 0 0;
        border: 0;
        background-color: @primary;
        color: #fff;
        font-size: 20px;
        &:hover, &:active {background-color: @primary-focus}
        &.active {color: red}
        > .input-file {
          position: relative;
          opacity: 0;
          cursor: pointer;
          > input {
            position: absolute;
            top: -16px;
            left: -26px;
            width: 32px;
            height: 32px;
          }
        }
      }
      > .sticker {
        > .item {
          display: flex;
          width: fit-content;
          margin-top: 5px;
          padding-right: .5rem;
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
            }
          }
          > .remove {margin-left: .5rem}
        }
      }
      > .image-preview {
        position: relative;
        width: 100px;
        height: auto;
        margin-top: 5px;
        padding: 2px;
        border: 1px solid #ccc;
        > .remove {display: none}
        &:hover {
          > img { opacity: .8}
          > .remove {
            display: block;
            position: absolute;
            top: 0;
            right: 6px;
            color: #333;
          }
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
