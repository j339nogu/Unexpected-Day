import React, { useState, useEffect } from 'react';

// --- 時間帯の定義リスト ---
const ALL = ['morning', 'day', 'afternoon', 'evening', 'night', 'midnight'];
const OUTSIDE_DAY = ['morning', 'day', 'afternoon', 'evening'];
const OPEN_HOURS = ['day', 'afternoon', 'evening', 'night'];
const NIGHT_ONLY = ['evening', 'night', 'midnight'];

// --- 予想外のミッションリスト（全56種） ---
const unexpectedMissions = {
  short: [
    { title: "目を閉じて、5分間だけ一切の思考を放棄する", duration: 15, slots: ALL },
    { title: "財布の中身をすべて出し、不要なレシートを捨てる", duration: 15, slots: ALL },
    { title: "スマホを伏せて、窓から見える景色だけをぼーっと眺める", duration: 15, slots: OUTSIDE_DAY },
    { title: "誰の目も気にせず、その場で全力の「伸び」をする", duration: 15, slots: ALL },
    { title: "コップ一杯の水を、驚くほどゆっくり味わって飲む", duration: 15, slots: ALL },
    { title: "今日あった「ちょっとだけ良かったこと」を3つ思い出す", duration: 15, slots: NIGHT_ONLY },
    { title: "利き手と逆の手で、今考えていることをノートに書き出す", duration: 15, slots: ALL },
    { title: "辞書や適当な本を開き、最初に目についた単語について5分間真剣に考察する", duration: 15, slots: ALL },
    { title: "床に大の字で寝転がり、天井の模様をただ見つめて別の何かに見立てる", duration: 15, slots: ALL },
    { title: "今すぐシャワーを浴びて、すべての気だるさを洗い流す", duration: 20, slots: ['morning', 'night', 'midnight'] },
    { title: "窓を全開にして、外の音をただひたすらスマホで録音して聴き返す", duration: 15, slots: OUTSIDE_DAY },
    { title: "15分間だけ、絶対に「はい」「いいえ」以外の言葉を発しない縛りゲームを一人でする", duration: 15, slots: ALL },
    { title: "スマホの連絡先をランダムにスクロールし、止まった人のことを3分間だけ思い出す", duration: 15, slots: NIGHT_ONLY },
    { title: "鏡の前で、今まで一度もしたことがないような最高の笑顔を1分間キープする", duration: 15, slots: ALL },
    { title: "過去の自分のSNSを一番下までスクロールし、当時の自分に心の中でツッコミを入れる", duration: 15, slots: NIGHT_ONLY },
    { title: "家の中にある「一番赤いもの」と「一番青いもの」を探して並べる", duration: 15, slots: ALL },
  ],
  medium: [
    { title: "一番近くのコンビニで、今まで一度も買ったことのない飲み物を買う", duration: 30, slots: ALL },
    { title: "目的もなく、ただ30分間だけ近所を散歩する", duration: 30, slots: OUTSIDE_DAY },
    { title: "紙とペンを用意し、今の脳内にある言葉をひたすら書き殴る", duration: 30, slots: ALL },
    { title: "普段絶対に聴かないジャンルの音楽を、目を閉じて真剣に聴く", duration: 30, slots: ALL },
    { title: "部屋の「普段絶対に掃除しない場所」を1箇所だけ本気で綺麗にする", duration: 30, slots: ALL },
    { title: "近くの公園に行き、一番形のいい落ち葉（または石）を真剣に探して持ち帰る", duration: 30, slots: OUTSIDE_DAY },
    { title: "Googleマップのストリートビューで、地球の裏側の道を30分間散歩する", duration: 30, slots: ALL },
    { title: "100円ショップに行き、「絶対にいらないけど一番面白いもの」を真剣に選んで買う", duration: 30, slots: ['day', 'afternoon', 'evening'] },
    { title: "今から30分間、すべてのアクションを「スローモーション」で行う", duration: 30, slots: ALL },
    { title: "家にある本の中からランダムに3冊選び、それぞれの最初の1文を繋げて詩を作る", duration: 30, slots: ALL },
    { title: "近くの交差点に行き、行き交う人々の人生を勝手にアテレコする", duration: 30, slots: OUTSIDE_DAY },
    { title: "普段よく使うアプリの「設定」画面を隅から隅まで読み込み、未知の機能を探す", duration: 30, slots: ALL },
    { title: "折り紙やチラシで、誰も見たことがない複雑な立体物を創作する", duration: 30, slots: ALL },
    { title: "今いる部屋のレイアウトを、一時的に全く意味のない不便な配置に変えてみる", duration: 30, slots: ALL },
    { title: "スーパーに行き、見たこともない謎の調味料を一つ買って少しだけ舐める", duration: 30, slots: OPEN_HOURS },
  ],
  long: [
    { title: "スマホの電源を切り、1時間だけ世界から姿を消す", duration: 60, slots: ALL },
    { title: "本屋に行き、タイトルが一番『予想外』な本をジャケ買いしてカフェで読む", duration: 60, slots: OPEN_HOURS },
    { title: "気になっていた少し高めのカフェに入り、贅沢な時間を過ごす", duration: 60, slots: ['day', 'afternoon', 'evening'] },
    { title: "帰り道をあえて間違え、迷子を楽しみながら1時間かけて帰る", duration: 60, slots: OUTSIDE_DAY },
    { title: "宛先のない手紙を、1時間かけて本気で書き上げ、そして破り捨てる", duration: 60, slots: NIGHT_ONLY },
    { title: "電車に乗り、サイコロを振って出た目の数だけ先の駅で降りて散策する", duration: 60, slots: OUTSIDE_DAY },
    { title: "一番近くにある図書館に行き、普段絶対に立ち入らないコーナーの本を熟読する", duration: 60, slots: ['day', 'afternoon'] },
    { title: "スマホを持って外に出、「赤いもの」だけを1時間ひたすら撮影し続ける", duration: 60, slots: OUTSIDE_DAY },
    { title: "何も買わずに、巨大なショッピングモールや商店街を1時間ただひたすら歩き回る", duration: 60, slots: OPEN_HOURS },
    { title: "自分を主人公にした「架空の情熱大陸」のシナリオを1時間かけて本気で書く", duration: 60, slots: ALL },
    { title: "1時間、一切の時計やスマホを見ずに、自分の感覚だけで「1時間経った」と思うまで待つ", duration: 60, slots: ALL },
    { title: "普段なら絶対に作らない、異常に手間のかかる飲み物や軽食を一つだけ作る", duration: 60, slots: ALL },
    { title: "誰のいないカラオケに行き、1時間ひたすら歌わずに「朗読」をする", duration: 60, slots: OPEN_HOURS },
    { title: "今すぐ一番近くの水辺に向かい、水面をただひたすら眺める", duration: 90, slots: OUTSIDE_DAY },
  ],
  extraLong: [
    { title: "直感だけで入ったことのない飲食店に入り、直感でメニューを頼む", duration: 90, slots: OPEN_HOURS },
    { title: "全く知らない駅まで電車で移動し、街の雰囲気を観察しながら歩く", duration: 120, slots: OUTSIDE_DAY },
    { title: "少し遠くの銭湯や温泉に行き、何も考えずに湯に浸かる", duration: 180, slots: OPEN_HOURS },
    { title: "バスの終点まで乗ってみて、そこからなんとかして自力で帰ってくる", duration: 180, slots: OUTSIDE_DAY },
    { title: "映画館に行き、一番直近の時間に上映される作品を何も調べずに観る", duration: 150, slots: OPEN_HOURS },
    { title: "今から行ける一番遠い美術館や博物館に行き、一つの作品の前だけで30分過ごす", duration: 150, slots: ['day', 'afternoon'] },
    { title: "目的地の駅を決めず、予算「1000円」で行けるところまで行き、そこで何かを成し遂げる", duration: 120, slots: OUTSIDE_DAY },
    { title: "レンタサイクルを借りて、体力が尽きるまでただひたすら真っ直ぐ進み続ける", duration: 120, slots: OUTSIDE_DAY },
    { title: "フェリーや船に乗れる場所を探し、ただ対岸に渡って帰ってくるだけの無目的な旅をする", duration: 180, slots: ['day', 'afternoon'] },
    { title: "映画館に行き、一番人気がなさそうな映画を選んで、最前列のど真ん中で観る", duration: 150, slots: OPEN_HOURS },
    { title: "少し高めのホテルのラウンジに行き、何かのスパイであるかのように人間観察をする", duration: 120, slots: ['day', 'afternoon', 'evening'] },
    { title: "半日かけて、自分の住んでいる街の「自分だけの秘密の抜け道」マップを作る", duration: 120, slots: OUTSIDE_DAY },
    { title: "まったく興味のないジャンルのイベントや展示会を検索し、飛び入り参加してみる", duration: 150, slots: OUTSIDE_DAY },
    { title: "日帰りでいける一番寂れそうな温泉街に行き、強烈なノスタルジーに浸る", duration: 180, slots: ['day', 'afternoon'] },
    { title: "巨大な駅に行き、案内板を一切見ずに「勘」だけで目的地に辿り着けるかゲームする", duration: 90, slots: OUTSIDE_DAY },
  ]
};

