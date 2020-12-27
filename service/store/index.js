export const state = () => ({
  forceUpdate: 0,
  topic: [],
  loading: false
})

export const mutations = {
  forceUpdate: state => ++state.forceUpdate,
  setTopic: (state, topic) => state.topic = topic,
  setLoading: (state, toggle = false) => state.loading = toggle
}
