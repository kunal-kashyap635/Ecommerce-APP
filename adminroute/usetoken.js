import { Alert } from 'react-native';

export async function getAuthToken(SecureStore, navigation) {
    try {
        const token = await SecureStore.getItemAsync('authToken');
        const aid = await SecureStore.getItemAsync('adminid');
        if (token && aid) {
            Alert.alert('Token Retrieved', token);
        } else {
            // Alert.alert('No Token', 'No authentication token found');
            navigation.navigate('adminlogin');
        }
    } catch (error) {
        console.error('Error retrieving token', error);
        Alert.alert('Error', 'Failed to retrieve authentication token');
    }
}
