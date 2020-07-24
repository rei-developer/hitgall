module.exports.getBoardName = domain => {
    let name = ''
    switch (domain) {
        case 'hit':
            name = 'HIT'
            break
        case 'all':
            name = '전체글'
            break
        case 'save':
            name = '외부 저장소'
            break
        case 'notice':
            name = '공지사항'
            break
        case 'feedback':
            name = '건의사항'
            break
        case 'talk':
            name = '토크'
            break
    }
    return name
}