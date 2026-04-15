import React, { useState, useEffect, useRef } from 'react';
import { useAutoAnimate } from '@formkit/auto-animate/react';

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
    { title: "近くにある「一番赤いもの」と「一番青いもの」を探して並べる", duration: 15, slots: ALL },
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

// --- スワイプ対応コンポーネント ---
const SwipeableEventCard = ({ id, startTime, endTime, title, type, onDelete, onEdit }) => {
  const isUnexpected = type === 'unexpected';
  const isCustom = type === 'custom';

  // スワイプ時に後ろのボタンが透けないよう、アプリ背景色(#F3EFE6)と同化する色をデフォルトに
  let bgColor = 'bg-[#F3EFE6]';
  let borderColor = 'border-[#C63527]';
  let textColor = 'text-[#C63527]';

  if (isUnexpected) {
    bgColor = 'bg-[#C63527]';
    textColor = 'text-white';
  } else if (isCustom) {
    bgColor = 'bg-[#2D4E35]';
    borderColor = 'border-[#2D4E35]';
    textColor = 'text-white';
  }

  // スワイプ用の状態管理
  const [translateX, setTranslateX] = useState(0);
  const touchStartX = useRef(0);
  const touchCurrentX = useRef(0);
  const ACTION_WIDTH = 140; // 編集(70px) + 削除(70px) の幅

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchCurrentX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchCurrentX.current = e.touches[0].clientX;
    const diff = touchCurrentX.current - touchStartX.current;
    
    if (diff < 0 && translateX === 0) {
      // 左へのスワイプ
      setTranslateX(Math.max(diff, -ACTION_WIDTH));
    } else if (diff > 0 && translateX < 0) {
      // 右へのスワイプ（元に戻す）
      setTranslateX(Math.min(-ACTION_WIDTH + diff, 0));
    }
  };

  const handleTouchEnd = () => {
    // スワイプ距離が半分を超えたら開きっぱなしにする
    if (translateX < -(ACTION_WIDTH / 2)) {
      setTranslateX(-ACTION_WIDTH);
    } else {
      setTranslateX(0);
    }
  };

  return (
    <div className="relative w-full mb-2 overflow-hidden rounded-md border-2 border-transparent">
      {/* 背後に隠れているアクションボタン */}
      <div className="absolute top-0 right-0 h-full flex">
        <button 
          onClick={(e) => { e.stopPropagation(); setTranslateX(0); onEdit(); }} 
          className="w-[70px] bg-gray-400 text-white font-bold text-sm flex items-center justify-center transition-colors hover:bg-gray-500 rounded-l-md"
        >
          編集
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); setTranslateX(0); onDelete(id); }} 
          className="w-[70px] bg-[#C63527] text-white font-bold text-sm flex items-center justify-center transition-colors hover:bg-red-800 rounded-r-md"
        >
          削除
        </button>
      </div>

      {/* スワイプで動く前面のカード本体 */}
      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ transform: `translateX(${translateX}px)` }}
        className={`relative w-full px-4 py-3 border-2 transition-transform duration-200 ease-out rounded-md shadow-sm ${bgColor} ${borderColor} ${textColor}`}
      >
        <div className="font-bold text-base sm:text-lg leading-tight mb-1 pr-6 break-words whitespace-pre-wrap">{title}</div>
        <div className={`text-xs sm:text-sm ${isUnexpected || isCustom ? 'opacity-90' : 'text-[#C63527]/80'}`}>
          {startTime}-{endTime}
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [fadeSplash, setFadeSplash] = useState(false);

  // データ用ステート
  const [schedule, setSchedule] = useState([]);
  const [customPool, setCustomPool] = useState([]);
  const [activeRange, setActiveRange] = useState({ start: "08:00", end: "23:00" });

  // UI用ステート（折りたたみ）
  const [isScheduleFormOpen, setIsScheduleFormOpen] = useState(false);
  const [isPoolFormOpen, setIsPoolFormOpen] = useState(false);

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

  // ★ ヌルッとしたアニメーションを管理するHook
  const [listRef] = useAutoAnimate();

  useEffect(() => {
    const fadeTimer = setTimeout(() => { setFadeSplash(true); }, 1500);
    const removeTimer = setTimeout(() => { setShowSplash(false); }, 2500);

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
      // 初期データ
      setSchedule([
        { id: 1, startTime: '09:00', endTime: '10:00', title: 'ミーティング', type: 'normal' },
        { id: 2, startTime: '10:30', endTime: '12:00', title: '資料作成', type: 'normal' },
        { id: 3, startTime: '13:00', endTime: '14:30', title: 'アプリ開発', type: 'normal' },
        { id: 4, startTime: '17:30', endTime: '18:30', title: '夕食', type: 'normal' },
      ]);
    }
    localStorage.setItem('last_opened_date', todayStr);

    return () => { clearTimeout(fadeTimer); clearTimeout(removeTimer); };
  }, []);

  // 保存処理
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

    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const effectiveStart = Math.max(activeStart, currentMinutes);

    if (effectiveStart >= activeEnd) return { innerGaps: [], outerGaps: [] };

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
    const newEvent = { id: Date.now(), startTime: newStartTime, endTime: newEndTime, title: newTitle, type: 'normal' };
    setSchedule([...schedule, newEvent]);
    setNewTitle(''); setNewStartTime(''); setNewEndTime('');
    setIsScheduleFormOpen(false);
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

  // ★ バイブレーション機能の追加
  const triggerVibration = () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(50); // 50ミリ秒の「ブルッ」
    }
  };

  const triggerUnexpected = () => {
    triggerVibration(); // ボタン押下時の振動

    const { innerGaps, outerGaps } = getGaps(schedule);
    const gaps = innerGaps.length > 0 ? innerGaps : outerGaps;
    
    if (gaps.length === 0) {
      alert("現在の時刻から活動終了までの間に、予想外が入り込む隙間がありません！");
      return;
    }

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

    setSchedule([...schedule, {
      id: Date.now(),
      startTime: minutesToTime(randomGap.start),
      endTime: minutesToTime(randomGap.start + randomMission.duration),
      title: randomMission.title,
      type: 'unexpected'
    }]);
  };

  const triggerCustomTask = () => {
    triggerVibration(); // ボタン押下時の振動

    if (customPool.length === 0) {
      alert("まずは「ストック」にタスクを追加してください。");
      return;
    }

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

  const sortedDisplaySchedule = [...schedule].sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));

  return (
    <>
      {showSplash && (
        <div className={`fixed inset-0 z-50 bg-[#F3EFE6] flex items-center justify-center transition-opacity duration-1000 ${fadeSplash ? 'opacity-0' : 'opacity-100'}`}>
          <p className="text-[#C63527] text-2xl leading-loose [writing-mode:vertical-rl] font-bold tracking-widest font-serif">
            私の予定は、<br />予想外。
          </p>
        </div>
      )}

      <div className="min-h-screen bg-[#F3EFE6] flex justify-center font-serif p-4 sm:p-6 pb-48">
        <div className="w-full max-w-sm relative">
          
          <div className="text-center mb-6 sm:mb-8 text-[#C63527]">
            <p className="text-base sm:text-lg">{currentMonth}月</p>
            <h1 className="text-4xl sm:text-5xl font-bold mt-1">{currentDate}</h1>
          </div>

          <div className="mb-6 p-3 border border-[#C63527]/30 rounded flex items-center justify-between text-[#C63527] bg-[#F3EFE6]">
            <span className="text-xs font-bold">活動時間</span>
            <div className="flex gap-2 items-center">
              <input type="time" className="bg-transparent border-b border-[#C63527] outline-none text-sm" value={activeRange.start} onChange={e => setActiveRange({...activeRange, start: e.target.value})} />
              <span>~</span>
              <input type="time" className="bg-transparent border-b border-[#C63527] outline-none text-sm" value={activeRange.end} onChange={e => setActiveRange({...activeRange, end: e.target.value})} />
            </div>
          </div>

          <div className="mb-4 border-2 border-dashed border-[#C63527]/40 rounded-md transition-all overflow-hidden">
            <button 
              type="button" 
              onClick={() => setIsScheduleFormOpen(!isScheduleFormOpen)} 
              className="w-full p-4 flex justify-between items-center text-[#C63527] bg-[#F3EFE6]"
            >
              <span className="text-xs font-bold">＋ 確定している予定を追加</span>
              <span className="font-bold">{isScheduleFormOpen ? '−' : '＋'}</span>
            </button>
            {isScheduleFormOpen && (
              <form onSubmit={addNormalEvent} className="p-4 pt-0">
                <textarea
                  placeholder="予定のタイトル"
                  className="w-full mb-3 p-2 bg-transparent border-b border-[#C63527] text-[#C63527] placeholder-[#C63527]/50 focus:outline-none text-sm sm:text-base resize-none overflow-hidden"
                  rows={1}
                  value={newTitle}
                  onChange={(e) => { setNewTitle(e.target.value); handleTextareaResize(e); }}
                />
                <div className="flex gap-1 sm:gap-2 mb-4">
                  <input type="time" className="w-1/2 p-2 bg-transparent border-b border-[#C63527] text-[#C63527] focus:outline-none text-sm sm:text-base" value={newStartTime} onChange={(e) => setNewStartTime(e.target.value)} />
                  <span className="text-[#C63527] self-center">〜</span>
                  <input type="time" className="w-1/2 p-2 bg-transparent border-b border-[#C63527] text-[#C63527] focus:outline-none text-sm sm:text-base" value={newEndTime} onChange={(e) => setNewEndTime(e.target.value)} />
                </div>
                <button type="submit" className="w-full py-2 border-2 border-[#C63527] text-[#C63527] font-bold rounded-md hover:bg-[#C63527] hover:text-white transition-colors text-sm sm:text-base">
                  追加する
                </button>
              </form>
            )}
          </div>

          <div className="mb-8 border-2 border-[#2D4E35]/40 rounded-md text-[#2D4E35] transition-all overflow-hidden">
            <button 
              type="button" 
              onClick={() => setIsPoolFormOpen(!isPoolFormOpen)} 
              className="w-full p-4 flex justify-between items-center bg-[#F3EFE6]"
            >
              <span className="text-xs font-bold">＋ いつかやりたいこと（ストック）</span>
              <span className="font-bold">{isPoolFormOpen ? '−' : '＋'}</span>
            </button>
            {isPoolFormOpen && (
              <div className="p-4 pt-0">
                <form onSubmit={(e) => { e.preventDefault(); if(poolTitle){ setCustomPool([...customPool, { id: Date.now(), title: poolTitle, duration: parseInt(poolDuration) }]); setPoolTitle(''); } }}>
                  <input className="w-full bg-transparent border-b border-[#2D4E35] mb-3 p-1 outline-none" placeholder="タスク名" value={poolTitle} onChange={e => setPoolTitle(e.target.value)} />
                  <div className="flex items-center gap-3">
                    <select className="bg-transparent border-b border-[#2D4E35] outline-none text-sm" value={poolDuration} onChange={e => setPoolDuration(e.target.value)}>
                      <option value="15">15分</option><option value="30">30分</option><option value="60">60分</option><option value="90">90分</option>
                    </select>
                    <button type="submit" className="ml-auto font-bold border border-[#2D4E35] px-3 py-1 rounded">ストック</button>
                  </div>
                </form>
                {customPool.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {customPool.map(t => (
                      <div key={t.id} className="text-[10px] border border-[#2D4E35] px-2 py-1 rounded-full flex items-center gap-1">
                        <span>{t.title}({t.duration}分)</span>
                        <button type="button" onClick={() => setCustomPool(customPool.filter(x => x.id !== t.id))} className="hover:text-red-500 font-bold ml-1">×</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ★ AutoAnimateを適用したスケジュールリスト */}
          <div className="flex flex-col" ref={listRef}>
            {sortedDisplaySchedule.map((item) => {
              const isUnexpected = item.type === 'unexpected';
              const isCustom = item.type === 'custom';
              const editBg = isUnexpected ? 'bg-[#C63527] border-[#C63527] text-white' : isCustom ? 'bg-[#2D4E35] border-[#2D4E35] text-white' : 'bg-[#F3EFE6] border-[#C63527] text-[#C63527]';
              const saveBtnClass = isUnexpected || isCustom ? 'border-white hover:bg-white hover:text-[#C63527]' : 'border-[#C63527] hover:bg-[#C63527] hover:text-white';

              return editingId === item.id ? (
                <div key={item.id} className={`w-full px-4 py-3 rounded-md border-2 mb-2 ${editBg}`}>
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
              ) : (
                <SwipeableEventCard
                  key={item.id}
                  id={item.id}
                  startTime={item.startTime}
                  endTime={item.endTime}
                  title={item.title}
                  type={item.type}
                  onDelete={deleteEvent}
                  onEdit={() => startEditing(item)}
                />
              )
            })}
          </div>

          <div className="mt-12 flex justify-end text-[#C63527]">
            <p className="text-xs sm:text-sm leading-loose [writing-mode:vertical-rl] font-bold tracking-widest opacity-80">
              私の予定は、<br />予想外。
            </p>
          </div>

          <div className="fixed bottom-6 left-0 right-0 flex flex-col items-center gap-3 px-4 pointer-events-none">
            <button
              onClick={triggerCustomTask}
              className="pointer-events-auto w-full max-w-sm bg-[#2D4E35] text-white px-4 sm:px-6 py-3 sm:py-4 rounded-full font-bold shadow-lg border-2 border-[#2D4E35] hover:bg-white hover:text-[#2D4E35] transition-all transform hover:scale-105 active:scale-95 text-sm sm:text-base"
            >
              時間を有効活用する
            </button>
            <button
              onClick={triggerUnexpected}
              className="pointer-events-auto w-full max-w-sm bg-[#C63527] text-white px-4 sm:px-6 py-3 sm:py-4 rounded-full font-bold shadow-lg border-2 border-[#C63527] hover:bg-white hover:text-[#C63527] transition-all transform hover:scale-105 active:scale-95 text-sm sm:text-base"
            >
              日常に予想外を起こす
            </button>
          </div>
          
        </div>
      </div>
    </>
  );
}
