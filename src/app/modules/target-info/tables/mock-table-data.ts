import { MethodRecord, SubTargetRecord, TargetRecord } from "../target.types";

export const genMockTargetRecord: () => TargetRecord = () => {
    const randomValue = genRandomNumber();
    return {
        data: {
            targetId: randomValue,
            name: randomValue,
            standard: randomValue,
            relativeTarget: '1'
        },
        kids: {
            records: []
        }
    };
}

export const genMockSubTargetRecord: () => SubTargetRecord = () => {
    const randomValue = genRandomNumber();
    return {
        data: {
            subTargetId: randomValue,
            subTargetName: randomValue,
            index: randomValue,
            value: randomValue,
            unit: randomValue,
            currentValue: randomValue,
            startMonth: randomValue,
            startYear: randomValue,
            finishMonth: randomValue,
            finishYear: '1'
        },
        kids: {
            records: []
        }
    };
}

export const genMockMethodRecord: () => MethodRecord = () => {
    const randomValue = genRandomNumber();
    return {
        data: {
            methodId: randomValue,
            methodName: randomValue,
            jan: randomValue,
            feb: randomValue,
            mar: randomValue,
            apr: randomValue,
            may: randomValue,
            jun: randomValue,
            jul: randomValue,
            aug: randomValue,
            sep: randomValue,
            oct: randomValue,
            nov: randomValue,
            dec: randomValue,
            owner: '1'
        },
        kids: undefined
    }
};

export const genRandomNumber = () => {
    return getRandomInt(10000).toString();
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}