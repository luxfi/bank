import moment from 'moment';
export const snakeCaseToHumanCase = (str:string|undefined) => {
    if (!str) return '';
    return str.replace(/(^\w)/g, g => g[0].toUpperCase()).replace(/([-_]\w)/g, g => " " + g[1].toUpperCase()).trim();;
}

export const dateToHuman = (date:Date|string|undefined, toLocal = true) => {
    return toLocal ? moment(date).format('DD MMM YYYY @ h:mm:ss a') : moment.utc(date).format('DD MMM YYYY @ h:mm:ss a');
}
export const dateToHumanDate = (date:Date|string|undefined, toLocal = true) => {
    return toLocal ? moment(date).format('DD MMM YYYY') : moment.utc(date).format('DD MMM YYYY');
}