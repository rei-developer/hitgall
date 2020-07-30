<template>
    <div class='loginForm'>
        <!-- <nuxt-link to='/' class='logo'><h1>HitGall</h1></nuxt-link> -->
        <h5>로그인</h5>
        <hr>
        <b-overlay
            :show='loading'
            rounded='sm'>
            <b-form @submit='onSubmit'>
                <b-form-group>
                    <b-input-group class='mb-2 mr-sm-2 mb-sm-0'>
                        <b-input-group-prepend is-text>
                            <font-awesome-icon icon='user-circle'/>
                        </b-input-group-prepend>
                        <b-form-input
                            placeholder='아이디'
                            v-model='form.username'
                            :state='state.username'
                            autofocus/>
                    </b-input-group>
                </b-form-group>
                <b-form-group>
                    <b-input-group class='mb-2 mr-sm-2 mb-sm-0'>
                        <b-input-group-prepend is-text>
                            <font-awesome-icon icon='key'/>
                        </b-input-group-prepend>
                        <b-form-input
                            type='password'
                            placeholder='비밀번호'
                            v-model='form.password'
                            :state='state.password'/>
                    </b-input-group>
                </b-form-group>
                <b-form-group v-if='message'>
                    <b-form-invalid-feedback :state='false'>
                        {{ message }}
                    </b-form-invalid-feedback>
                </b-form-group>
                <b-form-group>
                    <b-form-checkbox v-model='form.checked'>로그인 유지</b-form-checkbox>
                </b-form-group>
                <b-button
                    type='submit'
                    variant='primary'>
                    로그인
                </b-button>
                <nuxt-link to='/signup'>
                    <b-button variant='link'>회원가입</b-button>
                </nuxt-link>
                <!-- <nuxt-link to='/user/find'>
                    <b-button variant='link'>아이디/비밀번호 찾기</b-button>
                </nuxt-link> -->
            </b-form>
        </b-overlay>
    </div>
</template>

<script>
    export default {
        layout: 'sign',
        data() {
            return {
                form: {
                    username: '',
                    password: '',
                    checked: false
                },
                state: {
                    username: null,
                    password: null
                },
                message: null,
                loading: false
            }
        },
        async mounted() {
            // await this.$recaptcha.init()
        },
        created() {
            if (process.browser) {
                this.form.checked = (localStorage.save === 'true') || false
                if (this.form.checked)
                    this.username = localStorage.username || ''
            }
        },
        updated() {
            if (process.browser) {
                if ((localStorage.save === 'true') !== this.form.checked) {
                    localStorage.save = this.form.checked
                    if (!this.form.checked)
                        localStorage.removeItem('username')
                }
                if (localStorage.save === 'true' && localStorage.username !== this.username)
                    localStorage.username = this.username
            }
        },
        methods: {
            async onSubmit(evt) {
                evt.preventDefault()
                if (this.loading)
                    return
                this.clear()
                if (this.form.username === '') {
                    this.state.username = false
                    return this.message = '아이디를 입력하세요.'
                } else if (this.form.password === '') {
                    this.state.password = false
                    return this.message = '비밀번호를 입력하세요.'
                }
                this.loading = true
                // const success = await this.checkRecaptcha()
                // if (!success) {
                //     this.loading = false
                //     return this.message = 'reCAPTCHA v3 인증에 실패했습니다.'
                // }
                const data = await this.$axios.$post('/api/auth/signin', { username: this.form.username, password: this.form.password })
                if (data.status === 'fail') {
                    this.loading = false
                    return this.message = data.message || '알 수 없는 오류가 발생했습니다. 나중에 다시 시도하세요.'
                }
                localStorage.setItem('tk', data.token)
                location.href = '/'
            },
            // async checkRecaptcha() {
            //     const token = await this.$recaptcha.execute('login')
            //     if (!token)
            //         return false
            //     const response = await this.$axios.post('/api/auth/recaptcha', { token })
            //     return response.data.status === 'ok'
            // },
            clear() {
                this.state.username = null
                this.state.password = null
            }
        }
    }
</script>

<style lang='less' scoped>
    .logo {
        text-decoration: none !important;
        > h1 {
            margin: 0 0 2rem;
            color: #FFF;
            // font-family: 'PricedownW00-Light';
            font-size: 5em;
            font-weight: bold;
            text-align: center;
            text-shadow: 5px 5px #000;
        }
    }
</style>