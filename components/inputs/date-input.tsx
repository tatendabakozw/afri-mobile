import React from 'react';
import { View, Text } from 'react-native';
import tw from 'twrnc';
import PrimaryInput from './primary-input';

interface DateInputProps {
    day: string;
    month: string;
    year: string;
    onChangeDay: (value: string) => void;
    onChangeMonth: (value: string) => void;
    onChangeYear: (value: string) => void;
    label?: string;
    error?: string;
}

const DateInput: React.FC<DateInputProps> = ({
    day,
    month,
    year,
    onChangeDay,
    onChangeMonth,
    onChangeYear,
    label,
    error,
}) => {
    return (
        <View style={tw`w-full mb-4`}>
            {label && (
                <Text style={tw`text-gray-700 font-medium mb-2`}>{label}</Text>
            )}

            <View style={tw`flex-row w-full`}>
                {/* Day Input */}
                <PrimaryInput
                    value={day}
                    onChangeText={onChangeDay}
                    placeholder="DD"
                    keyboardType="numeric"
                    maxLength={2}
                    style={tw`mr-2`}
                />

                {/* Month Input */}
                <PrimaryInput
                    value={month}
                    onChangeText={onChangeMonth}
                    placeholder="MM"
                    keyboardType="numeric"
                    maxLength={2}
                    style={tw` mx-2 `}
                />

                {/* Year Input */}
                <PrimaryInput
                    value={year}
                    onChangeText={onChangeYear}
                    placeholder="YYYY"
                    keyboardType="numeric"
                    maxLength={4}
                    style={tw`ml-2`}
                />
            </View>

            {/* Error Message */}
            {error && <Text style={tw`text-red-500 text-sm mt-1`}>{error}</Text>}
        </View>
    );
};

export default DateInput;
