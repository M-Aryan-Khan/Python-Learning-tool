"""Shared Python-side runner.

Used in two places so that lessons are graded identically:
  * in the browser, inside Pyodide (see pyworker.js)
  * on the command line by tools/verify.js (real CPython), to prove every
    reference solution in the course actually passes its own tests.
"""
import sys, os, json, time, types, builtins, random, shutil

WORK = os.path.join(os.getcwd(), "work")
MAX_OUT = 60000
MAX_STEPS = 1500


class NeedInput(BaseException):
    """Raised when the program asks for input we do not have yet (interactive replay)."""


class StopRun(BaseException):
    """Raised to abort a run (too much output / too many trace steps)."""


def set_workdir(path):
    global WORK
    WORK = path


class Out:
    def __init__(self, emit=None, limit=MAX_OUT):
        self.parts = []
        self.n = 0
        self.emit = emit
        self.pending = []
        self.pending_len = 0
        self.last = time.time()
        self.limit = limit
        self.over = False

    def write(self, s):
        if not isinstance(s, str):
            s = str(s)
        if not s:
            return 0
        self.parts.append(s)
        self.n += len(s)
        if self.emit:
            self.pending.append(s)
            self.pending_len += len(s)
            if self.pending_len > 2000 or time.time() - self.last > 0.05:
                self.flush_out()
        if self.n > self.limit:
            self.over = True
            raise StopRun("output")
        return len(s)

    def flush_out(self):
        if self.emit and self.pending:
            self.emit("".join(self.pending))
            self.pending = []
            self.pending_len = 0
            self.last = time.time()

    def flush(self):
        pass

    def isatty(self):
        return False

    def getvalue(self):
        return "".join(self.parts)


def _prepare(files):
    os.makedirs(WORK, exist_ok=True)
    os.chdir(WORK)
    for n in os.listdir(WORK):
        p = os.path.join(WORK, n)
        if os.path.isdir(p):
            shutil.rmtree(p, ignore_errors=True)
        else:
            try:
                os.remove(p)
            except OSError:
                pass
    for n, c in (files or {}).items():
        with open(os.path.join(WORK, n), "w", encoding="utf-8", newline="") as f:
            f.write(c)


def _collect_files():
    res = {}
    try:
        for n in sorted(os.listdir(WORK)):
            p = os.path.join(WORK, n)
            if os.path.isfile(p):
                try:
                    with open(p, "r", encoding="utf-8", newline="") as f:
                        res[n] = f.read(30000)
                except Exception:
                    res[n] = "(binary file)"
    except Exception:
        pass
    return res


_SKIP = (types.ModuleType, types.FunctionType, types.BuiltinFunctionType, type)


def _fmt(v):
    try:
        r = repr(v)
    except Exception:
        r = "<?>"
    return r if len(r) <= 48 else r[:45] + "..."


def _vars(d):
    out = {}
    for k, v in list(d.items()):
        if k.startswith("__") or isinstance(v, _SKIP):
            continue
        out[k] = _fmt(v)
    return out


def _err_info(e, code):
    lines = code.split("\n")
    if isinstance(e, SyntaxError):
        return {
            "type": type(e).__name__,
            "msg": e.msg,
            "line": e.lineno,
            "offset": e.offset,
            "text": (e.text or "").rstrip("\n"),
        }
    tb = e.__traceback__
    line = None
    while tb:
        if tb.tb_frame.f_code.co_filename == "<student>":
            line = tb.tb_lineno
        tb = tb.tb_next
    text = lines[line - 1] if line and 0 < line <= len(lines) else ""
    return {"type": type(e).__name__, "msg": str(e), "line": line, "text": text}


