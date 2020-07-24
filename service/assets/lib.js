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
        case 'skyrim':
            name = '스카이림 갤러리'
            break
        case 'honkai3':
            name = '붕괴3 갤러리'
            break
        case 'monmusu':
            name = '몬무스 갤러리'
            break
        case 'langrisser':
            name = '랑그랏사 갤러리'
            break
        case 'tsukutu':
            name = '쯔꾸르 갤러리'
            break
        default:
            name = domain + ' 갤러리'
            break
    }
    return name
}