<template>
  <div class='wrapper'>
    <nav>
      <ul>
        <nuxt-link to='/dmca'>
          <li>
            <font-awesome-icon icon='copyright'/>
            DMCA
          </li>
        </nuxt-link>
      </ul>
    </nav>
  </div>
</template>

<style lang='less' scoped>
@primary: #5F5476;
@primary-hover: #EDE3EB;
@font-color: #EDA7B2;

.wrapper {
  height: 44px;
  > nav {
    margin-top: 1rem;
    color: #FFF;
    background: @font-color;
    > ul {
      display: flex;
      align-items: center;
      width: 1200px;
      height: 44px;
      margin: 0 auto;
      padding: 0;
      list-style: none;
      > a {
        height: 44px;
        line-height: 42px;
        padding: 0 .5rem;
        color: #FFF;
        font-size: 13px;
        font-weight: bold;
        text-decoration: none;
        white-space: nowrap;
        &:hover {color: @primary-hover}
      }
    }
  }
}

@media (max-width: 1199px) {
  .wrapper {
    > nav {
      > ul {width: 100%}
    }
  }
}
</style>

<script>
export default {
  name: 'Footer'
}
</script>
