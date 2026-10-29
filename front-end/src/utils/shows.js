// Do dates ke beech ke saare din ["YYYY-MM-DD", ...] (dono shamil)
export const todayString = () => {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
};

export const isUpcoming = ({ date, time }) => {
  if (!date || !time) return false;
  const now = new Date();
  const today = todayString();
  const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  return date > today || (date === today && time >= currentTime);
};

export const sortShows = (shows = []) =>
  [...shows].sort((a, b) => `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`));

export const getUpcomingShows = (shows = []) =>
  sortShows(shows.filter(isUpcoming));

const parseLocalDate = (date) => {
  const [year, month, day] = date.split("-").map(Number);
  return new Date(year, month - 1, day);
};

export const formatShowDate = (date) =>
  parseLocalDate(date).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

export const formatShortDate = (date) =>
  parseLocalDate(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

export const formatShowTime = (time) => {
  const [hours, minutes] = time.split(":").map(Number);
  return new Date(2000, 0, 1, hours, minutes).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
};

export const datesBetween = (from, to) => {
  const result = [];
  const cur = new Date(`${from}T00:00:00`);
  const end = new Date(`${to}T00:00:00`);

  while (cur <= end) {
    result.push(
      `${cur.getFullYear()}-${String(cur.getMonth() + 1).padStart(2, "0")}-${String(
        cur.getDate()
      ).padStart(2, "0")}`
    );
    cur.setDate(cur.getDate() + 1);
  }

  return result;
};
