import React, { useState, useEffect, useRef } from 'react';

const ALL = ['morning', 'day', 'afternoon', 'evening', 'night', 'midnight'];
const OUTSIDE_DAY = ['morning', 'day', 'afternoon', 'evening'];
const OPEN_HOURS = ['day', 'afternoon', 'evening', 'night'];
const NIGHT_ONLY = ['evening', 'night', 'midnight'];

const unexpectedMissions = {
  short: [
    // 📷 カメラを使うミッション（cameraTypeを指定）
    { title: "至急、コンビニでメロンソーダを調達して撮影しろ", duration: 15, slots: ALL, cameraType: 'melon' },
    { title: "スマホを持って暗闇に行き、視覚を完全に遮断して撮影しろ", duration: 15, slots: ALL, cameraType: 'dark' },
    // 👆ボタンで完了できる通常のミッション（cameraTypeなし）
    { title: "目を閉じて、5分間だけ一切の思考を放棄する", duration: 15, slots: ALL },
    { title: "財布の中身をすべて出し、不要なレシートを捨てる", duration: 15, slots: ALL },
  ],
  medium: [
    { title: "一番近くのコンビニで、今まで一度も買ったことのない飲み物を買う", duration: 30, slots: ALL },
    { title: "目的もなく、ただ30分間だけ近所を散歩する", duration: 30, slots: OUTSIDE_DAY },
  ],
  long: [
    { title: "スマホの電源を切り、1時間だけ世界から姿を消す", duration: 60, slots: ALL },
    { title: "帰り道をあえて間違え、迷子を楽しみながら1時間かけて帰る", duration: 60, slots: OUTSIDE_DAY },
  ],
  extraLong: [
    { title: "直感だけで入ったことのない飲食店に入り、直感でメニューを頼む", duration: 90, slots: OPEN_HOURS },
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

const getSlotCategory = (minutes) => {
  if (minutes >= 360 && minutes < 540) return 'morning';
  if (minutes >= 540 && minutes < 780) return 'day';
  if (minutes >= 780 && minutes < 1080) return 'afternoon';
  if (minutes >= 1080 && minutes < 1260) return 'evening';
  if (minutes >= 1260 && minutes <= 1440) return 'night';
  return 'midnight';
};

// --- 📷 カメラオーバーレイコンポーネント ---
const CameraOverlay = ({ targetType, onClose, onSuccess }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // ターゲットに応じたメッセージを設定
  const [message, setMessage] = useState(
    targetType === 'melon' ? 'メロンソーダを画面の中央に捉えてください' : '真っ暗な場所で撮影してください'
  );

  useEffect(() => {
    let stream = null;
    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch (err) {
        alert("カメラへのアクセスができません。");
        onClose();
      }
    };
    startCamera();
    return () => { if (stream) stream.getTracks().forEach(track => track.stop()); };
  }, [onClose]);

  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) return;
    setIsAnalyzing(true);
    setMessage('画像を解析中...');

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    const totalPixels = data.length / 4;

    let targetPixelCount = 0;

    // --- 画像解析ロジック（ターゲットごとに分岐） ---
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i]; const g = data[i + 1]; const b = data[i + 2];

      if (targetType === 'melon') {
        // メロンソーダ（鮮やかな緑）の判定
        if (g > 100 && g > r * 1.5 && g > b * 1.2) targetPixelCount++;
      } else if (targetType === 'dark') {
        // 暗闇（低照度環境）の判定：輝度(Luminance)を計算
        const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
        if (luminance < 30) targetPixelCount++; // 輝度が極端に低いピクセルをカウント
      }
    }

    const ratio = targetPixelCount / totalPixels;
    
    setTimeout(() => {
      if (targetType === 'melon' && ratio > 0.05) {
        alert(`メロンソーダを検出！（緑色率: ${Math.round(ratio * 100)}%）`);
        onSuccess();
      } else if (targetType === 'dark' && ratio > 0.85) {
        alert(`暗闇を検出しました！（暗部率: ${Math.round(ratio * 100)}%）`);
        onSuccess();
      } else {
        setMessage(targetType === 'melon' ? 'メロンソーダの色が足りません！' : 'まだ明るすぎます！完全に暗闇にしてください');
        setIsAnalyzing(false);
      }
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center">
      <div className="absolute top-8 text-white font-bold text-center z-10 w-full px-4 drop-shadow-md">{message}</div>
      <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover opacity-80" />
      <canvas ref={canvasRef} className="hidden" />
      <div className="absolute bottom-12 flex flex-col gap-4 items-center w-full px-8">
        <button onClick={handleCapture} disabled={isAnalyzing} className="w-20 h-20 bg-white rounded-full border-4 border-gray-300 shadow-lg active:scale-95 transition-transform"></button>
        <button onClick={onClose} className="text-white font-bold bg-gray-800 px-6 py-2 rounded-full opacity-80">キャンセル</button>
      </div>
    </div>
  );
};

