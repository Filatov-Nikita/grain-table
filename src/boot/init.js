function displayDate(date) {
  if (typeof date !== "string") return "-";

  const months = [
    null,
    "января",
    "февраля",
    "марта",
    "апреля",
    "мая",
    "июня",
    "июля",
    "августа",
    "сентября",
    "октября",
    "ноября",
    "декабря",
  ];

  const [year = "2000", month = "1", day = "1"] = date.split("-");
  return `${day} ${months[parseInt(month)]}`;
}

export default ({ app }) => {
  app.config.globalProperties.$filters = {
    displayDate,
  };
};
