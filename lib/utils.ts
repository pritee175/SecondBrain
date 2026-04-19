export const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

export const todayISO = () => new Date().toISOString().split("T")[0];

export const todayStr = () =>
  new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

export const fmtDate = (d: string) =>
  d ? new Date(d + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "";

export const fmtDateFull = (d: string) =>
  d ? new Date(d + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "";

export const greet = () => {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
};

// Get ISO dates for the past N days
export const lastNDays = (n: number): string[] => {
  const days: string[] = [];
  for (let i = 0; i < n; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().split("T")[0]);
  }
  return days;
};

// Week start (Monday)
export const weekStart = (): string => {
  const d = new Date();
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  return d.toISOString().split("T")[0];
};

export const monthStart = (): string => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-01`;
};

export const yesterday = (): string => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split("T")[0];
};

// Check if a habit streak should continue (was done yesterday)
export const streakAlive = (lastDone?: string): boolean => {
  if (!lastDone) return false;
  return lastDone === yesterday() || lastDone === todayISO();
};
