<template>
    <div class='StickerInventory'>
        <div class='title'>
            <font-awesome-icon icon='info-circle'/>
            스티커 인벤토리
            <button class='close' @click='$emit("close")'>×</button>
        </div>
        <div class='content'>
            <div class='item'>
                <img
                    :src='`/sticker/${item.id}/1.${item.ext}`'
                    @click='view(item)'
                    v-for='(item, index) in inventory' :key='index'>
            </div>
            <div class='itemList' v-if='sticker'>
                <img
                    :src='`/sticker/${sticker.id}/${index}.${sticker.ext}`'
                    @click='use(sticker, index)'
                    v-for='index in sticker.number' :key='index'>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                inventory: [],
                sticker: null
            }
        },
        mounted() {
            this.getData()
        },
        methods: {
            getData: async function() {
                if (!this.$store.state.user.isLogged)
                    return
                const token = this.$store.state.user.token
                const data = await this.$axios.$get(
                    `/api/sticker/list`,
                    { headers: { 'x-access-token': token } }
                )
                if (data.status === 'fail' || !data.inventory)
                    return
                this.inventory = data.inventory
                this.sticker = this.inventory[0]
            },
            view(item) {
                this.sticker = item
            },
            use(item, index) {
                this.$emit('use', item, index)
            },
            numberWithCommas(x) {
                return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            }
        }
    }
</script>

<style lang='less' scope>
    .StickerInventory {
        position: fixed;
        left: 35%;
        top: 6em;
        width: 670px;
        height: 423px;
        margin: 0 0 0 -180px;
        border: 1px solid #333;
        border-radius: 5px;
        background: #FFF;
        z-index: 10000;
        > .title {
            margin: 0;
            padding: 6px;
            height: 29px;
            background-color: #29313D;
            color: #FFF;
            font-size: .9rem;
            font-weight: bold;
        }
        .close {
            position: absolute;
            top: 2px;
            right: 2px;
            width: 24px;
            height: 24px;
            line-height: 0;
            margin: 0;
            border: none;
            background: transparent;
            color: #FFF;
            text-align: center;
            cursor: pointer;
            outline: none;
        }
        .content { padding: 12px }
        .item {
            height: 64px;
            margin-bottom: 2px;
            overflow-x: scroll;
            overflow-y: hidden;
            white-space: nowrap;
        }
        .item img {
            width: 41px;
            height: 41px;
            margin: 2px;
            border-radius: .25rem;
        }
        .itemList {
            height: 300px;
            overflow: auto;
        }
        .itemList img {
            margin: 2px;
            width: 100px;
            height: 100px;
            float: left;
        }
        .item img:hover,
        .itemList img:hover {
            opacity: .8;
            cursor: pointer;
        }
        .itemList img:hover { border: 1px solid #333 }
    }

    @media (max-width: 1024px) {
        .StickerInventory {
            left: 50%;
            width: 360px;
        }
    }
</style>