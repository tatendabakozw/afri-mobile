import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import tw from 'twrnc';

interface QuestionItemProps {
    question: {
        questionId: number;
        question: string;
        questionType: 'single_choice' | 'multiple_choice' | 'open_text';
        answerOptions: {
            label: string;
            option: string;
            translations?: any;
        }[];
        translations?: any;
    };
    responses: Record<number, string | string[]>;
    onResponseChange: (questionId: number, value: string | string[], type: string) => void;
    getTranslatedText: (translations: any | undefined, defaultText: string) => string;
}

const QuestionItem: React.FC<QuestionItemProps> = ({
    question,
    responses,
    onResponseChange,
    getTranslatedText
}) => {
    const renderRadioOption = (option: { label: string; option: string; translations?: any }) => (
        <TouchableOpacity
            key={option.option}
            style={tw`flex-row items-center mb-3 p-3 border rounded-lg ${
                responses[question.questionId] === option.option 
                ? 'border-[#32B3C2] bg-[#E6F7F9]' 
                : 'border-gray-300'
            }`}
            onPress={() => onResponseChange(question.questionId, option.option, 'single_choice')}
        >
            <View style={tw`w-5 h-5 rounded-full border-2 mr-3 items-center justify-center ${
                responses[question.questionId] === option.option 
                ? 'border-[#32B3C2]' 
                : 'border-gray-400'
            }`}>
                {responses[question.questionId] === option.option && (
                    <View style={tw`w-3 h-3 rounded-full bg-[#32B3C2]`} />
                )}
            </View>
            <Text style={tw`flex-1 text-base ${
                responses[question.questionId] === option.option 
                ? 'text-[#32B3C2]' 
                : 'text-gray-700'
            }`}>
                {getTranslatedText(option.translations, option.label)}
            </Text>
        </TouchableOpacity>
    );

    const renderCheckboxOption = (option: { label: string; option: string; translations?: any }) => {
        const isSelected = (responses[question.questionId] as string[] || []).includes(option.option);
        
        return (
            <TouchableOpacity
                key={option.option}
                style={tw`flex-row items-center mb-3 p-3 border rounded-lg ${
                    isSelected 
                    ? 'border-[#32B3C2] bg-[#E6F7F9]' 
                    : 'border-gray-300'
                }`}
                onPress={() => onResponseChange(question.questionId, option.option, 'multiple_choice')}
            >
                <View style={tw`w-5 h-5 rounded border-2 mr-3 items-center justify-center ${
                    isSelected 
                    ? 'border-[#32B3C2]' 
                    : 'border-gray-400'
                }`}>
                    {isSelected && (
                        <View style={tw`w-3 h-3 bg-[#32B3C2]`} />
                    )}
                </View>
                <Text style={tw`flex-1 text-base ${
                    isSelected 
                    ? 'text-[#32B3C2]' 
                    : 'text-gray-700'
                }`}>
                    {getTranslatedText(option.translations, option.label)}
                </Text>
            </TouchableOpacity>
        );
    };

    const renderTextInput = () => (
        <TextInput
            style={tw`border border-gray-300 rounded-lg p-3 text-base mb-3`}
            value={responses[question.questionId] as string || ''}
            onChangeText={(text) => onResponseChange(question.questionId, text, 'open_text')}
            placeholder={"t('common.type_here')"}
            placeholderTextColor="#9CA3AF"
        />
    );

    return (
        <View style={tw`mb-6`}>
            <Text style={tw`text-lg font-medium mb-3`}>
                {getTranslatedText(question.translations, question.question)}
            </Text>
            
            {question.questionType === 'single_choice' && (
                <View>
                    {question.answerOptions.map(renderRadioOption)}
                </View>
            )}

            {question.questionType === 'multiple_choice' && (
                <View>
                    {question.answerOptions.map(renderCheckboxOption)}
                </View>
            )}

            {question.questionType === 'open_text' && renderTextInput()}
        </View>
    );
};

export default QuestionItem;