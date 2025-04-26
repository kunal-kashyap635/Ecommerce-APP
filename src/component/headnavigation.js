import React, { useEffect, useState } from 'react';
import { StyleSheet, View, TextInput, FlatList, SafeAreaView, Text } from 'react-native';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import AntDesign from '@expo/vector-icons/AntDesign';
import axios from 'axios';
import { myip } from '@/myip';

const Headnavigation = () => {
    const [prod, setProd] = useState([]);
    const [search, setSearch] = useState('');

    const api_url = `${myip}/getproduct.php`;
    useEffect(() => {
        axios.post(`${api_url}`)
            .then(response => {
                // console.log(response);  // In response there is key i.e data and data value is array of objects.
                // console.log(response.data); 
                setProd(response.data);
            })
            .catch(error => {
                console.error(error);
            });
    }, []);

    // console.log(prod);

    return (
        <View style={styles.container}>
            <View style={styles.searchbox}>
                <FontAwesome5 name="search" size={30} style={styles.searchicon} />
                <TextInput placeholder='Search....' style={styles.input} onChangeText={(text) => { setSearch(text) }} />
            </View>
            {
                search != '' &&
                <SafeAreaView>
                    <View style={styles.searchresultouter}>
                        <FlatList style={styles.searchresultinner}
                            data={prod}
                            renderItem={({ item }) => {
                                if (search && item.product_name.toLowerCase().includes(search.toLocaleLowerCase())) {
                                    return (
                                        <View style={styles.searchresult}>
                                            <AntDesign name="arrowright" size={24} color="black" />
                                            <Text style={styles.searchresulttext}>{item.product_name}</Text>
                                        </View>
                                    )
                                }
                            }}
                        />
                    </View>
                </SafeAreaView>
            }
        </View>
    )
}

export default Headnavigation

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
    },
    searchbox: {
        flexDirection: 'row',
        width: '90%',
        backgroundColor: 'white',
        borderRadius: 30,
        alignItems: 'center',
        padding: 10,
        margin: 20,
        elevation: 10,
    },
    input: {
        marginLeft: 10,
        width: '90%',
        fontSize: 18,
        color: 'red',
    },
    searchicon: {
        color: 'red',
    },
    searchresultouter: {
        width: '100%',
        marginHorizontal: 30,
        height: '100%',
        backgroundColor: 'white',
    },
    searchresultinner: {
        width: '100%',
    },
    searchresult: {
        width: '100%',
        flexDirection: 'row',
        alignContent: 'center',
        padding: 5,
    },
    searchresulttext: {
        marginLeft: 10,
        fontSize: 20,
        color: 'red',
    },
})