const timeToMinutes = (timeStr) => {
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
};

const minutesToTime = (mins) => {
  const h = Math.floor(mins / 60) % 24;
  const m = mins % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
};

const getSlotCategory = (minutes) => {
  if (minutes >= 360 && minutes < 540) return 'morning';
  if (minutes >= 540 && minutes < 780) return 'day';
  if (minutes >= 780 && minutes < 1080) return 'afternoon';
  if (minutes >= 1080 && minutes < 1260) return 'evening';
  if (minutes >= 1260 && minutes <= 1440) return 'night';
  return 'midnight';
};

// --- コンポーネント：タイムライン ---
const CurrentTimeLine = ({ time }) => (
  <div className="flex items-center w-full my-3 text-red-500 dark:text-red-400 animate-pulse relative z-0">
    <div className="text-xs font-bold mr-2 bg-[#F3EFE6] dark:bg-[#121212] pr-2">{time}</div>
    <div className="flex-1 border-t-2 border-red-500 dark:border-red-400 border-dashed relative">
      <div className="absolute -left-1.5 -top-1.5 w-3 h-3 bg-red-500 dark:bg-red-400 rounded-full"></div>
    </div>
  </div>
);

// --- コンポーネント：イベントカード ---
const EventCard = ({ id, startTime, endTime, title, type, onDelete, onClick }) => {
  const isUnexpected = type === 'unexpected';
  const isCustom = type === 'custom';

  // ダークモード対応のカラーリング
  let bgColor = 'bg-transparent dark:bg-transparent';
  let borderColor = 'border-[#C63527] dark:border-[#FF8A80]';
  let textColor = 'text-[#C63527] dark:text-[#FF8A80]';
  let btnColor = 'text-[#C63527] dark:text-[#FF8A80] opacity-30 hover:opacity-100';

  if (isUnexpected) {
    bgColor = 'bg-[#C63527] dark:bg-[#B71C1C]';
    textColor = 'text-white dark:text-white';
    btnColor = 'text-white dark:text-white opacity-40 hover:opacity-100';
    borderColor = 'border-transparent';
  } else if (isCustom) {
    bgColor = 'bg-[#2D4E35] dark:bg-[#1B5E20]';
    borderColor = 'border-transparent';
    textColor = 'text-white dark:text-white';
    btnColor = 'text-white dark:text-white opacity-40 hover:opacity-100';
  }

  return (
    <div
      onClick={onClick}
      className={`relative w-full px-4 py-3 rounded-xl border-2 mb-2 cursor-pointer transition-transform hover:scale-[1.01] shadow-sm ${bgColor} ${borderColor} ${textColor} relative z-10`}
    >
      <button 
        onClick={(e) => {
          e.stopPropagation();
          onDelete(id);
        }}
        className={`absolute top-2 right-2 text-xs transition-opacity ${btnColor} p-2 -m-2`}
        aria-label="削除"
      >
        ✕
      </button>
      <div className="font-bold text-base sm:text-lg leading-tight mb-1 pr-6 break-words whitespace-pre-wrap">{title}</div>
      <div className={`text-xs sm:text-sm ${isUnexpected || isCustom ? 'opacity-90' : 'opacity-80'}`}>
        {startTime}-{endTime}
      </div>
    </div>
  );
};

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [fadeSplash, setFadeSplash] = useState(false);

  const [schedule, setSchedule] = useState([]);
  const [customPool, setCustomPool] = useState([]);
  const [activeRange, setActiveRange] = useState({ start: "08:00", end: "23:00" });

  // タイムライン用（現在時刻）
  const [currentTime, setCurrentTime] = useState('');

  // UI用ステート（ボトムシート＆FAB）
  const [isFabMenuOpen, setIsFabMenuOpen] = useState(false);
  const [activeSheet, setActiveSheet] = useState(null); // 'event' | 'stock' | null

  // 編集用ステート
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editStartTime, setEditStartTime] = useState('');
  const [editEndTime, setEditEndTime] = useState('');

  // 新規追加用ステート
  const [newTitle, setNewTitle] = useState('');
  const [newStartTime, setNewStartTime] = useState('');
  const [newEndTime, setNewEndTime] = useState('');
  const [poolTitle, setPoolTitle] = useState('');
  const [poolDuration, setPoolDuration] = useState(30);

  // 初期読み込みと現在時刻の更新
  useEffect(() => {
    const fadeTimer = setTimeout(() => { setFadeSplash(true); }, 1500);
    const removeTimer = setTimeout(() => { setShowSplash(false); }, 2500);

    // 現在時刻を1分ごとに更新
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(minutesToTime(now.getHours() * 60 + now.getMinutes()));
    };
    updateTime();
    const timeInterval = setInterval(updateTime, 60000);

    const savedSchedule = localStorage.getItem('my_schedule');
    const savedPool = localStorage.getItem('custom_pool');
    const savedRange = localStorage.getItem('active_range');
    const lastOpenedDate = localStorage.getItem('last_opened_date');
    const todayStr = new Date().toLocaleDateString();

    if (savedPool) setCustomPool(JSON.parse(savedPool));
    if (savedRange) setActiveRange(JSON.parse(savedRange));

    if (lastOpenedDate && lastOpenedDate !== todayStr) {
      setSchedule([]); // 日付が変わっていたら予定のみリセット
    } else if (savedSchedule) {
      setSchedule(JSON.parse(savedSchedule));
    } else {
      setSchedule([
        { id: 1, startTime: '09:00', endTime: '10:00', title: 'ミーティング', type: 'normal' },
        { id: 2, startTime: '10:30', endTime: '12:00', title: '資料作成', type: 'normal' },
        { id: 3, startTime: '13:00', endTime: '14:30', title: 'アプリ開発', type: 'normal' },
        { id: 4, startTime: '17:30', endTime: '18:30', title: '夕食', type: 'normal' },
      ]);
    }
    localStorage.setItem('last_opened_date', todayStr);

    return () => { clearTimeout(fadeTimer); clearTimeout(removeTimer); clearInterval(timeInterval); };
  }, []);

  useEffect(() => {
    if (!showSplash) {
      localStorage.setItem('my_schedule', JSON.stringify(schedule));
      localStorage.setItem('custom_pool', JSON.stringify(customPool));
      localStorage.setItem('active_range', JSON.stringify(activeRange));
    }
  }, [schedule, customPool, activeRange, showSplash]);

  const today = new Date();
  const currentMonth = today.getMonth() + 1;
  const currentDate = today.getDate();

  // 隙間計算
  const getGaps = (currentSchedule) => {
    const sorted = [...currentSchedule].sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));
    const innerGaps = [];
    const outerGaps = [];
    const activeStart = timeToMinutes(activeRange.start);
    const activeEnd = timeToMinutes(activeRange.end);
    
    // 現在時刻考慮
    const nowMins = timeToMinutes(currentTime);
    const effectiveStart = Math.max(activeStart, nowMins);

    if (effectiveStart >= activeEnd) {
      return { innerGaps: [], outerGaps: [] };
    }

    if (sorted.length === 0) {
      if (activeEnd - effectiveStart >= 15) outerGaps.push({ start: effectiveStart, end: activeEnd, duration: activeEnd - effectiveStart });
      return { innerGaps, outerGaps };
    }

    const firstEventStart = timeToMinutes(sorted[0].startTime);
    if (firstEventStart > effectiveStart) {
      const gapEnd = Math.min(firstEventStart, activeEnd);
      if (gapEnd - effectiveStart >= 15) outerGaps.push({ start: effectiveStart, end: gapEnd, duration: gapEnd - effectiveStart });
    }

    let lastEnd = Math.max(effectiveStart, timeToMinutes(sorted[0].endTime));
    for (let i = 1; i < sorted.length; i++) {
      const start = timeToMinutes(sorted[i].startTime);
      if (start > lastEnd) {
        const gapStart = Math.max(lastEnd, effectiveStart);
        const gapEnd = Math.min(start, activeEnd);
        if (gapEnd - gapStart >= 15) innerGaps.push({ start: gapStart, end: gapEnd, duration: gapEnd - gapStart });
      }
      lastEnd = Math.max(lastEnd, timeToMinutes(sorted[i].endTime));
    }

    if (activeEnd > lastEnd) {
      const gapStart = Math.max(lastEnd, effectiveStart);
      if (activeEnd - gapStart >= 15) outerGaps.push({ start: gapStart, end: activeEnd, duration: activeEnd - gapStart });
    }

    return { innerGaps, outerGaps };
  };

  const addNormalEvent = (e) => {
    e.preventDefault();
    if (!newTitle || !newStartTime || !newEndTime) return;
    if (timeToMinutes(newStartTime) >= timeToMinutes(newEndTime)) {
      alert("終了時刻は開始時刻より後に設定してください。");
      return;
    }
    setSchedule([...schedule, { id: Date.now(), startTime: newStartTime, endTime: newEndTime, title: newTitle, type: 'normal' }]);
    setNewTitle(''); setNewStartTime(''); setNewEndTime('');
    setActiveSheet(null); // ボトムシートを閉じる
  };

  const deleteEvent = (idToDelete) => setSchedule(schedule.filter(item => item.id !== idToDelete));

  const startEditing = (item) => {
    setEditingId(item.id);
    setEditTitle(item.title);
    setEditStartTime(item.startTime);
    setEditEndTime(item.endTime);
  };

  const saveEdit = (id) => {
    if (!editTitle || !editStartTime || !editEndTime) return;
    if (timeToMinutes(editStartTime) >= timeToMinutes(editEndTime)) {
      alert("終了時刻は開始時刻より後に設定してください。");
      return;
    }
    setSchedule(schedule.map(item => item.id === id ? { ...item, title: editTitle, startTime: editStartTime, endTime: editEndTime } : item));
    setEditingId(null);
  };

  const handleTextareaResize = (e) => {
    e.target.style.height = 'auto'; 
    e.target.style.height = `${e.target.scrollHeight}px`; 
  };

  const triggerUnexpected = () => {
    setIsFabMenuOpen(false);
    const { innerGaps, outerGaps } = getGaps(schedule);
    const gaps = innerGaps.length > 0 ? innerGaps : outerGaps;
    
    if (gaps.length === 0) return alert("活動時間内に予想外が入り込む隙がありません！");

    const randomGap = gaps[Math.floor(Math.random() * gaps.length)];
    const targetSlotCategory = getSlotCategory(randomGap.start);
    
    let targetMissions = [];
    if (randomGap.duration >= 90) {
      targetMissions = unexpectedMissions.extraLong.filter(m => m.slots.includes(targetSlotCategory));
      if (targetMissions.length === 0) targetMissions = unexpectedMissions.long.filter(m => m.slots.includes(targetSlotCategory)); 
    } else if (randomGap.duration >= 60) {
      targetMissions = unexpectedMissions.long.filter(m => m.slots.includes(targetSlotCategory));
    } else if (randomGap.duration >= 30) {
      targetMissions = unexpectedMissions.medium.filter(m => m.slots.includes(targetSlotCategory));
    } else {
      targetMissions = unexpectedMissions.short.filter(m => m.slots.includes(targetSlotCategory));
    }
    if (targetMissions.length === 0) targetMissions = unexpectedMissions.short; 

    const randomMission = targetMissions[Math.floor(Math.random() * targetMissions.length)];
    setSchedule([...schedule, { id: Date.now(), startTime: minutesToTime(randomGap.start), endTime: minutesToTime(randomGap.start + randomMission.duration), title: randomMission.title, type: 'unexpected' }]);
  };

  const triggerCustomTask = () => {
    setIsFabMenuOpen(false);
    if (customPool.length === 0) return alert("まずは「ストック」にタスクを追加してください。");

    const { innerGaps, outerGaps } = getGaps(schedule);
    const shuffledTasks = [...customPool].sort(() => 0.5 - Math.random());

    for (const task of shuffledTasks) {
      const targetGap = innerGaps.find(g => g.duration >= task.duration);
      if (targetGap) {
        setSchedule([...schedule, { id: Date.now(), startTime: minutesToTime(targetGap.start), endTime: minutesToTime(targetGap.start + task.duration), title: task.title, type: 'custom' }]);
        return; 
      }
    }
    for (const task of shuffledTasks) {
      const targetGap = outerGaps.find(g => g.duration >= task.duration);
      if (targetGap) {
        setSchedule([...schedule, { id: Date.now(), startTime: minutesToTime(targetGap.start), endTime: minutesToTime(targetGap.start + task.duration), title: task.title, type: 'custom' }]);
        return; 
      }
    }
    alert("現在の時刻から活動終了までの間に収まるタスクがストックにありませんでした。");
  };

  // スケジュールと現在時刻（タイムライン）を描画するための関数
  const renderScheduleWithTimeline = () => {
    const sorted = [...schedule].sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));
    const nowMins = timeToMinutes(currentTime);
    const elements = [];
    let isNowInjected = false;

    sorted.forEach((item) => {
      const itemStartMins = timeToMinutes(item.startTime);
      // 現在時刻がこの予定の開始時刻より前なら、ここに線を引く
      if (!isNowInjected && nowMins < itemStartMins) {
        elements.push(<CurrentTimeLine key="timeline-now" time={currentTime} />);
        isNowInjected = true;
      }
      
      const isUnexpected = item.type === 'unexpected';
      const isCustom = item.type === 'custom';
      const editBg = isUnexpected ? 'bg-[#C63527] dark:bg-[#B71C1C] border-[#C63527] dark:border-[#B71C1C] text-white' 
                  : isCustom ? 'bg-[#2D4E35] dark:bg-[#1B5E20] border-[#2D4E35] dark:border-[#1B5E20] text-white' 
                  : 'bg-transparent border-[#C63527] dark:border-[#FF8A80] text-[#C63527] dark:text-[#FF8A80]';
      const saveBtnClass = isUnexpected || isCustom ? 'border-white hover:bg-white hover:text-black' : 'border-[#C63527] dark:border-[#FF8A80] hover:bg-[#C63527] dark:hover:bg-[#FF8A80] hover:text-white dark:hover:text-gray-900';

      if (editingId === item.id) {
        elements.push(
          <div key={item.id} className={`w-full px-4 py-3 rounded-xl border-2 mb-2 ${editBg}`}>
            <textarea
              value={editTitle}
              className="w-full font-bold text-base sm:text-lg bg-transparent border-b border-current focus:outline-none mb-3 placeholder-current opacity-90 resize-none overflow-hidden"
              placeholder="予定のタイトル"
              rows={1}
              onChange={(e) => { setEditTitle(e.target.value); handleTextareaResize(e); }}
              ref={(element) => { if (element) { element.style.height = 'auto'; element.style.height = `${element.scrollHeight}px`; } }}
            />
            <div className="flex gap-2 items-center mb-4 text-xs sm:text-sm opacity-90">
              <input type="time" value={editStartTime} onChange={(e) => setEditStartTime(e.target.value)} className="w-1/2 bg-transparent border-b border-current focus:outline-none" />
              <span>〜</span>
              <input type="time" value={editEndTime} onChange={(e) => setEditEndTime(e.target.value)} className="w-1/2 bg-transparent border-b border-current focus:outline-none" />
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={() => setEditingId(null)} className="text-xs opacity-70 hover:opacity-100">キャンセル</button>
              <button onClick={() => saveEdit(item.id)} className={`text-xs font-bold px-3 py-1 border rounded transition-colors ${saveBtnClass}`}>保存</button>
            </div>
          </div>
        );
      } else {
        elements.push(
          <EventCard key={item.id} id={item.id} startTime={item.startTime} endTime={item.endTime} title={item.title} type={item.type} onDelete={deleteEvent} onClick={() => startEditing(item)} />
        );
      }
    });

    // もし全ての予定が現在時刻より前だった場合は、一番下に線を引く
    if (!isNowInjected) {
      elements.push(<CurrentTimeLine key="timeline-now" time={currentTime} />);
    }

    return elements;
  };

  return (
    <>
      {/* ボトムシート用のアニメーション定義 */}
      <style>{`
        @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
        .animate-slide-up { animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in { animation: fadeIn 0.2s ease-out forwards; }
      `}</style>

      {showSplash && (
        <div className={`fixed inset-0 z-[100] bg-[#F3EFE6] dark:bg-[#121212] flex items-center justify-center transition-opacity duration-1000 ${fadeSplash ? 'opacity-0' : 'opacity-100'}`}>
          <p className="text-[#C63527] dark:text-[#FF8A80] text-2xl leading-loose [writing-mode:vertical-rl] font-bold tracking-widest font-serif">
            私の予定は、<br />予想外。
          </p>
        </div>
      )}

      {/* Tailwindのdarkモードを有効活用するためのベースコンテナ */}
      <div className="min-h-screen bg-[#F3EFE6] dark:bg-[#121212] transition-colors duration-300 flex justify-center font-serif p-4 sm:p-6 pb-48">
        <div className="w-full max-w-sm relative">
          
          <div className="text-center mb-6 sm:mb-8 text-[#C63527] dark:text-[#FF8A80]">
            <p className="text-base sm:text-lg">{currentMonth}月</p>
            <h1 className="text-4xl sm:text-5xl font-bold mt-1">{currentDate}</h1>
          </div>

          {/* 活動時間の指定 */}
          <div className="mb-6 p-3 border border-[#C63527]/30 dark:border-[#FF8A80]/30 rounded-xl flex items-center justify-between text-[#C63527] dark:text-[#FF8A80] bg-[#F3EFE6] dark:bg-[#1E1E1E]">
            <span className="text-xs font-bold">活動時間</span>
            <div className="flex gap-2 items-center">
              <input type="time" className="bg-transparent border-b border-[#C63527] dark:border-[#FF8A80] outline-none text-sm" value={activeRange.start} onChange={e => setActiveRange({...activeRange, start: e.target.value})} />
              <span>~</span>
              <input type="time" className="bg-transparent border-b border-[#C63527] dark:border-[#FF8A80] outline-none text-sm" value={activeRange.end} onChange={e => setActiveRange({...activeRange, end: e.target.value})} />
            </div>
          </div>

          {/* スケジュールとタイムライン表示 */}
          <div className="flex flex-col">
            {renderScheduleWithTimeline()}
          </div>

          <div className="mt-16 flex justify-end text-[#C63527] dark:text-[#FF8A80]">
            <p className="text-xs sm:text-sm leading-loose [writing-mode:vertical-rl] font-bold tracking-widest opacity-60">
              私の予定は、<br />予想外。
            </p>
          </div>
          
        </div>
      </div>

      {/* FAB (Floating Action Button) */}
      <div className="fixed bottom-6 right-6 flex flex-col items-end z-40 font-serif">
        {/* サブメニュー（展開時） */}
        <div className={`flex flex-col items-end gap-3 mb-4 transition-all duration-300 origin-bottom-right ${isFabMenuOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-75 pointer-events-none'}`}>
          <button onClick={triggerCustomTask} className="bg-[#2D4E35] dark:bg-[#A5D6A7] text-white dark:text-gray-900 px-5 py-3 rounded-full shadow-lg font-bold text-sm">時間を有効活用する</button>
          <button onClick={triggerUnexpected} className="bg-[#C63527] dark:bg-[#FF8A80] text-white dark:text-gray-900 px-5 py-3 rounded-full shadow-lg font-bold text-sm">日常に予想外を起こす</button>
          <button onClick={() => { setIsFabMenuOpen(false); setActiveSheet('stock'); }} className="bg-white dark:bg-gray-800 text-[#C63527] dark:text-[#FF8A80] border-2 border-[#C63527] dark:border-[#FF8A80] px-5 py-3 rounded-full shadow-lg font-bold text-sm">＋ ストック追加</button>
          <button onClick={() => { setIsFabMenuOpen(false); setActiveSheet('event'); }} className="bg-white dark:bg-gray-800 text-[#C63527] dark:text-[#FF8A80] border-2 border-[#C63527] dark:border-[#FF8A80] px-5 py-3 rounded-full shadow-lg font-bold text-sm">＋ 予定追加</button>
        </div>
        
        {/* メインFAB */}
        <button 
          onClick={() => setIsFabMenuOpen(!isFabMenuOpen)} 
          className={`w-16 h-16 rounded-full bg-[#C63527] dark:bg-[#FF8A80] text-white dark:text-gray-900 shadow-xl flex items-center justify-center text-3xl font-light transition-transform duration-300 ${isFabMenuOpen ? 'rotate-45 bg-gray-800 dark:bg-white text-white dark:text-gray-900' : ''}`}
        >
          ＋
        </button>
      </div>

      {/* ボトムシート（ハーフモーダル） */}
      {activeSheet && (
        <div className="fixed inset-0 z-50 flex items-end justify-center font-serif">
          {/* 背景のダークオーバーレイ */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in" onClick={() => setActiveSheet(null)}></div>
          
          {/* シート本体 */}
          <div className="relative w-full max-w-md bg-[#F3EFE6] dark:bg-[#1E1E1E] rounded-t-3xl shadow-2xl p-6 pb-12 animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto mb-6"></div>
            
            {activeSheet === 'event' && (
              <div>
                <h3 className="text-lg font-bold text-[#C63527] dark:text-[#FF8A80] mb-4">確定している予定を追加</h3>
                <form onSubmit={addNormalEvent}>
                  <textarea
                    placeholder="予定のタイトル"
                    className="w-full mb-6 p-2 bg-transparent border-b-2 border-[#C63527] dark:border-[#FF8A80] text-[#C63527] dark:text-[#FF8A80] placeholder-[#C63527]/50 dark:placeholder-[#FF8A80]/50 focus:outline-none text-base resize-none overflow-hidden"
                    rows={1}
                    value={newTitle}
                    onChange={(e) => { setNewTitle(e.target.value); handleTextareaResize(e); }}
                  />
                  <div className="flex gap-2 mb-8">
                    <input type="time" className="w-1/2 p-2 bg-transparent border-b-2 border-[#C63527] dark:border-[#FF8A80] text-[#C63527] dark:text-[#FF8A80] focus:outline-none" value={newStartTime} onChange={(e) => setNewStartTime(e.target.value)} />
                    <span className="text-[#C63527] dark:text-[#FF8A80] self-center">〜</span>
                    <input type="time" className="w-1/2 p-2 bg-transparent border-b-2 border-[#C63527] dark:border-[#FF8A80] text-[#C63527] dark:text-[#FF8A80] focus:outline-none" value={newEndTime} onChange={(e) => setNewEndTime(e.target.value)} />
                  </div>
                  <button type="submit" className="w-full py-3 bg-[#C63527] dark:bg-[#FF8A80] text-white dark:text-gray-900 font-bold rounded-xl shadow-md hover:opacity-90 transition-opacity">
                    追加する
                  </button>
                </form>
              </div>
            )}

            {activeSheet === 'stock' && (
              <div>
                <h3 className="text-lg font-bold text-[#2D4E35] dark:text-[#A5D6A7] mb-4">いつかやりたいこと（ストック）</h3>
                <form onSubmit={(e) => { e.preventDefault(); if(poolTitle){ setCustomPool([...customPool, { id: Date.now(), title: poolTitle, duration: parseInt(poolDuration) }]); setPoolTitle(''); } }}>
                  <input className="w-full mb-6 p-2 bg-transparent border-b-2 border-[#2D4E35] dark:border-[#A5D6A7] text-[#2D4E35] dark:text-[#A5D6A7] placeholder-[#2D4E35]/50 dark:placeholder-[#A5D6A7]/50 focus:outline-none text-base" placeholder="タスク名" value={poolTitle} onChange={e => setPoolTitle(e.target.value)} />
                  <div className="flex gap-4 mb-8">
                    <select className="flex-1 bg-transparent border-b-2 border-[#2D4E35] dark:border-[#A5D6A7] text-[#2D4E35] dark:text-[#A5D6A7] focus:outline-none p-2" value={poolDuration} onChange={e => setPoolDuration(e.target.value)}>
                      <option value="15">15分</option><option value="30">30分</option><option value="60">60分</option><option value="90">90分</option>
                    </select>
                    <button type="submit" className="flex-1 py-3 bg-[#2D4E35] dark:bg-[#A5D6A7] text-white dark:text-gray-900 font-bold rounded-xl shadow-md hover:opacity-90 transition-opacity">
                      ストックする
                    </button>
                  </div>
                </form>
                {customPool.length > 0 && (
                  <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                    {customPool.map(t => (
                      <div key={t.id} className="text-xs border border-[#2D4E35] dark:border-[#A5D6A7] text-[#2D4E35] dark:text-[#A5D6A7] px-3 py-1.5 rounded-full flex items-center gap-2">
                        <span>{t.title}({t.duration}分)</span>
                        <button type="button" onClick={() => setCustomPool(customPool.filter(x => x.id !== t.id))} className="font-bold opacity-60 hover:opacity-100">×</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
