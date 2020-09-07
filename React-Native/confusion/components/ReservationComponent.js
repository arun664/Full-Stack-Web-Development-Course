import React, { Component } from 'react';
import { Text, View, StyleSheet, Picker, Switch, Button, ScrollView, Alert } from 'react-native';
import DateTimePicker from "@react-native-community/datetimepicker";
import * as Animatable from 'react-native-animatable';
import * as Permissions from 'expo-permissions';
import * as Notifications from 'expo-notifications';
import * as Calendar from 'expo-calendar';

class Reservation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      guests: 1,
      smoking: false,
      date: new Date(),
      show: false,
      mode: 'date'
    };
    this.resetForm = this.resetForm.bind(this);
    this.presentLocalNotification = this.presentLocalNotification.bind(this);
  }

  static navigationOptions = {
    title: "Reserve Table",
  };

  async obtainNotificationPermission() {
    const { status, expires, permissions } = await Permissions.getAsync(
        Permissions.USER_FACING_NOTIFICATIONS
      );
      if (status !== 'granted') {
        alert('Hey! You have not enabled selected permissions');
      }
      return permissions;
  }

  async obtainCalendarPermission() {
    const { status, expires, permissions } = await Permissions.askAsync(
      Permissions.CALENDAR
    );
    if (status !== 'granted') {
      alert('Hey! You have not enabled selected permissions');
    }
    return permissions;
  }

  addReservationToCalendar = async ( date ) => {
    await this.obtainCalendarPermission()

    const defaultCalendarSource = Platform.OS === 'ios' ?
        await getDefaultCalendarSource()
        : { isLocalAccount: true, name: 'Expo Calendar' };

    const tempDate = Date.parse(date)
    const startDate = new Date(tempDate)
    const endDate = new Date(tempDate + 2 * 60 * 60 * 1000)

    const calendarID = await Calendar.createCalendarAsync({
        title: 'Expo Calendar',
        color: 'blue',
        entityType: Calendar.EntityTypes.EVENT,
        sourceId: defaultCalendarSource.id,
        source: defaultCalendarSource,
        name: 'internalCalendarName',
        ownerAccount: 'personal',
        accessLevel: Calendar.CalendarAccessLevel.OWNER,
    })

    await Calendar.createEventAsync(calendarID, {
        title: 'Con Fusion Table Reservation',
        startDate: startDate,
        endDate: endDate,
        timeZone: 'Asia/Hong_Kong',
        location: '121, Clear Water Bay Road, Clear Water Bay, Kowloon, Hong Kong'
    })
}


  async presentLocalNotification(date) {
      await this.obtainNotificationPermission();
      Notifications.presentNotificationAsync({
          title: 'Your Reservation',
          body: 'Reservation for '+ date + ' requested',
          ios: {
              sound: true
          },
          android: {
              sound: true,
              vibrate: true,
              color: '#512DA8'
          }
      });
  }

  handleReservation() {
    Alert.alert(
      "Your Reservation OK ?",
      "Number of Guests" +
        this.state.guests +
        "\n" +
        "Smoking?" +
        this.state.smoking +
        "\n" +
        "Date and Time: " +
        this.state.date,
      [
        {
          text: "Cancel",
          onPress: () => {
            this.resetForm();
          },
        },
        {
          text: "OK",
          onPress: () => {
            this.presentLocalNotification(this.state.date);
            this.addReservationToCalendar(this.state.date);
            this.resetForm();
          },
        },
      ],
      { cancelable: false }
    );
  }

  resetForm() {
    this.setState({
      guests: 1,
      smoking: false,
      date: new Date(),
      showModal: false,
      mode: "date",
      show: false,
    });
  }

  render() {
    return (
      <ScrollView>
        <Animatable.View animation="zoomIn" duration={1000} delay={500}>
          <View style={styles.formRow}>
            <Text style={styles.formLabel}>Number of Guests</Text>
            <Picker
              style={styles.formItem}
              selectedValue={this.state.guests}
              onValueChange={(itemValue, itemIndex) =>
                this.setState({ guests: itemValue })
              }
            >
              <Picker.Item label="1" value="1" />
              <Picker.Item label="2" value="2" />
              <Picker.Item label="3" value="3" />
              <Picker.Item label="4" value="4" />
              <Picker.Item label="5" value="5" />
              <Picker.Item label="6" value="6" />
            </Picker>
          </View>
          <View style={styles.formRow}>
            <Text style={styles.formLabel}>Smoking/Non-Smoking?</Text>
            <Switch
              style={styles.formItem}
              value={this.state.smoking}
              trackColor="#512DA8"
              onValueChange={(value) => this.setState({ smoking: value })}
            ></Switch>
          </View>
          <View style={styles.formRow}>
            <Text style={styles.formLabel}>Date and Time</Text>
            <View>
                    <Button onPress={() => this.setState({show: true})} color="#512DA8" title="Select Date and Time" />
                </View>
              {this.state.show && (
                <DateTimePicker
                value={this.state.date}
                mode={this.state.mode}
                display="default"
                minimumDate={new Date()}
                onChange={(selected, value) => {
                    if (value !== undefined) {
                    this.setState({
                        show: this.state.mode === "time" ? false : true,
                        mode: "time",
                        date: new Date(selected.nativeEvent.timestamp),
                    });
                    } else {
                    this.setState({ show: false, mode: "date" });
                    }
                  }}
                  />
                )} 
          </View>
          <View style={styles.formRow}>
            <Button
              onPress={() => this.handleReservation()}
              title="Reserve"
              color="#512DA8"
              accessibilityLabel="Learn more about this purple button"
            />
          </View>
        </Animatable.View>
      </ScrollView>
    );
  }
};

const styles = StyleSheet.create({
    formRow: {
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
      flexDirection: 'row',
      margin: 20
    },
    formLabel: {
        fontSize: 18,
        flex: 2
    },
    formItem: {
        flex: 1
    }
});

export default Reservation;