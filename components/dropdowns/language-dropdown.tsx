import { StyleSheet, Text, TouchableOpacity, View, Animated } from 'react-native';
import React, { useState, useRef } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = {};
type Language = 'en' | 'ar' | 'fr' | 'nl';

const languages: Record<Language, { name: string; flag: string }> = {
    en: { name: 'English', flag: '🇬🇧' },
    ar: { name: 'العربية', flag: '🇸🇦' },
    fr: { name: 'Français', flag: '🇫🇷' },
    nl: { name: 'Dutch', flag: '🇳🇱' }
};

const LanguageDropdown = (props: Props) => {
    const insets = useSafeAreaInsets();
    const [showLanguages, setShowLanguages] = useState(false);
    const [selectedLang, setSelectedLang] = useState<Language>('en');
    const rotateAnim = useRef(new Animated.Value(0)).current;

    const toggleDropdown = () => {
        setShowLanguages(!showLanguages);
        Animated.spring(rotateAnim, {
            toValue: showLanguages ? 0 : 1,
            useNativeDriver: true,
        }).start();
    };

    const rotate = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '180deg'],
    });

    return (
        <View style={[styles.dropdown, { top: insets.top + 10 }]}>
            <TouchableOpacity
                style={styles.languageButton}
                onPress={toggleDropdown}
                activeOpacity={0.7}
            >
                <Text style={styles.flagEmoji}>{languages[selectedLang].flag}</Text>
                <Text style={styles.languageText}>{languages[selectedLang].name}</Text>
                <Animated.View style={{ transform: [{ rotate }] }}>
                    <Ionicons name="chevron-down" size={16} color="#666" />
                </Animated.View>
            </TouchableOpacity>

            {showLanguages && (
                <View style={styles.dropdownContent}>
                    {(Object.entries(languages) as [Language, { name: string; flag: string }][])
                        .filter(([code]) => code !== selectedLang)
                        .map(([code, { name, flag }]) => (
                            <TouchableOpacity
                                key={code}
                                style={styles.languageOption}
                                onPress={() => {
                                    setSelectedLang(code);
                                    toggleDropdown();
                                }}
                                activeOpacity={0.5}
                            >
                                <Text style={styles.flagEmoji}>{flag}</Text>
                                <Text style={styles.optionText}>{name}</Text>
                            </TouchableOpacity>
                        ))}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    dropdown: {
        position: 'absolute',
        right: 16,
        zIndex: 1000,
    },
    dropdownContent: {
        marginTop: 8,
        backgroundColor: 'white',
        borderRadius: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
        overflow: 'hidden',
    },
    languageButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    flagEmoji: {
        fontSize: 16,
        marginRight: 8,
    },
    languageOption: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f5f5f5',
    },
    languageText: {
        marginRight: 8,
        fontSize: 14,
        color: '#333',
        fontWeight: '500',
    },
    optionText: {
        fontSize: 14,
        color: '#666',
    },
});

export default LanguageDropdown;