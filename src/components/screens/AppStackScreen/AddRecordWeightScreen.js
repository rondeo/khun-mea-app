import React, { Component } from 'react'
import { Text, View, SafeAreaView, StyleSheet, TextInput, TouchableOpacity, Alert, AsyncStorage } from 'react-native'
import { Container, Content, Root, Toast } from 'native-base'
import CalendarStrip from 'react-native-calendar-strip';

import moment from 'moment';
import { httpClient } from '../../../../HttpClient';
import qs from 'qs'

export class AddRecordWeightScreen extends Component {

  constructor() {
    super()
    this.state = {
      showToast: false,
      selectedDate: moment(new Date()).format("YYYY-MM-DD hh:mm:ss"),
      recordWeightData: [],
      isFetching: false
    };

    this.recordWeight = this.recordWeight.bind(this);
    this.confirmRecord = this.confirmRecord.bind(this);
    this.toDate = this.toDate.bind(this);
    this.loadRecord = this.loadRecord.bind(this)
  }

  componentDidMount() {
    this.loadRecord();
  }

  toDate(date) {
    var months = ['0', 'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤษจิกายน', 'ธันวาคม'];
    var d = date.split("-");
    var day = d[2].split(" ")
    var formatDate = day[0] + " " + months[d[1]] + " " + (parseInt(d[0]) + 543);
    return (formatDate);
  }

  async loadRecord() {
    const userId = await AsyncStorage.getItem('userId');
    httpClient
      .get('/get_record_weight/' + userId)
      .then(res => {
        console.log('record weight : ' + JSON.stringify(res.data))
        if (res.data.auth) {
          setTimeout(() => {
            this.setState({
              recordWeightData: res.data.data,
              isFetching: false
            })

          }, 0)
        } else {
          alert('Error : Cant find your token.')
        }
      })
  }

  confirmRecord() {
    Alert.alert(
      'ยืนยันการบันทึก',
      'บันทึกน้ำหนัก ' + this.state.weight + ' กิโลกรัม \n วันที่ ' + this.toDate(this.state.selectedDate),
      [
        { text: 'ยกเลิก', onPress: () => console.log('cancel record weight'), style: 'cancel' },
        { text: 'บันทึก', onPress: () => this.recordWeight(this.state.weight, this.state.selectedDate) },
      ]
    );
  }

  async recordWeight(weight, date) {

    console.log('weight : ' + weight + '\n' + 'date : ' + date)
    const userId = await AsyncStorage.getItem('userId');
    const username = await AsyncStorage.getItem('username');

    const data = qs.stringify({
      weight: weight,
      userId: userId,
      username: username,
      date: this.state.selectedDate
    })

    httpClient
      .post('/record_weight/', data)
      .then(res => {
        if (res.data.type == 'success') {
          console.log('navigate')
          this.props.navigation.popToTop();
        } else {
          alert("Error : " + res.data.type)
        }

      })

  }

  render() {
    return (
      <Root>
        <SafeAreaView style={styles.safeAreaContainer}>
          <Container>
            <Content>
              <View>
                <CalendarStrip
                  calendarAnimation={{ type: 'sequence', duration: 30 }}
                  daySelectionAnimation={{ type: 'border', duration: 200, borderWidth: 1, borderHighlightColor: '#272C35' }}
                  style={{ height: 100, paddingTop: 20, paddingBottom: 10 }}
                  calendarHeaderStyle={{ color: '#272C35' }}
                  calendarColor={'#fff'}
                  dateNumberStyle={{ color: '#272C35' }}
                  dateNameStyle={{ color: '#272C35' }}
                  highlightDateNumberStyle={{ color: '#272C35' }}
                  highlightDateNameStyle={{ color: '#272C35' }}
                  disabledDateNameStyle={{ color: 'grey' }}
                  disabledDateNumberStyle={{ color: 'grey' }}
                  iconContainer={{ flex: 0.1 }}
                  onDateSelected={(value) => this.setState({ selectedDate: moment(new Date(value)).format("YYYY-MM-DD hh:mm:ss") })}
                />
              </View>
              {/* <Text> Date : { this.state.selectedDate } </Text> */}
              <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', margin: 10, borderColor: '#272C35', borderWidth: 1, borderRadius: 5 }}>
                <View style={{ justifyContent: 'center', padding: 10 }}>
                  <TextInput
                    autoFocus
                    placeholder='กรอกน้ำหนัก'
                    style={{ flex: 1, fontSize: 34, fontWeight: '200' }}
                    keyboardType='numeric'
                    maxLength={6}
                    underlineColorAndroid="transparent"
                    onChangeText={(weight) => this.setState({ weight })}
                  />
                  <Text style={{ flex: 1, fontSize: 24, fontWeight: '200', textAlign: 'right' }}>กิโลกรัม</Text>
                </View>
                <View style={{ justifyContent: 'center', backgroundColor: '#272C35', }}>
                  <TouchableOpacity onPress={this.confirmRecord}>
                    <Text style={{ flex: 1, fontWeight: '200', fontSize: 20, padding: 30, color: '#fff' }}>
                      บันทึก
                </Text>
                  </TouchableOpacity>
                </View>
              </View>
              {
                this.state.isFetching && <ActivityIndicator size="large" style={{ flex: 1, flexDirection: 'column', justifyContent: 'center' }} />
              }
              {
                !this.state.isFetching && this.state.recordWeightData.length ? (
                  this.state.recordWeightData.reverse().map((recordWeight, i) => {
                    return <View key={i} style={{ flexDirection: 'column', paddingLeft: 15 }}>
                      <Text style={{ fontSize: 18, fontWeight: '400' }}> { this.toDate(recordWeight.RECORD_DATE) } </Text>
                      <Text style={{ fontSize: 16, color: '#272C3599' }}> { recordWeight.RECORD_VALUE } กิโลกรัม</Text>
                    </View>
                  })
                ) : null
              }
            </Content>
          </Container>
        </SafeAreaView>
      </Root>


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

export default AddRecordWeightScreen
