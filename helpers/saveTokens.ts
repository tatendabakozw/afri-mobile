import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveTokens = async (accessToken: string, jwt: string, refreshToken: string): Promise<void> => {
    try {
        await AsyncStorage.setItem('accessToken', accessToken);
        await AsyncStorage.setItem('jwt', jwt);
        await AsyncStorage.setItem('refreshToken', refreshToken);
        // console.log('Tokens saved:', { accessToken, jwt, refreshToken });
    } catch (error) {
        console.error('Failed to save tokens:', error);
    }
};