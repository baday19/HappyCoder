const instructUrl = 'http://localhost:7888/v1'
const md = window.markdownit()

const app = Vue.createApp({
  data: () => {
    return {
      activeNav: 0,
      chatHistories: [],
      chatMsg: '',
      thinking: false
    }
  },
  methods: {
    switchNav(idx) {
      this.activeNav = idx
    },
    async handleSend() {
      const chatItem = {
        role: 'user',
        content: this.chatMsg
      }
      this.chatHistories.push(chatItem)
      const tempMsg = this.chatMsg
      this.chatMsg = ''
      this.thinking = true
      const resMsg = await chatWithInstructLLM(tempMsg)
      this.thinking = false
      const resItem = {
        role: 'system',
        content: resMsg
      }
      this.chatHistories.push(resItem)
      const eId = document.getElementById('chat-scroll')
      if (eId) {
        setTimeout(() => {
          eId.scrollTop = eId.scrollHeight
        }, 100);
      }
    }
  }
})

app.mount("#app")

const chatWithInstructLLM = async (prompt) => {
  const formData = {
    model: 'instruct',
    messages: [
      { "role": "system", "content": "You are a helpful assistant." },
      { "role": "user", "content": prompt }
    ]
  }
  const response = await POST('http://localhost:7888/v1/chat/completions', formData)
  const data = await response.json()
  const choice = data['choices'][0]
  const ans = choice['message']['content']
  const markedAns = md.render(ans)
  return markedAns
}

const POST = async (url, data) => {
  try {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    };
    const res = await fetch(url, options);
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    return res
  } catch (error) {
    console.log(error)
  }
}