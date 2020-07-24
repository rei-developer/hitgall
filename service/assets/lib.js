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
        case 'anime':
            name = '애니동'
            break
        case 'game':
            name = '게임동'
            break
        case 'nendo':
            name = '넨도동'
            break
        case 'music':
            name = '음악동'
            break
        case 'draw':
            name = '그림동'
            break
        case 'news':
            name = '뉴스동'
            break
        case 'review':
            name = '리뷰동'
            break
    }
    return name
}