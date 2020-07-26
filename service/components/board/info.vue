<template>
    <div class='desktop-only'>
        <div class='board-title'>{{ board.name }} 갤러리</div>
        <div class='board-info'>
            <div class='image'>
                <img src='/default.png'>
            </div>
            <div class='description'>{{ board.description }}</div>
            <div class='manager'>
                <span><strong>매니저</strong> : {{ board.masterName }} ({{ board.masterId }})</span>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: ['domain'],
        data() {
            return {
                board: {
                    name: '',
                    description: '',
                    masterId: '',
                    masterName: ''
                }
            }
        },
        mounted() {
            this.getData()
        },
        methods: {
            getData: async function() {
                const data = await this.$axios.$get(`/api/board/${this.domain}`)
                this.board = data.board
            },
            numberWithCommas(x) {
                try {
                    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                } catch {
                    return x
                }
            },
            imageUrlAlt(event) {
                event.target.src = '/default.png'
            }
        }
    }
</script>

<style lang='less' scoped>
    @primary: #30425f;

    .board-title {
        color: @primary;
        font-size: 20px;
        font-weight: bold;
    }

    .board-info {
        display: flex;
        margin: 0 0 1rem;
        padding: .5rem;
        color: #000;
        font-size: 13px;
        border: 1px solid #ccc;
        border-top: 2px solid @primary;
        background: #fff;
        > .image {
            margin-right: .5rem;
            > img {
                width: 150px;
                height: 100px;
                padding: 2px;
                border: 1px solid #000;
                background: #fff;
            }
        }
        > .description {
            flex: 1;
            margin-right: .5rem;
            color: #000;
            font-size: 13px;
        }
        > .manager {

        }
    }
</style>