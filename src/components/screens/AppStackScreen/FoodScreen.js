import React, { Component } from 'react'
import { Text, View, SafeAreaView, StyleSheet, TouchableOpacity, ActivityIndicator, AsyncStorage } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import { Container, Content } from 'native-base';

import { httpClient } from '../../../../HttpClient';
import qs from 'qs';

export class FoodScreen extends Component {

    constructor(props) {
        super(props)
        this.state = {
            foodData: [],
            isFetching: false
        }
        this.recordFood = this.recordFood.bind(this);
    }

    componentWillMount() {
        const { navigation } = this.props;
        const foodtypeId = navigation.getParam('FOODTYPE_ID');
        const date = navigation.getParam('DATE');
        console.log('date : ' + date)
        this.setState({ isFetching: true, date: date })
        httpClient
            .get('/food/' + foodtypeId)
            .then(res => {
                console.log('auth : ' + res.data.auth);
                console.log('data : ' + res.data.data);
                if (res.data.auth) {
                    setTimeout(() => {
                        this.setState({
                            foodData: res.data.data,
                            isFetching: false
                        })
                    }, 0)
                } else {
                    alert('Error : Cant find your token.')
                }
            })
    }

    async recordFood(foodId) {
        
        console.log('foodId : ' + foodId);
        const userId = await AsyncStorage.getItem('userId');
        const username = await AsyncStorage.getItem('username');
        const data = qs.stringify({
            foodId: foodId,
            userId: userId,
            username: username,
            date: this.state.date
        })

        httpClient
        .post('/record_food/',data)
        .then(res => {
            if (res.data.type == 'success'){
                console.log('navigate')
                this.props.navigation.popToTop();
            } else {
                alert( "Error : " + res.data.type )
            }
            
        })

    }

    componentWillUnmount() {
        
      }

    render() {
        return (
            <SafeAreaView style={styles.safeAreaContainer}>
                <Container>
                    <Content contentContainerStyle={{ flexGrow: 1 }}>
                        <View style={{ marginTop: 10 }}>
                            {
                                this.state.isFetching && <ActivityIndicator size="large" style={{ flex: 1, flexDirection: 'column', justifyContent: 'center'}} />
                            }
                            {
                                !this.state.isFetching && this.state.foodData.length ? (
                                    this.state.foodData.map((food, i) => {
                                        return <TouchableOpacity key={i} onPress={ () => this.recordFood(food.FOOD_ID)}>
                                            <View style={{ marginHorizontal: 10, marginVertical: 5, padding: 10, borderColor: 'transparent', borderWidth: 1, borderRadius: 5, backgroundColor: '#272C3511' }}>
                                                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                                                    <Text style={{ fontSize: 20, fontWeight: '400' }}> {food.FOOD_NAME} </Text>
                                                    <Text style={{ fontSize: 22, fontWeight: '400' }}>1</Text>
                                                    <Text style={{ fontSize: 20, fontWeight: '400' }}> {food.FOOD_UNIT} </Text>
                                                </View>
                                                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                                                    <Text style={{ fontSize: 14, fontWeight: '200', color: '#272C3599' }}> {food.FOODTYPE_NAME} </Text>
                                                    <Text style={{ fontSize: 14, fontWeight: '200', color: '#272C3599' }}> {food.FOOD_KCAL} แคลอรี่</Text>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    })
                                ) : null
                            }
                        </View>
                    </Content>
                </Container>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    safeAreaContainer: {
        flex: 1,
        backgroundColor: '#fff'
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
})

export default FoodScreen
