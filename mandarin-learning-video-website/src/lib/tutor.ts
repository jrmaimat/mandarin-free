import { REVIEW_DECK } from "@/data/review";

export type TutorVocab = { zh: string; pinyin: string; en: string };

export type TutorReply = {
  zh: string;
  pinyin: string;
  en: string;
  coach: string;
  tips: string[];
  vocab: TutorVocab[];
  suggestions: string[];
  matched?: { zh: string; pinyin: string; en: string };
  engine: "local" | "openai";
};

type Topic = {
  id: string;
  keywords: string[];
  zhKeywords?: string[];
  reply: { zh: string; pinyin: string; en: string };
  tips: string[];
  vocab: TutorVocab[];
  suggestions: string[];
};

const CHINESE_RE = /[\u3400-\u9fff]/;

const ENGLISH_STOPWORDS = new Set([
  "the", "a", "an", "i", "is", "are", "am", "was", "were", "do", "does", "did",
  "how", "what", "where", "when", "why", "who", "can", "could", "would", "should",
  "you", "your", "my", "me", "we", "they", "he", "she", "it", "this", "that",
  "to", "in", "of", "and", "or", "for", "with", "please", "want", "need", "say",
  "tell", "learn", "know", "use", "pay", "order", "hello", "thanks", "thank",
  "good", "morning", "yes", "no", "help", "chinese", "mandarin", "china",
  "translate", "mean", "meaning", "difference", "between", "speak", "speaking",
  "pronounce", "pronunciation", "buy", "go", "get", "find", "book", "hotel",
  "food", "eat", "some", "there", "here", "have", "has", "like", "love", "about",
  "explain", "practice", "practise", "sentence", "word", "words", "phrase",
]);

const TONE_MAP: Record<string, string> = {
  ā: "a", á: "a", ǎ: "a", à: "a",
  ē: "e", é: "e", ě: "e", è: "e",
  ī: "i", í: "i", ǐ: "i", ì: "i",
  ō: "o", ó: "o", ǒ: "o", ò: "o",
  ū: "u", ú: "u", ǔ: "u", ù: "u",
  ǖ: "v", ǘ: "v", ǚ: "v", ǜ: "v", ü: "v",
};

export function stripTones(value: string): string {
  return value
    .toLowerCase()
    .split("")
    .map((char) => TONE_MAP[char] ?? char)
    .join("");
}

