import { C, PRIORITY } from '../utils/constants.js';

export default function TaskDrawer({
  tasks,
  drawerOpen,
  setDrawerOpen,
  swipeTaskId,
  setSwipeTaskId,
  onTaskClick,
  onTaskDone,
  onTaskDelete,
  onAddTask,
}) {
  const openTasks = tasks.filter(t => !t.done);

  return (
    <div style={{
      position: "fixed",
      bottom: 0, left: 0, right: 0,
      zIndex: 200,
      transform: drawerOpen ? "translateY(-44px)" : "translateY(calc(100% - 214px))",
      transition: "transform .3s cubic-bezier(.4,0,.2,1)",
      maxHeight: "60vh",
      display: "flex",
      flexDirection: "column",
      background: C.surface,
      borderTop: `2px solid ${C.gold}`,
      borderRadius: "16px 16px 0 0",
      boxShadow: "0 -4px 20px rgba(0,0,0,.12)",
      paddingBottom: "60px",
    }}>

      {/* Handle + flèche + titre */}
      <div onClick={() => setDrawerOpen(o => !o)}
        style={{ padding: "8px 16px 6px", cursor: "pointer", flexShrink: 0 }}>
        {/* Flèche gold */}
        <div style={{
          textAlign: "center",
          fontSize: 22,
          color: C.gold,
          lineHeight: 1,
          marginBottom: 4,
          fontWeight: 700,
        }}>
          {drawerOpen ? "↓" : "↑"}
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{
              fontSize: 16,
              fontWeight: 800,
              color: C.goldDark,
              fontFamily: "Phenomena, sans-serif",
            }}>
              ↻ Tâches en cours
            </span>
            <span style={{
              fontSize: 13,
              background: C.goldLight,
              color: C.goldDark,
              border: `1px solid ${C.gold}88`,
              borderRadius: 10,
              padding: "2px 8px",
              fontWeight: 700,
            }}>
              {openTasks.length}
            </span>
          </div>
          <button
            onClick={e => { e.stopPropagation(); onAddTask(); }}
            style={{
              fontSize: 11, fontWeight: 700, color: "#fff",
              background: C.accent, border: "none",
              borderRadius: 8, padding: "4px 10px",
              cursor: "pointer", fontFamily: "inherit",
            }}>
            + Tâche
          </button>
        </div>
      </div>

      {/* Liste tâches */}
      {drawerOpen && (
        <div style={{ overflowY: "auto", flex: 1, padding: "4px 0 20px" }}>
          {openTasks.length === 0 && (
            <div style={{ textAlign: "center", padding: "20px", color: C.muted, fontSize: 13 }}>
              Aucune tâche en cours 🎉
            </div>
          )}
          {openTasks.map(task => {
            const pr = PRIORITY[task.priority || "normal"];
            const isSwiped = swipeTaskId === task.id;
            return (
              <div key={task.id} style={{ position: "relative", overflow: "hidden" }}>
                {/* Fond rouge supprimer */}
                <div style={{
                  position: "absolute", right: 0, top: 0, bottom: 0, width: 80,
                  background: C.red,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  opacity: isSwiped ? 1 : 0, transition: "opacity .2s",
                }}>
                  <button
                    onClick={() => { onTaskDelete(task); setSwipeTaskId(null); }}
                    style={{
                      background: "none", border: "none", color: "#fff",
                      fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
                    }}>
                    🗑 Suppr.
                  </button>
                </div>

                {/* Item tâche */}
                <div style={{
                  background: C.surface,
                  transform: isSwiped ? "translateX(-80px)" : "translateX(0)",
                  transition: "transform .2s",
                  padding: "12px 16px",
                  borderBottom: `0.5px solid ${C.border}`,
                  display: "flex", gap: 10, alignItems: "center",
                  cursor: "pointer",
                }}
                  onTouchStart={e => { e.currentTarget._ts = e.touches[0].clientX; }}
                  onTouchEnd={e => {
                    const dx = e.changedTouches[0].clientX - (e.currentTarget._ts || 0);
                    if (dx < -40) setSwipeTaskId(task.id);
                    else if (dx > 20) setSwipeTaskId(null);
                  }}
                  onClick={() => {
                    if (swipeTaskId === task.id) { setSwipeTaskId(null); return; }
                    onTaskClick(task);
                    setDrawerOpen(false);
                  }}>
                  {/* Point priorité */}
                  <div style={{
                    width: 10, height: 10, borderRadius: "50%",
                    background: pr.color, flexShrink: 0,
                    boxShadow: `0 0 6px ${pr.color}88`,
                  }} />
                  {/* Contenu */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: 14, fontWeight: 600, color: C.ink,
                      overflow: "hidden", textOverflow: "ellipsis",
                      whiteSpace: "nowrap", marginBottom: 3,
                    }}>
                      {task.title}
                    </div>
                    <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                      <span style={{ fontSize: 11, color: pr.color, fontWeight: 600 }}>
                        {pr.label}
                      </span>
                      {task.dueDate && (
                        <span style={{ fontSize: 11, color: C.muted }}>· {task.dueDate}</span>
                      )}
                      {task.recurrence && task.recurrence !== "none" && (
                        <span style={{ fontSize: 11, color: C.accent }}>· 🔁</span>
                      )}
                    </div>
                  </div>
                  <span style={{ color: C.muted, fontSize: 20, flexShrink: 0 }}>›</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
