export type VideoCategory =
  | "Pinyin & Tones"
  | "Beginner Foundations"
  | "Everyday Conversation"
  | "HSK 1–2"
  | "HSK 3–4"
  | "Listening Practice"
  | "Food & Travel"
  | "Culture & Life"
  | "Grammar Clinic"
  | "Characters & Reading"
  | "Work & Business"
  | "Songs & Fun";

export type VideoLevel = "Absolute beginner" | "Beginner" | "Elementary" | "Intermediate";

export type VideoLesson = {
  id: string;
  number: number;
  title: string;
  channel: string;
  category: VideoCategory;
  level: VideoLevel;
  minutes: number;
  focus: string;
  hanzi: string;
  searchQuery: string;
  watchUrl: string;
};

type Row = [title: string, channel: string, category: VideoCategory, level: VideoLevel, minutes: number, focus: string, hanzi: string];

const rows: Row[] = [
  ["Pinyin in 20 minutes: every sound you need", "Yoyo Chinese", "Pinyin & Tones", "Absolute beginner", 21, "Initials, finals and how pinyin spells what you hear.", "拼音"],
  ["The four tones with clear slow examples", "Grace Mandarin Chinese", "Pinyin & Tones", "Absolute beginner", 14, "1st to 4th tone plus neutral tone in real words.", "声调"],
  ["Tone pairs practice: 你好, 可以, 很好", "Everyday Chinese", "Pinyin & Tones", "Beginner", 12, "Third-tone sandhi and the most common tone pairs.", "连读"],
  ["Hard sounds: j q x vs zh ch sh r", "Chinese with Lulu", "Pinyin & Tones", "Beginner", 16, "The consonants English speakers confuse most.", "难音"],
  ["b p m f: your first Chinese syllables", "Little Fox Chinese", "Pinyin & Tones", "Absolute beginner", 9, "Slow repetition for absolute day-one learners.", "声母"],
  ["The ü sound and why it hides in 'u'", "Mandarin Corner", "Pinyin & Tones", "Beginner", 8, "ü, ju, qu, xu and the spelling rule.", "韵母"],
  ["Tone changes for 不 and 一", "Grace Mandarin Chinese", "Pinyin & Tones", "Beginner", 10, "Why 不是 sounds like bú shì and 一个 like yí ge.", "变调"],
  ["Listening test: identify the tone you hear", "ChinesePod", "Pinyin & Tones", "Beginner", 13, "Ear training before you can speak comfortably.", "听力"],

  ["Chinese for absolute beginners: lesson 1", "Learn Chinese with Litao", "Beginner Foundations", "Absolute beginner", 18, "Hello, thank you, goodbye and your first sentences.", "初学"],
  ["Introduce yourself in Mandarin", "Yoyo Chinese", "Beginner Foundations", "Absolute beginner", 15, "Name, nationality, job — full intro script.", "介绍"],
  ["Say it right: 是, 有, 在", "GoEast Mandarin", "Beginner Foundations", "Beginner", 17, "The three verbs beginners mix up.", "动词"],
  ["Numbers 1–100 and how to build them", "Everyday Chinese", "Beginner Foundations", "Absolute beginner", 14, "Zero to a hundred with price examples.", "数字"],
  ["Pronouns and plurals with 们", "Learn Chinese Now", "Beginner Foundations", "Beginner", 11, "我, 你, 他, 她, 我们 and friends.", "代词"],
  ["Chinese word order in 10 minutes", "Grace Mandarin Chinese", "Beginner Foundations", "Beginner", 12, "Subject + time + place + verb — the golden order.", "语序"],
  ["Question words: what, who, where, when", "Mandarin Corner", "Beginner Foundations", "Beginner", 16, "什么, 谁, 哪里, 什么时候 with examples.", "问题"],
  ["Measure words made simple", "Chinese with Da Peng", "Beginner Foundations", "Beginner", 13, "个, 本, 杯, 张, 位 and how to use them.", "量词"],

  ["Ordering food without English", "Mandarin Corner", "Everyday Conversation", "Beginner", 15, "Menus, spice levels, water and the bill.", "点菜"],
  ["Taking a taxi and telling the driver where", "Everyday Chinese", "Everyday Conversation", "Beginner", 12, "Addresses, meters and asking to stop.", "打车"],
  ["At the metro station: buying tickets", "Yoyo Chinese", "Everyday Conversation", "Beginner", 10, "Lines, transfers and station announcements.", "地铁"],
  ["Bargaining at a Chinese market", "Grace Mandarin Chinese", "Everyday Conversation", "Elementary", 11, "Polite haggling with real market phrases.", "砍价"],
  ["At the pharmacy: describing symptoms", "ChinesePod", "Everyday Conversation", "Elementary", 14, "Fever, headache, allergy and medicine.", "药房"],
  ["Checking into a hotel in Mandarin", "Learn Chinese with Litao", "Everyday Conversation", "Beginner", 13, "Reservation, room card, Wi-Fi and check-out.", "入住"],
  ["Asking for directions and understanding answers", "GoEast Mandarin", "Everyday Conversation", "Beginner", 15, "Left, right, straight, near, far, landmark.", "问路"],
  ["Phone calls and WeChat voice messages", "Fragrant Mandarin", "Everyday Conversation", "Elementary", 12, "Calling, messaging and leaving a voice note.", "打电话"],
  ["Making plans with a friend", "Joyce Mandarin", "Everyday Conversation", "Elementary", 12, "Time, place and the friendly 吧.", "约朋友"],
  ["Emergencies: what to say, who to call", "Chinese with Lulu", "Everyday Conversation", "Elementary", 9, "Help, police, hospital and lost documents.", "紧急"],

  ["HSK 1 full vocabulary walkthrough", "HSK Academy", "HSK 1–2", "Beginner", 38, "All 150 HSK 1 words with sentence examples.", "HSK一"],
  ["HSK 1 listening practice with answers", "Everyday Chinese", "HSK 1–2", "Beginner", 22, "Short dialogues at exam pace.", "一级听力"],
  ["HSK 2 grammar points explained", "Grace Mandarin Chinese", "HSK 1–2", "Elementary", 26, "了, 过, 比, 因为…所以 — core patterns.", "一级语法"],
  ["HSK 2 vocabulary with tones", "HSK Academy", "HSK 1–2", "Elementary", 31, "150 new words, grouped by topic.", "二级词汇"],
  ["HSK 2 listening: daily situations", "Mandarin Corner", "HSK 1–2", "Elementary", 20, "Shops, transport, weather and appointments.", "二级听力"],
  ["100 most common Chinese words", "Learn Chinese with Litao", "HSK 1–2", "Beginner", 24, "High-frequency vocabulary that pays for itself.", "常用词"],
  ["HSK 3 vocabulary: work and study", "HSK Academy", "HSK 3–4", "Intermediate", 35, "300 words with usage notes.", "三级词汇"],
  ["HSK 3 listening drills", "Everyday Chinese", "HSK 3–4", "Intermediate", 24, "Longer passages and question types.", "三级听力"],
  ["HSK 4 grammar: the tricky connectors", "GoEast Mandarin", "HSK 3–4", "Intermediate", 29, "却, 而, 甚至, 无论 and other written patterns.", "四级语法"],
  ["HSK 4 vocabulary in context", "HSK Academy", "HSK 3–4", "Intermediate", 40, "600 words, split into manageable chunks.", "四级词汇"],
  ["Reading a Chinese news headline", "Mandarin Corner", "HSK 3–4", "Intermediate", 17, "Headline grammar and new characters.", "新闻"],
  ["Describing people and personality", "Chinese with Da Peng", "HSK 3–4", "Intermediate", 16, "Adjectives, descriptions and comparisons.", "描述"],

  ["Slow Chinese: my morning routine", "Mandarin Corner", "Listening Practice", "Beginner", 11, "Comprehensible input at a gentle pace.", "慢中文"],
  ["Street interviews in slow Mandarin", "Chinese with Da Peng", "Listening Practice", "Elementary", 14, "Real people talk about food and hometowns.", "街访"],
  ["Tea shop conversation, fully in Chinese", "Fragrant Mandarin", "Listening Practice", "Elementary", 13, "Ordering and tasting with a vendor.", "茶馆"],
  ["One-minute news in easy Chinese", "Slow Chinese", "Listening Practice", "Intermediate", 10, "Daily news, slow and subtitled.", "新闻"],
  ["Podcast for beginners: episode 1", "ChinesePod", "Listening Practice", "Beginner", 18, "Dialogue, breakdown and repetition.", "播客"],
  ["Shadowing practice: repeat after me", "Grace Mandarin Chinese", "Listening Practice", "Beginner", 15, "Speak along to build rhythm and tone.", "跟读"],
  ["Weather small talk listening", "Everyday Chinese", "Listening Practice", "Beginner", 9, "Seasons, temperatures and small talk.", "天气"],
  ["Ordering delivery by phone", "Chinese with Lulu", "Listening Practice", "Elementary", 12, "Meituan-style phone order vocabulary.", "外卖"],

  ["Street food tour in Chengdu", "Mandarin Corner", "Food & Travel", "Beginner", 19, "Skewers, spice and ordering on the street.", "小吃"],
  ["How to eat hotpot like a local", "Fragrant Mandarin", "Food & Travel", "Elementary", 14, "Dipping sauces, cooking times and etiquette.", "火锅"],
  ["Travelling in Yunnan: useful phrases", "Joyce Mandarin", "Food & Travel", "Beginner", 16, "Tickets, guesthouses and mountain villages.", "云南"],
  ["Riding China's high-speed train", "Learn Chinese Now", "Food & Travel", "Elementary", 12, "Stations, seat classes and boarding.", "高铁"],
  ["Beijing hutong walking tour in Chinese", "Slow Chinese", "Food & Travel", "Elementary", 17, "Directions and neighbourhood vocabulary.", "胡同"],
  ["Ordering bubble tea with your own choices", "Chinese with Lulu", "Food & Travel", "Beginner", 10, "Sugar, ice, toppings and size.", "奶茶"],
  ["Market vocabulary: fruit and vegetables", "Mandarin Corner", "Food & Travel", "Beginner", 11, "Buy by weight and ask for a bag.", "市场"],
  ["Shanghai taxi and metro challenge", "GoEast Mandarin", "Food & Travel", "Beginner", 13, "Navigating a city with beginner Mandarin.", "上海"],

  ["Chinese dining etiquette explained", "Fragrant Mandarin", "Culture & Life", "Beginner", 13, "Seating, toasts, chopsticks and paying.", "礼仪"],
  ["Spring Festival traditions and phrases", "Yoyo Chinese", "Culture & Life", "Beginner", 15, "New Year greetings, 红包 and family customs.", "春节"],
  ["WeChat: groups,红包 and mini-apps", "Chinese with Da Peng", "Culture & Life", "Elementary", 16, "The digital etiquette of daily China.", "微信"],
  ["Tea culture from leaf to cup", "Slow Chinese", "Culture & Life", "Elementary", 18, "Six tea families and how to taste them.", "茶文化"],
  ["Lucky numbers and gift taboos", "Learn Chinese Now", "Culture & Life", "Beginner", 9, "Why 8 is loved and 4 is avoided.", "数字文化"],
  ["Temples, incense and quiet etiquette", "Mandarin Corner", "Culture & Life", "Elementary", 14, "Visiting a temple respectfully.", "寺庙"],
  ["A day in a Chinese family home", "Joyce Mandarin", "Culture & Life", "Intermediate", 20, "Family words in real conversation.", "家庭"],
  ["Business cards, 关系 and first meetings", "GoEast Mandarin", "Culture & Life", "Intermediate", 15, "Workplace culture for newcomers.", "关系"],

  ["了 explained once and for all", "Grace Mandarin Chinese", "Grammar Clinic", "Beginner", 18, "Completion vs change of state.", "了"],
  ["是…的 and emphasis", "GoEast Mandarin", "Grammar Clinic", "Elementary", 15, "Talking about when, where and how something happened.", "是…的"],
  ["比 comparisons without mistakes", "Everyday Chinese", "Grammar Clinic", "Beginner", 13, "A 比 B + adjective, and what not to add.", "比较"],
  ["把 sentences: moving the object", "Chinese with Lulu", "Grammar Clinic", "Intermediate", 16, "The pattern that makes you sound fluent.", "把字句"],
  ["得, 的, 地 — three little de", "Mandarin Corner", "Grammar Clinic", "Elementary", 14, "Which de goes where, with examples.", "的地得"],
  ["Asking negative questions the Chinese way", "Yoyo Chinese", "Grammar Clinic", "Beginner", 11, "有没有, 是不是, 能不能.", "正反问"],
  ["就 and 才: sooner, later, only", "Chinese with Da Peng", "Grammar Clinic", "Intermediate", 15, "Subtle attitude in two small words.", "就才"],
  ["Result complements: 完, 到, 好, 错", "Grace Mandarin Chinese", "Grammar Clinic", "Intermediate", 14, "Finish, achieve, complete, get wrong.", "结果补语"],

  ["First 100 characters with stroke order", "Little Fox Chinese", "Characters & Reading", "Absolute beginner", 24, "Write and recognise your first characters.", "汉字"],
  ["Radicals that unlock meaning", "Chinative", "Characters & Reading", "Beginner", 16, "Water, hand, speech, heart and more.", "部首"],
  ["Read your first Chinese menu", "Mandarin Corner", "Characters & Reading", "Elementary", 13, "Dish names decoded by character.", "菜单"],
  ["Street signs you must recognise", "Everyday Chinese", "Characters & Reading", "Beginner", 11, "Exit, entrance, push, pull, danger.", "路牌"],
  ["Reading a WeChat conversation", "Chinese with Lulu", "Characters & Reading", "Elementary", 15, "Abbreviations, emoji and chat slang.", "聊天"],
  ["Typing Chinese on your phone", "Fragrant Mandarin", "Characters & Reading", "Beginner", 10, "Pinyin input, handwriting and voice typing.", "打字"],

  ["Job interview Chinese: tell me about yourself", "GoEast Mandarin", "Work & Business", "Intermediate", 21, "Structured answers and polite hedging.", "面试"],
  ["Office vocabulary and meetings", "HSK Academy", "Work & Business", "Intermediate", 18, "Meetings, deadlines and reporting.", "办公室"],
  ["Writing a polite WeChat business message", "Joyce Mandarin", "Work & Business", "Intermediate", 12, "Tone, thanks and follow-ups.", "商务"],
  ["Emails in Chinese: openings and closings", "Chinative", "Work & Business", "Intermediate", 14, "Format, 尊敬的, 此致敬礼 and requests.", "邮件"],

  ["Learn Chinese with songs: 月亮代表我的心", "Joyce Mandarin", "Songs & Fun", "Beginner", 12, "Sing and absorb rhythm and tones.", "歌曲"],
  ["Tongue twisters for pronunciation", "Grace Mandarin Chinese", "Songs & Fun", "Beginner", 9, "Fun drills for tricky consonants.", "绕口令"],
  ["Chinese slang that young people use", "Mango Mandarin", "Songs & Fun", "Elementary", 13, "加油, 厉害, 牛, 种草 and more.", "网络语"],
  ["Learn through a cartoon episode", "Little Fox Chinese", "Songs & Fun", "Absolute beginner", 11, "Story-based listening with visuals.", "动画"],
];

