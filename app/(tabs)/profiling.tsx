import { Text, View, ScrollView, TouchableOpacity, TextInput } from 'react-native'
import React, { useState } from 'react'
import GeneralLayout from '@/layouts/GeneralLayout'
import { Ionicons } from '@expo/vector-icons'
import tw from 'twrnc'
import PrimaryButton from '@/components/buttons/primary-button'

type QuestionType = 'single' | 'multiple' | 'open'

interface Question {
  id: number
  type: QuestionType
  question: string
  options?: string[]
  answer?: string | string[]
}

const Profiling = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, any>>({})

  const questions: Question[] = [
    {
      id: 1,
      type: 'single',
      question: 'What is your age group?',
      options: ['18-24', '25-34', '35-44', '45-54', '55+']
    },
    {
      id: 2,
      type: 'multiple',
      question: 'Which devices do you own? (Select all that apply)',
      options: ['Smartphone', 'Tablet', 'Laptop', 'Desktop', 'Smart TV']
    },
    {
      id: 3,
      type: 'open',
      question: 'What are your main interests or hobbies?'
    }
  ]

  const handleAnswer = (questionId: number, answer: any) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }))
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
    }
  }

  const handleSubmit = () => {
    console.log('Submitted answers:', answers)
  }

  const renderQuestion = (question: Question) => {
    switch (question.type) {
      case 'single':
        return (
          <View style={tw`mt-4`}>
            {question.options?.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={tw`flex-row items-center p-4 bg-white rounded-lg mb-2 border ${
                  answers[question.id] === option ? 'border-[#32B3C2]' : 'border-gray-200'
                }`}
                onPress={() => handleAnswer(question.id, option)}
              >
                <View style={tw`w-5 h-5 rounded-full border-2 ${
                  answers[question.id] === option ? 'border-[#32B3C2]' : 'border-gray-300'
                } mr-3`}>
                  {answers[question.id] === option && (
                    <View style={tw`w-3 h-3 rounded-full bg-[#32B3C2] m-auto`} />
                  )}
                </View>
                <Text style={tw`text-gray-800`}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )

      case 'multiple':
        return (
          <View style={tw`mt-4`}>
            {question.options?.map((option, index) => {
              const isSelected = answers[question.id]?.includes(option)
              return (
                <TouchableOpacity
                  key={index}
                  style={tw`flex-row items-center p-4 bg-white rounded-lg mb-2 border ${
                    isSelected ? 'border-[#32B3C2]' : 'border-gray-200'
                  }`}
                  onPress={() => {
                    const currentAnswers = answers[question.id] || []
                    const newAnswers = isSelected
                      ? currentAnswers.filter((a: string) => a !== option)
                      : [...currentAnswers, option]
                    handleAnswer(question.id, newAnswers)
                  }}
                >
                  <View style={tw`w-5 h-5 rounded border-2 ${
                    isSelected ? 'border-[#32B3C2]' : 'border-gray-300'
                  } mr-3`}>
                    {isSelected && (
                      <Ionicons name="checkmark" size={16} color="#32B3C2" style={tw`m-auto`} />
                    )}
                  </View>
                  <Text style={tw`text-gray-800`}>{option}</Text>
                </TouchableOpacity>
              )
            })}
          </View>
        )

      case 'open':
        return (
          <View style={tw`mt-4`}>
            <TextInput
              style={tw`bg-white p-4 rounded-lg border border-gray-200 min-h-[100px]`}
              multiline
              placeholder="Type your answer here..."
              value={answers[question.id] || ''}
              onChangeText={(text) => handleAnswer(question.id, text)}
            />
          </View>
        )
    }
  }

  return (
    <GeneralLayout>
      <ScrollView style={tw`flex-1`} contentContainerStyle={tw`p-4 pb-32`}>
        <View style={tw`flex-row items-center justify-between mb-6`}>
          <Text style={tw`text-xl font-bold text-gray-800`}>Profile Setup</Text>
          <Text style={tw`text-gray-500`}>
            {currentQuestion + 1} of {questions.length}
          </Text>
        </View>

        <View style={tw`bg-white rounded-xl p-4 shadow-sm`}>
          <Text style={tw`text-lg font-medium text-gray-800 mb-2`}>
            {questions[currentQuestion].question}
          </Text>
          {renderQuestion(questions[currentQuestion])}
        </View>

        <View style={tw`flex-row justify-between mt-6`}>
          <PrimaryButton
            title="Next"
            onPress={handleNext}
            style={tw`flex-1 mr-2`}
            disabled={currentQuestion === questions.length - 1}
          />
          <PrimaryButton
            title="Submit"
            onPress={handleSubmit}
            style={tw`flex-1 ml-2`}
            disabled={currentQuestion !== questions.length - 1}
          />
        </View>
      </ScrollView>
    </GeneralLayout>
  )
}

export default Profiling