// --- イベントカードコンポーネント ---
const EventCard = ({ item, onDelete, onClick, onCameraLaunch, onDirectClear }) => {
  const isUnexpected = item.type === 'unexpected';
  const isCleared = item.isCleared;

  return (
    <div
      onClick={onClick}
      className={`
        relative w-full px-4 py-3 rounded-md border-2 mb-2 cursor-pointer transition-all hover:scale-[1.01] overflow-hidden
        ${isUnexpected ? 'bg-[#C63527] border-[#C63527] text-white' : 'bg-transparent border-[#C63527] text-[#C63527]'}
      `}
    >
      {/* 削除ボタン */}
      <button 
        onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
        className={`absolute top-2 right-2 text-xs transition-opacity z-20 ${isUnexpected ? 'text-white opacity-40 hover:opacity-100' : 'text-[#C63527] opacity-30 hover:opacity-100'} p-2 -m-2`}
      >
        ✕
      </button>

      {/* アクションボタン（未クリアの場合のみ表示） */}
      {!isCleared && (
        <div className="absolute bottom-3 right-4 z-20">
          {item.cameraType ? (
            // カメラ判定が必要なミッション
            <button onClick={(e) => { e.stopPropagation(); onCameraLaunch(item.id, item.cameraType); }} className="text-xs font-bold bg-white text-[#C63527] px-3 py-1 rounded shadow hover:bg-gray-100">
              📷 証拠提出
            </button>
          ) : (
            // 通常の完了ボタン
            <button onClick={(e) => { e.stopPropagation(); onDirectClear(item.id); }} className={`text-xs font-bold px-3 py-1 rounded shadow ${isUnexpected ? 'bg-white text-[#C63527] hover:bg-gray-100' : 'bg-[#C63527] text-white hover:bg-[#A32A1F]'}`}>
              ✅ 完了
            </button>
          )}
        </div>
      )}

      {/* スタイリッシュな「CLEARED」スタンプ演出 */}
      {isCleared && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 bg-black/5">
          <div className={`transform -rotate-12 border-4 font-black text-2xl sm:text-3xl px-4 py-1 rounded opacity-80 tracking-widest ${isUnexpected ? 'border-white text-white' : 'border-[#C63527] text-[#C63527]'}`}>
            CLEARED
          </div>
        </div>
      )}

      {/* テキスト部分（打ち消し線は廃止） */}
      <div className={`font-bold text-base sm:text-lg leading-tight mb-1 pr-6 break-words whitespace-pre-wrap ${isCleared ? 'opacity-40' : ''}`}>
        {item.title}
      </div>
      <div className={`text-xs sm:text-sm ${isUnexpected ? 'opacity-90' : 'text-[#C63527]/80'} ${isCleared ? 'opacity-40' : ''}`}>
        {item.startTime}-{item.endTime}
      </div>
    </div>
  );
};

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [fadeSplash, setFadeSplash] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editStartTime, setEditStartTime] = useState('');
  const [editEndTime, setEditEndTime] = useState('');

  // カメラの状態管理（IDと要求されるタイプを保持）
  const [cameraState, setCameraState] = useState({ id: null, type: null });

  useEffect(() => {
    const fadeTimer = setTimeout(() => { setFadeSplash(true); }, 1500);
    const removeTimer = setTimeout(() => { setShowSplash(false); }, 2500);
    return () => { clearTimeout(fadeTimer); clearTimeout(removeTimer); };
  }, []);

  const today = new Date();
  const currentMonth = today.getMonth() + 1;
  const currentDate = today.getDate();

  const [schedule, setSchedule] = useState([
    { id: 1, startTime: '09:00', endTime: '10:00', title: 'ミーティング', type: 'normal', isCleared: false },
    { id: 2, startTime: '13:00', endTime: '14:30', title: 'アプリ開発', type: 'normal', isCleared: false },
  ]);

  const [newTitle, setNewTitle] = useState('');
  const [newStartTime, setNewStartTime] = useState('');
  const [newEndTime, setNewEndTime] = useState('');

  const addNormalEvent = (e) => {
    e.preventDefault();
    if (!newTitle || !newStartTime || !newEndTime) return;
    const newEvent = { id: Date.now(), startTime: newStartTime, endTime: newEndTime, title: newTitle, type: 'normal', isCleared: false };
    setSchedule([...schedule, newEvent]);
    setNewTitle(''); setNewStartTime(''); setNewEndTime('');
  };

  const deleteEvent = (idToDelete) => setSchedule(schedule.filter(item => item.id !== idToDelete));

  const startEditing = (item) => {
    setEditingId(item.id); setEditTitle(item.title); setEditStartTime(item.startTime); setEditEndTime(item.endTime);
  };

  const saveEdit = (id) => {
    setSchedule(schedule.map(item => item.id === id ? { ...item, title: editTitle, startTime: editStartTime, endTime: editEndTime } : item));
    setEditingId(null);
  };

  // ミッションをクリア状態にする関数
  const handleClearMission = (id) => {
    setSchedule(schedule.map(item => item.id === id ? { ...item, isCleared: true } : item));
    setCameraState({ id: null, type: null }); // カメラを閉じる
  };

  const triggerUnexpected = () => {
    const sorted = [...schedule].sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));
    const gaps = [];
    for (let i = 0; i < sorted.length - 1; i++) {
      const endCurrent = timeToMinutes(sorted[i].endTime);
      const startNext = timeToMinutes(sorted[i + 1].startTime);
      if (startNext - endCurrent >= 15) gaps.push({ start: endCurrent, end: startNext, duration: startNext - endCurrent });
    }

    if (gaps.length === 0) { alert("予想外が入り込む隙がありません！"); return; }

    const randomGap = gaps[Math.floor(Math.random() * gaps.length)];
    const targetSlotCategory = getSlotCategory(randomGap.end);
    
    let targetMissions = unexpectedMissions.short.filter(m => m.slots.includes(targetSlotCategory));
    if (targetMissions.length === 0) targetMissions = unexpectedMissions.short; 

    const randomMission = targetMissions[Math.floor(Math.random() * targetMissions.length)];

    const unexpectedEvent = {
      id: Date.now(),
      startTime: minutesToTime(randomGap.start),
      endTime: minutesToTime(randomGap.start + randomMission.duration),
      title: randomMission.title,
      type: 'unexpected',
      cameraType: randomMission.cameraType || null, // カメラ要求があればセット
      isCleared: false
    };

    setSchedule([...schedule, unexpectedEvent]);
  };

  const sortedDisplaySchedule = [...schedule].sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));
  const handleTextareaResize = (e) => { e.target.style.height = 'auto'; e.target.style.height = `${e.target.scrollHeight}px`; };

  return (
    <>
      {cameraState.id && (
        <CameraOverlay 
          targetType={cameraState.type}
          onClose={() => setCameraState({ id: null, type: null })} 
          onSuccess={() => handleClearMission(cameraState.id)} 
        />
      )}

      {showSplash && (
        <div className={`fixed inset-0 z-50 bg-[#F3EFE6] flex items-center justify-center transition-opacity duration-1000 ${fadeSplash ? 'opacity-0' : 'opacity-100'}`}>
          <p className="text-[#C63527] text-2xl leading-loose [writing-mode:vertical-rl] font-bold tracking-widest font-serif">私の予定は、<br />予想外。</p>
        </div>
      )}

      <div className="min-h-screen bg-[#F3EFE6] flex justify-center font-serif p-4 sm:p-6 pb-24">
        <div className="w-full max-w-sm relative">
          
          <div className="text-center mb-6 sm:mb-8 text-[#C63527]">
            <p className="text-base sm:text-lg">{currentMonth}月</p>
            <h1 className="text-4xl sm:text-5xl font-bold mt-1">{currentDate}</h1>
          </div>

          <form onSubmit={addNormalEvent} className="mb-6 sm:mb-8 p-3 sm:p-4 border-2 border-dashed border-[#C63527]/50 rounded-md">
            <div className="text-xs sm:text-sm text-[#C63527] mb-3 font-bold">＋ 予定を追加</div>
            <textarea placeholder="予定のタイトル" className="w-full mb-3 p-2 bg-transparent border-b border-[#C63527] text-[#C63527] placeholder-[#C63527]/50 focus:outline-none text-sm sm:text-base resize-none overflow-hidden" rows={1} value={newTitle} onChange={(e) => { setNewTitle(e.target.value); handleTextareaResize(e); }} />
            <div className="flex gap-1 sm:gap-2 mb-4">
              <input type="time" className="w-1/2 p-2 bg-transparent border-b border-[#C63527] focus:outline-none text-sm sm:text-base" value={newStartTime} onChange={(e) => setNewStartTime(e.target.value)} />
              <span className="text-[#C63527] self-center">〜</span>
              <input type="time" className="w-1/2 p-2 bg-transparent border-b border-[#C63527] focus:outline-none text-sm sm:text-base" value={newEndTime} onChange={(e) => setNewEndTime(e.target.value)} />
            </div>
            <button type="submit" className="w-full py-2 border-2 border-[#C63527] text-[#C63527] font-bold rounded-md hover:bg-[#C63527] hover:text-white transition-colors text-sm sm:text-base">追加する</button>
          </form>

          <div className="flex flex-col">
            {sortedDisplaySchedule.map((item) => (
              editingId === item.id ? (
                <div key={item.id} className="w-full px-4 py-3 rounded-md border-2 mb-2 bg-transparent border-[#C63527] text-[#C63527]">
                  <textarea value={editTitle} className="w-full font-bold text-base sm:text-lg bg-transparent border-b border-current focus:outline-none mb-3 resize-none overflow-hidden" rows={1} onChange={(e) => { setEditTitle(e.target.value); handleTextareaResize(e); }} />
                  <div className="flex gap-2 items-center mb-4 text-xs sm:text-sm opacity-90">
                    <input type="time" value={editStartTime} onChange={(e) => setEditStartTime(e.target.value)} className="w-1/2 bg-transparent border-b border-current focus:outline-none" />
                    <span>〜</span>
                    <input type="time" value={editEndTime} onChange={(e) => setEditEndTime(e.target.value)} className="w-1/2 bg-transparent border-b border-current focus:outline-none" />
                  </div>
                  <div className="flex justify-end gap-3">
                    <button onClick={() => setEditingId(null)} className="text-xs opacity-70 hover:opacity-100">キャンセル</button>
                    <button onClick={() => saveEdit(item.id)} className="text-xs font-bold px-3 py-1 border rounded border-[#C63527] hover:bg-[#C63527] hover:text-white">保存</button>
                  </div>
                </div>
              ) : (
                <EventCard
                  key={item.id}
                  item={item}
                  onDelete={deleteEvent}
                  onClick={() => !item.isCleared && startEditing(item)}
                  onCameraLaunch={(id, type) => setCameraState({ id, type })} // 📷ボタン
                  onDirectClear={(id) => handleClearMission(id)} // ✅ボタン
                />
              )
            ))}
          </div>

          <div className="fixed bottom-6 left-0 right-0 flex justify-center pointer-events-none px-4">
            <button onClick={triggerUnexpected} className="pointer-events-auto w-full max-w-sm bg-[#C63527] text-white px-4 py-3 sm:py-4 rounded-full font-bold shadow-lg border-2 border-[#C63527] hover:bg-white hover:text-[#C63527] transition-all transform hover:scale-105 text-sm sm:text-base">
              日常に予想外を起こす
            </button>
          </div>
          
        </div>
      </div>
    </>
  );
}
