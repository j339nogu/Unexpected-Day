import React, { useState, useEffect } from 'react';

// 所要時間（分）ごとに分類された「予想外のミッション」リスト（全56種）
const unexpectedMissions = {
  short: [
    { title: "目を閉じて、5分間だけ一切の思考を放棄する", duration: 15 },
    { title: "財布の中身をすべて出し、不要なレシートを捨てる", duration: 15 },
    { title: "スマホを伏せて、窓から見える景色だけをぼーっと眺める", duration: 15 },
    { title: "誰の目も気にせず、その場で全力の「伸び」をする", duration: 15 },
    { title: "コップ一杯の水を、驚くほどゆっくり味わって飲む", duration: 15 },
    { title: "今日あった「ちょっとだけ良かったこと」を3つ思い出す", duration: 15 },
    { title: "利き手と逆の手で、今考えていることをノートに書き出す", duration: 15 },
    { title: "辞書や適当な本を開き、最初に目についた単語について5分間真剣に考察する", duration: 15 },
    { title: "床に大の字で寝転がり、天井の模様をただ見つめて別の何かに見立てる", duration: 15 },
    { title: "今すぐシャワーを浴びて、すべての気だるさを洗い流す", duration: 20 },
    { title: "窓を全開にして、外の音をただひたすらスマホで録音して聴き返す", duration: 15 },
    { title: "15分間だけ、絶対に「はい」「いいえ」以外の言葉を発しない縛りゲームを一人でする", duration: 15 },
    { title: "スマホの連絡先をランダムにスクロールし、止まった人のことを3分間だけ思い出す", duration: 15 },
    { title: "鏡の前で、今まで一度もしたことがないような最高の笑顔を1分間キープする", duration: 15 },
    { title: "過去の自分のSNSを一番下までスクロールし、当時の自分に心の中でツッコミを入れる", duration: 15 },
    { title: "家の中にある「一番赤いもの」と「一番青いもの」を探して並べる", duration: 15 },
  ],
  medium: [
    { title: "一番近くのコンビニで、今まで一度も買ったことのない飲み物を買う", duration: 30 },
    { title: "目的もなく、ただ30分間だけ近所を散歩する", duration: 30 },
    { title: "紙とペンを用意し、今の脳内にある言葉をひたすら書き殴る", duration: 30 },
    { title: "普段絶対に聴かないジャンルの音楽を、目を閉じて真剣に聴く", duration: 30 },
    { title: "部屋の「普段絶対に掃除しない場所」を1箇所だけ本気で綺麗にする", duration: 30 },
    { title: "近くの公園に行き、一番形のいい落ち葉（または石）を真剣に探して持ち帰る", duration: 30 },
    { title: "Googleマップのストリートビューで、地球の裏側の道を30分間散歩する", duration: 30 },
    { title: "100円ショップに行き、「絶対にいらないけど一番面白いもの」を真剣に選んで買う", duration: 30 },
    { title: "今から30分間、すべてのアクションを「スローモーション」で行う", duration: 30 },
    { title: "家にある本の中からランダムに3冊選び、それぞれの最初の1文を繋げて詩を作る", duration: 30 },
    { title: "近くの交差点に行き、行き交う人々の人生を勝手にアテレコする", duration: 30 },
    { title: "普段よく使うアプリの「設定」画面を隅から隅まで読み込み、未知の機能を探す", duration: 30 },
    { title: "折り紙やチラシで、誰も見たことがない複雑な立体物を創作する", duration: 30 },
    { title: "今いる部屋のレイアウトを、一時的に全く意味のない不便な配置に変えてみる", duration: 30 },
    { title: "スーパーに行き、見たこともない謎の調味料を一つ買って少しだけ舐める", duration: 30 },
  ],
  long: [
    { title: "スマホの電源を切り、1時間だけ世界から姿を消す", duration: 60 },
    { title: "本屋に行き、タイトルが一番『予想外』な本をジャケ買いしてカフェで読む", duration: 60 },
    { title: "気になっていた少し高めのカフェに入り、贅沢な時間を過ごす", duration: 60 },
    { title: "帰り道をあえて間違え、迷子を楽しみながら1時間かけて帰る", duration: 60 },
    { title: "宛先のない手紙を、1時間かけて本気で書き上げ、そして破り捨てる", duration: 60 },
    { title: "電車に乗り、サイコロを振って出た目の数だけ先の駅で降りて散策する", duration: 60 },
    { title: "一番近くにある図書館に行き、普段絶対に立ち入らないコーナーの本を熟読する", duration: 60 },
    { title: "スマホを持って外に出、「赤いもの」だけを1時間ひたすら撮影し続ける", duration: 60 },
    { title: "何も買わずに、巨大なショッピングモールや商店街を1時間ただひたすら歩き回る", duration: 60 },
    { title: "自分を主人公にした「架空の情熱大陸」のシナリオを1時間かけて本気で書く", duration: 60 },
    { title: "1時間、一切の時計やスマホを見ずに、自分の感覚だけで「1時間経った」と思うまで待つ", duration: 60 },
    { title: "普段なら絶対に作らない、異常に手間のかかる飲み物や軽食を一つだけ作る", duration: 60 },
    { title: "誰のいないカラオケに行き、1時間ひたすら歌わずに「朗読」をする", duration: 60 },
    { title: "今すぐ一番近くの水辺に向かい、水面をただひたすら眺める", duration: 90 },
  ],
  extraLong: [
    { title: "直感だけで入ったことのない飲食店に入り、直感でメニューを頼む", duration: 90 },
    { title: "全く知らない駅まで電車で移動し、街の雰囲気を観察しながら歩く", duration: 120 },
    { title: "少し遠くの銭湯や温泉に行き、何も考えずに湯に浸かる", duration: 180 },
    { title: "バスの終点まで乗ってみて、そこからなんとかして自力で帰ってくる", duration: 180 },
    { title: "映画館に行き、一番直近の時間に上映される作品を何も調べずに観る", duration: 150 },
    { title: "今から行ける一番遠い美術館や博物館に行き、一つの作品の前だけで30分過ごす", duration: 150 },
    { title: "目的地の駅を決めず、予算「1000円」で行けるところまで行き、そこで何かを成し遂げる", duration: 120 },
    { title: "レンタサイクルを借りて、体力が尽きるまでただひたすら真っ直ぐ進み続ける", duration: 120 },
    { title: "フェリーや船に乗れる場所を探し、ただ対岸に渡って帰ってくるだけの無目的な旅をする", duration: 180 },
    { title: "映画館に行き、一番人気がなさそうな映画を選んで、最前列のど真ん中で観る", duration: 150 },
    { title: "少し高めのホテルのラウンジに行き、何かのスパイであるかのように人間観察をする", duration: 120 },
    { title: "半日かけて、自分の住んでいる街の「自分だけの秘密の抜け道」マップを作る", duration: 120 },
    { title: "まったく興味のないジャンルのイベントや展示会を検索し、飛び入り参加してみる", duration: 150 },
    { title: "日帰りでいける一番寂れそうな温泉街に行き、強烈なノスタルジーに浸る", duration: 180 },
    { title: "巨大な駅に行き、案内板を一切見ずに「勘」だけで目的地に辿り着けるかゲームする", duration: 90 },
  ]
};

