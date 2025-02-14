export interface CreateBankAccountDto {
    firstName: string;
    lastName: string;
    email: string;
    branchCode: string;
    bankName: string;
    bankId: string;
    accountNumber: string;
    mobileNumber: string;
    address: string;
}

export interface RequestPayoutDto {
    amount: number;
}

export interface UpdateBankAccountDto {
    accountNumber: string;
    mobileNumber: string;
}

export interface MobileMoneyDto {
    phoneNumber: string;
    operator: string;
    amount: number;
}