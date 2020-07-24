<template>
    <article class='comment-write'>
        <div v-if='$store.state.user.isLogged'>
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
            <div class='content'>
                <div class='profile desktop-only'>
                    <img :src='$store.state.user.profileImageUrl' @error='imageUrlAlt'>
                </div>
                <div class='write-box'>
                    <textarea
                        rows='3'
                        placeholder='이곳에 내용을 입력하세요.'
                        v-model='content'
                        v-on:keyup.alt.83='submit'
                        v-shortkey='["alt", "s"]' @shortkey='submit'
                        autofocus/>
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
                <div class='sticker'
                    @click='clear'
                    v-if='stickers.sticker'>
                    <div class='item'>
                        <div class='image'>
                            <img :src='`/sticker/${stickers.sticker.id}/${stickers.select}.${stickers.sticker.ext}`' @error='imageUrlAlt'>
                        </div>
                        {{ stickers.sticker.name }}
                        <div class='remove'>
                            <font-awesome-icon icon='times'/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-else>
            <div class='signin-box'>
                <nuxt-link to='/signin'>
                    계정이 있으시다면 로그인하세요
                </nuxt-link>
            </div>
        </div>
    </article>
</template>

<script>
    import StickerInventory from '~/components/sticker/inventory.vue'

    export default {
        components: { StickerInventory },
        props: ['id', 'edit', 'pureContent', 'author', 'topicUserId', 'postUserId', 'postRootId', 'postParentId'],
        data() {
            return {
                content: this.pureContent,
                stickers: {
                    sticker: null,
                    select: 0,
                    hide: true
                },
                loading: false
            }
        },
        methods: {
            submit: async function() {
                if (this.loading)
                    return
                if (!this.stickers.sticker && this.content === '')
                    return this.toast('내용을 입력하세요.', 'danger')
                if (!this.$store.state.user.isLogged)
                    return this.toast('로그인하세요.', 'warning')
                const token = this.$store.state.user.token
                this.loading = true
                let result
                if (this.edit) {
                    const data = await this.$axios.$patch(
                        '/api/topic/edit/post',
                        {
                            id: this.id,
                            content: this.content,
                            sticker: {
                                id: this.stickers.sticker ? this.stickers.sticker.id : 0,
                                select: this.stickers.sticker ? `${this.stickers.select}.${this.stickers.sticker.ext}` : ''
                            }
                        },
                        { headers: { 'x-access-token': token } }
                    )
                    result = data
                } else {
                    const data = await this.$axios.$post('/api/topic/write/post',
                        {
                            topicId: this.id,
                            topicUserId: this.topicUserId,
                            postUserId: this.postUserId,
                            postRootId: this.postRootId,
                            postParentId: this.postParentId,
                            content: this.content,
                            sticker: {
                                id: this.stickers.sticker ? this.stickers.sticker.id : 0,
                                select: this.stickers.sticker ? `${this.stickers.select}.${this.stickers.sticker.ext}` : ''
                            }
                        },
                        { headers: { 'x-access-token': token } }
                    )
                    result = data
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
            },
            use(item, select) {
                this.stickers = {
                    sticker: item,
                    select: select,
                    hide: true
                }
            },
            imageUrlAlt(event) {
                event.target.src = 'http://localhost:3000/default.png'
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
    @primary: #9BA9FB;
    @primary-focus: #8698FB;

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
                        font-size: 13px;
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
                        border-radius: .25rem .25rem 0;
                        background-color: #f7f8fa;
                        color: #333;
                        font-size: .8rem;
                    }
                    > .submit {
                        width: 4.5rem;
                        height: 45px;
                        line-height: 44px;
                        border-radius: 0 0 .25rem .25rem;
                        background-color: @primary;
                        color: #FFF;
                        font-size: 1.5rem;
                        &:hover { background-color: @primary-focus }
                    }
                }
            }
            > .footer {
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
                        &.item:hover { background-color: @primary-focus }
                        > .image {
                            margin-right: .5rem;
                            > img {
                                width: 2rem;
                                height: 2rem;
                                border-radius: 500rem;
                            }
                        }
                        > .remove { margin-left: .5rem }
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
                    > a { color: #fff }
                }
                > a {
                    color: @primary;
                    text-decoration: none;
                }
            }
        }
    }
</style>