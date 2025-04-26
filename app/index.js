import React from 'react';
import { NavigationContainer, NavigationIndependentTree } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RecoilRoot } from 'recoil';

// customer screen
import Loginscreen from '../src/loginsignupscreen/loginscreen';
import Welcomescreen from '../src/loginsignupscreen/welcomescreen';
import Signupscreen from '../src/loginsignupscreen/signupscreen';
import Homescreen from '../src/homescreen';
import Product from '../src/product';
import Wishlist from '../src/wishlist';
import Cart from '../src/cart';
import Forgetpassword from '../src/loginsignupscreen/forgetpassword';
import Updateprofile from '../src/updateprofile';
import Checkout from '../src/checkout';
import Orderpage from '../src/orderpage';
import Orders from '../src/orders';

// Admin screen
import Adminlogin from '../adminroute/adminlogin';
import Dashboard from '../adminroute/dashboard';
import Addproduct from '../adminroute/addproduct';
import Updateproduct from '../adminroute/updateproduct';
import Deleteproduct from '../adminroute/deleteproduct';
import Category from '../adminroute/category';
import Seeorder from '../adminroute/seeorder';
import Orderdetails from '../adminroute/orderdetails';
import Customer from '../adminroute/customer';
import Customerdetails from '../adminroute/customerdetails';
import Editproduct from '../adminroute/editproduct';

// for creating stack navigation we need this
const Stack = createNativeStackNavigator();

const Index = () => {
  return (
    <RecoilRoot>
      <NavigationIndependentTree>
        <NavigationContainer>
          <Stack.Navigator initialRouteName='Welcomescreen'>
            <Stack.Screen name="Welcomescreen" component={Welcomescreen} options={{ headerShown: false }} />
            <Stack.Screen name="Loginscreen" component={Loginscreen} options={{ headerShown: false }} />
            <Stack.Screen name="Signupscreen" component={Signupscreen} options={{ headerShown: false }} />
            <Stack.Screen name="Homescreen" component={Homescreen} options={{ headerShown: false }} />
            <Stack.Screen name="product" component={Product} options={{ headerShown: false }} />
            <Stack.Screen name="wishlist" component={Wishlist} options={{ headerShown: false }} />
            <Stack.Screen name="cart" component={Cart} options={{ headerShown: false }} />
            <Stack.Screen name="forgetpassword" component={Forgetpassword} options={{ headerShown: false }} />
            <Stack.Screen name="update" component={Updateprofile} options={{ headerShown: false }} />
            <Stack.Screen name="checkout" component={Checkout} options={{ headerShown: false }} />
            <Stack.Screen name="orderpage" component={Orderpage} options={{ headerShown: false }} />
            <Stack.Screen name="orders" component={Orders} options={{ headerShown: false }} />

            {/* Admin Screen  */}
            <Stack.Screen name="adminlogin" component={Adminlogin} options={{
              title: 'Welcome To Admin Login Panel....',
              headerStyle: {
                backgroundColor: '#42f5b0',
              },
              headerTintColor: 'black',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
              headerTitleAlign: 'center',
            }} />
            <Stack.Screen name="dashboard" component={Dashboard} options={{
              title: 'Welcome To Dashboard....',
              headerStyle: {
                backgroundColor: '#42f5b0',
              },
              headerTintColor: 'black',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
              headerTitleAlign: 'center',
            }} />
            <Stack.Screen name="viewproduct" component={Addproduct} options={{ headerShown: false }} />
            <Stack.Screen name="category" component={Category} options={{ headerShown: false }} />
            <Stack.Screen name="updateproduct" component={Updateproduct} options={{ headerShown: false }} />
            <Stack.Screen name="deleteproduct" component={Deleteproduct} options={{ headerShown: false }} />
            <Stack.Screen name="order" component={Seeorder} options={{ headerShown: false }} />
            <Stack.Screen name="orderdetails" component={Orderdetails} options={{ headerShown: false }} />
            <Stack.Screen name="customer" component={Customer} options={{ headerShown: false }} />
            <Stack.Screen name="customerdetails" component={Customerdetails} options={{ headerShown: false }} />
            <Stack.Screen name="editproduct" component={Editproduct} options={{ headerShown: false }} />
          </Stack.Navigator>
        </NavigationContainer>
      </NavigationIndependentTree>
    </RecoilRoot>
  )
}

export default Index
