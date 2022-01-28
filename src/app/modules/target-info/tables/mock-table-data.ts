import { MainMethodRecord, MethodRecord, PlanRecord, SubTargetRecord, TargetRecord } from "../target.types";

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

export const genMockMainMethodRecord: () => MainMethodRecord = () => {
    const randomValue = genRandomNumber();
    return {
        data: {
            mainMethodId: randomValue
        },
        kids: {
            planRecords: [],
            methodRecords: []
        }
    }
}

export const genMockMethodRecord: () => MethodRecord = () => {
    const randomValue = genRandomNumber();
    return {
        data: {
            methodId: randomValue,
            methodName: randomValue,
            resultRecords: [
                {
                    year: '',
                    "jan": {
                        status: 'initial',
                        causeRecords: []
                    },
                    "feb": {
                        status: 'initial',
                        causeRecords: []
                    },
                    "mar": {
                        status: 'initial',
                        causeRecords: []
                    },
                    "apr": {
                        status: 'initial',
                        causeRecords: []
                    },
                    "may": {
                        status: 'initial',
                        causeRecords: []
                    },
                    "jun": {
                        status: 'initial',
                        causeRecords: []
                    },
                    "jul": {
                        status: 'initial',
                        causeRecords: []
                    },
                    "aug": {
                        status: 'initial',
                        causeRecords: []
                    },
                    "sep": {
                        status: 'initial',
                        causeRecords: []
                    },
                    "oct": {
                        status: 'initial',
                        causeRecords: []
                    },
                    "nov": {
                        status: 'initial',
                        causeRecords: []
                    },
                    "dec": {
                        status: 'initial',
                        causeRecords: []
                    }
                }
            ],
            owner: '1'
        },
        kids: undefined
    }
};

export const genMockPlanRecord: () => PlanRecord = () => {
    const randomValue = genRandomNumber();
    return {
        data: {
            planName: randomValue,
            planActual: randomValue,
            planResource: randomValue,
            planOwner: randomValue,
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