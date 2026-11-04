/* Runs real CPython (Pyodide / WebAssembly) off the main thread so that an
   infinite loop in a student's program can never freeze the page. */
importScripts(new URL('../vendor/pyodide/pyodide.js', self.location.href).href);

let handle = null;

const ready = (async () => {
  const py = await loadPyodide({ indexURL: new URL('../vendor/pyodide/', self.location.href).href });
  const src = await (await fetch(new URL('pyrunner.py', self.location.href), { cache: 'no-store' })).text();
  py.FS.writeFile('/pyrunner.py', src);
  py.runPython("import sys\nsys.path.insert(0, '/')\nimport pyrunner\npyrunner.set_workdir('/work')");
  handle = py.runPython('pyrunner.handle');
  postMessage({ type: 'ready' });
})().catch((err) => postMessage({ type: 'fatal', message: String(err) }));

onmessage = async (e) => {
  await ready;
  if (!handle) return;
  const { id, req } = e.data;
  const emit = (s) => postMessage({ type: 'out', id, s });
  try {
    const json = handle(JSON.stringify(req), emit);
    postMessage({ type: 'result', id, result: JSON.parse(json) });
  } catch (err) {
    postMessage({ type: 'result', id, result: { fatal: String(err), stdout: '', files: {} } });
  }
};
