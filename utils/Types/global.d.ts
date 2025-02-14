interface Window {
    $zoho?: {
        salesiq: {
            widgetcode: string;
            values: {
                buttonColor: string;
                tabColor: string;
                [key: string]: any;
            };
            ready: () => void;
        };
    };
}

// This is important - it makes this a module
export {};