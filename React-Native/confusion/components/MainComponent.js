import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { View, Text, Image, StyleSheet, SafeAreaView } from 'react-native';
import {Icon} from 'react-native-elements';
import Login from './LoginComponent';
import Menu from './MenuComponent';
import Home from './HomeComponent'
import Dishdetail from './DishdetailComponent';
import Contact from './ContactComponent';
import About from './AboutComponent';
import Favorite from './FavoriteComponent';
import Reservation from './ReservationComponent';
import { connect } from 'react-redux';
import { fetchDishes, fetchComments, fetchPromos, fetchLeaders } from '../redux/ActionCreators';

const mapStateToProps = state => {
  return {
    dishes: state.dishes,
    comments: state.comments,
    promotions: state.promotions,
    leaders: state.leaders
  }
}

const mapDispatchToProps = dispatch => ({
  fetchDishes: () => dispatch(fetchDishes()),
  fetchComments: () => dispatch(fetchComments()),
  fetchPromos: () => dispatch(fetchPromos()),
  fetchLeaders: () => dispatch(fetchLeaders()),
})

const MenuNavigator = createStackNavigator();
function MenuNavigatorScreen(){
    return(
        <MenuNavigator.Navigator
        InitialRoutename='Menu'
        screenOptions={{
            headerStyle: {
                backgroundColor: "#512DA8"
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
                color: "#fff"            
            }
        }}>
            <MenuNavigator.Screen
                name="Menu"
                component={Menu}
            />
            <MenuNavigator.Screen
                name="Dishdetail"
                component={Dishdetail}
                options={{ headerTitle: "Dish Detail"}}
            />
        </MenuNavigator.Navigator>
    );
}


const LoginNavigator = createStackNavigator();

function LoginNavigatorScreen(){
    return(
        <LoginNavigator.Navigator
        InitialRoutename='Login'
        screenOptions={{
            headerStyle: {
                backgroundColor: "#512DA8"
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
                color: "#fff"            
            }
        }}>
            <LoginNavigator.Screen
                name="Login"
                component={Login}
            />
        </LoginNavigator.Navigator>
    );
}

const HomeNavigator = createStackNavigator();

function HomeNavigatorScreen(){
    return(
        <HomeNavigator.Navigator
        InitialRoutename='Home'
        screenOptions={{
            headerStyle: {
                backgroundColor: "#512DA8"
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
                color: "#fff"            
            }
        }}>
            <MenuNavigator.Screen
                name="Home"
                component={Home}
            />
        </HomeNavigator.Navigator>
    );
}

const ContactNavigator = createStackNavigator();

function ContactNavigatorScreen(){
    return(
        <ContactNavigator.Navigator
        InitialRoutename='Contact'
        screenOptions={{
            headerStyle: {
                backgroundColor: "#512DA8"
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
                color: "#fff"            
            }
        }}>
            <ContactNavigator.Screen
                name="Contact"
                component={Contact}
            />
        </ContactNavigator.Navigator>
    );
}

const FavoriteNavigator = createStackNavigator();

function FavoriteNavigatorScreen(){
    return(
        <FavoriteNavigator.Navigator
        InitialRoutename='Favorites'
        screenOptions={{
            headerStyle: {
                backgroundColor: "#512DA8"
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
                color: "#fff"            
            }
        }}>
            <FavoriteNavigator.Screen
                name="My Favorites"
                component={Favorite}
            />
        </FavoriteNavigator.Navigator>
    );
}

const AboutNavigator = createStackNavigator();

function AboutNavigatorScreen(){
    return(
        <AboutNavigator.Navigator
        InitialRoutename='About'
        screenOptions={{
            headerStyle: {
                backgroundColor: "#512DA8"
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
                color: "#fff"            
            }
        }}>
            <AboutNavigator.Screen
                name="About"
                component={About}
            />
        </AboutNavigator.Navigator>
    );
}

const ReservationNavigator = createStackNavigator();

