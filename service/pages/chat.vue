<template>
  <div>
    <div class='chat-box'>
      <div class='top'>
        <div class='profile'>
          <img src='/shiroo.png' alt='profile'>
        </div>
        <div class='name'>시루</div>
        <div class='typing' v-if='isTargetTyping'>(메시지를 입력중입니다...)</div>
      </div>
      <div ref='view' class='view'>
        <div
          :class='[item.target]'
          v-for='(item, index) in chattingList'
          :key='index'
        >
          <div class='message'>
            <div class='text' v-if='item.text'>
              {{ item.text }}
            </div>
            <div class='image' v-if='item.imageUrl'>
              <img :src='item.imageUrl' alt='image'/>
            </div>
          </div>
        </div>
      </div>
      <div class='bottom'>
        <b-input-group size='sm'>
          <b-form-input
            ref='sendMessage'
            placeholder='메시지를 입력하세요'
            v-model='text'
            @keydown.enter='sendMessage'
            autofocus
          />
          <b-input-group-append>
            <b-button
              variant='primary'
              :disabled='loading'
              @click='sendMessage'
            >
              전송
            </b-button>
          </b-input-group-append>
        </b-input-group>
      </div>
    </div>
  </div>
</template>

<style lang='less' scoped>
.chat-box {
  width: 300px;
  border: 1px solid #CCC;
  > .top {
    display: flex;
    align-items: center;
    padding: .5rem;
    background: linear-gradient(to bottom, #FFF, #EFEFEF);
    border-bottom: 1px solid #CCC;
    > .profile {
      width: 50px;
      height: 50px;
      border-radius: 500rem;
      background: #FFF;
      > img {
        width: 50px;
        height: 50px;
        padding: 3px;
        border: 1px solid #CCC;
        border-radius: 500rem;
      }
    }
    > .name {
      padding-left: .5rem;
      font-size: 16px;
      font-weight: bold;
    }
    > .typing {
      padding-left: .5rem;
      color: #999;
      font-size: 11px;
    }
  }
  > .view {
    height: 400px;
    padding: .5rem;
    font-size: 13px;
    overflow-x: hidden;
    overflow-y: auto;
    > .cpu, > .user {
      > .message {
        display: inline-block;
        position: relative;
        max-width: 70%;
        margin: 0 0 .5rem;
        padding: .25rem .875rem;
        border-radius: 1rem;
        > .image {
          > img {
            max-width: 100%;
            height: auto;
            border-radius: 5px;
          }
        }
      }
    }
    > .cpu > .message {background: #dcebff}
    > .user {
      display: flex;
      flex: 1;
      justify-content: flex-end;
      > .message {background: #efefef}
    }
  }
  > .bottom {
    outline: none;
    > .input-group > input,
    > .input-group > .input-group-append > button {border-radius: 0}
  }
}
</style>

<script>
export default {
  name: 'Chat',
  data() {
    return {
      text: '',
      chattingList: [],
      isTargetTyping: false,
      loading: false
    }
  },
  mounted() {
    this.toBottom()
  },
  methods: {
    async sendMessage() {
      const text = this.text.trim()
      await this.$nextTick()
      this.$refs.sendMessage.focus()
      if (this.loading || text === '')
        return
      this.text = ''
      const token = this.$store.state.user.token || ''
      if (!token)
        return this.$toast('로그인하세요')
      this.loading = true
      this.textTemplate('user', text)
      try {
        const data = await this.$axios.$post(
          `/api/chat`,
          {text},
          {headers: {'x-access-token': token}}
        )
        if (data.status === 'fail')
          return this.$toast(data.message || '알 수 없는 오류가 발생했습니다')
        const startTime = Math.floor(Math.random() * 1500) + 500
        const duration = startTime + Math.floor(Math.random() * 5000)
        setTimeout(() => this.isTargetTyping = true, startTime)
        setTimeout(() => this.receiveMessage(data.result), duration)
      } catch (error) {
        if (error.response?.status === 429)
          return this.$toast(error.response.data.message)
        this.$toast(error.message)
        console.error(error)
      } finally {
        this.loading = false
      }
    },
    receiveMessage(data) {
      if (data.length < 1)
        return
      // item.from.score
      data.map(item => item.type === 'text'
        ? this.textTemplate('cpu', item.text)
        : this.imageTemplate('cpu', item.image.url)
      )
      this.isTargetTyping = false
    },
    textTemplate(target, text) {
      this.chattingList.push({
        target,
        text
      })
      this.toBottom()
    },
    imageTemplate(target, imageUrl) {
      this.chattingList.push({
        target,
        imageUrl
      })
      this.toBottom()
    },
    async toBottom() {
      await this.$nextTick()
      this.$refs.view.scrollTop = this.$refs.view.scrollHeight
      setTimeout(() => this.$refs.view.scrollTop = this.$refs.view.scrollHeight, 100)
    }
  }
}
</script>
