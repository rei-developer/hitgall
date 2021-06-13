<template>
  <b-overlay :show='loading' rounded='sm'>
    <div class='content-box'>
      <div class='title'>
        <b-button
          squared
          size='sm'
          variant='primary'
          block
        >
          <font-awesome-icon icon='star'/>
          실시간 인기
        </b-button>
      </div>
      <ul>
        <li
          v-for='(item, index) in getData'
          :key='index'
        >
          <NuxtLink
            class='title'
            :to='`/${item.id}`'
          >
            {{ item.title }}
          </NuxtLink>
        </li>
      </ul>
    </div>
  </b-overlay>
</template>

<style lang='less' scoped>
@primary: #5F5476;
@primary-hover: #EDE3EB;
@font-color: #EDA7B2;

.content-box {
  margin-bottom: .5rem;
  padding: .5rem;
  border-radius: 2px;
  background: #333;
  box-shadow: 1px 0 10px rgba(0, 0, 0, .1);
  > .title {
    display: flex;
    margin-bottom: 3px;
  }
  > ul {
    margin: 0;
    padding: 0;
    list-style: none;
    > li {
      padding: .1rem 0 .2rem;
      > a {
        display: block;
        color: #FFF;
        font-size: 12px;
        text-decoration: none;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        cursor: pointer;
        &:hover {color: @font-color}
        &:visited {color: #AAA}
      }
    }
  }
}
</style>

<script>
import {getTopicWidgetList} from '@/api/topic'

export default {
  name: 'SidebarWidget',
  data() {
    return {
      tab: 'movie',
      girlImageList: [],
      animeImageList: [],
      loading: true
    }
  },
  mounted() {
    this.fetch()
  },
  computed: {
    getData() {
      return this.tab === 'movie'
        ? this.girlImageList
        : this.animeImageList
    }
  },
  methods: {
    async fetch() {
      const {
        girlImageList,
        animeImageList
      } = await getTopicWidgetList(this.$axios, true)
      this.girlImageList = girlImageList
      this.animeImageList = animeImageList
      this.loading = false
    }
  }
}
</script>
