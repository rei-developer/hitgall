<template>
  <div class='content-box'>
    <b-modal
      id='bv-back-modal'
      @ok='$router.push({ path: `/board/${domain}` })'
      title='알림'
      title-tag='h6'
      cancel-title='취소'
      ok-title='확인'
      size='sm'
      auto-focus-button='ok'
      centered>
      정말로 취소하시겠습니까?
    </b-modal>
    <b-overlay
      :show='loading'
      rounded='sm'>
      <article class='writeBox'>
				<span v-if='boardLevel > 0'>
					<b-form-group>
						<b-form-checkbox v-model='form.isNotice' switch>
							공지사항
						</b-form-checkbox>
					</b-form-group>
					<b-form-group>
						<b-form-input size='sm' type='color' v-model='form.color' style='width: 120px'/>
					</b-form-group>
				</span>
        <b-form-group v-if='categories.length > 0'>
          <b-form-radio-group
            size='sm'
            v-model='form.category'
            :options='categories'
            button-variant='primary'
            buttons
            name='radios-btn-default'/>
        </b-form-group>
        <b-form-group v-if='!$store.state.user.isLogged'>
          <b-form inline>
            <b-input-group class='mb-2 mr-sm-2 mb-sm-0' size='sm'>
              <b-input placeholder='닉네임' v-model='form.writer' trim/>
            </b-input-group>
            <b-input-group class='mb-2 mr-sm-2 mb-sm-0' size='sm'>
              <b-input type='password' placeholder='비밀번호' v-model='form.password' trim/>
            </b-input-group>
          </b-form>
        </b-form-group>
        <b-form-group>
          <b-form-input size='sm' placeholder='제목' v-model='form.title' autofocus/>
        </b-form-group>
        <div v-if='!poll.hide'>
          <b-form-group label='설문조사 질문'>
            <b-form-input
              size='sm'
              placeholder='200글자 제한'
              v-model='poll.question'/>
          </b-form-group>
          <b-form-group label='설문조사 항목'>
            <b-form-textarea
              size='sm'
              placeholder='항목은 개행(Enter Key)으로 구분하세요.'
              v-model='poll.texts'
              rows='3'
              max-rows='6'/>
          </b-form-group>
          <b-form-group label='설문조사 종료 일자'>
            <b-form-datepicker
              size='sm'
              placeholder='종료 일자를 선택하세요.'
              v-model='poll.regdate'
              :min='new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())'/>
          </b-form-group>
          <b-alert show dismissible variant='danger' v-if='id > 0'>
            게시물 수정시 이전 설문조사 데이터는 모두 삭제됩니다.
          </b-alert>
        </div>
        <client-only>
          <div class='editor'>
            <editor-menu-bar :editor='editor' v-slot='{ commands }'>
              <div>
                <b-button-group vertical>
                  <b-button-group size='sm'>
                    <b-dropdown variant='primary' size='sm'>
                      <template v-slot:button-content>
                        <font-awesome-icon icon='heading'/>
                        Header
                      </template>
                      <b-dropdown-item @click='commands.heading({ level: 1 })'>H1</b-dropdown-item>
                      <b-dropdown-item @click='commands.heading({ level: 2 })'>H2</b-dropdown-item>
                      <b-dropdown-item @click='commands.heading({ level: 3 })'>H3</b-dropdown-item>
                      <b-dropdown-item @click='commands.heading({ level: 4 })'>H4</b-dropdown-item>
                      <b-dropdown-item @click='commands.heading({ level: 5 })'>H5</b-dropdown-item>
                      <b-dropdown-item @click='commands.heading({ level: 6 })'>H6</b-dropdown-item>
                    </b-dropdown>
                    <b-button
                      variant='primary'
                      @click='commands.bold'>
                      <font-awesome-icon icon='bold'/>
                    </b-button>
                    <b-button
                      variant='primary'
                      @click='commands.italic'>
                      <font-awesome-icon icon='italic'/>
                    </b-button>
                    <b-button
                      variant='primary'
                      @click='commands.strike'>
                      <font-awesome-icon icon='strikethrough'/>
                    </b-button>
                    <b-button
                      variant='primary'
                      @click='commands.underline'>
                      <font-awesome-icon icon='underline'/>
                    </b-button>
                    <b-button
                      variant='primary'
                      @click='commands.code'>
                      <font-awesome-icon icon='code'/>
                    </b-button>
                  </b-button-group>
                  <b-button-group size='sm'>
                    <b-button
                      variant='primary'
                      @click='commands.paragraph'>
                      <font-awesome-icon icon='paragraph'/>
                    </b-button>
                    <b-button
                      variant='primary'
                      @click='commands.bullet_list'>
                      <font-awesome-icon icon='list-ul'/>
                    </b-button>
                    <b-button
                      variant='primary'
                      @click='commands.ordered_list'>
                      <font-awesome-icon icon='list-ol'/>
                    </b-button>
                    <b-button
                      variant='primary'
                      @click='commands.blockquote'>
                      <font-awesome-icon icon='quote-right'/>
                    </b-button>
                    <b-button
                      variant='primary'
                      @click='commands.code_block'>
                      <font-awesome-icon icon='code'/>
                    </b-button>
                    <b-button
                      variant='primary'
                      @click='commands.horizontal_rule'>
                      <font-awesome-icon icon='ruler-horizontal'/>
                    </b-button>
                    <b-button
                      variant='primary'
                      @click='commands.undo'>
                      <font-awesome-icon icon='undo'/>
                    </b-button>
                    <b-button
                      variant='primary'
                      @click='commands.redo'>
                      <font-awesome-icon icon='redo'/>
                    </b-button>
                    <!-- <b-button
                      variant='primary'
                      @click='insertHTML(editor, `<img src='https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png'>`)'>
                      <font-awesome-icon icon='image'/>
                    </b-button> -->
                  </b-button-group>
                </b-button-group>
                <b-button-group vertical>
                  <b-button-group size='sm'>
                    <b-button @click='poll.hide = !poll.hide'>
                      <font-awesome-icon icon='poll'/>
                      설문조사
                    </b-button>
                  </b-button-group>
                  <b-button-group size='sm'>
                    <b-button variant='warning' @click='htmlMode = !htmlMode'>
                      <font-awesome-icon icon='edit'/>
                      {{ htmlMode ? 'HTML' : '에디터' }}
                    </b-button>
                  </b-button-group>
                </b-button-group>
              </div>
            </editor-menu-bar>
            <div v-if='htmlMode'>
							<textarea
                class='textBox'
                placeholder='이곳에 내용을 입력하세요.'
                @change='changeContent'
                v-model='html'/>
            </div>
            <div v-else>
              <editor-content class='textBox' :editor='editor'/>
            </div>
          </div>
          <div class='editor' slot='placeholder'>
            <b-spinner variant='primary' style='width: 3rem; height: 3rem' label='Large Spinner' type='grow'/>
          </div>
        </client-only>
        <div class='savedTime' v-if='savedTime'>
          {{ savedTime }} 자동 저장되었습니다.
        </div>
        <dropzone
          id='dropzone'
          ref='dropzone'
          :options='options'
          :include-styling='true'
          v-on:vdropzone-thumbnail='thumbnail'
          :destroyDropzone='true'
          :useCustomSlot='true'>
          <div class='dropzone-custom-content'>
            <h3 class='dropzone-custom-title'>
              <font-awesome-icon icon='image'/>
              이미지 첨부
            </h3>
            <p class='subtitle'>이곳에 이미지를 드롭하세요... <strong>(개당 20MB)</strong></p>
          </div>
        </dropzone>
        <b-button-group class='submit'>
          <b-button
            size='sm'
            @click='backHandler'>
            취소
          </b-button>
        </b-button-group>
        <b-button-group class='submit float-right'>
          <b-button
            size='sm'
            variant='primary'
            @click='submit'>
            <font-awesome-icon icon='pen'/>
            작성 완료
          </b-button>
        </b-button-group>
      </article>
    </b-overlay>
  </div>