const timeToMinutes = (timeStr) => {
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
};

const minutesToTime = (mins) => {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
};

const EventCard = ({ id, startTime, endTime, title, type, onDelete }) => {
  const isUnexpected = type === 'unexpected';
  return (
    <div
      className={`
        relative w-full px-4 py-3 rounded-md border-2 mb-2
        ${isUnexpected
          ? 'bg-[#C63527] border-[#C63527] text-white'
          : 'bg-transparent border-[#C63527] text-[#C63527]'
        }
      `}
    >
      <button 
        onClick={() => onDelete(id)}
        className={`absolute top-2 right-2 text-xs transition-opacity ${
          isUnexpected ? 'text-white opacity-40 hover:opacity-100' : 'text-[#C63527] opacity-30 hover:opacity-100'
        } p-2 -m-2`} // スマホでもタップしやすいように余白を確保
        aria-label="削除"
      >
        ✕
      </button>

      {/* break-words を追加して、スマホでも長文が枠をはみ出さないように対応 */}
      <div className="font-bold text-base sm:text-lg leading-tight mb-1 pr-6 break-words">{title}</div>
      <div className={`text-xs sm:text-sm ${isUnexpected ? 'opacity-90' : 'text-[#C63527]/80'}`}>
        {startTime}-{endTime}
      </div>
    </div>
  );
};

