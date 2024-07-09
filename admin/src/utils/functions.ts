export function ucFirst(string: string | undefined) {
    return string ? string.charAt(0).toUpperCase() + (string.slice(1)).toLowerCase() : string;
}
export function snakeToWords(string: string) {
    if (!string) return string;
    const words = string.split('_');
    const newWords = words.map(word => ucFirst(word));
    return newWords.join(' ');
}
export function wordsToDash(string: string) {
    if(!string) return string;
    const words = string.split(' ');
    const newWords = words.map(word => word.toLocaleLowerCase());
    return newWords.join('-');
}
export function onlyUnique(value: any, index: number, self: any[]) {
    return self.indexOf(value) === index;
}
export function formatDate(dt: any) {
    let dateString = "";
    if (dt) {
        dt = new Date(dt);
        dateString = dt.toISOString().split("T")[0];
    }
    return dateString;
}

export function formatDateToString(date: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  };

  const formattedDate: string = new Intl.DateTimeFormat(
    "en-US",
    options
  ).format(date);

  return formattedDate;
}
