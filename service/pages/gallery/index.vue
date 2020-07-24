<template>
    <div>
        <h5 @click='shuffle'>
            <font-awesome-icon icon='camera'/>
            <strong>갤러리</strong>
        </h5>
        <article class='gallery' v-viewer='{ title: false }'>
            <client-only>
                <waterfall
                    :line-gap='235'
                    :min-line-gap='100'
                    :max-line-gap='235'
                    :single-max-width='235'
                    :watch='items'>
                    <waterfall-slot
                        v-for='(item, index) in items'
                        :width='item.width > 0 ? item.width : 235'
                        :height='item.height > 0 ? item.height : 235'
                        :order='index'
                        :key='index'
                        move-class='item-move'>
                        <img
                            :src='`/img/${item.imageUrl}`'
                            @error='imageUrlAlt'
                            @click='playSound("/se3.mp3")'>
                    </waterfall-slot>
                </waterfall>
            </client-only>
        </article>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                items: [],
                page: 0,
                bottom: false,
                isBusy: false
            }
        },
        watch: {
            '$store.state.forceUpdate': function() {
                this.addItems()
            },
            bottom: function(bottom) {
                if (bottom)
                    this.addItems()
            }
        },
        mounted() {
            if (process.browser)
                window.addEventListener('scroll', () => this.bottom = this.bottomVisible())
            this.addItems()
        },
        methods: {
            async addItems(forceUpdate = false) {
                if (!this.isBusy && this.items.length < 500) {
                    this.isBusy = true
                    if (forceUpdate) {
                        this.items = []
                        this.page = 0
                    }
                    const data = await this.$axios.$post(
                        '/api/topic/list/image',
                        { page: this.page++ }
                    )
                    if (!data.items)
                        return this.isBusy = false
                    data.items.map(item => this.items.push(item))
                    this.isBusy = false
                }
            },
            shuffle() {
                this.items.sort(() => Math.random() - 0.5)
            },
            reflowed() {
                this.isBusy = false
            },
            bottomVisible() {
                if (process.browser) {
                    const scrollY = window.pageYOffset
                    const visible = document.documentElement.clientHeight
                    const pageHeight = document.documentElement.scrollHeight
                    const bottomOfPage = visible + scrollY >= pageHeight
                    return bottomOfPage || pageHeight < visible
                }
            },
            numberWithCommas(x) {
                return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            },
            imageUrlAlt(event) {
                event.target.src = 'https://github.com/u3u.png'
            },
            playSound(sound) {
                if (!sound)
                    return
                const audio = new Audio(sound)
                audio.play()
            }
        }
    }
</script>

<style lang='less' scoped>
    @primary: #30425f;
    
    h5 {
        height: 32px;
        margin: 0;
        padding: 3px 6px;
        border-bottom: 1px solid rgba(0, 0, 0, .2);
        border-radius: 10px 10px 0 0;
        background-color: @primary;
        color: #fff;
        font-size: 21px;
        font-weight: 700;
        text-shadow: #666 1px 1px;
    }

    article.gallery {
        padding: 10px 0 0 10px;
        background-color: #fff;
    }

    .vue-waterfall-slot {
        > img {
            width: calc(100% - 10px);
            height: calc(100% - 10px);
            cursor: pointer;
            &:hover { opacity: .8 }
        }
    }

    .item-move {
        transition: all .3s cubic-bezier(.55, 0, .1, 1);
        -webkit-transition: all .3s cubic-bezier(.55, 0, .1, 1);
    }
</style>