// import axios from "axios"

const instructUrl = 'http://localhost:7888/v1'
const codeUrl = 'http://localhost:7889/v1'

const chatWithInstructLLM = async (prompt: string) => {
  const formData = {
    model: 'instruct',
    messages: [
      {"role": "system", "content": "You are a helpful assistant."},
      {"role": "user", "content": prompt}
    ]
  }
  const response = await POST(`${instructUrl}/chat/completions`, formData)
  const data: any = await response.json()
  const choice = data['choices'][0]
  const ans =  choice['message']['content']
  return ans
}

const callInstructLLM = async (prompt: string) => {
  const formData = {
    model: "instruct",
    prompt: prompt,
    max_tokens: 256,
    temperature: 0
  }
  const response = await POST(`${instructUrl}/completions`, formData)
  const data: any = await response.json()
  const choices = data['choices']
  const ans =  choices.map((item: any) => {
    return item['text']
  })
  return ans
}

const callLLM = async (prompt: string, needStop=true) => {
  const formData = {
    model: "code",
    prompt: prompt,
    max_tokens: 128,
    temperature: 0,
    stop: needStop?["\nclass", "\ndef", "\nprint"]:[]
  }
  const response = await POST(`${codeUrl}/completions`, formData)
  const data: any = await response.json()
  const choices = data['choices']
  const ans =  choices.map((item: any) => {
    return item['text']
  })
  return ans
}

const GET = async (url: string): Promise<Response> => {
  try {
    // 使用 fetch 发送 GET 请求  
    const response = await fetch(url);

    // 检查响应状态码  
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return response;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error; // 重新抛出错误以便上层调用者处理  
  }
}

const POST = async (url: string, data: any) => {
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
}

export {
  callLLM,
  callInstructLLM,
  chatWithInstructLLM
}