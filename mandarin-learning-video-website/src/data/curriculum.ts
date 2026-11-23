export type Vocab = {
  id: string;
  zh: string;
  pinyin: string;
  en: string;
  category: string;
  note?: string;
};

export type DialogueLine = {
  who: string;
  zh: string;
  pinyin: string;
  en: string;
};

export type Lesson = {
  slug: string;
  number: number;
  unit: string;
  title: string;
  hanzi: string;
  subtitle: string;
  level: "Foundation" | "Beginner" | "Elementary" | "Pre-intermediate";
  minutes: number;
  objectives: string[];
  dialogue: DialogueLine[];
  vocab: Vocab[];
  grammar: { title: string; body: string; examples: { zh: string; pinyin: string; en: string }[] };
  practice: { prompt: string; model: string; pinyin: string; en: string };
  culture: { title: string; body: string };
};

type Seed = Omit<Lesson, "number" | "vocab"> & {
  vocab: Array<[zh: string, pinyin: string, en: string, note?: string]>;
};

const seeds: Seed[] = [
  {
    slug: "sound-lab",
    unit: "Unit 1 · First sounds",
    title: "Sound lab: pinyin & the four tones",
    hanzi: "声音",
    subtitle:
      "Everything in Mandarin starts here: initials, finals and the four tones that change meaning.",
    level: "Foundation",
    minutes: 18,
    objectives: [
      "Hear and copy the four Mandarin tones",
      "Read the pinyin you see across this site",
      "Greet someone with 你好 and answer 你好吗",
    ],
    dialogue: [
      {
        who: "陈老师 Chén lǎoshī",
        zh: "你好！你叫什么名字？",
        pinyin: "Nǐ hǎo! Nǐ jiào shénme míngzi?",
        en: "Hello! What is your name?",
      },
      {
        who: "安娜 Ānnà",
        zh: "你好！我叫安娜。",
        pinyin: "Nǐ hǎo! Wǒ jiào Ānnà.",
        en: "Hello! My name is Anna.",
      },
      {
        who: "陈老师 Chén lǎoshī",
        zh: "你好吗？",
        pinyin: "Nǐ hǎo ma?",
        en: "How are you?",
      },
      {
        who: "安娜 Ānnà",
        zh: "我很好，谢谢。你呢？",
        pinyin: "Wǒ hěn hǎo, xièxie. Nǐ ne?",
        en: "I'm very well, thank you. And you?",
      },
    ],
    vocab: [
      ["你好", "nǐ hǎo", "hello", "Literally 'you good'. Works all day."],
      ["谢谢", "xièxie", "thank you", "Second syllable is neutral tone: xie-xie."],
      ["再见", "zàijiàn", "goodbye", "'Again see' — see you again."],
      ["老师", "lǎoshī", "teacher", "Use it as a title: 陈老师."],
      ["名字", "míngzi", "name", "zi is neutral: MING-zi."],
      ["我很好", "wǒ hěn hǎo", "I'm very well", "hěn = very; the tone dips low."],
    ],
    grammar: {
      title: "The magic question particle 吗 (ma)",
      body:
        "Turn any statement into a yes/no question by adding 吗 at the end. No word order changes, no helper verb needed.",
      examples: [
        { zh: "你好吗？", pinyin: "Nǐ hǎo ma?", en: "Are you well?" },
        { zh: "他是老师吗？", pinyin: "Tā shì lǎoshī ma?", en: "Is he a teacher?" },
      ],
    },
    practice: {
      prompt: "Greet someone, say your name and ask how they are — three sentences in a row.",
      model: "你好！我叫安娜。你好吗？",
      pinyin: "Nǐ hǎo! Wǒ jiào Ānnà. Nǐ hǎo ma?",
      en: "Hello! I'm Anna. How are you?",
    },
    culture: {
      title: "Say it twice",
      body:
        "Chinese words love pairs: 谢谢, 再见, 看看. When a friendly answer is expected, repeat the verb: 好好好 means 'yes, yes, sure'. This rhythm is a big part of sounding natural.",
    },
  },
  {
    slug: "hello-i-am",
    unit: "Unit 1 · First sounds",
    title: "Hello, I am…",
    hanzi: "认识",
    subtitle: "Introduce yourself, ask names, and use the essential verb 是 (to be).",
    level: "Foundation",
    minutes: 22,
    objectives: [
      "Introduce yourself with 我叫 and 我是",
      "Ask someone's name politely",
      "Say where you are from",
      "Use 也 and 不 correctly",
    ],
    dialogue: [
      {
        who: "小李 Xiǎo Lǐ",
        zh: "请问，你叫什么名字？",
        pinyin: "Qǐngwèn, nǐ jiào shénme míngzi?",
        en: "Excuse me, what's your name?",
      },
      {
        who: "Mwangi",
        zh: "我叫姆旺吉。我是肯尼亚人。",
        pinyin: "Wǒ jiào Mwangi. Wǒ shì Kěníyà rén.",
        en: "My name is Mwangi. I'm Kenyan.",
      },
      {
        who: "小李 Xiǎo Lǐ",
        zh: "很高兴认识你！你是学生吗？",
        pinyin: "Hěn gāoxìng rènshi nǐ! Nǐ shì xuésheng ma?",
        en: "Very nice to meet you! Are you a student?",
      },
      {
        who: "Mwangi",
        zh: "不是，我是工程师。我学习中文。",
        pinyin: "Bú shì, wǒ shì gōngchéngshī. Wǒ xuéxí Zhōngwén.",
        en: "No, I'm an engineer. I study Chinese.",
      },
    ],
    vocab: [
      ["叫", "jiào", "to be called", "我叫… = my name is…"],
      ["是", "shì", "to be", "Never dropped, unlike Russian or Arabic."],
      ["人", "rén", "person", "中国人 = Chinese person."],
      ["高兴", "gāoxìng", "glad", "很高兴认识你 = nice to meet you."],
      ["认识", "rènshi", "to know (a person)", "The shi is neutral tone."],
      ["也", "yě", "also", "Put it before the verb, never after."],
      ["学生", "xuésheng", "student", "shēng is often neutral here."],
      ["工程师", "gōngchéngshī", "engineer", "Literally 'engineering master'."],
    ],
    grammar: {
      title: "A 也 B, and negating 是",
      body:
        "也 (yě) sits before the verb: 我也是 (I am too). To negate 是, use 不是 (bú shì) — 不 changes to second tone before a fourth tone.",
      examples: [
        { zh: "我也是工程师。", pinyin: "Wǒ yě shì gōngchéngshī.", en: "I'm an engineer too." },
        { zh: "她不是老师。", pinyin: "Tā bú shì lǎoshī.", en: "She is not a teacher." },
      ],
    },
    practice: {
      prompt: "Give a four-sentence introduction: name, nationality, job, and that you are learning Mandarin.",
      model: "我叫…。我是…人。我是…。我学习中文。",
      pinyin: "Wǒ jiào…. Wǒ shì…rén. Wǒ shì…. Wǒ xuéxí Zhōngwén.",
      en: "My name is…. I am from…. I am a…. I study Chinese.",
    },
    culture: {
      title: "The friendly opening",
      body:
        "Chinese introductions often start with 请问 (may I ask) and a smile. Asking 'Where are you from?' is small talk, not nosiness. Reply with 我是 + country + 人.",
    },
  },
  {
    slug: "numbers-money",
    unit: "Unit 2 · Everyday China",
    title: "Numbers & money",
    hanzi: "多少钱",
    subtitle: "Count to a thousand, ask prices and pay the Chinese way — QR code first.",
    level: "Beginner",
    minutes: 25,
    objectives: [
      "Say 0–100 and hundreds with confidence",
      "Ask 多少钱 and understand the answer",
      "Compare 块 / 毛 / 元",
      "Ask to pay by WeChat or Alipay",
    ],
    dialogue: [
      {
        who: "顾客 gùkè",
        zh: "老板，这个多少钱？",
        pinyin: "Lǎobǎn, zhège duōshao qián?",
        en: "Boss, how much is this?",
      },
      {
        who: "老板 lǎobǎn",
        zh: "二十五块。",
        pinyin: "Èrshíwǔ kuài.",
        en: "Twenty-five yuan.",
      },
      {
        who: "顾客 gùkè",
        zh: "太贵了！二十块可以吗？",
        pinyin: "Tài guì le! Èrshí kuài kěyǐ ma?",
        en: "Too expensive! Can it be twenty?",
      },
      {
        who: "老板 lǎobǎn",
        zh: "好吧，二十二块。扫码还是现金？",
        pinyin: "Hǎo ba, èrshí'èr kuài. Sǎomǎ háishì xiànjīn?",
        en: "Alright, twenty-two. QR code or cash?",
      },
      {
        who: "顾客 gùkè",
        zh: "我扫码。",
        pinyin: "Wǒ sǎomǎ.",
        en: "I'll scan the code.",
      },
    ],
    vocab: [
      ["多少", "duōshao", "how much / how many", "duōshao qián = how much money."],
      ["钱", "qián", "money", "Also the surname Qián."],
      ["块", "kuài", "yuan (colloquial)", "25块 = 25 yuan. 元 yuán is the formal word."],
      ["贵", "guì", "expensive", "太贵了 = way too expensive."],
      ["便宜", "piányi", "cheap", "便宜一点 = a bit cheaper."],
      ["扫码", "sǎomǎ", "to scan a QR code", "How almost everyone pays in China."],
      ["现金", "xiànjīn", "cash", "Cash still works — keep a little."],
      ["二维码", "èrwéimǎ", "QR code", "Literally 'two-dimensional code'."],
    ],
    grammar: {
      title: "Numbers stack like building blocks",
      body:
        "十一 = 10 + 1, 二十一 = 2 × 10 + 1, 一百零八 = 108. Only know 0–10 and you can build any number.",
      examples: [
        { zh: "三十五块", pinyin: "sānshíwǔ kuài", en: "35 yuan" },
        { zh: "一百二十", pinyin: "yībǎi èrshí", en: "120" },
      ],
    },
    practice: {
      prompt: "Ask the price of something, react that it is expensive, then offer a cheaper number.",
      model: "这个多少钱？太贵了！可以便宜一点吗？",
      pinyin: "Zhège duōshao qián? Tài guì le! Kěyǐ piányi yìdiǎn ma?",
      en: "How much is this? Too expensive! Could it be a little cheaper?",
    },
    culture: {
      title: "Two wallets: WeChat Pay & Alipay",
      body:
        "Almost every payment is a QR scan through 微信支付 (Wēixìn zhīfù) or 支付宝 (Zhīfùbǎo). At markets, tiny shops and taxis, cash is accepted but may surprise younger vendors.",
    },
  },
  {
    slug: "food-water",
    unit: "Unit 2 · Everyday China",
    title: "Food, drink & ordering",
    hanzi: "吃饭",
    subtitle: "Order noodles, ask for no chilli, and get the bill without a word of English.",
    level: "Beginner",
    minutes: 28,
    objectives: [
      "Order with 我要 and 请给我",
      "Say what you don't eat",
      "Ask for the bill and takeaway",
      "Recognise 10 staple dishes",
    ],
    dialogue: [
      {
        who: "服务员 fúwùyuán",
        zh: "几位？",
        pinyin: "Jǐ wèi?",
        en: "How many people?",
      },
      {
        who: "顾客 gùkè",
        zh: "两位。请给我菜单。",
        pinyin: "Liǎng wèi. Qǐng gěi wǒ càidān.",
        en: "Two people. Please give me the menu.",
      },
      {
        who: "顾客 gùkè",
        zh: "我要一碗牛肉面，不要辣。再来一壶茶。",
        pinyin: "Wǒ yào yì wǎn niúròumiàn, bú yào là. Zài lái yì hú chá.",
        en: "I'd like a bowl of beef noodles, not spicy. And a pot of tea.",
      },
      {
        who: "服务员 fúwùyuán",
        zh: "好的。要米饭吗？",
        pinyin: "Hǎo de. Yào mǐfàn ma?",
        en: "Sure. Would you like rice?",
      },
      {
        who: "顾客 gùkè",
        zh: "不要了，谢谢。很好吃！买单。",
        pinyin: "Bú yào le, xièxie. Hěn hǎochī! Mǎidān.",
        en: "No thanks. It's delicious! The bill, please.",
      },
    ],
    vocab: [
      ["吃", "chī", "to eat", "吃饭 = eat a meal."],
      ["喝", "hē", "to drink", "喝茶 / 喝水."],
      ["米饭", "mǐfàn", "cooked rice", "In the south, 饭 often means rice."],
      ["面条", "miàntiáo", "noodles", "牛肉面 = beef noodles."],
      ["辣", "là", "spicy", "不要辣 / 微辣 (a little spicy)."],
      ["好吃", "hǎochī", "tasty", "Literally 'good to eat'."],
      ["买单", "mǎidān", "the bill / pay", "In southern China you'll hear 埋单."],
      ["服务员", "fúwùyuán", "waiter / staff", "Perfectly polite to call out."],
    ],
    grammar: {
      title: "Asking for things with 要 and 给",
      body:
        "我要 + noun = I want. 请给我 + noun = please give me. Add 一 + measure word for 'one': 一碗面, 一杯茶, 两个包子.",
      examples: [
        { zh: "我要一杯热茶。", pinyin: "Wǒ yào yì bēi rè chá.", en: "I want a cup of hot tea." },
        { zh: "请给我一双筷子。", pinyin: "Qǐng gěi wǒ yì shuāng kuàizi.", en: "Please give me a pair of chopsticks." },
      ],
    },
    practice: {
      prompt: "Order one dish, say 'not spicy', ask for water and then the bill.",
      model: "我要一碗面条，不要辣。请给我一杯水。买单，谢谢。",
      pinyin: "Wǒ yào yì wǎn miàntiáo, bú yào là. Qǐng gěi wǒ yì bēi shuǐ. Mǎidān, xièxie.",
      en: "I'd like a bowl of noodles, not spicy. Please give me a glass of water. The bill, thanks.",
    },
    culture: {
      title: "Hot water, always",
      body:
        "Restaurants serve 热水 (hot water) free, and many people carry a flask. Ice is uncommon. 服务员 is shouted across the room, not rude. At the end, one person usually pays for everyone.",
    },
  },
  {
    slug: "getting-around",
    unit: "Unit 2 · Everyday China",
    title: "Taxis, metro & directions",
    hanzi: "怎么走",
    subtitle: "Get from the airport to the right alley without losing your nerve.",
    level: "Beginner",
    minutes: 26,
    objectives: [
      "Tell a driver where you are going",
      "Ask how far, how long and where to change",
      "Understand 左 / 右 / 一直走",
      "Read basic station signs",
    ],
    dialogue: [
      {
        who: "乘客 chéngkè",
        zh: "师傅，去这个地址。多少钱？",
        pinyin: "Shīfu, qù zhège dìzhǐ. Duōshao qián?",
        en: "Driver, to this address. How much?",
      },
      {
        who: "司机 sījī",
        zh: "大概三十块，二十分钟。",
        pinyin: "Dàgài sānshí kuài, èrshí fēnzhōng.",
        en: "About 30 yuan, 20 minutes.",
      },
      {
        who: "乘客 chéngkè",
        zh: "请问，地铁站在哪儿？",
        pinyin: "Qǐngwèn, dìtiězhàn zài nǎr?",
        en: "Excuse me, where is the metro station?",
      },
      {
        who: "路人 lùrén",
        zh: "一直走，然后左转。很近。",
        pinyin: "Yìzhí zǒu, ránhòu zuǒ zhuǎn. Hěn jìn.",
        en: "Go straight, then turn left. It's very close.",
      },
    ],
    vocab: [
      ["出租车", "chūzūchē", "taxi", "Call the driver 师傅 (shīfu)."],
      ["地铁", "dìtiě", "metro", "Cheap, fast, English signage."],
      ["高铁", "gāotiě", "high-speed train", "China's 300 km/h network."],
      ["一直走", "yìzhí zǒu", "go straight", "yìzhí, with a rising-then-straight tone."],
      ["左转 / 右转", "zuǒ zhuǎn / yòu zhuǎn", "turn left / right", "转 = to turn."],
      ["附近", "fùjìn", "nearby", "附近有…吗？ = is there a … nearby?"],
      ["远 / 近", "yuǎn / jìn", "far / near", "A useful pair to know by ear."],
      ["多久", "duō jiǔ", "how long (time)", "还要多久？ = how much longer?"],
    ],
    grammar: {
      title: "去 + place, 在 + place",
      body:
        "去 (qù) = to go to; 在 (zài) = at/in. Where something is: place + 在 + location. Where you go: 我去 + place.",
      examples: [
        { zh: "我去火车站。", pinyin: "Wǒ qù huǒchēzhàn.", en: "I'm going to the train station." },
        { zh: "洗手间在哪儿？", pinyin: "Xǐshǒujiān zài nǎr?", en: "Where is the toilet?" },
      ],
    },
    practice: {
      prompt: "Ask a driver to take you to the train station, then ask how long it takes.",
      model: "师傅，去火车站，谢谢。还要多久？",
      pinyin: "Shīfu, qù huǒchēzhàn, xièxie. Hái yào duō jiǔ?",
      en: "Driver, to the train station please. How much longer?",
    },
    culture: {
      title: "Didi, not a raised hand",
      body:
        "Use 滴滴 (Dīdī) in the WeChat or Alipay mini-app for taxis. Trains need passport ID — 高铁 stations feel like airports: arrive 45 minutes early, security scan first, then platform.",
    },
  },
  {
    slug: "shopping",
    unit: "Unit 2 · Everyday China",
    title: "Shopping & bargaining",
    hanzi: "太贵了",
    subtitle: "Sizes, colours, trying things on and the friendly art of 便宜一点.",
    level: "Beginner",
    minutes: 24,
    objectives: [
      "Ask to see and try on an item",
      "Use colours, sizes and 太…了",
      "Haggle politely at markets",
      "Ask about returns and receipts",
    ],
    dialogue: [
      {
        who: "顾客 gùkè",
        zh: "这件衣服有大号的吗？",
        pinyin: "Zhè jiàn yīfu yǒu dàhào de ma?",
        en: "Does this piece of clothing come in a large size?",
      },
      {
        who: "店员 diànyuán",
        zh: "有。颜色有蓝色和黑色。",
        pinyin: "Yǒu. Yánsè yǒu lánsè hé hēisè.",
        en: "Yes. The colours are blue and black.",
      },
      {
        who: "顾客 gùkè",
        zh: "我可以试穿吗？",
        pinyin: "Wǒ kěyǐ shìchuān ma?",
        en: "May I try it on?",
      },
      {
        who: "店员 diànyuán",
        zh: "当然可以，试衣间在右边。",
        pinyin: "Dāngrán kěyǐ, shìyījiān zài yòubiān.",
        en: "Of course, the fitting room is on the right.",
      },
    ],
    vocab: [
      ["买 / 卖", "mǎi / mài", "buy / sell", "Same sound, different tone — listen hard."],
      ["这个", "zhège", "this one", "那个 = that one."],
      ["衣服", "yīfu", "clothes", "件 jiàn is the measure word."],
      ["颜色", "yánsè", "colour", "蓝色 blue, 红色 red, 黑色 black, 白色 white."],
      ["试穿", "shìchuān", "try on clothes", "试衣间 = fitting room."],
      ["打折", "dǎzhé", "to give a discount", "八折 = 20% off."],
      ["换", "huàn", "to exchange", "我可以换吗？ = can I exchange it?"],
      ["收据", "shōujù", "receipt", "发票 fāpiào = official invoice."],
    ],
    grammar: {
      title: "太 + adjective + 了",
      body:
        "This frame adds emotion: 太贵了！too expensive; 太好了！great; 太好吃了！delicious. Use it before 了.",
      examples: [
        { zh: "这件衣服太小了。", pinyin: "Zhè jiàn yīfu tài xiǎo le.", en: "This piece of clothing is too small." },
        { zh: "这个颜色太漂亮了！", pinyin: "Zhège yánsè tài piàoliang le!", en: "This colour is so beautiful!" },
      ],
    },
    practice: {
      prompt: "Ask for a large, a blue one, try it on, then ask for a discount.",
      model: "有大号的吗？有蓝色的吗？我可以试穿吗？便宜一点吧！",
      pinyin: "Yǒu dàhào de ma? Yǒu lánsè de ma? Wǒ kěyǐ shìchuān ma? Piányi yìdiǎn ba!",
      en: "Do you have a large? Do you have a blue one? May I try it on? A little cheaper!",
    },
    culture: {
      title: "Bargain at markets, not in malls",
      body:
        "Fixed prices rule in malls, supermarkets and chains. Tourist markets and small stalls expect a counter-offer — start around half, smile, and be ready to walk away.",
    },
  },
  {
    slug: "time-dates",
    unit: "Unit 3 · Living in China",
    title: "Time, days & dates",
    hanzi: "几点",
    subtitle: "Make plans, read opening hours and never miss a train again.",
    level: "Elementary",
    minutes: 24,
    objectives: [
      "Tell the time and ask 几点",
      "Give days, dates and months in the Chinese order",
      "Use 今天 / 明天 / 后天",
      "Book an appointment",
    ],
    dialogue: [
      {
        who: "朋友 péngyou",
        zh: "现在几点？",
        pinyin: "Xiànzài jǐ diǎn?",
        en: "What time is it now?",
      },
      {
        who: "朋友 péngyou",
        zh: "三点半。明天下午四点，有时间吗？",
        pinyin: "Sān diǎn bàn. Míngtiān xiàwǔ sì diǎn, yǒu shíjiān ma?",
        en: "Three thirty. Do you have time tomorrow at 4pm?",
      },
      {
        who: "我 wǒ",
        zh: "有。我们在哪里见面？",
        pinyin: "Yǒu. Wǒmen zài nǎlǐ jiànmiàn?",
        en: "Yes. Where shall we meet?",
      },
      {
        who: "朋友 péngyou",
        zh: "地铁站出口，星期五，九月十二号。",
        pinyin: "Dìtiězhàn chūkǒu, xīngqīwǔ, jiǔ yuè shí'èr hào.",
        en: "Metro station exit, Friday, September 12th.",
      },
    ],
    vocab: [
      ["现在", "xiànzài", "now", "现在几点？ = what time is it?"],
      ["点", "diǎn", "o'clock", "三点 = 3 o'clock."],
      ["半", "bàn", "half past", "三点半 = 3:30."],
      ["今天", "jīntiān", "today", "明天 tomorrow, 昨天 yesterday."],
      ["星期", "xīngqī", "week", "星期一 = Monday."],
      ["月", "yuè", "month", "九月 = September."],
      ["号", "hào", "date (day)", "十二号 = the 12th."],
      ["见面", "jiànmiàn", "to meet up", "在哪儿见面？ = where to meet?"],
    ],
    grammar: {
      title: "Big to small: year → month → date → time",
      body:
        "Chinese dates run from the biggest unit down: 2026年9月12号星期五下午4点. Time expressions go before the verb.",
      examples: [
        { zh: "明天上午十点我们见面。", pinyin: "Míngtiān shàngwǔ shí diǎn wǒmen jiànmiàn.", en: "We'll meet at 10am tomorrow." },
        { zh: "商店几点开门？", pinyin: "Shāngdiàn jǐ diǎn kāimén?", en: "What time does the shop open?" },
      ],
    },
    practice: {
      prompt: "Say today's day and date, then propose a meeting tomorrow at six.",
      model: "今天是星期三，十月二号。明天晚上六点，我们见面吧。",
      pinyin: "Jīntiān shì xīngqīsān, shí yuè èr hào. Míngtiān wǎnshang liù diǎn, wǒmen jiànmiàn ba.",
      en: "Today is Wednesday, October 2nd. Let's meet tomorrow at 6pm.",
    },
    culture: {
      title: "One time zone, early starts",
      body:
        "All of China runs on Beijing time (UTC+8), even Xinjiang. Dinner can start at 6pm, lunch is noon sharp, and 24-hour stores are common in cities. 星期五 means Friday.",
    },
  },
  {
    slug: "hotel-home",
    unit: "Unit 3 · Living in China",
    title: "Hotels, Wi-Fi & living",
    hanzi: "房间",
    subtitle: "Check in, ask for the Wi-Fi password and get hot water at 11pm.",
    level: "Elementary",
    minutes: 25,
    objectives: [
      "Check in with a reservation",
      "Ask for Wi-Fi, hot water and air-conditioning",
      "Describe problems in a room",
      "Understand 有没有 and 能不能",
    ],
    dialogue: [
      {
        who: "前台 qiántái",
        zh: "您好，有预订吗？",
        pinyin: "Nín hǎo, yǒu yùdìng ma?",
        en: "Hello, do you have a reservation?",
      },
      {
        who: "客人 kèrén",
        zh: "有，我叫安娜，三个晚上。",
        pinyin: "Yǒu, wǒ jiào Ānnà, sān ge wǎnshang.",
        en: "Yes, I'm Anna, for three nights.",
      },
      {
        who: "前台 qiántái",
        zh: "这是您的房卡。Wi-Fi密码在这里。",
        pinyin: "Zhè shì nín de fángkǎ. Wi-Fi mìmǎ zài zhèlǐ.",
        en: "This is your room card. The Wi-Fi password is here.",
      },
      {
        who: "客人 kèrén",
        zh: "房间里没有热水，可以换房间吗？",
        pinyin: "Fángjiān lǐ méiyǒu rèshuǐ, kěyǐ huàn fángjiān ma?",
        en: "There's no hot water in the room — can I change rooms?",
      },
    ],
    vocab: [
      ["酒店", "jiǔdiàn", "hotel", "Also 宾馆 bīnguǎn for guesthouses."],
      ["预订", "yùdìng", "reservation", "我预订了房间 = I booked a room."],
      ["房间", "fángjiān", "room", "单人间 single, 双人间 twin."],
      ["房卡", "fángkǎ", "room card", "Card keys open the room and the lift."],
      ["热水", "rèshuǐ", "hot water", "Ask early if the tap is cold."],
      ["空调", "kōngtiáo", "air conditioning", "Please turn on the AC."],
      ["厕所 / 洗手间", "cèsuǒ / xǐshǒujiān", "toilet", "洗手间 is more polite."],
      ["干净", "gānjìng", "clean", "不干净 = not clean."],
    ],
    grammar: {
      title: "有没有 / 能不能",
      body:
        "Verb + 不 + verb is a casual way to ask: 有没有 (do you have?), 能不能 (can you?), 是不是 (is it?). Answers can be short: 有 / 没有.",
      examples: [
        { zh: "有没有吹风机？", pinyin: "Yǒu méiyǒu chuīfēngjī?", en: "Do you have a hairdryer?" },
        { zh: "能不能换一个房间？", pinyin: "Néng bu néng huàn yí ge fángjiān?", en: "Can you change the room?" },
      ],
    },
    practice: {
      prompt: "Check in, ask for Wi-Fi and a room with hot water.",
      model: "我有预订，三个晚上。有没有Wi-Fi？房间有热水吗？",
      pinyin: "Wǒ yǒu yùdìng, sān ge wǎnshang. Yǒu méiyǒu Wi-Fi? Fángjiān yǒu rèshuǐ ma?",
      en: "I have a reservation for three nights. Is there Wi-Fi? Does the room have hot water?",
    },
    culture: {
      title: "Things a Chinese hotel gives you",
      body:
        "Slippers, a kettle, tea, toothbrushes and bottled water are standard. Foreign passport holders usually need to check in at a designated window. Apartments often use WeChat for rent and repairs.",
    },
  },
  {
    slug: "family-people",
    unit: "Unit 3 · Living in China",
    title: "Family & people",
    hanzi: "我家",
    subtitle: "Talk about your family, ages and relationships with the right word for each relative.",
    level: "Elementary",
    minutes: 22,
    objectives: [
      "Name close family members",
      "Ask 你家有几口人 and say how many",
      "Ask someone's age politely",
      "Use measure words 个 / 口",
    ],
    dialogue: [
      {
        who: "同事 tóngshì",
        zh: "你家有几口人？",
        pinyin: "Nǐ jiā yǒu jǐ kǒu rén?",
        en: "How many people are in your family?",
      },
      {
        who: "我 wǒ",
        zh: "我家有五口人：爸爸、妈妈、哥哥、妹妹和我。",
        pinyin: "Wǒ jiā yǒu wǔ kǒu rén: bàba, māma, gēge, mèimei hé wǒ.",
        en: "There are five of us: dad, mum, older brother, younger sister and me.",
      },
      {
        who: "同事 tóngshì",
        zh: "你妹妹多大？",
        pinyin: "Nǐ mèimei duō dà?",
        en: "How old is your little sister?",
      },
      {
        who: "我 wǒ",
        zh: "她十八岁，是大学生。",
        pinyin: "Tā shíbā suì, shì dàxuéshēng.",
        en: "She's 18, a university student.",
      },
    ],
    vocab: [
      ["家", "jiā", "family / home", "我家有五口人."],
      ["爸爸 / 妈妈", "bàba / māma", "dad / mum", "The second syllable is neutral."],
      ["哥哥 / 弟弟", "gēge / dìdi", "older / younger brother", "Age order matters in Chinese."],
      ["姐姐 / 妹妹", "jiějie / mèimei", "older / younger sister", "Same pattern as brothers."],
      ["孩子", "háizi", "child", "男孩子 boy, 女孩子 girl."],
      ["岁", "suì", "years old", "我二十五岁."],
      ["结婚", "jiéhūn", "to get married", "我结婚了 / 我没结婚."],
      ["家人", "jiārén", "family members", "A warm, general word."],
    ],
    grammar: {
      title: "Measure words for people",
      body:
        "Use 个 for people in general, 口 when counting family members, and 位 as a polite version for guests or strangers.",
      examples: [
        { zh: "我家有四口人。", pinyin: "Wǒ jiā yǒu sì kǒu rén.", en: "There are four people in my family." },
        { zh: "那位是我的老师。", pinyin: "Nà wèi shì wǒ de lǎoshī.", en: "That person is my teacher." },
      ],
    },
    practice: {
      prompt: "Say how many people are in your family and introduce two of them with their ages.",
      model: "我家有四口人。爸爸六十岁，妈妈五十八岁。",
      pinyin: "Wǒ jiā yǒu sì kǒu rén. Bàba liùshí suì, māma wǔshíbā suì.",
      en: "There are four of us. Dad is 60, mum is 58.",
    },
    culture: {
      title: "Family first",
      body:
        "Family terms are precise and affectionate, and using the wrong older/younger form is noticeable. Asking about family is friendly. 独生子女 (only child) is common among city-born people in their 20s–30s.",
    },
  },
  {
    slug: "health-emergency",
    unit: "Unit 4 · Independence",
    title: "Health & emergencies",
    hanzi: "不舒服",
    subtitle: "Describe pain, find a pharmacy, and know exactly what to shout in an emergency.",
    level: "Elementary",
    minutes: 22,
    objectives: [
      "Say where it hurts",
      "Buy medicine at a pharmacy",
      "Ask for help and call emergency numbers",
      "Report a lost passport",
    ],
    dialogue: [
      {
        who: "医生 yīshēng",
        zh: "你怎么了？哪里不舒服？",
        pinyin: "Nǐ zěnme le? Nǎlǐ bù shūfu?",
        en: "What's wrong? Where does it hurt?",
      },
      {
        who: "病人 bìngrén",
        zh: "我头疼，发烧，肚子也不舒服。",
        pinyin: "Wǒ tóuténg, fāshāo, dùzi yě bù shūfu.",
        en: "My head hurts, I have a fever and my stomach is upset too.",
      },
      {
        who: "医生 yīshēng",
        zh: "你吃药了吗？对这个过敏吗？",
        pinyin: "Nǐ chī yào le ma? Duì zhège guòmǐn ma?",
        en: "Have you taken medicine? Are you allergic to this?",
      },
      {
        who: "病人 bìngrén",
        zh: "没有。我的护照丢了，怎么办？",
        pinyin: "Méiyǒu. Wǒ de hùzhào diū le, zěnme bàn?",
        en: "No. I've lost my passport — what should I do?",
      },
    ],
    vocab: [
      ["医院", "yīyuàn", "hospital", "急诊 jízhěn = emergency department."],
      ["医生", "yīshēng", "doctor", "看医生 = see a doctor."],
      ["药", "yào", "medicine", "药房 yàofáng = pharmacy."],
      ["疼", "téng", "to hurt", "头疼 headache, 肚子疼 stomach ache."],
      ["发烧", "fāshāo", "to have a fever", "我发烧了."],
      ["过敏", "guòmǐn", "allergy", "我对花生过敏."],
      ["救命", "jiùmìng", "help! (emergency)", "Use only for real danger."],
      ["护照", "hùzhào", "passport", "护照丢了 = my passport is lost."],
    ],
    grammar: {
      title: "哪里 + 不舒服 / 怎么办",
      body:
        "哪里 (where) can mean 'what part' when talking about the body. 怎么办 (zěnme bàn) = what should I do? A life-saving pair.",
      examples: [
        { zh: "我嗓子疼。", pinyin: "Wǒ sǎngzi téng.", en: "My throat hurts." },
        { zh: "我手机丢了，怎么办？", pinyin: "Wǒ shǒujī diū le, zěnme bàn?", en: "I lost my phone — what do I do?" },
      ],
    },
    practice: {
      prompt: "Tell a doctor you have a fever, a headache, and no allergy to medicine.",
      model: "我发烧，头疼。我对药不过敏。",
      pinyin: "Wǒ fāshāo, tóuténg. Wǒ duì yào bú guòmǐn.",
      en: "I have a fever and a headache. I'm not allergic to medicine.",
    },
    culture: {
      title: "Emergency numbers",
      body:
        "Police 110, ambulance 120, fire 119, traffic 122. Pharmacies (药房) are everywhere and staff help with minor issues. Bring your passport to a hospital; payment usually comes before treatment.",
    },
  },
  {
    slug: "work-study",
    unit: "Unit 4 · Independence",
    title: "Work, study & WeChat",
    hanzi: "上班",
    subtitle: "Talk about your job, survive a meeting, and live inside WeChat without fear.",
    level: "Pre-intermediate",
    minutes: 26,
    objectives: [
      "Describe your job and schedule",
      "Say what you are studying",
      "Send a polite WeChat message",
      "Ask someone to repeat or slow down",
    ],
    dialogue: [
      {
        who: "新同事 xīn tóngshì",
        zh: "你在哪儿工作？做什么的？",
        pinyin: "Nǐ zài nǎr gōngzuò? Zuò shénme de?",
        en: "Where do you work? What do you do?",
      },
      {
        who: "我 wǒ",
        zh: "我在一家科技公司工作，做设计。",
        pinyin: "Wǒ zài yì jiā kējì gōngsī gōngzuò, zuò shèjì.",
        en: "I work at a technology company, doing design.",
      },
      {
        who: "新同事 xīn tóngshì",
        zh: "你的中文说得很好！",
        pinyin: "Nǐ de Zhōngwén shuō de hěn hǎo!",
        en: "You speak Chinese really well!",
      },
      {
        who: "我 wǒ",
        zh: "哪里哪里，还在学习。请说慢一点。",
        pinyin: "Nǎlǐ nǎlǐ, hái zài xuéxí. Qǐng shuō màn yìdiǎn.",
        en: "Not at all, I'm still learning. Please speak a little slower.",
      },
    ],
    vocab: [
      ["工作", "gōngzuò", "work / job", "我在…工作."],
      ["公司", "gōngsī", "company", "一家公司 = one company."],
      ["开会", "kāihuì", "to have a meeting", "会议 = meeting (noun)."],
      ["上班 / 下班", "shàngbān / xiàbān", "start / finish work", "你几点下班？"],
      ["加班", "jiābān", "work overtime", "今天又要加班."],
      ["学习", "xuéxí", "to study", "我在学习中文."],
      ["微信", "Wēixìn", "WeChat", "The super-app of China."],
      ["慢一点", "màn yìdiǎn", "a little slower", "A learner's best sentence."],
    ],
    grammar: {
      title: "The 的 that turns verbs into descriptions",
      body:
        "Verb + 得 + adverb describes how an action happens: 说得好 (speaks well), 写得快 (writes fast). Also, 的 connects a noun to its owner: 我的工作.",
      examples: [
        { zh: "他中文说得非常流利。", pinyin: "Tā Zhōngwén shuō de fēicháng liúlì.", en: "He speaks Chinese very fluently." },
        { zh: "这是我朋友的电脑。", pinyin: "Zhè shì wǒ péngyou de diànnǎo.", en: "This is my friend's computer." },
      ],
    },
    practice: {
      prompt: "Say where you work or study, then ask the other person to speak slower.",
      model: "我在一家公司工作。我的中文不太好，请说慢一点。",
      pinyin: "Wǒ zài yì jiā gōngsī gōngzuò. Wǒ de Zhōngwén bú tài hǎo, qǐng shuō màn yìdiǎn.",
      en: "I work at a company. My Chinese isn't great — please speak a little slower.",
    },
    culture: {
      title: "WeChat is the office",
      body:
        "Groups, voice notes, red envelopes and payments all live in 微信. Voice messages are normal. A business contact may ask for your 二维码; scan and add. Silence in a group is not rudeness.",
    },
  },
  {
    slug: "culture-smalltalk",
    unit: "Unit 4 · Independence",
    title: "Culture & small talk",
    hanzi: "聊一聊",
    subtitle: "Hobbies, food hometowns, festivals and the polite phrases that open doors.",
    level: "Pre-intermediate",
    minutes: 24,
    objectives: [
      "Talk about hobbies with 喜欢",
      "Ask and answer 'where are you from?'",
      "Congratulate, compliment and politely decline",
      "Understand festivals and gift etiquette",
    ],
    dialogue: [
      {
        who: "朋友 péngyou",
        zh: "你家乡在哪里？",
        pinyin: "Nǐ jiāxiāng zài nǎlǐ?",
        en: "Where is your hometown?",
      },
      {
        who: "我 wǒ",
        zh: "我来自南非。你呢？",
        pinyin: "Wǒ láizì Nánfēi. Nǐ ne?",
        en: "I'm from South Africa. And you?",
      },
      {
        who: "朋友 péngyou",
        zh: "我是四川人。你喜欢吃什么？",
        pinyin: "Wǒ shì Sìchuān rén. Nǐ xǐhuan chī shénme?",
        en: "I'm from Sichuan. What do you like to eat?",
      },
      {
        who: "我 wǒ",
        zh: "我喜欢火锅和饺子。春节有什么安排？",
        pinyin: "Wǒ xǐhuan huǒguō hé jiǎozi. Chūnjié yǒu shénme ānpái?",
        en: "I like hotpot and dumplings. What are your plans for Spring Festival?",
      },
    ],
    vocab: [
      ["喜欢", "xǐhuan", "to like", "我喜欢 + noun or verb."],
      ["爱好", "àihào", "hobby", "你的爱好是什么？"],
      ["家乡", "jiāxiāng", "hometown", "A classic small-talk question."],
      ["旅游", "lǚyóu", "travel", "我喜欢旅游."],
      ["春节", "Chūnjié", "Spring Festival", "China's biggest holiday."],
      ["红包", "hóngbāo", "red envelope", "Gift money, given digitally too."],
      ["礼物", "lǐwù", "gift", "不要送钟 and don't give 4 of anything."],
      ["哪里哪里", "nǎlǐ nǎlǐ", "not at all (modest)", "The classic humble reply to praise."],
    ],
    grammar: {
      title: "喜欢, 想 and 会 — the three helper verbs",
      body:
        "喜欢 = like, 想 = want/would like, 会 = can (learned skill). All take a verb directly: 喜欢喝茶, 想去中国, 会说中文.",
      examples: [
        { zh: "我想去北京旅游。", pinyin: "Wǒ xiǎng qù Běijīng lǚyóu.", en: "I'd like to travel to Beijing." },
        { zh: "我会说一点中文。", pinyin: "Wǒ huì shuō yìdiǎn Zhōngwén.", en: "I can speak a little Chinese." },
      ],
    },
    practice: {
      prompt: "Say where you're from, one hobby, and ask about Spring Festival plans.",
      model: "我来自…，我喜欢音乐。你春节有什么安排？",
      pinyin: "Wǒ láizì…, wǒ xǐhuan yīnyuè. Nǐ Chūnjié yǒu shénme ānpái?",
      en: "I'm from…, and I like music. What are your plans for Spring Festival?",
    },
    culture: {
      title: "Modesty opens the door",
      body:
        "When praised, say 哪里哪里 or 谢谢. Give and receive gifts with both hands; don't open a present immediately unless invited. The number 8 is lucky and 4 sounds like 'death', so avoid gifting four of anything.",
    },
  },
];

export const CURRICULUM: Lesson[] = seeds.map((seed, index) => ({
  ...seed,
  number: index + 1,
  vocab: seed.vocab.map(([zh, pinyin, en, note], vIndex) => ({
    id: `${seed.slug}-${vIndex + 1}`,
    zh,
    pinyin,
    en,
    category: seed.hanzi,
    note,
  })),
}));

export const LESSON_COUNT = CURRICULUM.length;

export const TOTAL_LESSON_MINUTES = CURRICULUM.reduce(
  (sum, lesson) => sum + lesson.minutes,
  0,
);
