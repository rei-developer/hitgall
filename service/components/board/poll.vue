<template>
  <div>
    <span>{{ $moment(regdate).format('YYYY년 MM월 DD일') }}까지</span>
    <client-only>
      <vue-poll v-bind='options' @addvote='addVote'/>
    </client-only>
  </div>
</template>

<script>
export default {
  props: ['id'],
  data() {
    return {
      options: {
        question: '',
        answers: []
      },
      regdate: null
    }
  },
  mounted() {
    this.getVote()
  },
  methods: {
    getVote: async function () {
      const token = this.$store.state.user.token
      const data = await this.$axios.$get(
        `/api/poll/${this.id}`,
        {headers: {'x-access-token': token}}
      )
      if (data.status === 'fail')
        return
      this.options.answers = []
      const votes = []
      if (data.votes)
        data.votes.map(item => votes[item.selected] = item.count)
      const texts = data.poll.texts.split('|')
      texts.map((item, index) => {
        const vote = votes[index] || 0
        this.options.answers.push({
          value: index,
          pureText: item,
          text: `${item} (${vote})`,
          votes: vote,
          selected: data.selected === index
        })
      })
      this.options.question = data.poll.question
      this.regdate = data.poll.regdate
      const diff = this.$moment(new Date()).diff(this.$moment(this.regdate), 'days')
      if (diff > 0 || !data.possible)
        this.options.finalResults = true
    },
    async addVote(obj) {
      if (!this.$store.state.user.isLogged)
        return this.$toast.warning('로그인하세요.')
      const select = obj.value
      const token = this.$store.state.user.token
      const data = await this.$axios.$post(
        '/api/poll/vote',
        {id: this.id, select},
        {headers: {'x-access-token': token}}
      )
      if (data.status === 'fail')
        return this.$toast.error(data.message || '오류가 발생했습니다.')
      this.$toast.success('설문조사를 참여했습니다.')
      this.getVote()
    }
  }
}
</script>
