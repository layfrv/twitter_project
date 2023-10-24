export default function getFormatDate(dateIn) {
    return dateIn.substring(0, 10).split('-').reverse().join('.');
}
