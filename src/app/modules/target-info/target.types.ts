export interface SubTarget {
    ['Sub Target ID']: string;
    ['Sub Target Name']: string;
    Index: string;
    Value: string;
    Unit: string;
    ['Current Value']: string;
    ['Start Month']: string;
    ['Start Year']: string;
    ['Finish Month']: string;
    ['Finish Year']: string;
}

export interface Method {
    ['Method ID']: string;
    ['Method Name']: string;
    Jan: string;
    Feb: string;
    Mar: string;
    Apr: string;
    May: string;
    Jun: string;
    Jul: string;
    Aug: string;
    Sep: string;
    Oct: string;
    Nov: string;
    Dec: string;
    Owner: string;
}

export interface MethodRecord {
    data?: Method;
    kids?: MethodRecord;
}

export interface SubTargetRecord {
    data?: SubTarget;
    kids?: {
        has_methods?: {
            records: MethodRecord[];
        }
    }
}

export interface TargetData {
    ['Target ID']: string;
    Name: string;
    Standard: string;
    ['Relative Target']: string;
}

export interface Target {
    data: TargetData;
    kids: {
        has_sub_targets?: {
            records: SubTargetRecord[];
        }
    };
}

export interface RunningNoData {
    Site: string;
    Division: string;
    Department: string;
    ['Target Type']: string;
    Status: string;
    ['Running No.']: string;
    Year: string;
    ['Revision No.']: string;
    ['Modify No.']: string;
    ['Create Date']: string;
    ['Issued Date']: string;
    Creator: string;
}

export interface RunningNo {
    data: RunningNoData;
    kids: {
        has_targets?: {
            records: Target[];
        }
    }
}