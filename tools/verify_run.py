"""Batch runner used by verify.js. Reads jobs JSON, writes results JSON."""
import sys, os, json, tempfile

here = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(here, "..", "js"))
import pyrunner  # noqa: E402

pyrunner.set_workdir(tempfile.mkdtemp(prefix="pp_verify_"))

jobs = json.load(open(sys.argv[1], encoding="utf-8"))
results = []
for j in jobs:
    kind = j["kind"]
    if kind == "grade":
        r = pyrunner.grade({"code": j["code"], "test": j["test"]})
        results.append({"ok": r["ok"], "reason": r["reason"], "got": r["got"][:400],
                        "detail": r.get("detail"), "error": r["error"], "missing": r.get("missing")})
    else:
        res, _ = pyrunner.execute({"code": j["code"], "mode": "run", "inputs": j.get("inputs", []),
                                   "files": j.get("files"), "seed": 1})
        results.append({"error": res["error"], "need": res["need"], "stdout": res["stdout"][:300],
                        "truncated": res["truncated"]})
json.dump(results, open(sys.argv[2], "w", encoding="utf-8"))
