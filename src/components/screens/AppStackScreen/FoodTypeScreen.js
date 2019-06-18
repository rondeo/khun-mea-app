import React, { Component } from 'react'
import { Text, View, SafeAreaView, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native'
import { Container, Content } from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons'

import { httpClient } from '../../../../HttpClient';

export class FoodTypeScreen extends Component {

    constructor(props) {
        super(props)
        this.state = {
            foodTypeData: [],
            isFetching: false
        }
    }

    componentWillMount() {
        const { navigation } = this.props;
        const date = navigation.getParam('DATE');
        console.log('date : ' + date)
        this.setState({ isFetching: true, date: date })
        httpClient
            .get('/foodtypes')
            .then(res => {
                if (res.data.auth) {
                    setTimeout(() => {
                        this.setState({
                            foodTypeData: res.data.data,
                            isFetching: false
                        })
                    }, 0)
                } else {
                    alert('Error : Cant find your token.')
                }
            })
    }

    render() {

        return (
            <SafeAreaView style={styles.safeAreaContainer}>

                <Container>
                    <Content contentContainerStyle={{ flexGrow: 1 }}>
                        {
                            this.state.isFetching && <ActivityIndicator size="large" style={{flex:1, flexDirection:'column', justifyContent: 'center'}} />
                        }
                        {
                            !this.state.isFetching && this.state.foodTypeData.length ? (
                                this.state.foodTypeData.map((foodtype, i) => {
                                    return <TouchableOpacity key={i} onPress={() => this.props.navigation.navigate('Food',{ 'FOODTYPE_ID' : foodtype.FOODTYPE_ID, 'DATE': this.state.date })}>
                                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10, borderBottomWidth: .5, borderColor: '#272C3555' }}>
                                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                                <View>
                                                    <Icon name='ios-restaurant' size={47} />
                                                </View>
                                                <View style={{ flexDirection: 'column', paddingLeft: 15 }}>
                                                    <Text style={{ fontSize: 18, fontWeight: '400' }}> {foodtype.FOODTYPE_NAME} </Text>
                                                </View>
                                            </View>
                                            <View>
                                                <Icon name='ios-arrow-forward' size={30} color='#272C35' />
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                })
                            ) : null
                        }
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



export default FoodTypeScreen;
