export interface MobileMoneyOption {
    label: string;
    value: string;
}

export const mobileMoneyOptions: { [country: string]: MobileMoneyOption[] } = {
    "CM": [
        { label: "FMM", value: "FMM" }
    ],
    "CI": [
        { label: "FMM", value: "FMM" },
        { label: "WAVE", value: "WAVE" }
    ],
    "ET": [
        { label: "AMOLEMONEY", value: "AMOLEMONEY" }
    ],
    "GH": [
        { label: "AIRTEL", value: "AIRTEL" },
        { label: "MTN", value: "MTN" },
        { label: "TIGO", value: "TIGO" },
        { label: "VODAFONE", value: "VODAFONE" }
    ],
    "KE": [
        { label: "MPX", value: "MPX" },
        { label: "MPS", value: "MPS" }
    ],
    "MW": [
        { label: "AIRTELMW", value: "AIRTELMW" }
    ],
    "SN": [
        { label: "EMONEY", value: "EMONEY" },
        { label: "FREEMONEY", value: "FREEMONEY" },
        { label: "ORANGEMONEY", value: "ORANGEMONEY" },
        { label: "WAVE", value: "WAVE" }
    ],
    "RW": [
        { label: "MPS", value: "MPS" }
    ],
    "TZ": [
        { label: "MPS", value: "MPS" }
    ],
    "UG": [
        { label: "MPS", value: "MPS" }
    ],
    "ZM": [
        { label: "MPS", value: "MPS" }
    ]
};
