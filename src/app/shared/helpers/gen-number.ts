// for mock data
export function genRandomNumber() {
    return getRandomInt(10000).toString();
}

export function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}