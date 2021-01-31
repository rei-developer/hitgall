<template>
  <div>
    <div class='actor' v-if='script.actor'>
      <img :src='getActorImageUrl' alt='ACTOR_IMAGE'/>
    </div>
    <div class='select' v-if='script.select'>
      <ul>
        <li
          v-for='(item, index) in script.select'
          :key='index'
          @click='onChoiceClick()'
        >
          {{ item.TEXT }}
        </li>
      </ul>
    </div>
    <div class='message-box' v-if='script.text'>
      <div class='name'>{{ script.name }}</div>
      <p v-html='script.text'/>
    </div>
  </div>
</template>

<style lang='less' scoped>
@primary: #5F5476;
@primary-hover: #EDE3EB;
@font-color: #EDA7B2;

.actor {
  position: absolute;
  right: -12.5rem;
  bottom: -12.5rem;
  width: 200%;
  height: auto;
  animation: fadein 2s;
  -moz-animation: fadein 2s;
  -webkit-animation: fadein 2s;
  -o-animation: fadein 2s;
}

.select {
  width: calc(100% - 3rem);
  position: absolute;
  left: 1.5rem;
  top: 11rem;
  > ul {
    margin: 0;
    padding: 0;
    list-style: none;
    > li {
      margin-bottom: .25rem;
      padding: .2rem .5rem .35rem;
      color: #FFF;
      text-align: center;
      text-shadow: 1px 1px #000;
      border: 1px solid @font-color;
      background: rgba(0, 0, 0, .6);
      &:hover {
        font-size: 16px;
        font-weight: bold;
        cursor: pointer;
      }
    }
  }
}

.message-box {
  width: calc(100% - 1rem);
  height: 94px;
  padding: 3px .5rem 0;
  position: absolute;
  left: .5rem;
  bottom: .5rem;
  color: #FFF;
  text-shadow: 1px 1px #000;
  border: 1px solid @font-color;
  background: rgba(0, 0, 0, .6);
  > .name {
    color: @font-color;
    font-size: 16px;
    font-weight: bold;
  }
  > p {margin: 0}
}
</style>

<script>
import {CDN_HOST} from '@/data/novel/config.json'

export default {
  name: 'NovelGameTitle',
  props: {
    script: {
      type: JSON,
      default: {}
    }
  },
  data() {
    return {}
  },
  computed: {
    getActorImageUrl() {
      return this.script.actor.IMAGE_URL
        ? `${CDN_HOST}/novel/img/actor/${this.script.actor.IMAGE_URL}`
        : undefined
    }
  },
  methods: {
    onChoiceClick() {

    }
  }
}
</script>
