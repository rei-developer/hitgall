<template>
  <b-overlay :show='loading' rounded='sm'>
    <div class='content-box dark-widget'>
      <ul>
        <li
          v-for='(item, index) in data'
          :key='index'
        >
          <NuxtLink
            class='thumb side-thumb'
            :style='{backgroundImage: item.imageUrl ? `url("https://cdn.hitgall.com/img/thumb/${item.imageUrl}")` : undefined}'
            :to='`/${item.id}`'
          />
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
  height: 300px;
  margin-bottom: .5rem;
  padding: .25rem 0 0 .25rem;
  border-radius: 2px;
  background: #FFF;
  box-shadow: 1px 0 10px rgba(0, 0, 0, .1);
  > ul {
    margin: 0;
    padding: 0;
    list-style: none;
    > li {
      display: flex;
      float: left;
      > a {
        text-decoration: none;
        cursor: pointer;
        &.side-thumb {
          width: calc(100px - .5rem);
          height: calc(100px - .5rem);
          margin: .25rem 0 0 .25rem;
          background-repeat: no-repeat;
          background-size: cover;
        }
      }
    }
  }
}
</style>

<script>
import {getTopicThumbList} from '@/api/topic'

export default {
  name: 'SidebarThumb',
  data() {
    return {
      data: [],
      loading: true
    }
  },
  mounted() {
    this.fetch()
  },
  methods: {
    async fetch() {
      const {result} = await getTopicThumbList(this.$axios)
      this.data = result
      this.loading = false
    }
  }
}
</script>
