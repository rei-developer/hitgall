module.exports = (input, allowed) => {
  allowed = (
    ((allowed || '') + '').toLowerCase().match(/<[a-z][a-z0-9]*>/g) || []
  ).join('')
  const tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi
  const commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi
  return input
    .replace(commentsAndPhpTags, '')
    .replace(tags, ($0, $1) => {
      return allowed.indexOf('<' + $1.toLowerCase() + '>') > -1
        ? $0
        : ''
    })
}