function ReservationNavigatorScreen(){
    return(
        <ReservationNavigator.Navigator
        InitialRoutename='Reservation'
        screenOptions={{
            headerStyle: {
                backgroundColor: "#512DA8"
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
                color: "#fff"            
            }
        }}>
            <ReservationNavigator.Screen
                name="Reservation"
                component={Reservation}
            />
        </ReservationNavigator.Navigator>
    );
}


function CustomDrawerContentComponent(props) {
    return(
        <DrawerContentScrollView {...props}>
        <SafeAreaView style={styles.container} forceInset={{ top: 'always', horizontal: 'never' }}>
          <View style={styles.drawerHeader}>
            <View style={{flex:1}}>
            <Image source={require('./images/logo.png')} style={styles.drawerImage} />
            </View>
            <View style={{flex: 2}}>
              <Text style={styles.drawerHeaderText}>Ristorante Con Fusion</Text>
            </View>
          </View>
          </SafeAreaView>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>  
    );
}



const Drawer=createDrawerNavigator();

function MainNavigator({ navigation }) {
    return(

        <Drawer.Navigator 
        initialRouteName="Home"
        drawerContent={(props) => <CustomDrawerContentComponent {...props}/>}>
           <Drawer.Screen 
            name="Login"
            options={{drawerIcon: ({ tintColor, focused }) => (
                <Icon
                    name='menu'
                    iconStyle={{color:'black'}}          
                    size={24}
                    color={tintColor}
                />
                )}}
            component={LoginNavigatorScreen} 
            />
          <Drawer.Screen 
            name="Home"
            options={{drawerIcon: ({ tintColor, focused }) => (
                <Icon
                  name='home'
                  type='font-awesome'            
                  size={24}
                  color={tintColor}
                />
              )}}
            component={HomeNavigatorScreen} 
            />
          <Drawer.Screen 
            name="Menu"
            options={{drawerIcon: ({ tintColor, focused }) => (
                <Icon
                  name='list'
                  type='font-awesome'            
                  size={24}
                  color={tintColor}
                /> 
                )}}
            component={MenuNavigatorScreen} 
            />
          <Drawer.Screen 
            name="Contact" 
            options={{drawerIcon: ({ tintColor, focused }) => (
                <Icon
                  name='address-card'
                  type='font-awesome'            
                  size={24}
                  color={tintColor}
                /> 
                )}}
            component={ContactNavigatorScreen} 
            />
            <Drawer.Screen 
            name="My Favorites" 
            options={{drawerIcon: ({ tintColor, focused }) => (
                <Icon
                  name='heart'
                  type='font-awesome'            
                  size={24}
                  color={tintColor}
                /> 
                )}}
            component={FavoriteNavigatorScreen} 
            />
          <Drawer.Screen 
            name="About"
            options={{drawerIcon: ({ tintColor, focused }) => (
                <Icon
                  name='info-circle'
                  type='font-awesome'            
                  size={24}
                  color={tintColor}
                /> 
                )}} 
            component={AboutNavigatorScreen}
            />    
            <Drawer.Screen 
              name="Reservation"
              options={{drawerIcon: ({ tintColor, focused }) => (
                  <Icon
                    name='cutlery'
                    type='font-awesome'            
                    size={24}
                    color={tintColor}
                  /> 
                  )}} 
              component={ReservationNavigatorScreen}
              />      
        </Drawer.Navigator>

    );
}
class Main extends Component {
  
  componentDidMount() {
    this.props.fetchDishes();
    this.props.fetchComments();
    this.props.fetchPromos();
    this.props.fetchLeaders();
  }

  render() {
 
    return (
        <NavigationContainer>
            <MainNavigator/>           
        </NavigationContainer>
    );
  }
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    drawerHeader: {
      backgroundColor: '#512DA8',
      height: 140,
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
      flexDirection: 'row'
    },
    drawerHeaderText: {
      color: 'white',
      fontSize: 24,
      fontWeight: 'bold'
    },
    drawerImage: {
      margin: 10,
      width: 80,
      height: 60
    }
  });

export default connect(mapStateToProps, mapDispatchToProps)(Main);