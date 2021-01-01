module.exports.getBoardName = domain => {
    let name = ''
    switch (domain) {
        case 'hit':
            name = 'HIT'
            break
        case 'all':
            name = '전체글'
            break
        case 'notice':
            name = '공지사항'
            break
        case 'feedback':
            name = '건의사항'
            break
        case 'request':
            name = '갤러리 신청'
            break
        case 'girl':
            name = '연예 갤러리'
            break
        case 'anime':
            name = '애니메이션 갤러리'
            break
        case 'kawai3':
            name = '키아나 갤러리'
            break
        case 'lastorigin':
            name = '라스트 오리진 갤러리'
            break
        case 'koikatsu':
            name = '코이카츠 갤러리'
            break
        case 'skyrim':
            name = '베데스다 갤러리'
            break
        case 'monmusu':
            name = '몬무스 갤러리'
            break
        case 'tsukuru':
            name = '쯔꾸르 갤러리'
            break
        case 'yandere':
            name = '얀데레 갤러리'
            break
        case 'gfl':
            name = '소녀전선 갤러리'
            break
        case 'ar_knights':
            name = '명일방주 갤러리'
            break
        case 'epic7':
            name = '에픽세븐 갤러리'
            break
        case 'theaterdays':
            name = '밀리시타 갤러리'
            break
        case 'python':
            name = 'Python 갤러리'
            break
        case 'programming':
            name = '프로그래밍 갤러리'
            break
        default:
            name = domain + ' 갤러리'
            break
    }
    return name
}
