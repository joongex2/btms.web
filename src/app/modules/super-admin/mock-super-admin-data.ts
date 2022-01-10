export const genRandomNumber = () => {
    return getRandomInt(10000).toString();
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}