def execute(req, emit=None):
    """Run a student program. Returns (result_dict, namespace)."""
    mode = req.get("mode", "run")
    code = req.get("code", "")
    inputs = [str(x) for x in req.get("inputs", [])]
    echo = req.get("echo", mode in ("run", "trace"))
    out = Out(emit if mode == "run" else None)
    state = {"need": None, "i": 0}

    def _input(prompt=""):
        prompt = str(prompt)
        if echo:
            out.write(prompt)
        if state["i"] >= len(inputs):
            if mode == "test":
                raise EOFError("the program asked for more input than was provided")
            state["need"] = prompt
            raise NeedInput()
        v = inputs[state["i"]]
        state["i"] += 1
        if echo:
            out.write(v + "\n")
        return v

    _prepare(req.get("files"))
    random.seed(req.get("seed", 12345))
    ns = {"__name__": "__main__", "__builtins__": builtins}
    result = {"error": None, "need": None, "trace": None, "truncated": False}

    old = (sys.stdout, sys.stderr, builtins.input, sys.stdin)
    sys.stdout = sys.stderr = out
    builtins.input = _input
    steps = []

    def tracer(frame, event, arg):
        if frame.f_code.co_filename != "<student>":
            return None
        if event == "call":
            return tracer
        if event not in ("line", "return"):
            return tracer
        if len(steps) >= MAX_STEPS:
            raise StopRun("steps")
        depth = 0
        f = frame
        while f is not None:
            if f.f_code.co_filename == "<student>":
                depth += 1
            f = f.f_back
        name = frame.f_code.co_name
        is_mod = name == "<module>"
        step = {
            "line": frame.f_lineno,
            "kind": event,
            "fn": None if is_mod else name,
            "depth": depth,
            "glob": _vars(frame.f_globals),
            "loc": None if is_mod else _vars(frame.f_locals),
            "out": out.n,
            "gid": {k: id(v) for k, v in list(frame.f_globals.items())
                    if not k.startswith("__") and isinstance(v, (list, dict, set))},
        }
        if event == "return":
            step["ret"] = _fmt(arg)
        steps.append(step)
        return tracer

    try:
        try:
            comp = compile(code, "<student>", "exec")
        except SyntaxError as e:
            result["error"] = _err_info(e, code)
            comp = None
        if comp is not None:
            if mode == "trace":
                sys.settrace(tracer)
            try:
                exec(comp, ns)
            finally:
                sys.settrace(None)
    except NeedInput:
        result["need"] = state["need"]
    except StopRun as e:
        result["truncated"] = str(e) or True
    except SystemExit:
        pass
    except BaseException as e:  # noqa: BLE001 - students can raise anything
        result["error"] = _err_info(e, code)
    finally:
        sys.settrace(None)
        sys.stdout, sys.stderr, builtins.input, sys.stdin = old
    if state["need"] is not None and result["need"] is None:
        # the program swallowed our NeedInput (bare except) - still treat as waiting
        result["need"] = state["need"]
        result["error"] = None
    out.flush_out()
    result["stdout"] = out.getvalue()
    result["files"] = _collect_files()
    if mode == "trace":
        result["trace"] = steps
    return result, ns


def norm(s, loose=False):
    lines = [l.rstrip() for l in s.replace("\r", "").split("\n")]
    while lines and lines[-1] == "":
        lines.pop()
    r = "\n".join(lines)
    if loose:
        r = " ".join(r.lower().split())
    return r


def grade(req):
    """req: {code, test:{in, out, has, hasNot, py, files, seed, loose, msg}}"""
    t = req["test"]
    res, ns = execute(
        {
            "code": req["code"],
            "mode": "test",
            "inputs": t.get("in", []),
            "files": t.get("files"),
            "seed": t.get("seed", 12345),
            "echo": False,
        }
    )
    got = res["stdout"]
    v = {"ok": False, "got": got, "error": res["error"], "files": res["files"], "reason": None}
    if res["error"]:
        v["reason"] = "error"
        return v
    loose = t.get("loose", False)
    if "out" in t and norm(got, loose) != norm(t["out"], loose):
        v["reason"] = "output"
        return v
    if "lines" in t and len([l for l in got.split("\n") if l.strip()]) != t["lines"]:
        v["reason"] = "py"
        v["detail"] = "Expected %d lines of output but your program printed %d." % (
            t["lines"], len([l for l in got.split("\n") if l.strip()]))
        return v
    if "anyOf" in t and norm(got, loose) not in [norm(x, loose) for x in t["anyOf"]]:
        v["reason"] = "py"
        v["detail"] = "Your output should be one of: " + " | ".join(t["anyOf"])
        return v
    for h in t.get("has", []):
        if h.lower() not in got.lower():
            v["reason"] = "has"
            v["missing"] = h
            return v
    for h in t.get("hasNot", []):
        if h.lower() in got.lower():
            v["reason"] = "hasNot"
            v["missing"] = h
            return v
    if "py" in t:
        try:
            exec(compile(t["py"], "<check>", "exec"), ns)
        except AssertionError as e:
            v["reason"] = "py"
            v["detail"] = str(e)
            return v
        except BaseException as e:  # noqa: BLE001
            v["reason"] = "py"
            v["detail"] = type(e).__name__ + ": " + str(e)
            return v
    if "files_out" in t:
        for fn, expect in t["files_out"].items():
            if norm(res["files"].get(fn, ""), loose) != norm(expect, loose):
                v["reason"] = "file"
                v["missing"] = fn
                v["expected_file"] = expect
                return v
    v["ok"] = True
    return v


def handle(req_json, emit=None):
    req = json.loads(req_json)
    kind = req.get("kind", "exec")
    if kind == "grade":
        return json.dumps(grade(req))
    res, _ = execute(req, emit)
    return json.dumps(res)