export const FEATURED_PLAYLIST = {
  id: "PLWXyZU_NJb_chvMZ13hgOPB3Vcz7xhW3q",
  title: "Learn Mandarin Chinese for Complete Beginners",
  description:
    "A free beginner course playlist: pinyin, tones and first conversations. Press play here, then use the lesson cards below to go deeper on any topic.",
};

export const VIDEO_LESSONS: VideoLesson[] = rows.map(([title, channel, category, level, minutes, focus, hanzi], index) => {
  const searchQuery = `${channel} ${title}`;
  return {
    id: `video-${index + 1}`,
    number: index + 1,
    title,
    channel,
    category,
    level,
    minutes,
    focus,
    hanzi,
    searchQuery,
    watchUrl: `https://www.youtube.com/results?search_query=${encodeURIComponent(searchQuery)}`,
  };
});

export const VIDEO_CATEGORIES: VideoCategory[] = [
  "Pinyin & Tones",
  "Beginner Foundations",
  "Everyday Conversation",
  "HSK 1–2",
  "HSK 3–4",
  "Listening Practice",
  "Food & Travel",
  "Culture & Life",
  "Grammar Clinic",
  "Characters & Reading",
  "Work & Business",
  "Songs & Fun",
];

export const VIDEO_COUNT = VIDEO_LESSONS.length;
