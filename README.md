# HappyCoder

HappyCoder是VSCode平台上的扩展插件，可以实现通过描述生成代码、自动补全代码等一系列功能。

Happy Coding!

<video width="320" height="240" controls>
    <source src="https://raw.githubusercontent.com/baday19/HappyCoder/refs/heads/main/doc/demo.mp4" type="video/mp4">
</video>


## 基本用法

需保证VSCode版本 >= 1.94.0。安装插件并全局激活HappyCoder，有以下功能：

- 自动代码补全：保持HappyCoder处于激活状态，当您停止输入时，会从当前光标处开始生成。生成完毕之后会以灰色显示，按`Tab`即可插入生成结果。
- 主动代码补全：选取代码片段，然后按下`Alt+T` (或在编辑区的右键菜单中选择`代码补全`)，HappyCoder将基于您选择的代码片段插入续写的代码。
- 提示代码生成：选择需要作为输入的代码，然后按下`Ctrl+Alt+T`触发提示代码生成，会显示一个输入框，在输入框中输入的内容将与选择的代码按照一定的模板进行生成。
- 生成模型对话：在侧边栏点击`魔法棒`进入HappyCoder聊天界面，输入任何想问的问题，HappyCoder都会一一解答。

## 使用指南

以下是HappyCoder几种功能的详细用法：

### 自动代码补全

在该功能中，HappyCoder将在您停止输入时，从光标处开始生成（。生成完毕之后会以灰色显示，按`Tab`即可插入生成结果。 在生成多个候选的情况下，可以使用`Alt/Option+[` 或 `]`在几个候选间进行切换。如果你对现有建议不满意，可以使用`Alt/Option+N`去获得新的候选。
![auto](https://github.com/baday19/HappyCoder/blob/main/doc/demo-auto.gif?raw=true)

### 主动代码补全

在该功能中，您可以选取代码片段，然后按下`Alt+T` (或在编辑区的右键菜单中选择`代码补全`)，HappyCoder将基于您选择的代码片段插入续写的代码。
![complete](https://github.com/baday19/HappyCoder/blob/main/doc/demo-complete.gif?raw=true)

### 提示代码生成

在该功能中，您可以在输入中添加额外的提示来实现一些有趣的功能，包括并不限于代码解释、概括、以特定风格生成等。选择您想要的代码，按`Ctrl+Alt+T`触发提示代码生成，输入额外的提示，最后模型将根据`[INPUT]+[CODE]`的模板组织输入提供给模型进行生成。其中，`[INPUT]`是指您在输入框输入的内容，`[CODE]`是指您选择的代码。
![prompt](https://github.com/baday19/HappyCoder/blob/main/doc/demo-prompt.gif?raw=true)

### 生成模型对话

在该功能中，您可以与HappyCoder的聊天模型进行对话实现各种功能，包括解释代码、生成注释等。您只需要将问题输入在下方的输入框后，按下`enter`即可发送信息，HappyCoder将根据您的问题生成对应的内容。
![chat](https://github.com/baday19/HappyCoder/blob/main/doc/demo-chat.gif?raw=true)

## NOTE

本仓库是HappyCoder的VSCode扩展插件的源代码。

```shell
# 安装依赖
npm install
# 启动服务实时监听
npm run watch
# 调试插件：在VSCode中Run

# 插件打包
vsce package
```



**draft**

```shell
CUDA_VISIBLE_DEVICES="6" python -u -m vllm.entrypoints.openai.api_server --host 0.0.0.0 --model /nasdata/Model/deepseek-coder-6.7b-instruct --served-model-name instruct --tensor-parallel-size 1 --port 7888 --max_model_len 8192 --dtype bfloat16
```



```shell
curl http://localhost:7888/v1/chat/completions \
    -H "Content-Type: application/json" \
    -d '{
        "model": "instruct",
        "messages": [
      {"role": "system", "content": "You are a helpful assistant."},
      {"role": "user", "content": "quick sort"}
    ]
    }'
```

```shell
curl http://localhost:7888/v1/completions \
    -H "Content-Type: application/json" \
    -d '{
        "model": "instruct",
        "prompt": "# quick sort",
        "max_tokens": 128,
        "temperature": 0
    }'
```

