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
        case 'honkai3':
            name = '붕괴3 갤러리'
            break
        case 'monmusu':
            name = '몬무스 갤러리'
            break
        case 'langrisser':
            name = '랑그릿사 갤러리'
            break
        case 'tsukuru':
            name = '쯔꾸르 갤러리'
            break
        case 'counterside':
            name = '카운터사이드 갤러리'
            break
        case 'yandere':
            name = '얀데레 갤러리'
            break
        case 'gfl':
            name = '소녀전선 갤러리'
            break
        case 'mmd':
            name = 'MMD 갤러리'
            break
        case 'ai_girl':
            name = 'AI 소녀 갤러리'
            break
        case 'ar_knights':
            name = '명일방주 갤러리'
            break
        case 'epic7':
            name = '에픽세븐 갤러리'
            break
        case 'pmmm':
            name = '마법소녀 마도카 마기카 갤러리'
            break
        case 'girlcafe':
            name = '걸 카페 건 갤러리'
            break
        default:
            name = domain + ' 갤러리'
            break
    }
    return name
}