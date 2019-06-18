import React, { Component } from 'react'
import { Text, View, SafeAreaView, StyleSheet, TouchableOpacity, ActivityIndicator, AsyncStorage } from 'react-native'
import { Container, Content } from 'native-base'
import Icon from 'react-native-vector-icons/Ionicons'

import { httpClient } from '../../../../../HttpClient';

export class RecordScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            recordFoodData: [],
            isFetching: false
        }
        this.toDate = this.toDate.bind(this);
        this.loadRecord = this.loadRecord.bind(this)
    }

    toDate(date) {
        var months = ['0', 'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤษจิกายน', 'ธันวาคม'];
        var d = date.split("-");
        var formatDate = d[2] + " " + months[d[1]] + " " + (parseInt(d[0]) + 543);
        return (formatDate);
    }

    componentWillMount() {
        this.loadRecord()
    }

    componentDidMount() {
        this.loadRecord();
        this.willFocusSubscription = this.props.navigation.addListener(
            'willFocus',
            () => {
                this.loadRecord();
            }
        );
    }

    componentWillUnmount() {
        this.willFocusSubscription.remove();
    }

    async loadRecord() {
        const userId = await AsyncStorage.getItem('userId');
        httpClient
            .get('/get_record_foods/' + userId)
            .then(res => {
                console.log(JSON.stringify(res.data))
                if (res.data.auth) {
                    setTimeout(() => {
                        this.setState({
                            recordFoodData: res.data.data,
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
                    <Content>
                        <View>
                            <Text style={{ fontSize: 35, fontWeight: 'bold', textAlign: 'right', padding: 10 }}>
                                บันทึกอาหาร
                        </Text>
                            <Text style={{ marginTop: 5, marginBottom: 10, textAlign: 'center', fontSize: 16, fontWeight: '200', color: '#FF6369' }}>
                                คุณแม่ควรได้รับพลังงาน 1700 - 2000 แคลอรี่ต่อวัน
                    </Text>
                        </View>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('AddRecord')}>
                            <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', padding: 10, borderWidth: 2, borderColor: '#272C3555', borderStyle: 'dashed', borderRadius: 5, margin: 15 }}>
                                <Icon name='ios-add-circle-outline' size={35} color='#272C3599' />
                                <Text style={{ fontSize: 18, fontWeight: '400', color: '#272C3599' }}>สร้างรายการบันทึก</Text>
                            </View>
                        </TouchableOpacity>

                        {
                            this.state.isFetching && <ActivityIndicator size="large" style={{ flex: 1, flexDirection: 'column', justifyContent: 'center' }} />
                        }
                        {
                            !this.state.isFetching && this.state.recordFoodData.length ? (
                                this.state.recordFoodData.map((record, i) => {
                                    return <TouchableOpacity key={i} onPress={() => this.props.navigation.navigate('RecordDetail', { DATE: record.RECORD_DATE, SUM_KCAL: record.SUM_KCAL, DATE_FORMAT: this.toDate(record.RECORD_DATE) })}>
                                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10, borderBottomWidth: .5, borderColor: '#272C3555' }}>
                                            <View style={{ flexDirection: 'row' }}>
                                                <View>
                                                    <Icon name='ios-restaurant' size={47} />
                                                </View>
                                                <View style={{ flexDirection: 'column', paddingLeft: 15 }}>
                                                    <Text style={{ fontSize: 18, fontWeight: '400' }}> {this.toDate(record.RECORD_DATE)} </Text>
                                                    <Text style={{ fontSize: 16, color: '#272C3599' }}> {record.SUM_KCAL} แคลอรี่</Text>
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

export default RecordScreen