function normalize(value: string): string {
  return stripTones(value)
    .replace(/[\s'’·.,!?，。！？、；：""''()\-]/g, "")
    .trim();
}

function hasToneMarks(value: string): boolean {
  return Object.keys(TONE_MAP).some((mark) => value.includes(mark));
}

function pick<T>(pool: T[], seed: number): T {
  if (pool.length === 0) return undefined as T;
  return pool[Math.abs(seed) % pool.length];
}

function seedOf(value: string): number {
  let seed = 0;
  for (let i = 0; i < value.length; i += 1) {
    seed = (seed * 31 + value.charCodeAt(i)) % 100000;
  }
  return seed;
}

const TOPICS: Topic[] = [
  {
    id: "greeting",
    keywords: ["hello", "hi ", "hi!", "hey", "good morning", "good evening", "nihao", "greet", "你好"],
    zhKeywords: ["你好", "您好", "早上好", "晚上好", "嗨"],
    reply: {
      zh: "你好！很高兴认识你。我叫小敏，是你的中文伙伴。你叫什么名字？",
      pinyin: "Nǐ hǎo! Hěn gāoxìng rènshi nǐ. Wǒ jiào Xiǎomǐn, shì nǐ de Zhōngwén huǒbàn. Nǐ jiào shénme míngzi?",
      en: "Hello! Lovely to meet you. I'm Xiaomin, your Mandarin partner. What's your name?",
    },
    tips: [
      "你好 is the safe greeting at any hour. Add a smile and you're fluent already.",
      "Answer with 我叫 + your name, then return the question with 你呢? (and you?)",
    ],
    vocab: [
      { zh: "你好", pinyin: "nǐ hǎo", en: "hello" },
      { zh: "很高兴", pinyin: "hěn gāoxìng", en: "very happy / glad" },
      { zh: "你呢？", pinyin: "nǐ ne?", en: "and you?" },
    ],
    suggestions: ["我叫Anna", "我很好，谢谢", "你好，老师！"],
  },
  {
    id: "howareyou",
    keywords: ["how are you", "how do you do", "how is it going", "haoma", "ni hao ma", "你怎么样"],
    zhKeywords: ["你好吗", "怎么样", "最近"],
    reply: {
      zh: "我很好，谢谢你！我今天很开心，因为我们在说中文。你今天怎么样？",
      pinyin: "Wǒ hěn hǎo, xièxie nǐ! Wǒ jīntiān hěn kāixīn, yīnwèi wǒmen zài shuō Zhōngwén. Nǐ jīntiān zěnmeyàng?",
      en: "I'm very well, thank you! I'm happy today because we're speaking Chinese. How are you today?",
    },
    tips: [
      "我很好 (wǒ hěn hǎo) is the textbook answer. 还行 (hái xíng, 'so-so') sounds natural too.",
      "Don't repeat 吗 after 怎么样 — 怎么样 is already the question.",
    ],
    vocab: [
      { zh: "很好", pinyin: "hěn hǎo", en: "very well" },
      { zh: "今天", pinyin: "jīntiān", en: "today" },
      { zh: "开心", pinyin: "kāixīn", en: "happy" },
    ],
    suggestions: ["我很好，谢谢", "我有点累", "你好吗？"],
  },
  {
    id: "introduce",
    keywords: ["my name", "i am called", "i'm called", "introduce", "wo jiao", "name is", "call me"],
    zhKeywords: ["我叫", "名字", "介绍", "我是"],
    reply: {
      zh: "很高兴认识你！我是你的中文老师小敏。你是哪国人？你在学习中文吗？",
      pinyin: "Hěn gāoxìng rènshi nǐ! Wǒ shì nǐ de Zhōngwén lǎoshī Xiǎomǐn. Nǐ shì nǎ guó rén? Nǐ zài xuéxí Zhōngwén ma?",
      en: "Nice to meet you! I'm Xiaomin, your Chinese teacher. What nationality are you? Are you studying Chinese?",
    },
    tips: [
      "我叫 means 'I am called'. 我是 alone needs a noun: 我是学生, 我是老师.",
      "Name order in China is surname first: 王小明 → Mr Wang, given name Xiaoming.",
    ],
    vocab: [
      { zh: "我叫", pinyin: "wǒ jiào", en: "my name is" },
      { zh: "哪国人", pinyin: "nǎ guó rén", en: "what nationality" },
      { zh: "认识", pinyin: "rènshi", en: "to know (someone)" },
    ],
    suggestions: ["我是南非人", "我是学生", "很高兴认识你"],
  },
  {
    id: "thanks",
    keywords: ["thank", "thanks", "xiexie", "xie xie", "appreciate"],
    zhKeywords: ["谢谢", "感谢"],
    reply: {
      zh: "不客气！你很有礼貌。记住，别人说谢谢的时候，我们说“不客气”或者“没事”。",
      pinyin: "Bú kèqi! Nǐ hěn yǒu lǐmào. Jìzhù, biérén shuō xièxie de shíhou, wǒmen shuō “bú kèqi” huòzhě “méi shì”.",
      en: "You're welcome! You're very polite. Remember, when someone says thank you we say 'bú kèqi' or 'méi shì'.",
    },
    tips: [
      "不客气 = polite 'you're welcome'; 没事 = casual 'no worries'.",
      "The second 谢 in 谢谢 is neutral: xie-xie, not xiè-xiè.",
    ],
    vocab: [
      { zh: "不客气", pinyin: "bú kèqi", en: "you're welcome" },
      { zh: "礼貌", pinyin: "lǐmào", en: "polite" },
      { zh: "没事", pinyin: "méi shì", en: "no problem" },
    ],
    suggestions: ["不客气", "谢谢老师", "没事"],
  },
  {
    id: "goodbye",
    keywords: ["bye", "goodbye", "see you", "zaijian", "good night"],
    zhKeywords: ["再见", "拜拜", "晚安"],
    reply: {
      zh: "再见！明天我们再练习。别忘了听中文歌，慢慢地听。",
      pinyin: "Zàijiàn! Míngtiān wǒmen zài liànxí. Bié wàng le tīng Zhōngwén gē, mànmàn de tīng.",
      en: "Goodbye! We'll practise again tomorrow. Don't forget to listen to Chinese songs, slowly.",
    },
    tips: [
      "再见 literally means 'see again'. 明天见 = see you tomorrow.",
      "晚安 (good night) is only used when someone is going to sleep.",
    ],
    vocab: [
      { zh: "再见", pinyin: "zàijiàn", en: "goodbye" },
      { zh: "明天见", pinyin: "míngtiān jiàn", en: "see you tomorrow" },
      { zh: "练习", pinyin: "liànxí", en: "to practise" },
    ],
    suggestions: ["再见，老师", "明天见", "晚安"],
  },
  {
    id: "food",
    keywords: ["food", "eat", "hungry", "order", "restaurant", "menu", "noodle", "rice", "dumpling", "hotpot", "waiter", "吃饭", "吃饭"],
    zhKeywords: ["吃", "饿", "菜单", "面条", "饺子", "米饭", "火锅", "服务员", "点菜"],
    reply: {
      zh: "欢迎光临！请坐。这是菜单。你想吃什么？我们有牛肉面、饺子和米饭。你要辣的吗？",
      pinyin: "Huānyíng guānglín! Qǐng zuò. Zhè shì càidān. Nǐ xiǎng chī shénme? Wǒmen yǒu niúròumiàn, jiǎozi hé mǐfàn. Nǐ yào là de ma?",
      en: "Welcome! Please sit. This is the menu. What would you like to eat? We have beef noodles, dumplings and rice. Do you want it spicy?",
    },
    tips: [
      "我要 + dish = I'll have… 不要辣 (not spicy) or 微辣 (mildly spicy) are essential.",
      "The measure word for a bowl is 碗: 一碗面. For a plate, 一盘.",
    ],
    vocab: [
      { zh: "我要", pinyin: "wǒ yào", en: "I would like" },
      { zh: "不要辣", pinyin: "bú yào là", en: "not spicy" },
      { zh: "好吃", pinyin: "hǎochī", en: "delicious" },
    ],
    suggestions: ["我要一碗牛肉面，不要辣", "有素食吗？", "请给我一杯热水"],
  },
  {
    id: "money",
    keywords: ["how much", "price", "expensive", "cheap", "pay", "bill", "money", "cost", "duoshao", "kuai", "discount"],
    zhKeywords: ["多少钱", "贵", "便宜", "买单", "块", "现金", "扫码", "扫码"],
    reply: {
      zh: "这个二十五块。可以扫码，也可以给现金。你要买单吗？一共二十五块。",
      pinyin: "Zhège èrshíwǔ kuài. Kěyǐ sǎomǎ, yě kěyǐ gěi xiànjīn. Nǐ yào mǎidān ma? Yígòng èrshíwǔ kuài.",
      en: "This is 25 yuan. You can scan the QR code or pay cash. Would you like the bill? That's 25 yuan in total.",
    },
    tips: [
      "多少钱 = how much money. 块 is the spoken word for yuan; 元 is the written one.",
      "太贵了! (too expensive) then 便宜一点吧 (a little cheaper) is the polite haggle.",
    ],
    vocab: [
      { zh: "多少钱", pinyin: "duōshao qián", en: "how much" },
      { zh: "扫码", pinyin: "sǎomǎ", en: "scan the QR code" },
      { zh: "一共", pinyin: "yígòng", en: "in total" },
    ],
    suggestions: ["太贵了！便宜一点吧", "我扫码", "可以刷卡吗？"],
  },
  {
    id: "transport",
    keywords: ["taxi", "metro", "subway", "station", "how do i get", "directions", "airport", "train", "bus", "driver", "lost", "where is"],
    zhKeywords: ["出租车", "地铁", "怎么走", "司机", "火车站", "机场", "公交车", "在哪里", "在哪儿", "师傅"],
    reply: {
      zh: "师傅，请去地铁站。大概多久？一直走，然后左转。谢谢你！",
      pinyin: "Shīfu, qǐng qù dìtiězhàn. Dàgài duō jiǔ? Yìzhí zǒu, ránhòu zuǒ zhuǎn. Xièxie nǐ!",
      en: "Driver, please go to the metro station. About how long? Go straight, then turn left. Thank you!",
    },
    tips: [
      "Call any driver 师傅 (shīfu) — respectful and friendly.",
      "在哪儿? (zài nǎr) = where is it? Put the place first: 洗手间在哪儿？",
    ],
    vocab: [
      { zh: "地铁站", pinyin: "dìtiězhàn", en: "metro station" },
      { zh: "怎么走", pinyin: "zěnme zǒu", en: "how do I get there" },
      { zh: "一直走", pinyin: "yìzhí zǒu", en: "go straight" },
    ],
    suggestions: ["师傅，去火车站", "地铁站在哪儿？", "多少钱？"],
  },
  {
    id: "hotel",
    keywords: ["hotel", "room", "check in", "booking", "reservation", "wifi", "password", "shower", "stay"],
    zhKeywords: ["酒店", "房间", "预订", "入住", "退房", "密码", "热水", "空调", "Wi-Fi"],
    reply: {
      zh: "欢迎！您有预订吗？您的房间在三楼，这是房卡。Wi-Fi密码在桌子上。需要热水吗？",
      pinyin: "Huānyíng! Nín yǒu yùdìng ma? Nín de fángjiān zài sān lóu, zhè shì fángkǎ. Wi-Fi mìmǎ zài zhuōzi shàng. Xūyào rèshuǐ ma?",
      en: "Welcome! Do you have a reservation? Your room is on the third floor, here is your key card. The Wi-Fi password is on the table. Do you need hot water?",
    },
    tips: [
      "您 is the polite 'you'. Hotel staff use it with guests — you can use it back.",
      "三楼 = third floor (Chinese floors start at 1, so 三楼 is two flights up).",
    ],
    vocab: [
      { zh: "预订", pinyin: "yùdìng", en: "reservation" },
      { zh: "房卡", pinyin: "fángkǎ", en: "room card" },
      { zh: "热水", pinyin: "rèshuǐ", en: "hot water" },
    ],
    suggestions: ["我有预订，三个晚上", "Wi-Fi密码是什么？", "几点退房？"],
  },
  {
    id: "tones",
    keywords: ["tone", "pinyin", "pronounce", "pronunciation", "sound", "accent", "shengdiao", "mandarin"],
    zhKeywords: ["声调", "拼音", "发音"],
    reply: {
      zh: "跟我读：妈 mā，麻 má，马 mǎ，骂 mà。第一声高平，第二声上升，第三声下降再升，第四声快速下降。慢慢来！",
      pinyin: "Gēn wǒ dú: mā, má, mǎ, mà. Dì yī shēng gāo píng, dì èr shēng shàngshēng, dì sān shēng xiàjiàng zài shēng, dì sì shēng kuàisù xiàjiàng. Màn màn lái!",
      en: "Repeat after me: mā (mother), má (hemp), mǎ (horse), mà (scold). 1st tone high and flat, 2nd rising, 3rd dips then rises, 4th falls sharply. Take it slowly!",
    },
    tips: [
      "Record yourself and compare — tone errors are usually pitch, not volume.",
      "Practice tone pairs: 你好 (ní hǎo), 可以 (ké yǐ), 很好 (hén hǎo).",
    ],
    vocab: [
      { zh: "声调", pinyin: "shēngdiào", en: "tone" },
      { zh: "拼音", pinyin: "pīnyīn", en: "pinyin" },
      { zh: "慢慢来", pinyin: "màn màn lái", en: "take your time" },
    ],
    suggestions: ["妈麻马骂", "请说慢一点", "我发音不好"],
  },
  {
    id: "numbers",
    keywords: ["number", "count", "one two three", "how many", "age", "how old"],
    zhKeywords: ["数字", "多少", "几", "岁", "一二三"],
    reply: {
      zh: "我们一起数：一、二、三、四、五、六、七、八、九、十。十一、二十、三十。你几岁？",
      pinyin: "Wǒmen yìqǐ shǔ: yī, èr, sān, sì, wǔ, liù, qī, bā, jiǔ, shí. Shíyī, èrshí, sānshí. Nǐ jǐ suì?",
      en: "Let's count together: 1, 2, 3, 4, 5, 6, 7, 8, 9, 10. Eleven, twenty, thirty. How old are you?",
    },
    tips: [
      "11 = 十一 (ten + one), 21 = 二十一 (two + ten + one).",
      "Use 两 (liǎng), not 二, before measure words: 两个人 (two people).",
    ],
    vocab: [
      { zh: "几岁", pinyin: "jǐ suì", en: "how old (children)" },
      { zh: "两", pinyin: "liǎng", en: "two (before measure words)" },
      { zh: "一起", pinyin: "yìqǐ", en: "together" },
    ],
    suggestions: ["我二十五岁", "一二三四五", "多少钱？"],
  },
  {
    id: "time",
    keywords: ["what time", "today", "tomorrow", "yesterday", "meet", "appointment", "jidian", "schedule"],
    zhKeywords: ["几点", "今天", "明天", "昨天", "见面", "时间", "星期"],
    reply: {
      zh: "现在三点半。明天下午四点你有时间吗？我们在茶店见面，怎么样？",
      pinyin: "Xiànzài sān diǎn bàn. Míngtiān xiàwǔ sì diǎn nǐ yǒu shíjiān ma? Wǒmen zài chádiàn jiànmiàn, zěnmeyàng?",
      en: "It's 3:30 now. Do you have time tomorrow at 4pm? Shall we meet at the tea shop?",
    },
    tips: [
      "几点 (jǐ diǎn) = what time. 半 = half past: 三点半 = 3:30.",
      "Time expressions go before the verb: 明天见 (see you tomorrow).",
    ],
    vocab: [
      { zh: "几点", pinyin: "jǐ diǎn", en: "what time" },
      { zh: "下午", pinyin: "xiàwǔ", en: "afternoon" },
      { zh: "见面", pinyin: "jiànmiàn", en: "to meet" },
    ],
    suggestions: ["明天下午四点可以", "现在几点？", "我们几点见面？"],
  },
  {
    id: "weather",
    keywords: ["weather", "rain", "hot", "cold", "snow", "sunny", "temperature"],
    zhKeywords: ["天气", "下雨", "很热", "很冷", "下雪", "度"],
    reply: {
      zh: "今天天气很好，不冷也不热。你带伞了吗？天气预报说晚上可能下雨。",
      pinyin: "Jīntiān tiānqì hěn hǎo, bù lěng yě bú rè. Nǐ dài sǎn le ma? Tiānqì yùbào shuō wǎnshang kěnéng xià yǔ.",
      en: "The weather is nice today — not cold, not hot. Did you bring an umbrella? The forecast says it may rain tonight.",
    },
    tips: [
      "热 is hot, 冷 is cold. 太热了! is a very common complaint in summer.",
      "天 is literally 'sky'; 天气 is the weather.",
    ],
    vocab: [
      { zh: "天气", pinyin: "tiānqì", en: "weather" },
      { zh: "下雨", pinyin: "xià yǔ", en: "to rain" },
      { zh: "伞", pinyin: "sǎn", en: "umbrella" },
    ],
    suggestions: ["今天太热了", "会下雨吗？", "很冷"],
  },
  {
    id: "family",
    keywords: ["family", "mother", "father", "mum", "dad", "brother", "sister", "children", "married", "wife", "husband"],
    zhKeywords: ["家人", "妈妈", "爸爸", "哥哥", "姐姐", "弟弟", "妹妹", "结婚", "孩子"],
    reply: {
      zh: "我家有四口人：爸爸、妈妈、妹妹和我。你家里有几口人？你有兄弟姐妹吗？",
      pinyin: "Wǒ jiā yǒu sì kǒu rén: bàba, māma, mèimei hé wǒ. Nǐ jiā lǐ yǒu jǐ kǒu rén? Nǐ yǒu xiōngdì jiěmèi ma?",
      en: "There are four people in my family: dad, mum, my younger sister and me. How many people are in your family? Do you have siblings?",
    },
    tips: [
      "Chinese distinguishes older/younger siblings: 哥哥 older brother, 弟弟 younger brother.",
      "Count family members with 口: 我家有五口人.",
    ],
    vocab: [
      { zh: "家人", pinyin: "jiārén", en: "family members" },
      { zh: "几口人", pinyin: "jǐ kǒu rén", en: "how many people (family)" },
      { zh: "妹妹", pinyin: "mèimei", en: "younger sister" },
    ],
    suggestions: ["我家有三口人", "我有一个哥哥", "我结婚了"],
  },
  {
    id: "study",
    keywords: ["study", "work", "job", "school", "university", "student", "office", "meeting", "career", "major", "learn"],
    zhKeywords: ["学习", "工作", "学校", "学生", "公司", "开会", "专业", "中文"],
    reply: {
      zh: "我在一家中文学校工作。我是老师，也在学习新的东西。你在哪里工作？或者你在哪里学习？",
      pinyin: "Wǒ zài yì jiā Zhōngwén xuéxiào gōngzuò. Wǒ shì lǎoshī, yě zài xuéxí xīn de dōngxi. Nǐ zài nǎlǐ gōngzuò? Huòzhě nǐ zài nǎlǐ xuéxí?",
      en: "I work at a Chinese language school. I'm a teacher and I'm also learning new things. Where do you work? Or where do you study?",
    },
    tips: [
      "在 + place + 工作 = work at a place. 在 + verb = ongoing action: 我在学习.",
      "A polite follow-up to 你好吗 is 你最近忙吗? (have you been busy?).",
    ],
    vocab: [
      { zh: "工作", pinyin: "gōngzuò", en: "work / job" },
      { zh: "学校", pinyin: "xuéxiào", en: "school" },
      { zh: "老师", pinyin: "lǎoshī", en: "teacher" },
    ],
    suggestions: ["我在一家公司工作", "我是学生", "我在学习中文"],
  },
  {
    id: "phone",
    keywords: ["wechat", "phone", "app", "alipay", "internet", "wifi", "scan", "qr", "social media", "how to pay"],
    zhKeywords: ["微信", "手机", "支付宝", "扫码", "网络", "二维码", "上网"],
    reply: {
      zh: "在中国，我们用微信聊天、付钱、叫车。你有微信吗？我们可以扫码。要不要互相加一下？",
      pinyin: "Zài Zhōngguó, wǒmen yòng Wēixìn liáotiān, fù qián, jiào chē. Nǐ yǒu Wēixìn ma? Wǒmen kěyǐ sǎomǎ. Yào bu yào hùxiāng jiā yíxià?",
      en: "In China we use WeChat to chat, pay and call a taxi. Do you have WeChat? We can scan the code. Shall we add each other?",
    },
    tips: [
      "要不要…? is a soft 'how about…?' — friendlier than a direct question.",
      "二维码 (QR code) is literally 'two-dimensional code'.",
    ],
    vocab: [
      { zh: "微信", pinyin: "Wēixìn", en: "WeChat" },
      { zh: "扫码", pinyin: "sǎomǎ", en: "scan the code" },
      { zh: "付钱", pinyin: "fù qián", en: "to pay" },
    ],
    suggestions: ["可以加你微信吗？", "我扫码", "有Wi-Fi吗？"],
  },
  {
    id: "health",
    keywords: ["sick", "doctor", "hospital", "hurt", "pain", "emergency", "help me", "medicine", "fever", "allergy", "pharmacy"],
    zhKeywords: ["医院", "医生", "疼", "发烧", "药", "不舒服", "救命", "帮帮我", "过敏", "护照丢了"],
    reply: {
      zh: "别担心，我帮你。你怎么了？哪里不舒服？需要去医院吗？",
      pinyin: "Bié dānxīn, wǒ bāng nǐ. Nǐ zěnme le? Nǎlǐ bù shūfu? Xūyào qù yīyuàn ma?",
      en: "Don't worry, I'll help you. What's wrong? Where does it hurt? Do you need to go to the hospital?",
    },
    tips: [
      "Emergency numbers: police 110, ambulance 120, fire 119.",
      "Say symptoms with 我 + body part + 疼: 我头疼 (my head hurts).",
    ],
    vocab: [
      { zh: "不舒服", pinyin: "bù shūfu", en: "unwell" },
      { zh: "医院", pinyin: "yīyuàn", en: "hospital" },
      { zh: "帮忙", pinyin: "bāngmáng", en: "to help" },
    ],
    suggestions: ["我发烧了", "医院在哪儿？", "我肚子疼"],
  },
  {
    id: "polite",
    keywords: ["sorry", "excuse me", "please", "thank you very much", "apologise", "polite", "how to be polite"],
    zhKeywords: ["对不起", "请问", "不好意思", "请", "麻烦"],
    reply: {
      zh: "你可以说“请问”来开始问题，说“不好意思”表示打扰，说“对不起”表示道歉。请问，你需要什么帮助？",
      pinyin: "Nǐ kěyǐ shuō “qǐngwèn” lái kāishǐ wèntí, shuō “bù hǎoyìsi” biǎoshì dǎrǎo, shuō “duìbuqǐ” biǎoshì dàoqiàn. Qǐngwèn, nǐ xūyào shénme bāngzhù?",
      en: "Say 'qǐngwèn' to start a question, 'bù hǎoyìsi' to excuse yourself, and 'duìbuqǐ' for a real apology. May I ask, what help do you need?",
    },
    tips: [
      "请问 before a question makes any stranger willing to help.",
      "Don't over-apologise: 对不起 is heavy. 不好意思 is the everyday bump.",
    ],
    vocab: [
      { zh: "请问", pinyin: "qǐngwèn", en: "may I ask" },
      { zh: "不好意思", pinyin: "bù hǎoyìsi", en: "excuse me / my bad" },
      { zh: "对不起", pinyin: "duìbuqǐ", en: "sorry" },
    ],
    suggestions: ["请问，洗手间在哪儿？", "不好意思", "谢谢你"],
  },
  {
    id: "culture",
    keywords: ["culture", "festival", "new year", "gift", "etiquette", "taboo", "lucky", "tea", "chopsticks", "red envelope"],
    zhKeywords: ["文化", "春节", "红包", "礼物", "礼貌", "茶", "筷子", "数字"],
    reply: {
      zh: "中国文化很有意思。春节是最大的节日，大家吃饺子、发红包。数字八很幸运，四不太好。你喜欢中国的什么？",
      pinyin: "Zhōngguó wénhuà hěn yǒu yìsi. Chūnjié shì zuì dà de jiérì, dàjiā chī jiǎozi, fā hóngbāo. Shùzì bā hěn xìngyùn, sì bú tài hǎo. Nǐ xǐhuan Zhōngguó de shénme?",
      en: "Chinese culture is fascinating. Spring Festival is the biggest holiday — people eat dumplings and give red envelopes. Eight is lucky; four is not so good. What do you like about China?",
    },
    tips: [
      "Give and receive gifts with both hands. Don't gift clocks, knives or four of anything.",
      "春卷, 饺子 and 鱼 are classic New Year foods with lucky meanings.",
    ],
    vocab: [
      { zh: "春节", pinyin: "Chūnjié", en: "Spring Festival" },
      { zh: "红包", pinyin: "hóngbāo", en: "red envelope" },
      { zh: "文化", pinyin: "wénhuà", en: "culture" },
    ],
    suggestions: ["我喜欢中国文化", "春节快乐", "为什么八很幸运？"],
  },
  {
    id: "shopping",
    keywords: ["shopping", "buy", "cheaper", "discount", "size", "clothes", "market", "try on", "colour"],
    zhKeywords: ["买", "太贵", "便宜", "打折", "试穿", "颜色", "大号", "衣服"],
    reply: {
      zh: "欢迎！这件衣服有大号的，颜色有蓝色和黑色。你要试穿吗？今天可以打八折。",
      pinyin: "Huānyíng! Zhè jiàn yīfu yǒu dàhào de, yánsè yǒu lánsè hé hēisè. Nǐ yào shìchuān ma? Jīntiān kěyǐ dǎ bā zhé.",
      en: "Welcome! This item comes in a large, in blue and black. Would you like to try it on? Today you can get 20% off.",
    },
    tips: [
      "八折 literally means '80%' — pay 80%, i.e. 20% off.",
      "Ask 有没有大号的? (do you have a large?) — 的 replaces the noun.",
    ],
    vocab: [
      { zh: "试穿", pinyin: "shìchuān", en: "try on" },
      { zh: "打折", pinyin: "dǎzhé", en: "discount" },
      { zh: "颜色", pinyin: "yánsè", en: "colour" },
    ],
    suggestions: ["我可以试穿吗？", "太贵了，便宜一点", "有大号的吗？"],
  },
  {
    id: "hobbies",
    keywords: ["hobby", "like", "love", "music", "movie", "travel", "sport", "football", "free time", "fun"],
    zhKeywords: ["爱好", "喜欢", "音乐", "电影", "旅游", "运动", "足球"],
    reply: {
      zh: "我喜欢听音乐和旅游。周末我常常去公园跑步。你喜欢做什么？你的爱好是什么？",
      pinyin: "Wǒ xǐhuan tīng yīnyuè hé lǚyóu. Zhōumò wǒ chángcháng qù gōngyuán pǎobù. Nǐ xǐhuan zuò shénme? Nǐ de àihào shì shénme?",
      en: "I like listening to music and travelling. On weekends I often go running in the park. What do you like to do? What are your hobbies?",
    },
    tips: [
      "喜欢 is followed directly by a verb or noun: 喜欢喝茶, 喜欢音乐.",
      "常常 (often), 有时候 (sometimes), 从来不 (never) go before the verb.",
    ],
    vocab: [
      { zh: "爱好", pinyin: "àihào", en: "hobby" },
      { zh: "喜欢", pinyin: "xǐhuan", en: "to like" },
      { zh: "周末", pinyin: "zhōumò", en: "weekend" },
    ],
    suggestions: ["我喜欢听音乐", "我喜欢旅游", "你呢？"],
  },
  {
    id: "confused",
    keywords: ["don't understand", "dont understand", "repeat", "slower", "too fast", "confused", "hard", "difficult", "say again"],
    zhKeywords: ["听不懂", "不懂", "慢一点", "再说一遍", "难"],
    reply: {
      zh: "没问题！我们慢慢来。我说慢一点，你听：你、叫、什、么、名、字？你可以再说一遍吗？",
      pinyin: "Méi wèntí! Wǒmen màn màn lái. Wǒ shuō màn yìdiǎn, nǐ tīng: nǐ, jiào, shén, me, míng, zi? Nǐ kěyǐ zài shuō yí biàn ma?",
      en: "No problem! Let's take it slowly. I'll speak slowly — listen: nǐ, jiào, shén, me, míng, zi? Can you say it again?",
    },
    tips: [
      "听不懂 = I don't understand (by ear). 看不懂 = I can't read it.",
      "These two sentences will save you constantly: 请说慢一点 and 可以再说一遍吗?",
    ],
    vocab: [
      { zh: "听不懂", pinyin: "tīng bu dǒng", en: "don't understand (hearing)" },
      { zh: "慢一点", pinyin: "màn yìdiǎn", en: "a little slower" },
      { zh: "再说一遍", pinyin: "zài shuō yí biàn", en: "say it again" },
    ],
    suggestions: ["请说慢一点", "可以再说一遍吗？", "请写下来"],
  },
];

type DictionaryEntry = { zh: string; pinyin: string; en: string };

const DICTIONARY: DictionaryEntry[] = (() => {
  const seen = new Set<string>();
  const list: DictionaryEntry[] = [];
  const push = (entry: DictionaryEntry) => {
    if (seen.has(entry.zh) || entry.zh.length > 8) return;
    seen.add(entry.zh);
    list.push(entry);
  };
  for (const item of REVIEW_DECK) push({ zh: item.zh, pinyin: item.pinyin, en: item.en });
  for (const [zh, pinyin, en] of [
    ["你好", "nǐ hǎo", "hello"],
    ["谢谢", "xièxie", "thank you"],
    ["再见", "zàijiàn", "goodbye"],
    ["我爱你", "wǒ ài nǐ", "I love you"],
    ["我叫", "wǒ jiào", "my name is"],
    ["多少钱", "duōshao qián", "how much"],
    ["听不懂", "tīng bu dǒng", "I don't understand"],
    ["请说慢一点", "qǐng shuō màn yìdiǎn", "please speak slower"],
    ["我是学生", "wǒ shì xuésheng", "I am a student"],
    ["你叫什么名字", "nǐ jiào shénme míngzi", "what is your name"],
    ["洗手间在哪儿", "xǐshǒujiān zài nǎr", "where is the toilet"],
    ["我饿了", "wǒ è le", "I'm hungry"],
    ["我很好", "wǒ hěn hǎo", "I'm fine"],
  ] as const) {
    push({ zh, pinyin, en });
  }
  return list;
})();

function findMatch(message: string): DictionaryEntry | undefined {
  const trimmed = message.trim();
  if (!trimmed) return undefined;
  const normalized = normalize(trimmed);

  const chinese = DICTIONARY.filter((entry) => CHINESE_RE.test(trimmed) && trimmed.includes(entry.zh)).sort(
    (a, b) => b.zh.length - a.zh.length,
  );
  if (chinese.length > 0) return chinese[0];

  if (/^[a-zA-ZüÜ\u0100-\u01ff\s'?.,!]+$/.test(trimmed)) {
    const pinyinMatch = DICTIONARY.find((entry) => {
      const key = normalize(entry.pinyin);
      return key.length >= 4 && normalized.includes(key);
    });
    if (pinyinMatch) return pinyinMatch;
  }

  if (!CHINESE_RE.test(trimmed)) {
    const englishMatch = DICTIONARY.find((entry) => {
      const english = entry.en.toLowerCase().replace(/[()]/g, "");
      return english.length >= 4 && trimmed.toLowerCase().includes(english);
    });
    if (englishMatch) return englishMatch;
  }

  return undefined;
}

const TOPIC_PRIORITY: Record<string, number> = {
  health: 10,
  confused: 9,
  food: 8,
  money: 8,
  transport: 8,
  hotel: 8,
  shopping: 7,
  phone: 7,
  tones: 7,
  numbers: 6,
  time: 6,
  family: 6,
  study: 6,
  weather: 5,
  culture: 5,
  polite: 4,
  hobbies: 4,
  introduce: 3,
  greeting: 1,
  howareyou: 1,
  thanks: 1,
  goodbye: 1,
};

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function englishHit(lower: string, keyword: string): boolean {
  const clean = keyword.trim().toLowerCase();
  if (!clean) return false;
  const pattern = new RegExp(`(^|[^a-z])${escapeRegExp(clean)}([^a-z]|$)`, "i");
  return pattern.test(` ${lower} `);
}

function detectTopics(message: string): Topic[] {
  const lower = message.toLowerCase();
  const plain = normalize(message);
  const hits = TOPICS.filter((topic) => {
    const english = topic.keywords.some((keyword) => englishHit(lower, keyword));
    const chinese = (topic.zhKeywords ?? []).some(
      (keyword) => message.includes(keyword) || plain.includes(normalize(keyword)),
    );
    return english || chinese;
  });
  return hits.sort((a, b) => (TOPIC_PRIORITY[b.id] ?? 0) - (TOPIC_PRIORITY[a.id] ?? 0));
}

const CORRECTIONS: Array<{ pattern: RegExp; fix: string }> = [
  {
    pattern: /\bwo shi (hao|fine|good|okay)\b/i,
    fix: "Use 我很好 (wǒ hěn hǎo) to say 'I'm fine' — 我是 needs a noun, like 我是学生.",
  },
  {
    pattern: /\bni hao ma ma\b/i,
    fix: "Drop the extra 吗: 你好吗？(nǐ hǎo ma?) already is the question.",
  },
  {
    pattern: /\b(xie xie ni|xièxiè nǐ)\b/i,
    fix: "谢谢 on its own is enough. 谢谢你 is fine too, but never double the tone: say xie-xie.",
  },
  {
    pattern: /\bwo hěn hǎo\b/,
    fix: "Check the tone mark on 很: hěn (3rd tone), so 我很好 is wǒ hěn hǎo.",
  },
  {
    pattern: /two (person|people)/i,
    fix: "Use 两个 (liǎng ge), not 二个: 两个人 = two people.",
  },
  {
    pattern: /\bwo jiao shi\b/i,
    fix: "Don't add 是 after 叫: 我叫 Anna = 'I'm called Anna'.",
  },
  {
    pattern: /\b(hen hao|hen shi)\b/i,
    fix: "Add the tone marks when you write pinyin: hěn hǎo. It trains your ear as well as your eye.",
  },
];

function countTurns(turn: number): string {
  if (turn <= 1) return "Let's warm up with something small.";
  if (turn <= 4) return "You're getting into a rhythm.";
  if (turn <= 8) return "Nice — your turns are getting longer.";
  return "Look at you holding a whole conversation in Chinese.";
}

export function buildLocalReply(message: string, turn = 1): TutorReply {
  const text = message.trim();
  const seed = seedOf(text) + turn * 7;
  const matched = findMatch(text);
  const topics = detectTopics(text);
  const isChinese = CHINESE_RE.test(text);
  const asciiOnly = /^[a-zA-ZüÜ\u0100-\u01ff\s'?.,!]+$/.test(text);
  const looksEnglish = text
    .toLowerCase()
    .split(/[^a-z']+/)
    .filter(Boolean)
    .some((word) => ENGLISH_STOPWORDS.has(word));
  const pinyinOnly = !isChinese && asciiOnly && !looksEnglish;
  const toneMarks = hasToneMarks(text);

  const tips: string[] = [];
  let topic: Topic | undefined = topics[0];

  if (!topic && matched) {
    const byMeaning = TOPICS.find((entry) =>
      entry.vocab.some((vocab) => vocab.zh === matched.zh) ||
      entry.reply.zh.includes(matched.zh),
    );
    topic = byMeaning;
  }

  if (!topic) {
    if (pinyinOnly) {
      topic = TOPICS.find((entry) => entry.id === "confused");
    } else if (isChinese) {
      topic = TOPICS.find((entry) => entry.id === "confused");
    } else {
      const fallbackPool = ["food", "hobbies", "culture", "polite"];
      const id = pick(fallbackPool, seed);
      topic = TOPICS.find((entry) => entry.id === id);
    }
    topic = topic ?? TOPICS[0];
  }

  let coach: string;
  if (isChinese) {
    coach = matched
      ? `I recognised “${matched.zh}” (${matched.pinyin}) — “${matched.en}”. ${countTurns(turn)}`
      : `You wrote in Chinese characters — brilliant. I understood the gist; ${countTurns(turn).toLowerCase()}`;
  } else if (pinyinOnly) {
    coach = toneMarks
      ? `Good: you used tone marks. Keep the pitch high and short where the mark falls. ${countTurns(turn)}`
      : `I read your pinyin. To be understood, add tone marks (nǐ hǎo, not ni hao) — they carry the meaning. ${countTurns(turn)}`;
  } else {
    coach = `Let's turn that into Mandarin. ${countTurns(turn)}`;
  }

  if (pinyinOnly && !toneMarks) {
    tips.push("Try writing the same phrase with tones, then say it aloud slowly.");
  }
  if (isChinese && matched && matched.zh !== topic.reply.zh) {
    tips.push(`You said “${matched.zh}” (${matched.en}). I'll answer in Mandarin and keep it short.`);
  }
  if (isChinese && text.length > 0 && text.length <= 4 && !matched) {
    tips.push("Short and clear is good. Add a subject next time: 我 / 你 + verb.");
  }

  const correction = CORRECTIONS.find((entry) => entry.pattern.test(text));
  if (correction) tips.push(`Correction: ${correction.fix}`);

  tips.push(pick(topic.tips, seed + 1));
  for (const extra of topic.tips) {
    if (tips.length >= 2) break;
    if (!tips.includes(extra)) tips.push(extra);
  }

  const vocab: TutorVocab[] = [...topic.vocab];
  if (matched && !vocab.some((entry) => entry.zh === matched.zh)) {
    vocab.unshift({ zh: matched.zh, pinyin: matched.pinyin, en: matched.en });
  }

  const suggestions = [...topic.suggestions];
  if (matched && matched.zh.length <= 6) {
    const extra = `再说一次「${matched.zh}」`;
    if (!suggestions.includes(extra)) suggestions.push(extra);
  }

  return {
    zh: topic.reply.zh,
    pinyin: topic.reply.pinyin,
    en: topic.reply.en,
    coach,
    tips: Array.from(new Set(tips)).slice(0, 3),
    vocab: vocab.slice(0, 4),
    suggestions: suggestions.slice(0, 4),
    matched: matched ? { zh: matched.zh, pinyin: matched.pinyin, en: matched.en } : undefined,
    engine: "local",
  };
}

type OpenAiResponse = {
  choices?: Array<{ message?: { content?: string } }>;
};


type GeminiResponse = {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: string }>;
    };
  }>;
};

export async function buildAiReply(
  message: string,
  turn: number,
  history: Array<{ role: string; content: string }>,
): Promise<TutorReply> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) return buildLocalReply(message, turn);

  const system = [
    "You are Xiaomin (小敏), a warm Mandarin Chinese conversation partner for an English-speaking beginner.",
    "Use short natural beginner Mandarin, HSK 1-2 vocabulary.",
    "Provide Chinese, tone-marked pinyin, and English translation.",
    "Gently correct mistakes.",
    "Return ONLY JSON with keys: zh, pinyin, en, coach, tips, vocab, suggestions.",
    "vocab must contain objects with zh, pinyin and en.",
  ].join(" ");

  try {
    const contents = [
      ...history.slice(-8).map((entry) => ({
        role: entry.role === "assistant" ? "model" : "user",
        parts: [{ text: entry.content }],
      })),
      { role: "user", parts: [{ text: message }] },
    ];

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: system }] },
          contents,
          generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.7,
            maxOutputTokens: 1200,
          },
        }),
        signal: AbortSignal.timeout(20000),
      },
    );

    if (!response.ok) {
      console.error("Gemini API error:", response.status, await response.text());
      return buildLocalReply(message, turn);
    }

    const data = (await response.json()) as GeminiResponse;
    const raw = data.candidates?.[0]?.content?.parts
      ?.map((part) => part.text ?? "")
      .join("");

    if (!raw) return buildLocalReply(message, turn);

    const parsed = JSON.parse(raw) as Partial<TutorReply>;

    if (!parsed.zh || !parsed.pinyin || !parsed.en) {
      return buildLocalReply(message, turn);
    }

    return {
      zh: parsed.zh,
      pinyin: parsed.pinyin,
      en: parsed.en,
      coach: parsed.coach ?? "Great effort — let's keep going.",
      tips: Array.isArray(parsed.tips) ? parsed.tips.slice(0, 3) : [],
      vocab: Array.isArray(parsed.vocab) ? parsed.vocab.slice(0, 4) : [],
      suggestions: Array.isArray(parsed.suggestions)
        ? parsed.suggestions.slice(0, 4)
        : [],
      matched: findMatch(message),
      engine: "openai",
    };
  } catch (error) {
    console.error("Gemini tutor error:", error);
    return buildLocalReply(message, turn);
  }
}