</template>

<script>
import {Editor, EditorContent, EditorMenuBar} from 'tiptap'
import {
  Blockquote,
  CodeBlock,
  HardBreak,
  Heading,
  Image,
  HorizontalRule,
  OrderedList,
  BulletList,
  ListItem,
  TodoItem,
  TodoList,
  Bold,
  Code,
  Italic,
  Link,
  Strike,
  Underline,
  History
} from 'tiptap-extensions'
import {DOMParser} from 'prosemirror-model'
import Dropzone from 'nuxt-dropzone'
import 'nuxt-dropzone/dropzone.css'

export default {
  components: {
    EditorContent,
    EditorMenuBar,
    Dropzone
  },
  validate({query, store}) {
    return query.id ? /^\d+$/.test(query.id) : true
  },
  data() {
    return {
      id: 0,
      domain: '',
      boardLevel: 0,
      categories: [],
      images: [],
      savedTime: null,
      form: {
        category: '',
        color: '',
        writer: '',
        password: '',
        title: '',
        content: '<p></p>',
        isNotice: false
      },
      poll: {
        question: '',
        texts: '',
        regdate: '',
        hide: true
      },
      editor: null,
      options: {
        url: 'https://httpbin.org/anything',
        uploadMultiple: true,
        resizeWidth: 1,
        resizeQuality: 0.2,
        previewTemplate: this.template()
      },
      html: '<p></p>',
      htmlMode: false,
      loading: false
    }
  },
  async asyncData({params, query, store, $axios}) {
    const id = query.id || 0
    const domain = params.domain
    const categories = await $axios.$get(`/api/topic/categories/${domain}`)
    if (categories.status === 'fail')
      return console.log(categories.message)
    if (store.state.user.isLogged) {
      const token = store.state.user.token
      const boardLevel = await $axios.$get(
        `/api/topic/boardLevel/${domain}`,
        {headers: {'x-access-token': token}}
      )
      if (boardLevel.status === 'fail')
        return console.log(boardLevel.message)
      if (id > 0) {
        const data = await $axios.$get(`/api/topic/read/${id}`)
        if (data.status === 'fail')
          return console.log(data.message)
        return {
          id,
          domain,
          boardLevel,
          categories,
          form: {
            category: data.topic.category,
            color: data.topic.color
              ? '#' + data.topic.color
              : '',
            title: data.topic.title,
            content: data.topic.content,
            isNotice: data.topic.isNotice > 0
          },
          html: data.topic.content
        }
      }
      const data = await $axios.$get(
        `/api/topic/save`,
        {headers: {'x-access-token': token}}
      )
      if (data.status === 'fail')
        return console.log(data.message)
      return {
        domain,
        boardLevel,
        categories,
        form: {
          color: data.topic.color
            ? '#' + data.topic.color
            : '',
          title: data.topic.title,
          content: data.topic.content,
          isNotice: data.topic.isNotice > 0
        },
        html: data.topic.content
      }
    }
    return {
      domain,
      categories
    }
  },
  watch: {
    'form.writer': function () {
      localStorage.setItem('notUserID', this.form.writer)
    },
    'form.password': function () {
      localStorage.setItem('notUserPW', this.form.password)
    }
  },
  mounted() {
    this.editor = new Editor({
      // autoFocus: true,
      extensions: [
        new Blockquote(),
        new BulletList(),
        new CodeBlock(),
        new HardBreak(),
        new Heading({
          levels: [1, 2, 3]
        }),
        new Image(),
        new HorizontalRule(),
        new ListItem(),
        new OrderedList(),
        new TodoItem(),
        new TodoList(),
        new Link(),
        new Bold(),
        new Code(),
        new Italic(),
        new Strike(),
        new Underline(),
        new History()
      ],
      content: this.form.content,
      onUpdate: ({getHTML}) => this.html = getHTML()
    })
    this.form.writer = localStorage.notUserID || 'ㅇㅇ'
    this.form.password = localStorage.notUserPW || ''
    const instance = this.$refs.dropzone.dropzone
    const editor = this.editor
    const getContent = this.getContent
    const setContent = this.setContent
    const insertHTML = this.insertHTML
    this.$refs.dropzone.dropzone.on('addedfile', function (file) {
      insertHTML(editor, `<p><img src='${URL.createObjectURL(file)}' alt='${file.upload.uuid}'></p><p></p>`)
    })
    this.$refs.dropzone.dropzone.on('removedfile', function (file) {
      const regex = new RegExp(`<img\\s+[^>]*alt=('|")${file.upload.uuid}('|")[^>]*>`, 'gi')
      setContent(getContent().replace(regex, ''))
    })
    this.realtimeUpdate()
  },
  methods: {
    getContent() {
      return this.html
    },
    setContent(html) {
      this.editor.setContent(html, true)
      this.editor.focus()
    },
    changeContent() {
      this.editor.setContent(this.html, true)
      this.editor.focus()
    },
    clearContent() {
      this.editor.clearContent(true)
      this.editor.focus()
    },
    elementFromString(value) {
      const element = document.createElement('p')
      element.innerHTML = value
      return element
    },
    insertHTML({
                 state,
                 view
               }, value) {
      const {selection} = state
      const element = this.elementFromString(value)
      const slice = DOMParser
        .fromSchema(state.schema)
        .parseSlice(element)
      const transaction = state
        .tr
        .insert(selection.anchor, slice.content)
      view.dispatch(transaction)
      this.editor.focus('end')
    },
    async submit() {
      if (this.loading)
        return
      // if (!this.$store.state.user.isLogged)
      // 	return this.toast('로그인하세요.', 'warning')
      if (this.form.title === '')
        return this.toast('제목을 입력하세요.', 'danger')
      if (this.html === '' || this.html === '<p></p>')
        return this.toast('본문을 입력하세요.', 'danger')
      if (!this.poll.hide) {
        if (this.poll.question === '')
          return this.toast('설문조사 질문을 입력하세요.', 'danger')
        if (this.poll.texts === '')
          return this.toast('설문조사 항목을 입력하세요.', 'danger')
        if (this.poll.regdate === '')
          return this.toast('설문조사 종료 기간을 입력하세요.', 'danger')
      }
      this.loading = true
      await this.imageUploadToServer(this.$refs.dropzone.getAcceptedFiles().reverse())
    },
    async write() {
      const token = this.$store.state.user.token || ''
      const url = this.id > 0
        ? `/api/topic/edit/${this.id}`
        : '/api/topic/write'
      const form = {
        domain: this.domain,
        isNotice: this.form.isNotice,
        category: this.form.category,
        color: this.form.color,
        writer: this.form.writer,
        password: this.form.password,
        title: this.form.title,
        content: this.html,
        poll: this.poll,
        images: this.images
      }
      const headers = {'x-access-token': token}
      const data = this.id > 0
        ? await this.$axios.$patch(url, form, {headers})
        : await this.$axios.$post(url, form, {headers})
      if (data.status === 'fail') {
        this.loading = false
        return this.toast(data.message || '오류가 발생했습니다.', 'danger')
      }
      this.$router.push({path: `/${data.topicId}`})
    },
    async autoWrite() {
      if (this.loading || !this.$store.state.user.isLogged || (this.form.title === '' & (this.html === '' || this.html === '<p></p>')))
        return
      const token = this.$store.state.user.token || ''
      const data = await this.$axios.$post(
        '/api/topic/write/save',
        {
          isNotice: this.form.isNotice,
          color: this.form.color,
          title: this.form.title,
          content: this.html
        },
        {headers: {'x-access-token': token}}
      )
      if (data.status === 'fail')
        return
      this.savedTime = this.$moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
    },
    async imageUploadToServer(files, index = 0) {
      if (index >= files.length)
        return await this.write()
      const file = files[index]
      const LIMITS = 21504000
      const formData = new FormData()
      formData.append('type', 'file')
      formData.append('image', file, file.name)
      if (!/(.gif|.png|.jpg|.jpeg|.webp)/i.test(file.name))
        this.toast(`${index + 1}번째 이미지 업로드 실패... (gif, png, jpg, jpeg, webp만 가능)`, 'danger')
      else if (file.size > LIMITS)
        this.toast(`${index + 1}번째 이미지 업로드 실패... (20MB 이하만 업로드 가능)`, 'danger')
      else {
        const data = await this.$axios.$post(
          '/api/cloud/topic',
          formData,
          {headers: {'content-type': 'multipart/form-data'}}
        )
        if (data.status === 'ok') {
          const name = file.name
          const filename = `/img/${data.filename}`
          this.toast(`${index + 1}번째 이미지 (${name}) 업로드 성공!`, 'success')
          this.images.push({
            name,
            filename: data.filename,
            width: file.width,
            height: file.height,
            link: filename,
            uuid: file.upload.uuid
          })
          const regex = new RegExp(`<img\\s+[^>]*alt=('|")${file.upload.uuid}('|")[^>]*>`, 'gi')
          const text = `<img src='https://cdn.hitgall.com${filename}' alt='${data.filename}'>`
          this.setContent(this.html.replace(regex, text))
        } else {
          this.toast(`${index + 1}번째 이미지 업로드 실패...`, 'danger')
        }
      }
      await this.imageUploadToServer(files, index + 1)
    },
    template() {
      return `<div class='dz-preview dz-file-preview'>
							<div class='dz-image'>
								<div data-dz-thumbnail-bg></div>
							</div>
							<div class='dz-details'>
								<div class='dz-size'><span data-dz-size></span></div>
							</div>
							<div class='dz-progress'><span class='dz-upload' data-dz-uploadprogress></span></div>
							<div class='dz-error-message'><span data-dz-errormessage></span></div>
							<div class='dz-success-mark'><i class='fa fa-check'></i></div>
							<div class='dz-error-mark'><i class='fa fa-close'></i></div>
							<a class='dz-remove' data-dz-remove>삭제</a>
						</div>`
    },
    thumbnail(file, dataUrl) {
      let j, len, ref, thumbnailElement
      if (file.previewElement) {
        file.previewElement.classList.remove('dz-file-preview')
        ref = file.previewElement.querySelectorAll('[data-dz-thumbnail-bg]')
        for (j = 0, len = ref.length; j < len; j++) {
          thumbnailElement = ref[j]
          thumbnailElement.alt = file.name
          thumbnailElement.style.backgroundImage = 'url("' + dataUrl + '")'
        }
        return setTimeout(((function (_this) {
          return function () {
            return file.previewElement.classList.add('dz-image-preview')
          }
        })(this)), 1)
      }
    },
    backHandler: async function () {
      this.$bvModal.show('bv-back-modal')
    },
    realtimeUpdate() {
      const update = setTimeout(async () => {
        if (this.$nuxt.$route.name !== 'board-domain-write')
          return clearTimeout(update)
        if (this.$store.state.user.isLogged)
          this.autoWrite()
        this.realtimeUpdate()
      }, 60000)
    },
    numberWithCommas(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    },
    imageUrlAlt(event) {
      event.target.src = '/default.png'
    },
    toast(text, variant = 'default') {
      this.$bvToast.toast(text, {
        title: '알림',
        toaster: 'b-toaster-top-center',
        variant: variant,
        solid: true,
        appendToast: true
      })
    }
  }
}
</script>

<style lang='less' scoped>
@primary: #EDA7B2;

.content-box {
  margin-bottom: 1rem;
  padding: .5rem;
  border-radius: 2px;
  background: #FFF;
  box-shadow: 1px 0 10px rgba(0, 0, 0, .1);
}

.client-only-placeholder {
  height: 385px;
  line-height: 385px;
  color: #999;
  font-size: 1.2rem;
  text-align: center;
}

@media (max-width: 730px) {
  .textBox {
    width: 100%;
    min-height: 400px;
    margin: .5rem 0 0;
    padding: .5rem;
    border: 2px solid #e5e5e5;
    background-color: #fff;
  }
}

@media (min-width: 731px) {
  .textBox {
    width: 100%;
    min-height: 620px;
    margin: .5rem 0 0;
    padding: .5rem;
    border: 2px solid #e5e5e5;
    background-color: #fff;
  }
}

textarea {
  resize: both
}

textarea.textBox {
  margin-bottom: 2px
}

.savedTime {
  padding: 2px 0 3px;
  color: #fff;
  font-size: 13px;
  text-align: center;
  background-color: @primary;
}

.submit {
  margin-top: .5rem
}
</style>
