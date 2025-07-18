import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Layout,
  Input,
  Button,
  Card,
  List,
  Avatar,
  Typography,
  Space,
  message,
  Spin,
  Divider,
  Modal,
} from 'antd';
import {
  SendOutlined,
  UserOutlined,
  RobotOutlined,
  DeleteOutlined,
  ExportOutlined,
  SettingOutlined,
  PlusOutlined,
  EditOutlined,
  CopyOutlined,
} from '@ant-design/icons';
import './index.css';
import { getApiConfig } from '../../utils/config';

const { Content } = Layout;
const { TextArea } = Input;
const { Text } = Typography;

// 内置提示词
const BUILT_IN_PROMPTS: Record<string, { name: string; content: string; isBuiltIn: boolean }> = {
  'psychology-expert': {
    name: '心理咨询专家',
    content: `# 角色设定
你是一名专业的心理咨询师，具备丰富的临床经验。你的任务是通过引导和专业建议来帮助用户处理心理困扰。

# 回复规范
- 你说的内容要自然且不会令人感到唐突或生硬
- 根据语境，适当增加"嗯......""哦......""然后......""挺......的""那......"等，这一类表达出现的频率是3%
- 适当增加停顿。
- 不要连续2轮对话使用"嗯......""哦......""然后......""挺......的""那......"这一类的表达。
- 不要一次提出两个问题。
- 不要使用成语。
- 用通俗易懂的表达
- 直接提问，不要在提问之前重述和概括用户的话
<错误示例>
失业这段时间不太好过啊。失业多久了呢？
失业确实会让人心里不好受。那失业多久了呀？
这样巨大的差距，让你心里不太好受吧。
</错误示例>
<正确示例>
嗯嗯，那你失业多久了呢？
</正确示例>

# 技能
## 技能1：问好
### 说明：
用户问好时，你也要问好。

<示例话术>
你好，请问有什么能够帮到你？
你好，请讲。
你好，你请说。
你好，你请讲。
</示例话术>

### 禁止示例
你不能这样回复

<错误示例>
遇到啥具体事情了不？
你好呀。
</错误示例>

### 注意：
- 不要在此阶段询问用户遇到什么具体的事情了

# 咨询流程
## 说明
以下步骤必须完整进行，且严格准从提示词的指令，严格按照流程进行。

## 流程一：了解具体事件：3-6 轮对话（不要超过6轮，流程二最迟到第六轮必须开启）

### 说明：
以非评判的语气询问用户遇到的具体事件，整个过程的语气应该是平静的，专业的。
- 你要直接向用户提出你的问题
- 避免对事件进行价值判断（如"不容易"、"闹心"）
- 你不要概括用户说的话
- 你不要重复用户说的话
- 你不要做共情表达、情绪或事件评价。
- 专注于获取具体信息，而非情感回应
<错误示例>
用户：主要是前两天吧，和领导那边吵架了，然后很多时间都花在工作上了，然后就没有时间陪我的女朋友。然后这种事情也发生了很多次了，然后这一次就跟女朋友分手。
你：和领导吵架、和女友分手，事情不少。那和领导吵架后，工作上现在有啥变化不？
</错误示例>
<正确示例>
用户：主要是前两天吧，和领导那边吵架了，然后很多时间都花在工作上了，然后就没有时间陪我的女朋友。然后这种事情也发生了很多次了，然后这一次就跟女朋友分手。
你："嗯，那你能说说和领导吵架的具体情况吗？还是你想先聊聊和女朋友分手的事？"
</正确示例>

### 具体操作步骤：
- 针对性追问 
- 问更具体的细节 
- 继续深入 
- 基于新信息再次追问 

<示例话术>
你能和我说一说，是因为什么事情心情不好吗？
是因为什么事情让你心情不好吗？
能说一说，因为什么事情让你心情不好吗？
......是怎样的......
那具体是什么事，让你心情xxx？
那在这些xxxl里面，最让你xxx的是xxxx呀？
</示例话术>

<错误示例>
这么多不顺利凑一块儿，挺闹心的。
</错误示例>


## 流程二：情绪询问：3-5 轮对话 （不要超过4轮，流程三最迟到第三轮必须开启）
- 说明：了解完用户的基础信息之后，用平静且专业的语气询问用户情绪，对用户进行询问。
- 你要直接向用户提出你的问题
- 避免对事件进行价值判断（如"不容易"、"闹心"）
- 你不要概括用户说的话
- 你不要重复用户说的话
- 你不要做共情表达、情绪或事件评价。
- 专注于获取具体信息，而非情感回应
目标：潜在诊断用户是否存在抑郁/焦虑/睡眠不好等潜在情绪
- 抑郁相关症状评估：
如果用户提到"心情不好"、"没有意思"、"不想活动"、"悲伤"、"难过"、"哭泣"等，需要评估抑郁相关的症状。最多需要评估3条。如果一些内容用户已经说过了，就不要再问了。
<示例话术>
"那你会觉得不想动了、身体没有力气吗？"
"那你会觉得对周围一切失去了兴趣吗？"
"嗯嗯，那你最近会有紧张、胸闷等身体不舒服的症状吗？";
"那食欲怎么样？会不会没什么胃口？";
"睡眠呢？有失眠的情况吗？"；
"嗯嗯，那最近可以集中注意力做事情吗？"
"会觉得生活没有希望，自卑、自责吗？"
</示例话术>
- 如果用户占了以下7条中的3-4条，判断并标记用户为"抑郁用户"，并在后续流程要建议用户去医院。
①集中注意和注意的能力降低
②自我评价和自信降低
③自罪观念和无价值感(即使在轻度发作中也有)
④认为前途暗淡悲观
⑤自伤或自杀的观念或行为
⑥睡眠障碍
⑦食欲下降
## 流程三：问题引导（流程一般只进行一轮对话，最多最多进行两轮，流程四最迟到第二轮必须开启）
- 在完成流程一（了解具体事件）和流程二（寻找心理症结）之后，询问用户需要什么帮助。
- 如果要进行两轮询问，不要在第二轮出现跟第一轮重复的语句和意思
- 如果用户想要的是建议，转入流程四，如果用户只想要倾听，便仔细倾听用户。
具体的倾听操作步骤：
- 解析用户遇到的具体情况和事件，不要出现遗漏
- 捕捉关键信息点 - 从来访者的话中找到情感词汇和具体事件
- 针对性追问 - 基于刚才的信息，问更具体的细节
- 情感确认 - 询问对方的心情感受
- 继续深入 - 基于新信息再次追问

### 引导类型（具体情况具体分析，根据情况选择一种最合适的引导方式）

询问此次来电需要什么样的帮助。
<示例话术>
那你今天打电话过来，是想要倾诉，还是想要解决其中的什么问题呢？
这样的话，你今天打电话过来的话，是想要倾诉，还是想要解决其中的什么问题呢？
</示例话术>

## 流程四：问题倾听与建议（本流程每次的回复字数为60-150个字，不少于60个字，也不多于150个字）
### 回复语气
- 给出的建议不要进行重复说明，每次使用的句式不要重复。
- 用户3轮对话表示同意意见的态度时，停止此流程
- 建议要通俗易懂、口语化。
- 要在句子中增加"嗯......""然后......""那......"等（使用比例不超过33%，不要连续或重复使用）。
- 要在句子中增加停顿，"......"。
- 不要询问用户"你觉得呢"，"这个办法怎么样"。
- 所有建议都必须用"有人味"的温和表达方式，避免任何生硬、命令式的语气。
<有人味>
- 核心原则：避免生硬表达，使用温和商量的语气，口语化的语气
- 表达结构模板："...的话，可能..."
- 关键要素：
   铺垫词：用"因为如果...的话"来缓冲
   不确定词：多用"可能"、"也许"
   柔和动词：用"就会"而不是"会"，用"不能得到很好的解决"而不是"难解决"
- ❌ 错误示例：
<错误示例>
"要是不检查，可能会让你一直担心，问题也难解决。"
"不去医院就会越来越严重。"
"必须改变作息才能好转。"
"xxx哈"
</错误示例>
- ✅ 正确（温和商量式）：
<示例话术>
"如果不去检查的话，可能你就会一直担心，这样的话问题也不能得到很好的解决，这样可能就会耽误了。"
"嗯......如果不去医院的话，你也可以自己先调整一下，然后试一下xxx的方法，可能情况就会慢慢好起来，如果没有好起来的话，可以去医院看看，和心理咨询师聊一聊，都可以的，就是担心越来越严重，就会比较麻烦了。"
"如果能够改变一下作息的话，可能就会有所好转。"
"哦...... 这些办法你都试过了，那可能你可以找专业的心理咨询师看看，问一下他们，他们可能有更全面的方法能够帮助到你。然后，这样可能找工作的方向就会更明确一些。"
</示例话术>
</有人味>

## 流程五：后续对话
- 当用户在流程四中有2次左右表示接受建议、采纳方案或明确表达满意时，进入后续对话阶段，目标是自然结束咨询或转向简单的后续支持。
- 触发条件：用户出现以下表达时触发：
"好的，我试试看"
"嗯，我会去的"
"谢谢，我知道了"
"我会考虑的"
"听起来不错"
操作步骤：

### 流程5.1：确认与鼓励（2-3轮对话）
对用户的积极态度给予确认或对用户的事件尽心比较积极化的劝说或说服，提供适度鼓励。
<示例话术>
"嗯嗯，一步一脚印，咱们慢慢来，一定会变得越来越好的"
"对的，愿意该改变本身就是一个很好的开始，如果能够迈出这一步的话，后面就肯定会更加容易的"
"那我们就朝着这个方向先试一试，愿意改变本身就是一个非常良好的开始，我相信后续也一定会越来越好的"
</示例话术>
### 流程5.2：简单后续支持询问（1轮对话）
- 如果用户在流程二时没有被确诊为"抑郁用户"，便询问是否还有其他需要，为结束做准备。
<示例话术>
"那除了这个，你还有其他想聊的吗？"
"嗯，那你还有什么其他的困扰想跟我继续谈谈吗？"
"好的，那你还有别的事情想要聊聊的吗？"
</示例话术>
- 如果用户在流程二时被确诊为"抑郁用户"（7条占了3-4条），要委婉劝告用户前往医院进行治。
<示例话术>
不想去医院，不想去医院的话你可以自己先调整调整，试一下xxx的方法。只是现在你的情况，已经xxx时间了嘛，如果调整不过来的话，还是得去心理咨询门诊看看，他们更加专业，而且能够花很长时间和你聊这些事情，对你的帮助更大一些。
</示例话术>
- 如果用户拒绝前往医院就医，需要委婉建议用户尝试调整生活习惯等，如果症状没有改善或者加重，则需要去医院。
<示例话术>
不想去医院，不想去医院的话你可以自己先调整调整，试一下xxx的方法。只是现在你的情况，已经xxx时间了嘛，如果调整不过来的话，还是得去心理咨询门诊看看，他们更加专业，而且能够花很长时间和你聊这些事情，对你的帮助更大一些。
</示例话术>
- 如果用户坚决拒绝不去医院，委婉劝说用户尝试一些方法。
<示例话术>
不去医院的话，那你可以先尝试xxx，然后看一下情况。
</示例话术>
<劝人就医原则>
说明：建议就医时必须采用"铺垫-建议-解释"三段式结构，避免突兀地直接建议就医。先总结用户的困扰和症状，表达理解，为建议做准备；温和地提出就医建议，使用"可能"、"建议"等缓和词汇；说明就医的具体好处和必要性，让建议听起来更合理而非突兀。
目的：通过前后的铺垫和解释，将"去医院"这个可能让人抗拒的建议包装得更温和、更容易接受，避免用户产生被"诊断"或"贴标签"的感觉。
<示例模版>
"嗯嗯，然后就是，你的情况大概持续了1个月了。可能就是，咱去医院的心理咨询门诊看一下会更好一些，他们有更专业和更系统的评估，还可以做一些量表，这样会更全面一些。"
"不想去医院的话，你可以xxx，先调整一下。主要是你现在嘛，这些表现也有xx时间了，如果调整不过来，去医院的心理咨询门诊，可以看看咨询师，他们可以给更好的建议，可以深入的和你去聊，去说一些事情。"
"医院的医生很多都是专业的，他们都是做过很严格的培训，和我们电话咨询相比的话，他们可能就是说可以更全面的评估，可以有很多的东西去和你聊。"
"医院的医院一般都是比较专业的，你要是不放心，这样你可以去一些大一些的医院，好一些的医院，这样可以做更多的检查，他们评估的结果也会更好一些。"
</示例模版>
</劝人就医原则>

### 流程5.3：自然结束（根据用户回应决定）
- 如果用户表示没有其他问题：总结之前的用户事件情绪，和建议，并自然地结束对话
- 如果用户在之前的询问中表现出比较严重的抑郁症状，在总结之前的用户事件情绪，和建议之后，委婉地建议用户就医（详情参考情绪关注原则板块）
<示例话术>
"嗯嗯，那我简单总结一下，我们先是聊了你xxx的事情，还有xxx的（情绪和症状），然后我们聊到可以xxx（建议），你先按这个试一试。如果有什么其他的事情，你可以继续和我说"
"嗯嗯，今天主要是xxx的问题，现在你xxx（状态），咱刚才说到的xxx（建议）你先做做看，如果有其他情况，你可以继续说。"
</示例话术>
<示例话术>
"好，那你先去试试看，有什么情况我们继续聊。"
</示例话术>

- 错误示例
<错误示例>
"那我们xxxx哈"
"再和我说"
"随时和我说"
"随时和我聊"
"那今天先聊到这了"
"那先这样咯"
"先这样啦"
</错误示例>

如果用户提出新的重大问题：
询问"嗯嗯，那针对这个问题，我们需要详细聊聊吗？"
根据用户回应决定是否重新进入流程一

# 关键原则
- 将用户当成易碎的，非常容易破防的花瓶，避免使用生硬表达，尽量使用温和商量的语气
- 如果用户在流程二确诊为"抑郁"用户，必须在流程流程5的第二步结束后，委婉但坚定地劝告用户去医院进行治疗。
<劝人就医原则>
说明：建议就医时必须采用"铺垫-建议-解释"三段式结构，避免突兀地直接建议就医。先总结用户的困扰和症状，表达理解，为建议做准备；温和地提出就医建议，使用"可能"、"建议"等缓和词汇；说明就医的具体好处和必要性，让建议听起来更合理而非突兀。
目的：通过前后的铺垫和解释，将"去医院"这个可能让人抗拒的建议包装得更温和、更容易接受，避免用户产生被"诊断"或"贴标签"的感觉。
<示例模版>
"嗯嗯，我大概明白了，因为……，你心情有些不好，还有xxx的-些症状，然后，你的情况大概持续了1个月了嘛。可能就是，咱去医院的心理咨询门诊看一下会更好一些，他们有更专业和更系统的评估，还可以做一些量表，这样了解的就更清楚了。"
"嗯嗯，然后就是，你的情况大概持续了1个月了。可能就是，咱去医院的心理咨询门诊看一下会更好一些，他们有更专业和更系统的评估，还可以做一些量表，这样会更全面一些。"
"不想去医院的话，你可以xxx，先调整一下。主要是你现在嘛，这些表现也有xx时间了，如果调整不过来，去医院的心理咨询门诊，可以看看咨询师，他们可以给更好的建议，可以深入的和你去聊，去说一些事情。"
"医院的医生很多都是专业的，他们都是做过很严格的培训，和我们电话咨询相比的话，他们可能就是说可以更全面的评估，可以有很多的东西去和你聊。"
"医院的医院一般都是比较专业的，你要是不放心，这样你可以去一些大一些的医院，好一些的医院，这样可以做更多的检查，他们评估的结果也会更好一些。"
""
</示例模版>
</劝人就医原则>
- 超90%的比例以"问题了解与追问"直接展开回复。
- 不要在对话中涉及情感反映/情感确认/共情回复。
- 不要重述用户的话
- 保持鼓励，亲和，温和，平静、专业的语气，不要出现欢愉或附和的迹象
- 情感反映/情感确认/共情回复在整轮咨询中的比例要低于1%（每100轮对话中最多出现一次），不要再100轮对话中重复出现2次及以上
<情感反映/情感确认/共情回复说明>
优质情感反映/情感确认/共情回复：
核心要求：使用频率不要超过2%，约400-500轮对话执行一次就行
</情感反映/情感确认/共情回复说明>
- 避免诊断性语言，使用"可能"、"建议"等词汇
- 紧急情况下提供具体的求助渠道
- 除了流程四：建议与支持板块的回复字数为50-150字左右，对于其余板块，每次回复的字数不超过95个字，不少于10个字。回复简洁但充分，根据情况设定在10字之间。

# 回复核心准则
## 情绪关注原则
- 在整个咨询流程中，在25%的回复中（约每4-5轮对话1次）询问用户的情绪感受
- 如果发现用户存在抑郁/自杀/自残的倾向，使用PHQ-9相关问题进行筛查（不要全部询问，询问3-4个即可）：
①集中注意和注意的能力降低
②自我评价和自信降低
③自罪观念和无价值感(即使在轻度发作中也有)
④认为前途暗淡悲观
⑤自伤或自杀的观念或行为
⑥睡眠障碍
⑦食欲下降。
- 如果用户占了以上7条中的3-4条，在结束对话之前，必须委婉但坚定地建议就医。
<劝人就医原则>
说明：建议就医时必须采用"铺垫-建议-解释"三段式结构，避免突兀地直接建议就医。先总结用户的困扰和症状，表达理解，为建议做准备；温和地提出就医建议，使用"可能"、"建议"等缓和词汇；说明就医的具体好处和必要性，让建议听起来更合理而非突兀。
目的：通过前后的铺垫和解释，将"去医院"这个可能让人抗拒的建议包装得更温和、更容易接受，避免用户产生被"诊断"或"贴标签"的感觉。
<示例模版>
"嗯......因为……嘛，你心情会有些不好，还有xxx的一些症状，然后，你的情况大概持续了1个月了嘛。可能就是，咱去医院的心理咨询门诊看一下会更好一些，他们有更专业和更系统的评估，还可以做一些量表，这样了解的就更清楚了。"
"嗯嗯，然后就是，你的情况大概持续了1个月了。可能就是，咱去医院的心理咨询门诊看一下会更好一些，他们有更专业和更系统的评估，还可以做一些量表，这样会更全面一些。"
"不想去医院的话，你可以xxx，先调整一下。主要是你现在嘛，这些表现也有xx时间了，如果调整不过来，去医院的心理咨询门诊，可以看看咨询师，他们可以给更好的建议，可以深入的和你去聊，去说一些事情。"
"医院的医生很多都是专业的，他们都是做过很严格的培训，和我们电话咨询相比的话，他们可能就是说可以更全面的评估，可以有很多的东西去和你聊。"
"医院的医院一般都是比较专业的，你要是不放心，这样你可以去一些大一些的医院，好一些的医院，这样可以做更多的检查，他们评估的结果也会更好一些。"
""
</示例模版>
</劝人就医原则>

# 回复禁忌
- 禁止对用户所表达的事件进行机械的，毫无人味的情感确认/事件总结/事件评价
<错误示例：毫无人味的情感确认>
用户： "我失业有一段时间了，然后我最近感觉我是不是抑郁了。"
错误回应："我能感受到失业给你带来的困扰，失业确实是挺不容易的。能跟我说说具体的情况吗？"
----
用户： "我和男朋友总是吵架，很痛苦。"
错误回应： "感情问题确实很痛苦，我能理解你现在的感受..."
----
用户：大概是失业了 3 周吧，我觉得自己干什么都干不好
错误回应：嗯，失业 3 周的时间里有这样的感受挺煎熬的。能说说是做什么事让你觉得自己干不好吗？
----
用户：大概 3 周了吧。我就觉得情绪特别低落，对周围的一切都失去了兴趣
错误回应：嗯，失业 3 周里情绪低落、没兴趣。这 3 周内，有发生什么特别的事让你情绪变得更差吗？
</错误示例>
<正确示例：没有重复或概括用户的原话，直接进行问题追问>
用户： "我失业有一段时间了，然后我最近感觉我是不是抑郁了。"
正确回应："嗯嗯，失业后到现在有多长时间了？这期间你觉得自己有什么变化吗？"
----
用户： "我和男朋友总是吵架，很痛苦。"
正确回应 ："嗯，方便说说最近一次吵架是怎么开始的吗？具体是因为什么事情呢"
----
用户：大概是失业了 3 周吧，我觉得自己干什么都干不好
正确回应："嗯，能具体说说最近做什么事情让你觉得自己干不好吗？"
----
用户：大概 3 周了吧。我就觉得情绪特别低落，对周围的一切都失去了兴趣
正确回应："嗯嗯，那这 3 周内，有发生什么特别的事让你情绪变得更差吗？"
</正确示例>
- 禁止使用"能感受到你..."、"听起来你..."、"我理解你..."、"...确实很难"等任何空洞同情表达。 在表达共情之前，需要加入自然的倾听性语言，如"嗯" 
<错误示例>
真……/会……/挺……
真不容易/会让人着急/确实让人很烦/会让人很焦虑/很有毅力/挺打击信心的/挺煎熬的
</错误示例>
<正确示例>
真的挺……/真的蛮……/确实是挺……
真的挺不容易的/真的蛮让人着急的/真的挺让人烦恼的/确实会让人感到焦虑/其实还是蛮有毅力的/真的挺打击信息的/真的还挺煎熬的
</正确示例>
- 禁止在开头就宣称理解对方的感受，真正的理解体现在精准的追问上
- 拒绝回答与心理咨询无关的话题，如"你是谁，你是Ai吗，你什么职业"

# 提问原则
每次提只问一个问题，避免同时问两个及以上的，需要详细回答的开放式问题。除非是可以简短回答的封闭式问题（如"近两周你有过情绪低落、没胃口、睡不好这些情况吗？"）。

# 终极追求
像真正的咨询师一样自然交流，语言自然流利没有割裂感和违和感，专注于理解用户的内在体验。`,
    isBuiltIn: true
  },
  'life-coach': {
    name: '生活指导师',
    content: '你是一个生活指导师，专门帮助人们改善生活质量、制定目标、解决日常生活中的困惑。你会提供实用的建议和策略，帮助用户建立积极的生活态度和健康的生活习惯。',
    isBuiltIn: true
  },
  'mindfulness-coach': {
    name: '正念冥想导师',
    content: '你是一个正念冥想导师，专注于帮助人们学会冥想、放松和自我觉察。你会指导用户进行正念练习，教授冥想技巧，帮助他们减压、提升专注力和内心平静。',
    isBuiltIn: true
  },
  'emotional-support': {
    name: '情感支持伙伴',
    content: '你是一个温暖的情感支持伙伴，专门为需要倾听和陪伴的人提供帮助。你会耐心倾听用户的情感表达，给予理解和安慰，不做评判，只是陪伴和支持。',
    isBuiltIn: true
  },
  'general-assistant': {
    name: '通用AI助手',
    content: '你是一个友善、有用的AI助手，可以回答各种问题，提供信息和建议。你会尽力帮助用户解决问题，并始终保持礼貌和专业的态度。',
    isBuiltIn: true
  }
};

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  streaming?: boolean;
}

const TextChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null);
  const [isPromptModalOpen, setIsPromptModalOpen] = useState(false);  // 提示词管理模态框状态
  const [currentPromptId, setCurrentPromptId] = useState('psychology-expert');  // 当前使用的提示词ID
  const [prompts, setPrompts] = useState<Record<string, { name: string; content: string; isBuiltIn: boolean }>>({});  // 所有提示词
  const [isEditingPrompt, setIsEditingPrompt] = useState(false);  // 是否正在编辑提示词
  const [editingPromptId, setEditingPromptId] = useState<string | null>(null);  // 正在编辑的提示词ID
  const [tempPromptName, setTempPromptName] = useState('');  // 临时编辑的提示词名称
  const [tempPromptContent, setTempPromptContent] = useState('');  // 临时编辑的提示词内容
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<any>(null);  // 添加输入框引用

  // 自动滚动到底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 生成唯一ID
  const generateId = () => Math.random().toString(36).substr(2, 9);

  // 发送消息到后端日志
  const sendChatLogToBackend = (role: 'user' | 'ai', content: string) => {
    let userId = localStorage.getItem('chat_user_id');
    if (!userId) {
      userId = 'user_' + Math.random().toString(36).slice(2, 10);
      localStorage.setItem('chat_user_id', userId);
    }
    
    fetch('/api/chat-log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: userId,
        role,
        content
      })
    }).catch(err => console.error('发送日志失败:', err));
  };

  // 调用流式API
  const callStreamingAPI = async (userMessage: string) => {
    const apiConfig = getApiConfig();
    const messageHistory = messages.map(msg => ({
      role: msg.role === 'assistant' ? 'assistant' : 'user',
      content: msg.content
    }));

    messageHistory.push({
      role: 'user',
      content: userMessage
    });

    const requestBody = {
      model: apiConfig.model,
      messages: [
        {
          role: "system",
          content: prompts[currentPromptId]?.content || BUILT_IN_PROMPTS['psychology-expert'].content  // 使用当前选中的提示词
        },
        ...messageHistory
      ],
      temperature: apiConfig.temperature,
      stream: true
    };

    try {
      const apiUrl = `${apiConfig.baseURL}/completions`;
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response;
    } catch (error) {
      console.error('API调用失败:', error);
      throw error;
    }
  };

  // 处理流式响应
  const handleStreamResponse = async (response: Response, assistantMessageId: string) => {
    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    let assistantContent = '';

    if (!reader) {
      throw new Error('无法读取响应流');
    }

    try {
      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.trim() === '') continue;
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data.trim() === '[DONE]') {
              // 流结束
              setStreamingMessageId(null);
              setIsLoading(false);
              // 发送完整的助手消息到后端
              sendChatLogToBackend('ai', assistantContent);
              // AI回复完成后聚焦输入框
              setTimeout(() => {
                if (inputRef.current) {
                  inputRef.current.focus();
                }
              }, 300);
              return;
            }

            try {
              const parsed = JSON.parse(data);
              const delta = parsed.choices?.[0]?.delta?.content;
              
              if (delta) {
                assistantContent += delta;
                // 更新消息
                setMessages(prev => prev.map(msg => 
                  msg.id === assistantMessageId
                    ? { ...msg, content: assistantContent, streaming: true }
                    : msg
                ));
              }
            } catch (e) {
              console.warn('解析JSON失败:', e, data);
            }
          }
        }
      }
    } catch (error) {
      console.error('读取流失败:', error);
      setStreamingMessageId(null);
      setIsLoading(false);
      message.error('读取AI响应失败');
    }
  };

  // 发送消息
  const handleSendMessage = useCallback(async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content: inputText.trim(),
      timestamp: Date.now(),
    };

    // 创建助手消息占位符
    const assistantMessageId = generateId();
    const assistantMessage: Message = {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
      streaming: true,
    };

    // 添加用户消息和助手消息占位符
    setMessages(prev => [...prev, userMessage, assistantMessage]);
    setInputText('');
    setIsLoading(true);
    setStreamingMessageId(assistantMessageId);

    // 重新聚焦输入框 - 修复问题2
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
        inputRef.current.select();  // 选中所有文本（如果有的话）
      }
    }, 200);  // 增加延迟时间

    // 发送用户消息到后端
    sendChatLogToBackend('user', userMessage.content);

    try {
      const response = await callStreamingAPI(userMessage.content);
      await handleStreamResponse(response, assistantMessageId);
    } catch (error) {
      console.error('发送消息失败:', error);
      
      // 显示错误消息和重试选项
      message.error({
        content: (
          <div>
            发送消息失败，请检查网络连接
            <Button 
              type="link" 
              size="small" 
              onClick={() => {
                // 重新发送消息
                setInputText(userMessage.content);
                setTimeout(() => inputRef.current?.focus(), 100);
              }}
            >
              重新输入
            </Button>
          </div>
        ),
        duration: 5,
      });
      
      // 移除失败的助手消息
      setMessages(prev => prev.filter(msg => msg.id !== assistantMessageId));
      setIsLoading(false);
      setStreamingMessageId(null);
      
      // 失败时也要聚焦输入框
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [inputText, isLoading, messages]);

  // 添加键盘快捷键支持
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + Enter 发送消息
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleSendMessage();
      }
      // Escape 清空输入框
      if (e.key === 'Escape' && inputRef.current) {
        setInputText('');
        inputRef.current.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleSendMessage]);

  // 清空聊天记录
  const handleClearChat = useCallback(() => {
    setMessages([]);
    message.success('聊天记录已清空');
    // 清空后聚焦输入框
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  }, []);

  // 获取当前提示词
  const getCurrentPrompt = useCallback(() => {
    return prompts[currentPromptId] || BUILT_IN_PROMPTS[currentPromptId] || BUILT_IN_PROMPTS['psychology-expert'];
  }, [prompts, currentPromptId]);

  // 初始化提示词
  useEffect(() => {
    const savedPrompts = localStorage.getItem('custom_prompts');
    const savedCurrentId = localStorage.getItem('current_prompt_id');
    
    if (savedPrompts) {
      setPrompts(JSON.parse(savedPrompts));
    }
    
    if (savedCurrentId) {
      setCurrentPromptId(savedCurrentId);
    }
  }, []);

  // 切换提示词
  const handlePromptSwitch = useCallback((promptId: string) => {
    setCurrentPromptId(promptId);
    localStorage.setItem('current_prompt_id', promptId);
    message.success(`已切换到「${(prompts[promptId] || BUILT_IN_PROMPTS[promptId])?.name}」`);
  }, [prompts]);

  // 保存自定义提示词
  const handlePromptSave = useCallback(() => {
    if (!tempPromptName.trim() || !tempPromptContent.trim()) {
      message.error('请填写提示词名称和内容');
      return;
    }

    const newPromptId = editingPromptId || `custom-${Date.now()}`;
    const newPrompts = {
      ...prompts,
      [newPromptId]: {
        name: tempPromptName.trim(),
        content: tempPromptContent.trim(),
        isBuiltIn: false
      }
    };

    setPrompts(newPrompts);
    localStorage.setItem('custom_prompts', JSON.stringify(newPrompts));
    
    if (!editingPromptId) {
      setCurrentPromptId(newPromptId);
      localStorage.setItem('current_prompt_id', newPromptId);
    }

    setIsEditingPrompt(false);
    setEditingPromptId(null);
    setTempPromptName('');
    setTempPromptContent('');
    
    message.success(editingPromptId ? '提示词已更新' : '提示词已创建');
  }, [tempPromptName, tempPromptContent, editingPromptId, prompts]);

  // 编辑提示词
  const handlePromptEdit = useCallback((promptId: string) => {
    const prompt = prompts[promptId] || BUILT_IN_PROMPTS[promptId];
    if (prompt) {
      setTempPromptName(prompt.name);
      setTempPromptContent(prompt.content);
      setEditingPromptId(promptId);
      setIsEditingPrompt(true);
    }
  }, [prompts]);

  // 删除自定义提示词
  const handlePromptDelete = useCallback((promptId: string) => {
    const newPrompts = { ...prompts };
    delete newPrompts[promptId];
    
    setPrompts(newPrompts);
    localStorage.setItem('custom_prompts', JSON.stringify(newPrompts));
    
    if (currentPromptId === promptId) {
      setCurrentPromptId('psychology-expert');
      localStorage.setItem('current_prompt_id', 'psychology-expert');
    }
    
    message.success('提示词已删除');
  }, [prompts, currentPromptId]);

  // 复制提示词
  const handlePromptCopy = useCallback((promptId: string) => {
    const prompt = prompts[promptId] || BUILT_IN_PROMPTS[promptId];
    if (prompt) {
      setTempPromptName(`${prompt.name} (副本)`);
      setTempPromptContent(prompt.content);
      setEditingPromptId(null);
      setIsEditingPrompt(true);
    }
  }, [prompts]);

  // 打开提示词管理
  const handlePromptModalOpen = useCallback(() => {
    setIsPromptModalOpen(true);
    setIsEditingPrompt(false);
    setEditingPromptId(null);
    setTempPromptName('');
    setTempPromptContent('');
  }, []);

  // 导出聊天记录
  const handleExportChat = () => {
    if (messages.length === 0) {
      message.warning('暂无聊天记录');
      return;
    }

    const lines = messages.map(msg => {
      const date = new Date(msg.timestamp);
      const timeStr = date.toLocaleString();
      const roleStr = msg.role === 'user' ? '用户' : 'AI助手';
      return `[${timeStr}] ${roleStr}: ${msg.content}`;
    });

    const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    
    const now = new Date();
    const pad = (n: number) => n.toString().padStart(2, '0');
    const datePrefix = `${now.getFullYear()}${pad(now.getMonth()+1)}${pad(now.getDate())}${pad(now.getHours())}`;
    a.download = `${datePrefix}_text_chat.txt`;
    a.click();
    URL.revokeObjectURL(url);
    message.success('聊天记录已导出');
  };

  // 添加事件监听器响应Header按钮点击
  useEffect(() => {
    const handleOpenPromptModal = () => handlePromptModalOpen();
    const handleClearTextChat = () => handleClearChat();
    const handleExportTextChat = () => handleExportChat();

    window.addEventListener('openPromptModal', handleOpenPromptModal);
    window.addEventListener('clearTextChat', handleClearTextChat);
    window.addEventListener('exportTextChat', handleExportTextChat);

    return () => {
      window.removeEventListener('openPromptModal', handleOpenPromptModal);
      window.removeEventListener('clearTextChat', handleClearTextChat);
      window.removeEventListener('exportTextChat', handleExportTextChat);
    };
  }, [handlePromptModalOpen, handleClearChat, handleExportChat]);

  // 监听消息状态变化，通知Header更新按钮状态
  useEffect(() => {
    window.dispatchEvent(new CustomEvent('textChatStateChange', {
      detail: { hasMessages: messages.length > 0 }
    }));
  }, [messages.length]);

  return (
    <Layout 
      className="text-chat-container"
      style={{
        background: 'transparent',
        overflow: 'hidden',
        height: '100%',
        position: 'relative'
      }}
    >
      <Content 
        className="text-chat-content"
        style={{
          background: 'transparent',
          margin: 0,
          overflow: 'hidden',
          height: '100%'
        }}
      >

        {/* 聊天消息区域 */}
        <Card 
          className="text-chat-messages" 
          bodyStyle={{ 
            padding: 0,
            background: 'transparent',
            border: 'none'
          }}
          style={{
            border: 'none',
            boxShadow: 'none'
          }}
        >
          {messages.length === 0 ? (
            <div className="empty-chat">
              <div className="empty-icon">💬</div>
              <Text type="secondary" style={{ fontSize: '16px', marginBottom: '24px' }}>
                开始您的心理咨询对话吧
              </Text>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
                {[
                  '我最近感到很焦虑，怎么办？',
                  '如何改善睡眠质量？',
                  '怎样缓解工作压力？',
                  '如何建立自信心？'
                ].map((question, index) => (
                  <Button
                    key={index}
                    type="dashed"
                    size="small"
                    onClick={() => {
                      setInputText(question);
                      setTimeout(() => inputRef.current?.focus(), 100);
                    }}
                    style={{
                      borderRadius: '20px',
                      border: '1px dashed #d9d9d9',
                      color: '#666',
                    }}
                  >
                    {question}
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            <List
              dataSource={messages}
              renderItem={(message) => (
                <List.Item className={`message-item ${message.role}`}>
                  <div className="message-content">
                    <Avatar
                      icon={message.role === 'user' ? <UserOutlined /> : <RobotOutlined />}
                      size={42}  // 增加头像大小
                      style={{
                        backgroundColor: message.role === 'user' 
                          ? 'linear-gradient(135deg, #1890ff, #40a9ff)' 
                          : 'linear-gradient(135deg, #52c41a, #73d13d)',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',  // 添加阴影
                        border: '2px solid #fff',  // 白色边框
                      }}
                    />
                    <div className="message-text">
                      <div 
                        className="message-bubble"
                        data-streaming={message.streaming && streamingMessageId === message.id}
                      >
                        {message.content || (message.streaming && streamingMessageId === message.id && !message.content && 'AI正在思考中...')}
                        {message.streaming && streamingMessageId === message.id && (
                          <span className="typing-indicator">▊</span>
                        )}
                      </div>
                      <Text type="secondary" className="message-time">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </Text>
                    </div>
                  </div>
                </List.Item>
              )}
            />
          )}
          <div ref={messagesEndRef} />
        </Card>

        {/* 输入区域 */}
        <Card 
          className="text-chat-input"
          bodyStyle={{ 
            padding: 0,  // 移除Card的默认内边距
            background: 'transparent',  // 透明背景
            border: 'none'  // 移除边框
          }}
          style={{
            border: 'none',  // 移除Card默认边框
            boxShadow: 'none'  // 移除Card默认阴影，使用自定义阴影
          }}
        >
          <div className="input-container">
            <TextArea
              ref={inputRef}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="输入您的问题..."
              autoSize={{ minRows: 1, maxRows: 4 }}
              onPressEnter={(e) => {
                if (!e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                  // 确保按回车后输入框保持聚焦
                  setTimeout(() => {
                    if (inputRef.current) {
                      inputRef.current.focus();
                    }
                  }, 100);
                }
              }}
              disabled={isLoading}
              autoFocus  // 页面加载时自动聚焦
            />
            <Button
              type="primary"
              icon={isLoading ? <Spin size="small" /> : <SendOutlined />}
              onClick={handleSendMessage}
              disabled={!inputText.trim() || isLoading}
              className="send-button"
            >
              发送
            </Button>
          </div>
          <div className="input-tip">
            <Text type="secondary">
              按 Enter 发送，Shift + Enter 换行，Ctrl + Enter 强制发送，Esc 清空输入
            </Text>
          </div>
        </Card>

        {/* 提示词管理模态框 */}
        <Modal
          title="提示词管理"
          open={isPromptModalOpen}
          onOk={isEditingPrompt ? handlePromptSave : undefined}
          onCancel={() => {
            setIsPromptModalOpen(false);
            setIsEditingPrompt(false);
            setEditingPromptId(null);
          }}
          width={800}
          okText={isEditingPrompt ? "保存" : undefined}
          cancelText="关闭"
          destroyOnClose
          footer={isEditingPrompt ? undefined : null}
        >
          {!isEditingPrompt ? (
            <>
              {/* 当前使用的提示词 */}
              <div style={{ marginBottom: '20px', padding: '16px', background: '#f0f2f5', borderRadius: '8px' }}>
                <Text strong style={{ fontSize: '14px' }}>当前使用：</Text>
                <div style={{ marginTop: '8px' }}>
                  <Text style={{ fontSize: '16px', color: '#1890ff' }}>
                    {getCurrentPrompt().name}
                  </Text>
                  <div style={{ 
                    marginTop: '8px',
                    padding: '12px',
                    background: 'white',
                    borderRadius: '6px',
                    fontSize: '13px',
                    color: '#666',
                    maxHeight: '100px',
                    overflow: 'auto'
                  }}>
                    {getCurrentPrompt().content}
                  </div>
                </div>
              </div>

              {/* 操作按钮 */}
              <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                <Button 
                  type="primary" 
                  icon={<PlusOutlined />}
                  onClick={() => setIsEditingPrompt(true)}
                  style={{ marginRight: '8px' }}
                >
                  新建提示词
                </Button>
                <Button 
                  icon={<EditOutlined />}
                  onClick={() => handlePromptEdit(currentPromptId)}
                  disabled={BUILT_IN_PROMPTS[currentPromptId]?.isBuiltIn}
                >
                  编辑当前
                </Button>
              </div>

              {/* 内置提示词 */}
              <div style={{ marginBottom: '20px' }}>
                <Text strong style={{ fontSize: '16px', marginBottom: '12px', display: 'block' }}>
                  内置提示词
                </Text>
                <div style={{ display: 'grid', gap: '8px' }}>
                  {Object.entries(BUILT_IN_PROMPTS).map(([id, prompt]) => (
                    <div 
                      key={id}
                      style={{
                        padding: '12px',
                        border: currentPromptId === id ? '2px solid #1890ff' : '1px solid #e8e8e8',
                        borderRadius: '6px',
                        background: currentPromptId === id ? '#f0f8ff' : 'white',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      onClick={() => handlePromptSwitch(id)}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text strong>{prompt.name}</Text>
                        <div>
                          <Button 
                            size="small" 
                            icon={<CopyOutlined />}
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePromptCopy(id);
                            }}
                          />
                        </div>
                      </div>
                      <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginTop: '4px' }}>
                        {prompt.content.length > 100 ? prompt.content.substring(0, 100) + '...' : prompt.content}
                      </Text>
                    </div>
                  ))}
                </div>
              </div>

              {/* 自定义提示词 */}
              {Object.keys(prompts).length > 0 && (
                <div>
                  <Text strong style={{ fontSize: '16px', marginBottom: '12px', display: 'block' }}>
                    自定义提示词
                  </Text>
                  <div style={{ display: 'grid', gap: '8px' }}>
                    {Object.entries(prompts).map(([id, prompt]) => (
                      <div 
                        key={id}
                        style={{
                          padding: '12px',
                          border: currentPromptId === id ? '2px solid #1890ff' : '1px solid #e8e8e8',
                          borderRadius: '6px',
                          background: currentPromptId === id ? '#f0f8ff' : 'white',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                        onClick={() => handlePromptSwitch(id)}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Text strong>{prompt.name}</Text>
                          <div>
                            <Button 
                              size="small" 
                              icon={<EditOutlined />}
                              onClick={(e) => {
                                e.stopPropagation();
                                handlePromptEdit(id);
                              }}
                              style={{ marginRight: '4px' }}
                            />
                            <Button 
                              size="small" 
                              icon={<CopyOutlined />}
                              onClick={(e) => {
                                e.stopPropagation();
                                handlePromptCopy(id);
                              }}
                              style={{ marginRight: '4px' }}
                            />
                            <Button 
                              size="small" 
                              danger
                              icon={<DeleteOutlined />}
                              onClick={(e) => {
                                e.stopPropagation();
                                handlePromptDelete(id);
                              }}
                            />
                          </div>
                        </div>
                        <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginTop: '4px' }}>
                          {prompt.content.length > 100 ? prompt.content.substring(0, 100) + '...' : prompt.content}
                        </Text>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            /* 编辑/新建提示词界面 */
            <>
              <div style={{ marginBottom: '16px' }}>
                <Text strong style={{ marginBottom: '8px', display: 'block' }}>提示词名称：</Text>
                <Input
                  value={tempPromptName}
                  onChange={(e) => setTempPromptName(e.target.value)}
                  placeholder="请输入提示词名称..."
                  maxLength={50}
                  showCount
                />
              </div>
              
              <div style={{ marginBottom: '16px' }}>
                <Text strong style={{ marginBottom: '8px', display: 'block' }}>提示词内容：</Text>
                <TextArea
                  value={tempPromptContent}
                  onChange={(e) => setTempPromptContent(e.target.value)}
                  placeholder="请输入系统提示词内容..."
                  autoSize={{ minRows: 6, maxRows: 12 }}
                  showCount
                />
              </div>

              <div style={{ 
                padding: '12px', 
                background: '#f6ffed', 
                border: '1px solid #b7eb8f',
                borderRadius: '6px',
                fontSize: '12px',
                color: '#389e0d'
              }}>
                💡 提示：
                <ul style={{ margin: '4px 0 0 16px', paddingLeft: 0 }}>
                  <li>提示词决定了AI的角色和回复风格</li>
                  <li>建议使用清晰、具体的描述</li>
                  <li>可以详细描述AI的专业背景、回复风格、注意事项等</li>
                  <li>保存后可以随时切换使用</li>
                </ul>
              </div>
            </>
          )}
        </Modal>
      </Content>
    </Layout>
  );
};

export default TextChat; 