/* The list of everything a student can complete (activities, plus reading lessons), built from the lesson content.
   Used by progress sync, the offline demo and the admin portal. Load AFTER the content files. */
window.PP = window.PP || {};

PP.catalog = (function () {
  const items = [];
  const byId = {};
  const lessons = {};
  const modules = [];
  PP.modules.forEach((m, mi) => {
    const mod = { id: m.id, title: m.title, index: mi, lessons: [], total: 0 };
    modules.push(mod);
    m.lessons.forEach((l) => {
      const ids = [];
      l.blocks.forEach((b, i) => {
        if (PP.itemTypes.includes(b.t)) {
          const id = b.id || `${l.id}:${i}`;
          const it = { id, lessonId: l.id, moduleId: m.id, kind: b.t === 'exercise' ? (b.kind || 'exercise') : b.t, title: b.title || '' };
          items.push(it); byId[id] = it; ids.push(id);
        }
      });
      if (!ids.length) { // reading-only lesson: the lesson itself is the item
        const it = { id: l.id, lessonId: l.id, moduleId: m.id, kind: 'read', title: l.title };
        items.push(it); byId[l.id] = it; ids.push(l.id);
      }
      const L = { id: l.id, title: l.title, moduleId: m.id, moduleIndex: mi, items: ids, summary: l.summary || '' };
      lessons[l.id] = L; mod.lessons.push(L); mod.total += ids.length;
    });
  });
  return { items, byId, lessons, modules, total: items.length };
})();
