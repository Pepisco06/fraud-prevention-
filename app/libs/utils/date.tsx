export const formatDateDotSplit = (date: string) =>
  new Intl.DateTimeFormat("en-AU", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  })
    .format(new Date(date))
    .split(" ")
    .join(".");
