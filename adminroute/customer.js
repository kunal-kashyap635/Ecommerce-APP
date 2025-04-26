import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput, ActivityIndicator, Alert } from 'react-native';
import axios from 'axios';
import { getAuthToken } from './usetoken';
import { myip } from '../myip';
import * as SecureStore from "expo-secure-store";

const Customer = ({ navigation }) => {

  // fetching accesstkn to get started for it
  const [accesstkn, setAccesstkn] = useState('');

  // getting accesstoken
  async function Token() {
    try {
      const token = await SecureStore.getItemAsync('authToken');
      if (token) {
        setAccesstkn(token);
      } else {
        console.log("No Token found");
      }
    } catch (error) {
      console.error('Error retrieving token', error);
    }
  }

  // condition for checking if admin logged or not and getting authorized token
  useEffect(() => {
    getAuthToken(SecureStore, navigation);
    Token();
  }, []);

  // hook to store data received from server
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true);

  // function to convert data into desired format
  const desireddata = (data) => {

    const customers = {};

    data.forEach((item) => {
      if (! customers[item.id]) {
        customers[item.id] = {
          id: item.id,
          name: item.name,
          email: item.email,
          phone: item.phone,
          address: item.address,
          orders: []
        };
      }
      customers[item.id].orders.push({
        id: item.oid,
        date: item.odate,
        total: item.payamt,
      });

    });

    return Object.values(customers);
  }

  // Mock data - replace with your actual API call
  useEffect(() => {

    const api_url = `${myip}/customer.php`;

    const formdata = new FormData();
    formdata.append('tkn', accesstkn);

    axios.post(`${api_url}`, formdata , {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
      .then(response => {
        console.log(response.data);
        if (response.data.status === 'success') {
          setTimeout(() => {
            setCustomers(desireddata(response.data.customerdata));
            setFilteredCustomers(desireddata(response.data.customerdata));
            setLoading(false);
          }, 1000);
        }

      })
      .catch(error => {
        console.error(error);
      });
  }, [accesstkn]);

  // Search functionality
  useEffect(() => {
    if (searchText === '') {
      setFilteredCustomers(customers);
    } else {
      const filtered = customers.filter((customer) =>
        customer.name.toLowerCase().includes(searchText.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchText.toLowerCase()) ||
        customer.phone.includes(searchText)
      );
      setFilteredCustomers(filtered);
    }
  }, [searchText, customers]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Customer Panel</Text>
      <TextInput
        style={styles.searchInput}
        placeholder="Search customers..."
        value={searchText}
        onChangeText={(text) => setSearchText(text)}
      />

      <FlatList
        data={filteredCustomers}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.customerItem} onPress={() => navigation.navigate('customerdetails', item)}>
            <Text style={styles.customerName}>{item.name}</Text>
            <Text style={styles.customerEmail}>{item.email}</Text>
            <Text style={styles.customerPhone}>{item.phone}</Text>
            <Text style={styles.orderCount}>Orders: {item.orders.length}</Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

export default Customer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'gray',
    textAlign: 'center',
    marginVertical: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  listContainer: {
    paddingBottom: 20,
  },
  customerItem: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 5,
    elevation: 2,
  },
  customerName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  customerEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  customerPhone: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  orderCount: {
    fontSize: 14,
    color: '#2ecc71',
    fontWeight: '500',
  },
});