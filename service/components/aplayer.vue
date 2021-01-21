<template>
  <client-only>
    <aplayer
      :audio='audio'
      :fixed='true'
      :mini='true'
      :volume='0.8'
      :mutex='true'
      :autoplay='false'
      :listFolded='true'/>
  </client-only>
</template>

<script>
export default {
  data() {
    return {
      audio: [
        {
          'name': '바람의 나라 - 타이틀',
          'artist': 'be',
          'url': 'https://baram.vod.nexoncdn.co.kr/multimedia/ost/04_Winds_take2.mp3',
          'cover': 'https://ssl.nx.com/s2/game/Baram/2016/renewal/thum/music_thum04.jpg'
        },
        {
          'name': '바람의 나라 - 국내성',
          'artist': 'be',
          'url': 'https://baram.vod.nexoncdn.co.kr/multimedia/ost/08_2_Goguryeo.mp3',
          'cover': 'https://ssl.nx.com/s2/game/Baram/2016/renewal/thum/music_thum09.jpg'
        }
      ]
    }
  }
}
</script>
