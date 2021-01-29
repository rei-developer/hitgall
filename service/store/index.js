export const state = () => ({
  forceUpdate: 0,
  topic: [],
  isDesktop: false,
  loading: false
})

export const mutations = {
  forceUpdate: state => ++state.forceUpdate,
  screenWidth: (state, screenWidth) => state.isDesktop = screenWidth >= 1200,
  setTopic: (state, topic) => state.topic = topic,
  setLoading: (state, toggle = false) => state.loading = toggle
}
