/* Main-thread side of the Python runner. One worker, jobs run one at a time.
   A job that exceeds its time limit (or is stopped) kills and restarts the worker. */
window.PP = window.PP || {};

PP.runner = (function () {
  let worker = null;
  let state = 'loading';
  let readyResolve;
  let readyP;
  let current = null;
  let chain = Promise.resolve();
  let nextId = 1;
  const listeners = [];

  function setState(s, msg) {
    state = s;
    listeners.forEach((fn) => fn(s, msg));
  }

  function start() {
    setState('loading');
    readyP = new Promise((res) => { readyResolve = res; });
    worker = new Worker('js/pyworker.js?v=17');
    worker.onmessage = (e) => {
      const m = e.data;
      if (m.type === 'ready') { setState('ready'); readyResolve(); }
      else if (m.type === 'fatal') { setState('error', m.message); }
      else if (current && m.id === current.id) {
        if (m.type === 'out') { current.partial += m.s; if (current.onOut) current.onOut(current.partial); }
        else if (m.type === 'result') { current.finish(m.result); }
      }
    };
    worker.onerror = (e) => setState('error', e.message || 'worker error');
  }

  function kill(reason) {
    if (!current) return;
    const job = current;
    worker.terminate();
    start();
    job.finish({ stdout: job.partial, [reason]: true, files: {}, error: null, need: null });
  }

  function exec(req, opts) {
    opts = opts || {};
    const job = chain.then(() => readyP).then(() => new Promise((resolve) => {
      const id = nextId++;
      const timeout = opts.timeout || 8000;
      let timer;
      const j = {
        id, partial: '', onOut: opts.onOut,
        finish(result) {
          clearTimeout(timer);
          if (current === j) current = null;
          if (opts.job) opts.job.active = null;
          resolve(result);
        },
      };
      current = j;
      if (opts.job) opts.job.active = j;
      timer = setTimeout(() => kill('timeout'), timeout);
      worker.postMessage({ id, req });
    }));
    chain = job.catch(() => {});
    return job;
  }

  /* run(req, {onOut, timeout}) -> Promise(result) ; returns object with .stop() via handle */
  function run(req, opts) {
    const handle = { active: null };
    const p = exec(req, Object.assign({}, opts, { job: handle }));
    p.stop = () => { if (handle.active) kill('stopped'); };
    return p;
  }

  function grade(code, test) {
    return exec({ kind: 'grade', code, test }, { timeout: 6000 });
  }

  PP.onRunnerState = (fn) => { listeners.push(fn); fn(state); };
  start();
  return { run, grade, get state() { return state; } };
})();
