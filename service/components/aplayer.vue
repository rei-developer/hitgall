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
        //https://docs.google.com/uc?export=open&id=오디오파일 고유 아이디
        //https://drive.google.com/uc?id=이미지 파일 아이디
        {
          'name': 'Dirty Party',
          'artist': '輝夜月',
          'url': 'https://storage.googleapis.com/idolboard/4/Dirty%20Party.mp3',
          'cover': 'https://storage.googleapis.com/idolboard/4/600x600bb.jpg'
        }, {
          'name': 'joyful',
          'artist': '輝夜月',
          'url': 'https://storage.googleapis.com/idolboard/4/Joyful.mp3',
          'cover': 'https://storage.googleapis.com/idolboard/4/600x600bb.jpg'
        }, {
          'name': 'kick kick kick',
          'artist': '輝夜月',
          'url': 'https://storage.googleapis.com/idolboard/4/Kick%20Kick%20Kick.mp3',
          'cover': 'https://storage.googleapis.com/idolboard/4/600x600bb.jpg'
        }, {
          'name': '繰り返し一粒',
          'artist': 'namarin',
          'url': 'https://storage.googleapis.com/idolboard/4/%E3%80%90nami%E3%80%91%20One%20of%20Repetition%20-%E3%80%8C%E7%B9%B0%E3%82%8A%E8%BF%94%E3%81%97%E4%B8%80%E7%B2%92%20%E3%80%8D%E3%82%92%E6%AD%8C%E3%81%A3%E3%81%A6%E3%81%BF%E3%81%9F.mp3',
          //'cover': 'https://storage.googleapis.com/idolboard/4/600x600bb.jpg'
        }, {
          'name': '恋は渾沌の隷也',
          'artist': '後ろから這いより隊G',
          'url': 'https://storage.googleapis.com/idolboard/4/%EA%B8%B0%EC%96%B4%EC%99%80%EB%9D%BC%20%EB%83%90%EB%A3%A8%EC%BD%94%EC%96%91%202%EA%B8%B0%20op(%EC%82%AC%EB%9E%91%EC%9D%80%20%ED%98%BC%EB%8F%88%EC%9D%98%20%EB%85%B8%EC%98%88).mp3',
          //'cover': 'https://storage.googleapis.com/idolboard/4/600x600bb.jpg'
        }, {
          'name': 'ねむるまち',
          'artist': 'yama',
          'url': 'https://storage.googleapis.com/idolboard/3/%E3%81%AD%E3%82%80%E3%82%8B%E3%81%BE%E3%81%A1%20feat.yama%20%20(Official%20Video).mp3'
        }, {
          'name': '泥中に咲く',
          'artist': 'ウォルピスカーター',
          'url': 'https://storage.googleapis.com/idolboard/3/%E3%82%A6%E3%82%A9%E3%83%AB%E3%83%94%E3%82%B9%E3%82%AB%E3%83%BC%E3%82%BF%E3%83%BC%20MV%20%E3%80%8E%E6%B3%A5%E4%B8%AD%E3%81%AB%E5%92%B2%E3%81%8F%E3%80%8F.mp3'
        }, {
          'name': 'prince',
          'artist': 'さなり',
          'url': 'https://storage.googleapis.com/idolboard/3/prince%20%E3%81%95%E3%81%AA%E3%82%8A.mp3',
          //'cover': 'https://storage.googleapis.com/idolboard/2/600x600bb%20(1).jpg'
        }, {
          'name': '春ひさぎ',
          'artist': 'ヨルシカ',
          'url': 'https://storage.googleapis.com/idolboard/3/%E3%83%A8%E3%83%AB%E3%82%B7%E3%82%AB%20-%20%E6%98%A5%E3%81%B2%E3%81%95%E3%81%8E%EF%BC%88OFFICIAL%20VIDEO%EF%BC%89.mp3'
        }, {
          'name': 'かくれんぼ',
          'artist': '優里',
          'url': 'https://storage.googleapis.com/idolboard/2/%E5%84%AA%E9%87%8C%E3%80%8C%E3%81%8B%E3%81%8F%E3%82%8C%E3%82%93%E3%81%BC.mp3',
          'cover': 'https://storage.googleapis.com/idolboard/2/600x600bb%20(6).jpg'
        }, {
          'name': 'prover',
          'artist': 'milet',
          'url': 'https://storage.googleapis.com/idolboard/2/Prover.mp3',
          'cover': 'https://storage.googleapis.com/idolboard/2/600x600bb.jpg'
        }, {
          'name': '月光浴',
          'artist': 'ダズビー',
          'url': 'https://storage.googleapis.com/idolboard/3/%E6%9C%88%E5%85%89%E6%B5%B4%20(%E6%9F%B4%E7%94%B0%E6%B7%B3)%20%EF%BC%8F%E3%83%80%E3%82%BA%E3%83%93%E3%83%BC%20COVER.mp3'
        }, {
          'name': '灯火',
          'artist': 'Vaundy',
          'url': 'https://storage.googleapis.com/idolboard/3/%E7%81%AF%E7%81%AB.mp3'
        }, {
          'name': 'pretender',
          'artist': 'Officail髭男dism',
          'url': 'https://storage.googleapis.com/idolboard/3/Official%E9%AB%AD%E7%94%B7dism%20-%20Pretender%EF%BC%BBOfficial%20Video%EF%BC%BD.mp3',
          //'cover': 'https://storage.googleapis.com/idolboard/1/artworks-000643649881-rnm6pi-t500x500.jpg'
        }, {
          'name': 'some Like it hot',
          'artist': 'SPYAIR',
          'url': 'https://storage.googleapis.com/idolboard/3/SPYAIR%20-%20Some%20Like%20It%20Hot!!.mp3',
          //'cover': 'https://storage.googleapis.com/idolboard/1/artworks-000643649881-rnm6pi-t500x500.jpg'
        }, {
          'name': 'クズ',
          'artist': 'GADORO',
          'url': 'https://storage.googleapis.com/idolboard/2/GADORO%20%20%20%E3%82%AF%E3%82%BA.mp3',
          'cover': 'https://storage.googleapis.com/idolboard/2/600x600bb%20(7).jpg'
        }, {
          'name': 'Sincerely',
          'artist': 'TRUE',
          'url': 'https://storage.googleapis.com/idolboard/2/sincerly',
          'cover': 'https://storage.googleapis.com/idolboard/2/600x600bb%20(10).jpg'
        }, {
          'name': '君がくれた夏',
          'artist': '家入レオ',
          'url': 'https://storage.googleapis.com/idolboard/3/%E5%90%9B%E3%81%8C%E3%81%8F%E3%82%8C%E3%81%9F%E5%A4%8F%20-%20%E5%AE%B6%E5%85%A5%E3%83%AC%E3%82%AA%EF%BC%88%E3%83%95%E3%83%AB%EF%BC%89.mp3'
        }, {
          'name': '僕が死のうと思ったのは',
          'artist': 'amazarashi',
          'url': 'https://storage.googleapis.com/idolboard/3/%E3%80%8C%EB%82%B4%EA%B0%80%20%EC%A3%BD%EC%9C%BC%EB%A0%A4%EA%B3%A0%20%EC%83%9D%EA%B0%81%ED%95%9C%20%EA%B2%83%EC%9D%80%20%20%20%20%E5%83%95%E3%81%8C%E6%AD%BB%E3%81%AE%E3%81%86%E3%81%A8%E6%80%9D%E3%81%A3%E3%81%9F%E3%81%AE%E3%81%AF%E3%80%8D%20%E2%94%82Covered%20by%20%EB%8B%AC%EB%A7%88%EB%B0%9C.mp3'
        }, {
          'name': 'DREAM TEAM TRIANGLE',
          'artist': '冴えないヒロインの育て方',
          'url': 'https://storage.googleapis.com/idolboard/1/DREAM%20TEAM%20TRIANGLE.mp3',
          'cover': 'https://storage.cloud.google.com/idolboard/1/artworks-000643649881-rnm6pi-t500x500.jpg?folder&hl=ko&organizationId'
        }, {
          'name': 'tell me',
          'artist': 'milet',
          'url': 'https://storage.googleapis.com/idolboard/2/Tell%20me%20-%20milet.mp3',
          'cover': 'https://storage.googleapis.com/idolboard/2/600x600bb%20(3).jpg'
        }, {
          'name': '独りうた ～September調子はどうだい～',
          'artist': 'MASAZAYN Cover',
          'url': 'https://storage.googleapis.com/idolboard/2/%E7%8B%AC%E3%82%8A%E3%81%86%E3%81%9F%20%EF%BD%9ESeptember%E8%AA%BF%E5%AD%90%E3%81%AF%E3%81%A9%E3%81%86%E3%81%A0%E3%81%84%EF%BD%9E%20(MASAZAYN%20Cover).mp3',
          'cover': 'https://storage.googleapis.com/idolboard/2/600x600bb%20(2).jpg'
        }, {
          'name': '未来になれなかった夜に',
          'artist': 'Amazarashi',
          'url': 'https://storage.googleapis.com/idolboard/1/Amazarashi%20-%20%E6%9C%AA%E6%9D%A5%E3%81%AB%E3%81%AA%E3%82%8C%E3%81%AA%E3%81%8B%E3%81%A3%E3%81%9F%E3%81%82%E3%81%AE%E5%A4%9C%E3%81%AB.mp3',
          'cover': 'https://storage.googleapis.com/idolboard/1/600x600bb.jpg'
        }, {
          'name': 'chocolate',
          'artist': 'ちゃんみな',
          'url': 'https://storage.googleapis.com/idolboard/1/CHANMINA%20(%E3%81%A1%E3%82%83%E3%82%93%E3%81%BF%E3%81%AA)%20-%20Chocolate%20(JPN%2C%20ROM%2C%20ENG)%20Lyrics.mp3',
          'cover': 'https://storage.googleapis.com/idolboard/1/600x600bb%20(1).jpg'
        }, {
          'name': 'wonderland',
          'artist': 'iri',
          'url': 'https://storage.googleapis.com/idolboard/1/iri%20-%20Wonderland.mp3',
          'cover': 'https://storage.googleapis.com/idolboard/1/600x600bb%20(2).jpg'
        }, {
          'name': '호랑수월가',
          'artist': '달마밤',
          'url': 'https://storage.googleapis.com/idolboard/3/%E3%80%8C%ED%98%B8%EB%9E%91%EC%88%98%EC%9B%94%EA%B0%80%E3%80%8D%20%E2%94%82Cover%20by%20Darlim%26Hamabal.mp3'
        }, {
          'name': 'アイデア',
          'artist': '星野源 cover by 달마밤',
          'url': 'https://storage.googleapis.com/idolboard/2/%E3%82%A2%E3%82%A4%E3%83%87%E3%82%A2%20-%20%E6%98%9F%E9%87%8E%E6%BA%90.mp3',
          'cover': 'https://storage.googleapis.com/idolboard/2/600x600bb%20(8).jpg'
        }, {
          'name': 'やっぱり雨は降るんだね',
          'artist': 'ツユ',
          'url': 'https://storage.googleapis.com/idolboard/4/%E3%83%84%E3%83%A6%20-%20%E3%82%84%E3%81%A3%E3%81%B1%E3%82%8A%E9%9B%A8%E3%81%AF%E9%99%8D%E3%82%8B%E3%82%93%E3%81%A0%E3%81%AD%20MV.mp3',
          //'cover': 'https://storage.googleapis.com/idolboard/4/600x600bb.jpg'
        }, {
          'name': 'アイロに',
          'artist': 'かの',
          'url': 'https://storage.googleapis.com/idolboard/3/%E3%80%8E%E3%82%A2%E3%82%A4%E3%83%AD%E3%83%8B%20%20%20%E5%8F%8D%E8%AA%9E%E3%80%8F%E3%80%90%E9%B9%BF%E4%B9%83(%E3%81%8B%E3%81%AE)%E3%80%91%E4%B8%AD%E8%8B%B1%E6%97%A5%E7%BE%85%E5%AD%97%E5%B9%95.mp3'
        }, {
          'name': 'あなたに出会わなければ',
          'artist': 'Aimer',
          'url': 'https://storage.googleapis.com/idolboard/3/%E3%80%90HD%E3%80%91Sleepless%20Nights%20-%20Aimer%20-%20%E3%81%82%E3%81%AA%E3%81%9F%E3%81%AB%E5%87%BA%E4%BC%9A%E3%82%8F%E3%81%AA%E3%81%91%E3%82%8C%E3%81%B0%EF%BD%9E%E5%A4%8F%E9%9B%AA%E5%86%AC%E8%8A%B1%EF%BD%9E%E3%80%90%E4%B8%AD%E6%97%A5%E5%AD%97%E5%B9%95%E3%80%91.mp3'
        }, {
          'name': '心拍数',
          'artist': 'かの',
          'url': 'https://storage.googleapis.com/idolboard/3/%E3%80%90HD%E3%80%91one%20-%20%E9%B9%BF%E4%B9%83%20-%20%E5%BF%83%E6%8B%8D%E6%95%B0%230822.mp3'
        }, {
          'name': 'だから僕は音楽をやめた',
          'artist': 'ヨルシカ',
          'url': 'https://storage.googleapis.com/idolboard/3/%E3%83%A8%E3%83%AB%E3%82%B7%E3%82%AB%20-%20%E3%81%A0%E3%81%8B%E3%82%89%E5%83%95%E3%81%AF%E9%9F%B3%E6%A5%BD%E3%82%92%E8%BE%9E%E3%82%81%E3%81%9F%20(Music%20Video).mp3'
        }, {
          'name': 'daisy',
          'artist': 'Stereo Dive Foundation',
          'url': 'https://storage.googleapis.com/idolboard/2/01.%20Daisy.flac',
          'cover': 'https://storage.googleapis.com/idolboard/2/cover.jpg'
        }, {
          'name': '17才',
          'artist': 'ハルカトミユキ',
          'url': 'https://storage.googleapis.com/idolboard/3/%E4%BE%86%E8%87%AA%E7%B9%BD%E7%B4%9B%E4%B8%96%E7%95%8C%E7%9A%84%E6%98%8E%E6%97%A5OP%20%E3%83%8F%E3%83%AB%E3%82%AB%E3%83%88%E3%83%9F%E3%83%A6%E3%82%AD%20-%20%E3%80%8C%2017%E6%89%8D%E3%80%8D%E3%80%90%E4%B8%AD%E6%97%A5%E6%AD%8C%E8%A9%9E%E3%80%91.mp3'
        }, {
          'name': 'Remember',
          'artist': 'Uru',
          'url': 'https://storage.googleapis.com/idolboard/3/%E5%8A%87%E5%A0%B4%E7%89%88%E3%80%8A%E5%A4%8F%E7%9B%AE%E5%8F%8B%E4%BA%BA%E5%B8%B3-%E7%B7%A3%E7%B5%90%E7%A9%BA%E8%9F%AC%E3%80%8B%E4%B8%BB%E9%A1%8C%E6%9B%B2%20Uru%20-%20%E3%80%8C%20remember%E3%80%8D%E3%80%90%E4%B8%AD%E6%97%A5%E6%AD%8C%E8%A9%9E%E3%80%91.mp3'
        }, {
          'name': '４月は君の嘘',
          'artist': '４月は君の嘘　OP',
          'url': 'https://storage.googleapis.com/idolboard/3/Opening%20Shigatsu%20wa%20Kimi%20no%20Uso%201%20Full%20Lyrics%20HD.mp3',
          //'cover': 'https://storage.googleapis.com/idolboard/1/artworks-000643649881-rnm6pi-t500x500.jpg'
        }, {
          'name': '大丈夫',
          'artist': 'RADWIMPS',
          'url': 'https://storage.googleapis.com/idolboard/3/%E5%A4%A7%E4%B8%88%E5%A4%AB%20RADWIMPS%20MV.mp3'
        }, {
          'name': '幽霊東京',
          'artist': 'くろくも',
          'url': 'https://storage.googleapis.com/idolboard/3/%E5%B9%BD%E9%9C%8A%E6%9D%B1%E4%BA%AC%20(Aayase)%20-%20cover%20by%20%E3%81%8F%E3%82%8D%E3%81%8F%E3%82%82.mp3'
        }, {
          'name': '米津玄師',
          'artist': 'Lemon',
          'url': 'https://storage.googleapis.com/idolboard/3/%EC%9A%94%EB%84%A4%EC%A6%88%20%EC%BC%84%EC%8B%9C%20Lemon%20%5B%EC%9D%BC%EB%B3%B8%EC%96%B4%20%EB%B0%9C%EC%9D%8C%20%ED%95%9C%EA%B5%AD%EC%96%B4%5D.mp3'
        }
      ]
    }
  }
}
</script>
