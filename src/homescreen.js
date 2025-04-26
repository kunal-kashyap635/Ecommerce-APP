import React from 'react';
import { ScrollView, StyleSheet, FlatList } from 'react-native';
import Topnavigation from '../src/component/topnavigation';
import Headnavigation from '../src/component/headnavigation';
import Category from '../src/component/category';
import Cartdata from '../src/component/cartslider';
import Bottomnav from '../src/component/bottomnav';

const Homescreen = ({ navigation }) => {

    const components = [
        <Topnavigation key="topnav" navigation={navigation} />,
        <Headnavigation key="headnav" />,
        <Category key="category" />,
        <Cartdata key="cartdata" navigation={navigation} />,
        <Bottomnav key="bottomnav" style={styles.bottomnav} navigation={navigation} />
    ];
    
    return (
        
        // <ScrollView style={styles.container} showsVerticalScrollIndicator={false} >
        //     <Topnavigation navigation={navigation} />
        //     <Headnavigation />
        //     <Category />
        //     <Cartdata navigation={navigation} />
        //     <Bottomnav style={styles.bottomnav} navigation={navigation} />
        // </ScrollView>

        <FlatList
            data={components}
            renderItem={({ item }) => item}
            keyExtractor={(item) => item.key} // use the component's key
            style={styles.container}
            showsVerticalScrollIndicator={false}
        />
    )
}

export default Homescreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        width: '100%',
    },
    bottomnav: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        backgroundColor: 'white',
        zIndex: 20,
    },
})