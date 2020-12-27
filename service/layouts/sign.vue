<template>
  <div>
    <div class='bg'/>
    <nuxt/>
  </div>
</template>

<style lang='less' scoped>
@import '~/assets/stylesheets.less';

.bg {
  position: fixed;
  width: 100%;
  height: 100%;
  // background-image: url('/background.jpg');
  background-size: cover;
  background-repeat: no-repeat;
  background-position-y: -20rem;
  animation-name: goBlur;
  animation-duration: 5s;
  -webkit-filter: blur(3px);
  -moz-filter: blur(3px);
  -o-filter: blur(3px);
  -ms-filter: blur(3px);
  filter: blur(3px);
  opacity: .6;
  z-index: -1;
}

@keyframes goBlur {
  from {
    filter: none;
    opacity: 1;
  }
  to {
    -webkit-filter: blur(3px);
    -moz-filter: blur(3px);
    -o-filter: blur(3px);
    -ms-filter: blur(3px);
    filter: blur(3px);
    opacity: .6;
  }
}

@media (max-width: 1159px) {
  .bg {
    background-size: auto;
    background-position: center;
  }
}

.loginForm {
  width: 320px;
  margin: 0 auto;
  padding: 5rem 0 0;
}
</style>
