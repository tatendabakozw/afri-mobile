import { Text, View, ScrollView, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import GeneralLayout from '@/layouts/GeneralLayout'
import { Ionicons } from '@expo/vector-icons'
import tw from 'twrnc'
import PrimaryButton from '@/components/buttons/primary-button'
import ProfilingService from '@/api/services/profiling/ProfilingService'
import { router } from 'expo-router'
import { useLanguage } from '@/hooks/useLanguage'

interface Option {
  id: string
  text: string
  value: string
  isOther?: boolean
}

interface Question {
  id: string
  text: string
  type: 'single-select' | 'multi-select' | 'open-text'
  options?: Option[]
  answerFormat?: 'text' | 'time' | 'date' | 'float' | 'integer' | 'number'
  answer?: string | string[]
  maxSelectable?: number
  other?: boolean
  allowPreferNotToSay?: boolean
}

const mapQuestionType = (
  questionType: string
): "single-select" | "multi-select" | "open-text" => {
  switch (questionType) {
    case "single_choice":
      return "single-select";
    case "multiple_choice":
      return "multi-select";
    case "open_text":
    default:
      return "open-text";
  }
};

const Profiling = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [surveyData, setSurveyData] = useState<Question[]>([])
  const [answeredQuestions, setAnsweredQuestions] = useState<Question[]>([])
  const [responses, setResponses] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const { language } = useLanguage()

  const mapOptions = (answerOptions: any[], translations: any[]): Option[] => {
    return answerOptions.map((option) => {
      // Find the translation for the current option and language
      const translation = translations.find(
        (trans) => trans.questionId === option.questionId && trans.language === language && trans.answerOptionId === option.id
      );
  
      return {
        id: option.id.toString(),
        text: translation ? translation.label : option.label || option.option,
        value: translation ? translation.value : option.value,
        isOther: option.isOther || false,
      };
    });
  };
  
  
  const mapAnsweredQuestions = (answeredQuestions: any[]): Question[] => {
    return answeredQuestions.map((question) => {
      // Find the translation for the current question and language
      const translation = question.questionTranslations.find(
          (trans:any) => trans.questionId === question.questionId && trans.language === language
      );
  
      return {
        id: question.questionId.toString(),
        text: translation ? translation.translatedText : question.question,
        type: mapQuestionType(question.questionType),
        options:( question.answerOptions||question.answerOptionsTranslations) ? mapOptions(question.answerOptions,question.answerOptionsTranslations) : undefined,
        answerFormat: question.answerType,
        answer: question.answer,
      };
    });
  };
  
  const mapUnansweredQuestions = (unansweredQuestions: any[]): Question[] => {
    return unansweredQuestions.map((question) => {
      const translation = question.translations.find(
        (trans: any) => trans.questionId === question.questionId && trans.language === language
      );
  
  
      return {
        id: question.questionId.toString(),
        text: translation ? translation.translatedText : question.question,
        type: mapQuestionType(question.questionType),
        options: (question.answerOptions || question.answerOptionsTranslations) ? mapOptions(question.answerOptions, question.answerOptionsTranslations) : undefined,
        answerFormat: question.answerType,
        maxSelectable: question.maxSelectable,
        other: question.other,
      };
    });
  }

  const profilingService = new ProfilingService()


  useEffect(() => {
    fetchProfileData()
  }, [])

  const fetchProfileData = async () => {
    try {
      setLoading(true)
      const questionsResponse: any = await profilingService.fetchProfilingQuestions()

      console.log("questionsResponse, ", questionsResponse)

      const unansweredQuestions = mapUnansweredQuestions(questionsResponse?.unansweredQuestions)
      const answeredQuestions = mapAnsweredQuestions(questionsResponse?.answeredQuestions)

      setSurveyData(unansweredQuestions)
      setAnsweredQuestions(answeredQuestions)
      initializeResponses(unansweredQuestions)
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const initializeResponses = (questions: Question[]) => {
    const initialResponses: Record<string, any> = {}
    questions.forEach(question => {
      initialResponses[question.id] = question.type === 'multi-select' ? [] : ''
    })
    setResponses(initialResponses)
  }

  const handleOptionSelect = (questionId: string, value: string) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }))
  }

  const handleMultiSelect = (questionId: string, value: string, maxSelectable?: number) => {
    setResponses(prev => {
      const currentSelection = prev[questionId] || []
      if (currentSelection.includes(value)) {
        return {
          ...prev,
          [questionId]: currentSelection.filter((v:any) => v !== value)
        }
      } else {
        let newSelection = [...currentSelection, value]
        if (maxSelectable && newSelection.length > maxSelectable) {
          newSelection = newSelection.slice(1)
        }
        return {
          ...prev,
          [questionId]: newSelection
        }
      }
    })
  }

  const handleInputChange = (questionId: string, value: string, format?: string) => {
    if (value === 'PREFER_NOT_TO_SAY') {
      setResponses(prev => ({
        ...prev,
        [questionId]: value
      }))
      return
    }

    if (format && !validateInput(value, format) && value !== '') {
      return
    }

    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }))
  }

  const validateInput = (value: string, format?: string): boolean => {
    switch (format) {
      case 'time':
        return /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(value)
      case 'date':
        return /^\d{4}-\d{2}-\d{2}$/.test(value)
      case 'float':
        return /^\d*\.?\d*$/.test(value)
      case 'integer':
        return /^\d*$/.test(value)
      default:
        return true
    }
  }

  const handleSubmit = async () => {
    try {
      setSubmitting(true)
      const submissionData = Object.entries(responses)
        .filter(([_, value]) => value !== '')
        .map(([questionId, answer]) => ({
          questionId: parseInt(questionId),
          answer
        }))

      const profilingService = new ProfilingService()
      // await profilingService.submitProfilingAnswers(submissionData)

      router.push('/(tabs)')
    } catch (error: any) {
      setError(error.message)
    } finally {
      setSubmitting(false)
    }
  }

  const renderQuestion = (question: Question) => {
    switch (question.type) {
      case 'single-select':
        return (
          <View style={tw`mt-4`}>
            {question.options?.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={tw`flex-row items-center p-4 bg-white rounded-lg mb-2 border 
                  ${responses[question.id] === option.value ? 'border-[#32B3C2]' : 'border-gray-200'}`}
                onPress={() => handleOptionSelect(question.id, option.value)}
              >
                <View style={tw`w-5 h-5 rounded-full border-2 
                  ${responses[question.id] === option.value ? 'border-[#32B3C2]' : 'border-gray-300'} mr-3`}
                >
                  {responses[question.id] === option.value && (
                    <View style={tw`w-3 h-3 rounded-full bg-[#32B3C2] m-auto`} />
                  )}
                </View>
                <Text style={tw`text-gray-800`}>{option.text}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )

      case 'multi-select':
        return (
          <View style={tw`mt-4`}>
            {question.options?.map((option) => {
              const isSelected = (responses[question.id] || []).includes(option.value)
              return (
                <TouchableOpacity
                  key={option.id}
                  style={tw`flex-row items-center p-4 bg-white rounded-lg mb-2 border 
                    ${isSelected ? 'border-[#32B3C2]' : 'border-gray-200'}`}
                  onPress={() => handleMultiSelect(question.id, option.value, question.maxSelectable)}
                >
                  <View style={tw`w-5 h-5 rounded border-2 
                    ${isSelected ? 'border-[#32B3C2]' : 'border-gray-300'} mr-3`}
                  >
                    {isSelected && (
                      <Ionicons name="checkmark" size={16} color="#32B3C2" style={tw`m-auto`} />
                    )}
                  </View>
                  <Text style={tw`text-gray-800`}>{option.text}</Text>
                </TouchableOpacity>
              )
            })}
            {question.maxSelectable && (
              <Text style={tw`text-gray-500 text-sm mt-2`}>
                Select up to {question.maxSelectable} options
              </Text>
            )}
          </View>
        )

      case 'open-text':
        return (
          <View style={tw`mt-4`}>
            <TextInput
              style={tw`bg-white p-4 rounded-lg border border-gray-200 ${question.answerFormat === 'text' ? 'min-h-[100px]' : 'h-12'
                }`}
              multiline={question.answerFormat === 'text'}
              placeholder={getPlaceholder(question.answerFormat)}
              value={responses[question.id] === 'PREFER_NOT_TO_SAY' ? '' : responses[question.id]}
              onChangeText={(text) => handleInputChange(question.id, text, question.answerFormat)}
              keyboardType={getKeyboardType(question.answerFormat)}
              editable={responses[question.id] !== 'PREFER_NOT_TO_SAY'}
            />

            {question.allowPreferNotToSay && (
              <TouchableOpacity
                style={tw`flex-row items-center mt-2`}
                onPress={() => handleInputChange(question.id, 'PREFER_NOT_TO_SAY')}
              >
                <View style={tw`w-5 h-5 rounded border-2 border-gray-300 mr-2`}>
                  {responses[question.id] === 'PREFER_NOT_TO_SAY' && (
                    <Ionicons name="checkmark" size={16} color="#32B3C2" style={tw`m-auto`} />
                  )}
                </View>
                <Text style={tw`text-gray-600 text-sm`}>Prefer not to say</Text>
              </TouchableOpacity>
            )}
          </View>
        )
    }
  }

  if (loading) {
    return (
      <GeneralLayout>
        <View style={tw`flex-1 justify-center items-center`}>
          <ActivityIndicator size="large" color="#32B3C2" />
        </View>
      </GeneralLayout>
    )
  }

  return (
    <GeneralLayout>
      <ScrollView style={tw`flex-1`} contentContainerStyle={tw`p-4 pb-32`}>
        {error ? (
          <View style={tw`bg-red-50 p-4 rounded-lg mb-4`}>
            <Text style={tw`text-red-600`}>{error}</Text>
          </View>
        ) : null}

        <View style={tw`flex-row items-center justify-between mb-6`}>
          <Text style={tw`text-xl font-bold text-gray-800`}>Profile Setup</Text>
          <Text style={tw`text-gray-500`}>
            {currentQuestion + 1} of {surveyData.length}
          </Text>
        </View>

        {surveyData.length > 0 ? (
          <>
            <View style={tw`bg-white rounded-xl p-4 shadow-sm`}>
              <Text style={tw`text-lg font-medium text-gray-800 mb-2`}>
                {surveyData[currentQuestion].text}
              </Text>
              {renderQuestion(surveyData[currentQuestion])}
            </View>

            <View style={tw`flex-row justify-between mt-6`}>
              <PrimaryButton
                title="Previous"
                onPress={() => setCurrentQuestion(prev => prev - 1)}
                style={tw`flex-1 mr-2 ${currentQuestion === 0 ? 'opacity-50' : ''}`}
                disabled={currentQuestion === 0 || submitting}
              />
              {currentQuestion === surveyData.length - 1 ? (
                <PrimaryButton
                  title={submitting ? 'Submitting...' : 'Submit'}
                  onPress={handleSubmit}
                  style={tw`flex-1 ml-2`}
                  disabled={submitting}
                />
              ) : (
                <PrimaryButton
                  title="Next"
                  onPress={() => setCurrentQuestion(prev => prev + 1)}
                  style={tw`flex-1 ml-2`}
                  disabled={submitting}
                />
              )}
            </View>
          </>
        ) : (
          <View style={tw`bg-white rounded-xl p-4 shadow-sm items-center`}>
            <Text style={tw`text-gray-500 text-center`}>No questions available</Text>
          </View>
        )}
      </ScrollView>
    </GeneralLayout>
  )
}

const getPlaceholder = (format?: string): string => {
  switch (format) {
    case 'time':
      return 'HH:mm'
    case 'date':
      return 'YYYY-MM-DD'
    case 'float':
    case 'integer':
      return 'Enter a number'
    default:
      return 'Type your answer here...'
  }
}

const getKeyboardType = (format?: string): 'default' | 'numeric' => {
  switch (format) {
    case 'float':
    case 'integer':
    case 'number':
      return 'numeric'
    default:
      return 'default'
  }
}

export default Profiling