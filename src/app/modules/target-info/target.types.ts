export interface SubTarget {
    subTargetId: string;
    subTargetName: string;
    index: string;
    value: string;
    unit: string;
    currentValue: string;
    startMonth: string;
    startYear: string;
    finishMonth: string;
    finishYear: string;
}

export interface Method {
    methodId: string;
    methodName: string;
    jan: string;
    feb: string;
    mar: string;
    apr: string;
    may: string;
    jun: string;
    jul: string;
    aug: string;
    sep: string;
    oct: string;
    nov: string;
    dec: string;
    owner: string;
}

export interface MethodRecord {
    data?: Method;
    kids?: MethodRecord;
}

export interface SubTargetRecord {
    data?: SubTarget;
    kids?: {
        records: MethodRecord[];
    }
}

export interface Target {
    targetId: string;
    name: string;
    standard: string;
    relativeTarget: string;
}

export interface TargetRecord {
    data: Target;
    kids: {
        records: SubTargetRecord[];
    };
}

export interface RunningNoData {
    site: string;
    division: string;
    department: string;
    targetType: string;
    status: string;
    runningNo: string;
    year: string;
    revisionNo: string;
    modifyNo: string;
    createDate: string;
    issuedDate: string;
    creator: string;
}

export interface RunningNo {
    data: RunningNoData;
    kids: {
        hasTargets?: {
            records: TargetRecord[];
        }
    }
}