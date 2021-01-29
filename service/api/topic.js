const PATH = '/api/topic'

module.exports.getTopicWidgetList = async ($axios, sidebar = false) => {
  try {
    const data = await $axios.$get(`${PATH}/widget?sidebar=${sidebar ? 'Y' : 'N'}`)
    if (!data)
      return false
    return data
  } catch (error) {
    console.error(error)
    return false
  }
}

module.exports.getTopicThumbList = async $axios => {
  try {
    const data = await $axios.$get(`${PATH}/thumb`)
    if (!data)
      return false
    return data
  } catch (error) {
    console.error(error)
    return false
  }
}

module.exports.getTopicContent = async (idx, $axios) => {
  try {
    const data = await $axios.$get(`${PATH}/${idx}`)
    if (!data)
      return false
    return data
  } catch (error) {
    console.error(error)
    return false
  }
}

module.exports.getTopicList = async (args, $axios) => {
  try {
    const data = await $axios.$post(PATH, args)
    if (!data)
      return false
    return data
  } catch (error) {
    console.error(error)
    return false
  }
}
