export function ucFirst(string: string | undefined) {
    return string ? string.charAt(0).toUpperCase() + string.slice(1).toLowerCase() : string;
}
  
export function dateToHuman(string: string) {
    return string ? new Date(string).toDateString() : undefined;
}
  
export function snakeToWords(string: string) {
    if (!string) 
        return string;
    
    const words = string.split('_');
    const newWords = words.map((word) => ucFirst(word));
    return newWords.join(' ');
}
  