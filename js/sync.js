/* Progress sync: every completed activity, every attempt and the time spent per lesson is sent to the
   student's account. Saves are queued, so a flaky connection never loses work: the queue is kept in
   this browser and retried until the server accepts it. */
(function () {
  const B = PP.backend;
  const QKEY = (u) => 'pp.queue.' + u;
  let queue = [];
  let flushing = false;
  let counters = {};     // lessonId -> {views, runs}
  let counterTimer = null;
  let lastLesson = null;

  const sync = (PP.sync = {
    get currentLesson() { return lastLesson; },
    set currentLesson(v) { lastLesson = v; },
  });

  function persist() { const u = PP.store.user; if (u === 'guest') return; try { localStorage.setItem(QKEY(u), JSON.stringify(queue)); } catch (e) { /* ignore */ } }
  function restoreQueue() { queue = []; const u = PP.store.user; if (u === 'guest') return; try { queue = JSON.parse(localStorage.getItem(QKEY(u)) || '[]'); } catch (e) { queue = []; } }

  async function flush() {
    if (flushing || !PP.auth.user || !queue.length) return;
    flushing = true;
    try {
      while (queue.length) {
        const job = queue[0];
        if (job.t === 'progress') await B.saveProgress(job.v);
        else if (job.t === 'bump') await B.bumpLesson(job.v.lesson, job.v.views, job.v.runs);
        queue.shift(); persist();
      }
    } catch (e) {
      // keep the job, try again later (offline, server hiccup...). A job the server rejects outright is dropped after a while.
      queue[0].fails = (queue[0].fails || 0) + 1;
      if (queue[0].fails > 6) queue.shift();
      persist();
      setTimeout(flush, Math.min(60000, 3000 * (queue[0] ? queue[0].fails || 1 : 1)));
    } finally { flushing = false; }
  }

  /* ---- called by the activities ---- */
  sync.record = function (r) {   // {id, kind, passed, code}
    if (!PP.auth.user) return;
    const it = PP.catalog.byId[r.id];
    queue.push({ t: 'progress', v: { item_id: r.id, lesson_id: it ? it.lessonId : (lastLesson || null), kind: r.kind || (it && it.kind) || null, code: r.code || null, passed: !!r.passed } });
    persist(); flush();
  };
  sync.view = function (lessonId) { count(lessonId, 1, 0); };
  sync.run = function () { if (lastLesson) count(lastLesson, 0, 1); };
  function count(lessonId, views, runs) {
    if (!PP.auth.user) return;
    const c = (counters[lessonId] = counters[lessonId] || { views: 0, runs: 0 });
    c.views += views; c.runs += runs;
    clearTimeout(counterTimer);
    counterTimer = setTimeout(pushCounters, 8000);
  }
  function pushCounters() {
    Object.keys(counters).forEach((l) => { const c = counters[l]; if (c.views || c.runs) queue.push({ t: 'bump', v: { lesson: l, views: c.views, runs: c.runs } }); });
    counters = {}; persist(); flush();
  }
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') pushCounters(); });
  window.addEventListener('pagehide', pushCounters);
  window.addEventListener('online', flush);

  /* ---- when a student signs in: pull their saved progress down ---- */
  sync.load = async function () {
    restoreQueue();
    if (!PP.auth.user) return;
    try {
      const rows = await B.myProgress();
      PP.store.bulkDone(rows.filter((r) => r.completed_at).map((r) => r.item_id));
      rows.forEach((r) => { if (r.code && ['exercise', 'debug', 'exam'].includes(r.kind) && PP.store.getCode(r.item_id) === undefined) PP.store.setCode(r.item_id, r.code); });
    } catch (e) { /* offline: the local cache is still there */ }
    flush();
  };

  PP.auth.onChange((user) => { if (user) sync.load(); });
})();