export default function App() {
  // スプラッシュ画面（オープニング演出）のステート
  const [showSplash, setShowSplash] = useState(true);
  const [fadeSplash, setFadeSplash] = useState(false);

  useEffect(() => {
    // 起動から1.5秒後にフェードアウトを開始
    const fadeTimer = setTimeout(() => {
      setFadeSplash(true);
    }, 1500);

    // 起動から2.5秒後に完全に要素を消す
    const removeTimer = setTimeout(() => {
      setShowSplash(false);
    }, 2500);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  const today = new Date();
  const currentMonth = today.getMonth() + 1;
  const currentDate = today.getDate();

  const [schedule, setSchedule] = useState([
    { id: 1, startTime: '09:00', endTime: '10:00', title: 'ミーティング', type: 'normal' },
    { id: 2, startTime: '10:30', endTime: '12:00', title: '資料作成', type: 'normal' },
    { id: 3, startTime: '13:00', endTime: '14:30', title: 'アプリ開発', type: 'normal' },
    { id: 4, startTime: '17:30', endTime: '18:30', title: '夕食', type: 'normal' },
  ]);

  const [newTitle, setNewTitle] = useState('');
  const [newStartTime, setNewStartTime] = useState('');
  const [newEndTime, setNewEndTime] = useState('');

  const addNormalEvent = (e) => {
    e.preventDefault();
    if (!newTitle || !newStartTime || !newEndTime) return;

    if (timeToMinutes(newStartTime) >= timeToMinutes(newEndTime)) {
      alert("終了時刻は開始時刻より後に設定してください。");
      return;
    }

    const newEvent = {
      id: Date.now(),
      startTime: newStartTime,
      endTime: newEndTime,
      title: newTitle,
      type: 'normal'
    };

    setSchedule([...schedule, newEvent]);
    setNewTitle('');
    setNewStartTime('');
    setNewEndTime('');
  };

  const deleteEvent = (idToDelete) => {
    setSchedule(schedule.filter(item => item.id !== idToDelete));
  };

  const triggerUnexpected = () => {
    const sorted = [...schedule].sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));
    const gaps = [];

    for (let i = 0; i < sorted.length - 1; i++) {
      const endCurrent = timeToMinutes(sorted[i].endTime);
      const startNext = timeToMinutes(sorted[i + 1].startTime);
      const gapDuration = startNext - endCurrent;
      
      if (gapDuration >= 15) {
        gaps.push({ start: endCurrent, end: startNext, duration: gapDuration });
      }
    }

    if (gaps.length === 0) {
      alert("予定が詰まりすぎていて、予想外が入り込む隙がありません！");
      return;
    }

    const randomGap = gaps[Math.floor(Math.random() * gaps.length)];
    
    let targetMissions = [];
    if (randomGap.duration >= 90) {
      targetMissions = unexpectedMissions.extraLong.filter(m => m.duration <= randomGap.duration);
      if (targetMissions.length === 0) targetMissions = unexpectedMissions.long; 
    } else if (randomGap.duration >= 60) {
      targetMissions = unexpectedMissions.long.filter(m => m.duration <= randomGap.duration);
    } else if (randomGap.duration >= 30) {
      targetMissions = unexpectedMissions.medium;
    } else {
      targetMissions = unexpectedMissions.short;
    }
    
    const randomMission = targetMissions[Math.floor(Math.random() * targetMissions.length)];

    const unexpectedEvent = {
      id: Date.now(),
      startTime: minutesToTime(randomGap.start),
      endTime: minutesToTime(randomGap.start + randomMission.duration),
      title: randomMission.title,
      type: 'unexpected'
    };

    setSchedule([...schedule, unexpectedEvent]);
  };

  const sortedDisplaySchedule = [...schedule].sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));

  return (
    <>
      {/* オープニング演出（スプラッシュスクリーン） */}
      {showSplash && (
        <div 
          className={`fixed inset-0 z-50 bg-[#F3EFE6] flex items-center justify-center transition-opacity duration-1000 ${fadeSplash ? 'opacity-0' : 'opacity-100'}`}
        >
          <p className="text-[#C63527] text-2xl leading-loose [writing-mode:vertical-rl] font-bold tracking-widest font-serif">
            私の予定は、<br />予想外。
          </p>
        </div>
      )}

      {/* メインのアプリケーション */}
      <div className="min-h-screen bg-[#F3EFE6] flex justify-center font-serif p-4 sm:p-6 pb-24">
        <div className="w-full max-w-sm relative">
          
          <div className="text-center mb-6 sm:mb-8 text-[#C63527]">
            <p className="text-base sm:text-lg">{currentMonth}月</p>
            <h1 className="text-4xl sm:text-5xl font-bold mt-1">{currentDate}</h1>
          </div>

          <form onSubmit={addNormalEvent} className="mb-6 sm:mb-8 p-3 sm:p-4 border-2 border-dashed border-[#C63527]/50 rounded-md">
            <div className="text-xs sm:text-sm text-[#C63527] mb-3 font-bold">＋ 予定を追加</div>
            <input
              type="text"
              placeholder="予定のタイトル"
              className="w-full mb-3 p-2 bg-transparent border-b border-[#C63527] text-[#C63527] placeholder-[#C63527]/50 focus:outline-none text-sm sm:text-base"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
            <div className="flex gap-1 sm:gap-2 mb-4">
              <input
                type="time"
                className="w-1/2 p-2 bg-transparent border-b border-[#C63527] text-[#C63527] focus:outline-none text-sm sm:text-base"
                value={newStartTime}
                onChange={(e) => setNewStartTime(e.target.value)}
              />
              <span className="text-[#C63527] self-center">〜</span>
              <input
                type="time"
                className="w-1/2 p-2 bg-transparent border-b border-[#C63527] text-[#C63527] focus:outline-none text-sm sm:text-base"
                value={newEndTime}
                onChange={(e) => setNewEndTime(e.target.value)}
              />
            </div>
            <button type="submit" className="w-full py-2 border-2 border-[#C63527] text-[#C63527] font-bold rounded-md hover:bg-[#C63527] hover:text-white transition-colors text-sm sm:text-base">
              追加する
            </button>
          </form>

          <div className="flex flex-col">
            {sortedDisplaySchedule.map((item) => (
              <EventCard
                key={item.id}
                id={item.id}
                startTime={item.startTime}
                endTime={item.endTime}
                title={item.title}
                type={item.type}
                onDelete={deleteEvent}
              />
            ))}
          </div>

          <div className="mt-8 flex justify-end text-[#C63527]">
            <p className="text-xs sm:text-sm leading-loose [writing-mode:vertical-rl] font-bold tracking-widest">
              私の予定は、<br />予想外。
            </p>
          </div>

          {/* ボタンのラッパーを max-w-sm にしてスマホでも横幅が崩れないように修正 */}
          <div className="fixed bottom-6 left-0 right-0 flex justify-center pointer-events-none px-4">
            <button
              onClick={triggerUnexpected}
              className="pointer-events-auto w-full max-w-sm bg-[#C63527] text-white px-4 sm:px-6 py-3 sm:py-4 rounded-full font-bold shadow-lg border-2 border-[#C63527] hover:bg-white hover:text-[#C63527] transition-all transform hover:scale-105 text-sm sm:text-base"
            >
              日常に予想外を起こす
            </button>
          </div>
          
        </div>
      </div>
    </>
  );
}