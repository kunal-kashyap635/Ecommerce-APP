import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import Entypo from '@expo/vector-icons/Entypo';
import Octicons from '@expo/vector-icons/Octicons';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { myip } from '../myip';

const Adminlogin = ({ navigation }) => {

    const [emailfocus, setEmailfocus] = useState(false);
    const [passwordfocus, setPasswordfocus] = useState(false);
    const [showpassword, setShowpassword] = useState(false);

    //hook to store the data.
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // hook to store the data in the secure store.
    const [authtoken, setAuthtoken] = useState('');

    // hook to store userid
    const [adminid, setAdminid] = useState('');

    // function to save auth token securely.
    const saveAuthToken = async (ctoken, cadminid) => {
        try {
            const token = ctoken;
            const id = cadminid;
            await SecureStore.setItemAsync('authToken', token);
            await SecureStore.setItemAsync('adminid', id);
            setAuthtoken(token);
            setAdminid(id);
            Alert.alert('Success', 'Authentication token saved securely!');
        } catch (error) {
            console.error('Error saving token', error);
            Alert.alert('Error', 'Failed to save authentication token');
        }
    };

    useEffect(() => {
        console.log(authtoken);
        console.log(adminid);
    }, [authtoken])

    // function to send the data to the server.
    const handellogin = () => {
        const api_url = `${myip}/adminlogin.php`;

        if (email == '') {
            alert('Email is required');
            return;
        }

        else if (password == '' || password.length < 6) {
            alert('Password is required & have atleast 6 characters');
            return;
        }

        else {
            const formdata = new FormData();
            formdata.append('email', email);
            formdata.append('password', password);

            axios.post(`${api_url}`, formdata, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
                .then((response) => {
                    console.log(response.data);
                    if (response.data.status === 'success') {
                        alert('Login Successfull...');
                        setEmail('');
                        setPassword('');
                        saveAuthToken(response.data.token, response.data.adminid);
                        navigation.navigate('dashboard', {
                            token: response.data.token,
                        });
                    } else {
                        alert('Invalid Credentials...');
                    }
                })
                .catch((error) => {
                    console.log(error);
                })
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.head1}>LOG IN</Text>
            <View style={styles.inputout}>
                <Entypo name="email" size={30} color={emailfocus === true ? 'red' : 'grey'} />
                <TextInput style={styles.input} placeholder='Email..' onFocus={() => {
                    setEmailfocus(true);
                    setPasswordfocus(false);
                }}
                    onChangeText={(text) => setEmail(text)}
                    value={email}
                />
            </View>

            <View style={styles.inputout}>
                <Entypo name="lock" size={30} color={passwordfocus === true ? 'red' : 'grey'} />
                <TextInput style={styles.input} placeholder='Password..' secureTextEntry={showpassword === false ? true : false}
                    onFocus={() => {
                        setEmailfocus(false);
                        setPasswordfocus(true);
                    }}
                    onChangeText={(text) => setPassword(text)}
                    value={password}
                />
                <Octicons name={showpassword === false ? 'eye-closed' : 'eye'} size={24} color="black" onPress={
                    () => { setShowpassword(!showpassword) }
                } style={{ position: 'absolute', right: 10, marginRight: 5 }} />
            </View>

            <TouchableOpacity style={styles.btn1} onPress={() => handellogin()}>
                <Text style={{ color: 'white', fontSize: 30, fontWeight: 'bold' }}>Sign In</Text>
            </TouchableOpacity>
        </View>
    )
}

export default Adminlogin

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        alignItems: 'center',
        // justifyContent: 'center',
        width: '100%',
        height: '100%',
    },
    head1: {
        fontSize: 40,
        color: 'red',
        textAlign: 'center',
        marginVertical: 10,
    },
    inputout: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 10,
        width: '90%',
        marginVertical: 10,
        elevation: 20,
    },
    input: {
        fontSize: 20,
        marginleft: 10,
        width: '100%',
        height: 50,
        marginleft: 10,
    },
    btn1: {
        width: '90%',
        height: 50,
        backgroundColor: 'red',
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 10,
        color: 'white',
        marginBottom: 10,
    },
})