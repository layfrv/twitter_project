export default function createNickname(str) {
    if (!str) {
        return '';
    }
    const indexOfSymbol = str.indexOf('@');
    return `@${str.substring(0, indexOfSymbol)}`;
}
