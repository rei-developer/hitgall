const filter = (input, allowed) => {
    allowed = (
        ((allowed || '') + '').toLowerCase().match(/<[a-z][a-z0-9]*>/g) || []
    ).join('')
    var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi
    var commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi
    return input
        .replace(commentsAndPhpTags, '')
        .replace(tags, ($0, $1) => {
            return allowed.indexOf('<' + $1.toLowerCase() + '>') > -1
                ? $0
                : ''
        })
}

module.exports.disable = text => {
    text = text.replace(/<\/?([a-z][a-z0-9]*)\b[^>]*>/gi, ``)
    return text
}

module.exports.topic = text => {
    text = filter(
        text,
        `<video><p><pre><q><br><a><b><h1><h2><h3><h4><h5><h6><hr><span><strong><em><u><s><sub><sup><address><ol><ul><li><blockquote><img><iframe><embed><object><param><table><tbody><tr><td><code><audio><source>`
    )
    text = text.replace(
        /(http(s)?:\/\/)?(www.)?youtube.com\/watch\?v=([a-zA-Z0-9\-_]+)(\&amp;feature=youtu.be)?(\&amp;list=[a-zA-Z0-9\-_]+)?(\&amp;index=(\d+))?(\&amp;t=(\d+))?/gi,
        `<p class='embed-youtube'><iframe src='//www.youtube.com/embed/$4$9' allowfullscreen='allowfullscreen'></iframe></p>`
    )
    text = text.replace(
        /(http(s)?:\/\/)?(www.)?youtu.be\/([a-zA-Z0-9\-_]+)(\?list=[a-zA-Z0-9\-_]+)?(\?t=(\d+))?/gi,
        `<p class='embed-youtube'><iframe src='//www.youtube.com/embed/$4$5$6' allowfullscreen='allowfullscreen'></iframe></p>`
    )
    text = text.replace(
        /<iframe width="(\d+)" height="(\d+)" src="https:\/\/www.youtube.com\/embed\/([a-zA-Z0-9\-_]+)(\?list=[a-zA-Z0-9\-_]+)?(\?start=(\d+))?" (frameborder="(\d+)")? (allow="accelerometer;)? (autoplay;)? (encrypted-media;)? (gyroscope;)? (picture-in-picture")? (allowfullscreen(="")?)?><\/iframe>/gi,
        `<p class='embed-youtube'><iframe src='//www.youtube.com/embed/$3$4$5' allowfullscreen='allowfullscreen'></iframe></p>`
    )
    text = text.replace(
        /((http(s)?:\/\/)?(www.)?twitter(\.[^(\n|\t|\s,)]+)+)+$/gi,
        `<p><a href="$&" target='_blank'>$&</a></p><p><blockquote class='twitter-tweet' data-lang='ko'><a href="$&"></a></blockquote><script async src='https://platform.twitter.com/widgets.js' charset='utf-8'></script></p><br><br>`
    )
    // text = text.replace(
    //     /((http(s)?:\/\/)?(www.)?instagram(\.[^(\n|\t|\s,)]+)+)+$/gi,
    //     `<p><a href="$&" target='_blank'>$&</a></p><p><blockquote
    // class='instagram-media' data-instgrm-permalink='$&' data-instgrm-version='12'
    // style=' max-width:540px; min-width:326px; width:99.375%;
    // width:-webkit-calc(100% - 2px); width:calc(100% - 2px);'></blockquote><script
    // async defer src='//platform.instagram.com/en_US/embeds.js'></script></p>`
    // )
    // text = text.replace(
    //     /(http(s)?:\/\/)?(thumbs.)?gfycat.com\/(ko\/)?([a-zA-Z0-9\_]+)(-mobile.mp4)?/gi,
    //     `<div style='position:relative; padding-bottom:100%'><iframe
    // src='https://gfycat.com/ifr/$5' scrolling='no'
    // style='position:absolute;top:0;left:0;display:block; width:100vw; height:
    // 50vh' allowfullscreen></iframe></div>`
    // )
    text = text.replace(
        /(http(s)?:\/\/)?(thumbs.)?gfycat.com\/(ko\/)?([a-zA-Z0-9\_]+)(-mobile.mp4)?/gi,
        `<iframe src='https://gfycat.com/ifr/$5' frameborder='0' scrolling='no' allowfullscreen width='560' height='400'></iframe>`
    )
    text = text.replace(
        /\[\[\s*hy(\d+)\]\]/gi,
        `<a href="https://hiyobi.me/reader/$1" target='_blank' class='hitomiReader'>hiyobi:$1</a>`
    )
    text = text.replace(
        /\[\[\s*ht(\d+)\]\]/gi,
        `<a href="https://hitomi.la/reader/$1.html" target='_blank' class='hitomiReader'>hitomi:$1</a>`
    )
    text = text.replace(
        /\[\[\s*av([a-zA-Z0-9\_-]+(\d+))\]\]/gi,
        `<a href="https://www.avdbs.com/menu/dvd_list.php?_kwd=$1" target='_blank' class='hitomiReader'>av:$1</a>`
    )
    text = text.replace(/^\s+|\s+$/g, ``)
    return text
}

module.exports.post = text => {
    text = text.replace(/^\s+|\s+$/g, ``)
    text = text.replace(/<\/?([a-z][a-z0-9]*)\b[^>]*>/gi, ``)
    text = text.replace(/\n/g, ` <br>`)
    text = filter(
        text,
        `<p><pre><q><br><a><b><h1><h2><h3><h4><h5><h6><hr><span><strong><em><u><s><sub><sup><address><ol><ul><li><blockquote><img><iframe><embed><object><param><table><tbody><tr><td><code><audio><source>`
    )
    text = text.replace(
        /((http(s)?:\/\/)?(www.)?twitter(\.[^(\n|\t|\s,)]+)+)+$/gi,
        `<p><a href="$&" target='_blank'>$&</a></p><p><blockquote
		class='twitter-tweet' data-lang='ko'><a href="$&"></a></blockquote><script
		async src='https://platform.twitter.com/widgets.js'
		charset='utf-8'></script></p>`)
    return text
}