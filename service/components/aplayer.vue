<template>
  <client-only>
    <aplayer
      :audio='audio'
      :fixed='true'
      :mini='true'
      :volume='0.8'
      :mutex='true'
      :autoplay='true'
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
        },
        {
          'name': '바람의 나라 - 부여성',
          'artist': 'be',
          'url': 'https://baram.vod.nexoncdn.co.kr/multimedia/ost/08_1_Buyeo.mp3',
          'cover': 'https://ssl.nx.com/s2/game/Baram/2016/renewal/thum/music_thum08.jpg'
        },
        {
          'name': '바람의 나라 - 선비족 평원',
          'artist': 'be',
          'url': 'https://baram.vod.nexoncdn.co.kr/multimedia/ost/06_Plains_Xianbei.mp3',
          'cover': 'https://ssl.nx.com/s2/game/Baram/2016/renewal/thum/music_thum06.jpg'
        },
        {
          'name': '바람의 나라 - 만리장성',
          'artist': 'be',
          'url': 'https://baram.vod.nexoncdn.co.kr/multimedia/ost/07_The_great_Wall.mp3',
          'cover': 'https://ssl.nx.com/s2/game/Baram/2016/renewal/thum/music_thum07.jpg'
        },
        {
          'name': '마비노기 - 어릴 적 할머니가 들려주신 옛 전설',
          'artist': 'HanStone',
          'url': 'http://mabinogi.vod.nexoncdn.co.kr/music/Title_Open_Ver.mp3',
          'cover': 'http://s.nx.com/s2/game/mabinogi/mabiweb/homepage/images/music/thum/27.jpg'
        },
        {
          'name': '마비노기 - 소원',
          'artist': 'HanStone',
          'url': 'http://mabinogi.vod.nexoncdn.co.kr/music/NPC_Guide.mp3',
          'cover': 'http://s.nx.com/s2/game/mabinogi/mabiweb/homepage/images/music/thum/01.jpg'
        },
        {
          'name': '마비노기 - 장엄한 광경',
          'artist': 'HanStone',
          'url': 'http://mabinogi.vod.nexoncdn.co.kr/music/cutscene11.mp3',
          'cover': 'http://s.nx.com/s2/game/mabinogi/mabiweb/homepage/images/music/thum/01.jpg'
        },
        {
          'name': '마비노기 - 최종무곡(最終舞曲)',
          'artist': 'HanStone',
          'url': 'http://mabinogi.vod.nexoncdn.co.kr/music/Boss_FDG.mp3',
          'cover': 'http://s.nx.com/s2/game/mabinogi/mabiweb/homepage/images/music/thum/01.jpg'
        },
        {
          'name': '마비노기 - 팔리아스의 성좌',
          'artist': 'HanStone',
          'url': 'http://mabinogi.vod.nexoncdn.co.kr/music/Boss_Nuadha.mp3',
          'cover': 'http://s.nx.com/s2/game/mabinogi/mabiweb/homepage/images/music/thum/03.jpg'
        },
        {
          'name': 'エアーマンが倒せない (에어맨이 쓰러지지 않아)',
          'artist': 'Team.ねこかん【猫】',
          'url': "https://www.mboxdrive.com/can't_defeat_airman.mp3",
          'cover': 'https://lh3.googleusercontent.com/proxy/xC-rCAYaBVrgr3dHD02--Qx3MpmIkrxgAnQz3ej1UcpzEvJg7A91Ia23BPoERpprp_BmfAh79Ia7W9goFGecDPYshQgk6HPkXQ0iaqfDbc2GAZwECeVqXDzwK3K_SrqlQn_zAj1cA949ZcfQAUoK-86lX3TtN3VLV6o7ou3B3vqT9es'
        }
      ]
    }
  }
}
</script>
