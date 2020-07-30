<template>
    <client-only>
        <aplayer
            :audio='audio'
            :fixed='true'
            :mini='true'
            :listFolded='true'/>
    </client-only>
</template>

<script>
    export default {
        data() {
            return {
                audio: [
                    {
                        'name': '响喜乱舞（Cover：MARiA）',
                        'artist': '泠鸢yousa',
                        'url': 'https://cdn.moefe.org/music/mp3/kyoukiranbu.mp3',
                        'cover': 'https://p1.music.126.net/AUGVPQ_rVrngDH9ocQrn3Q==/109951163613037822.jpg?param=300y300'
                    }, {
                        'name': '伴宅日记',
                        'artist': 'Hanser',
                        'url': 'https://cdn.moefe.org/music/mp3/diary.mp3',
                        'cover': 'https://p1.music.126.net/oW7TW0VjK5PoNjhzdPm1lw==/109951163626390573.jpg?param=300y300'
                    }, {
                        'name': '童遊',
                        'artist': 'めらみぽっぷ',
                        'url': 'https://cdn.moefe.org/music/mp3/innocenttreasures.mp3',
                        'cover': 'https://p1.music.126.net/tkazmUdvztqtaL-XDN4D2A==/5947258394962501.jpg?param=300y300'
                    }, {
                        'name': 'The Party We Have Never Seen',
                        'artist': 'Nana Takahashi',
                        'url': 'https://cdn.moefe.org/music/mp3/thepartywehaveneverseen.mp3',
                        'cover': 'https://p1.music.126.net/IwclpJu4gaqhSZrKunEFWg==/3297435379408525.jpg?param=300y300'
                    }, {
                        'name': 'Let It Go.m3u8',
                        'artist': 'Idina Menzel',
                        'url': 'https://cdn.moefe.org/music/hls/frozen.m3u8',
                        'cover': 'https://p1.music.126.net/n72JJkPg2-ENxhB-DsZ2AA==/109951163115400390.jpg?param=300y300'
                    }, {
                        'name': 'Star Sky',
                        'artist': 'Two Steps From Hell',
                        'url': 'https://cdn.moefe.org/music/mp3/starsky.mp3',
                        'cover': 'https://p2.music.126.net/nJROWeZiEp1TUv27amRguQ==/18195817928618786.jpg?param=300y300'
                    }
                ]
            }
        }
    }
</script>