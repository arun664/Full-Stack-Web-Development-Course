import React, { Component } from 'react';
import { Text, View, ScrollView, FlatList, Modal, StyleSheet, Button, Alert, PanResponder, Share } from 'react-native';
import { Card, Icon, Rating, Input } from 'react-native-elements';
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import { postFavorite, postComment, fetchComments } from '../redux/ActionCreators';
import * as Animatable from 'react-native-animatable';

const mapStateToProps = state => {
    return {
      dishes: state.dishes,
      comments: state.comments,
      favorites: state.favorites
    }
  }

const mapDispatchToProps = dispatch => ({
    postFavorite: (dishId) => dispatch(postFavorite(dishId)),
    fetchComments: () => dispatch(fetchComments()),
    postComment: (dishId, rating, author, comment) => dispatch(postComment(dishId, rating, author, comment))
})

const shareDish = (title, message, url) => {
    Share.share({
        title: title,
        message: title + ': ' + message + ' ' + url,
        url: url
    },{
        dialogTitle: 'Share ' + title
    })
}

function RenderDish(props) {

    var viewRef;

    const handleViewRef = ref => viewRef = ref;

    const recognizeRLDrag = ({ moveX, moveY, dx, dy }) => {
        if ( dx < -200 )
            return true;
        else
            return false;
    }

    const recognizeLRDrag = ({ moveX, moveY, dx, dy }) => {
        if ( dx > 200 )
            return true;
        else
            return false;
    }

    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: (e, gestureState) => {
            return true;
        },
        onPanResponderGrant: () => {
            this.viewRef.rubberBand(1000).then(endState => console.log(endState.finished ? 'finished' : 'cancelled'));
        },
        onPanResponderEnd: (e, gestureState) => {
            console.log("pan responder end", gestureState);
            if (recognizeRLDrag(gestureState)) {
                Alert.alert(
                    'Add Favorite',
                    'Are you sure you wish to add ' + dish.name + ' to favorite?',
                    [
                    {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                    {text: 'OK', onPress: () => {props.favorite ? console.log('Already favorite') : props.onPress()}},
                    ],
                    { cancelable: false }
                );
            }
            else if(recognizeLRDrag(gestureState)) {
                props.modalRender()
            }
            return true;
        }
    })

    const dish = props.dish;
    // console.log(dish);
    
        if (dish != null) {
            return(
                <Animatable.View animation="fadeInDown" duration={2000} delay={1000}
                ref={handleViewRef}
                {...panResponder.panHandlers}>
                <Card
                featuredTitle={dish.name}
                image={{uri: baseUrl + dish.image}}>
                <Text style={{margin: 10, textAlign: "justify"}}>
                    {dish.description}
                </Text>
                <View style={{ flexDirection: "row", justifyContent: "center"}}>
                <Icon
                    raised
                    reverse
                    name={ props.favorite ? 'heart' : 'heart-o'}
                    type='font-awesome'
                    color='#f50'
                    onPress={() => props.favorite ? console.log('Already favorite') : props.onPress()}
                    />
                <Icon
                    raised
                    reverse
                    name='pencil'
                    type='font-awesome'
                    color='#512DA8'
                    onPress={props.modalRender}
                    />
                <Icon
                    raised
                    reverse
                    name='share'
                    type='font-awesome'
                    color='#51D2A8'
                    style={styles.cardItem}
                    onPress={() => shareDish(dish.name, dish.description, baseUrl + dish.image)} />
                </View>
                </Card>
                </Animatable.View>
            );
        }
        else {
            return(<View></View>);
        }
}

function RenderComments(props) {

    const comments = props.comments;
            
    const renderCommentItem = ({item, index}) => {
        
        return (
            <View key={index} style={{margin: 10}}>
                <Text style={{fontSize: 14}}>{item.comment}</Text>
                <Text style={{fontSize: 12}}>{item.rating} Stars</Text>
                <Text style={{fontSize: 12}}>{'-- ' + item.author + ', ' + item.date} </Text>
            </View>
        );
    };
    
    return (
        <Animatable.View animation="fadeInUp" duration={2000} delay={1000}>        
        <Card title='Comments' >
            <FlatList 
                data={comments}
                renderItem={renderCommentItem}
                keyExtractor={item => item.id.toString()}
                />
        </Card>
        </Animatable.View>
    );
}


class Dishdetail extends Component {

    constructor(props) {
        super(props);
        this.state = {
            rating : '',
            author : '',
            comment : '',
            showModal: false
        }
        this.ratingCompleted = this.ratingCompleted.bind(this);
        this.resetForm = this.resetForm.bind(this);
        this.SubmitForm = this.SubmitForm.bind(this);
    }

    componentDidMount(){
        this.props.fetchComments();
    }

    markFavorite(dishId) {
        this.props.postFavorite(dishId);
    }

    toggleModal() {
        this.setState({showModal: !this.state.showModal});
    }
    
    resetForm() {
        this.setState({
            rating : '',
            author : '',
            comment : '',
            showModal: false
        });
    }

    ratingCompleted(rating) {
        this.setState({rating:rating})
    }

    SubmitForm(){
        this.props.postComment(this.props.route.params.dishId, this.state.rating, this.state.author, this.state.comment);
        this.resetForm();
    }

    render() {
        const dishId = this.props.route.params.dishId;
        return(
            <ScrollView>
                <RenderDish dish={this.props.dishes.dishes[+dishId]}
                    favorite={this.props.favorites.some(el => el === dishId)}
                    onPress={() => this.markFavorite(dishId)} 
                    modalRender = {this.toggleModal.bind(this)}
                    />
                <RenderComments comments={this.props.comments.comments.filter((comment) => comment.dishId === dishId)} />
                <Modal animationType = {"slide"} transparent = {false}
                    visible = {this.state.showModal}
                    onDismiss = {() => this.toggleModal() }
                    onRequestClose = {() => this.toggleModal() }>
                    <View style = {styles.modal}>
                        <Rating showRating ratingCount={5} onFinishRating={this.ratingCompleted}></Rating>
                        <Input 
                            placeholder="    Author" 
                            leftIcon={{
                            name:"user",
                            type:'font-awesome'
                            }}
                            style = {styles.modalText}
                            onChangeText = {value => this.setState({ author: value })}
                            />
                        <Input placeholder="  Comment"
                            leftIcon={{ type: 'font-awesome', name: 'comment' }}
                            style = {styles.modalText}
                            onChangeText={value => this.setState({ comment: value })}
                            />
                        <View style={{margin:10}}>
                        <Button 
                            onPress = {() =>{this.SubmitForm()}}
                            color="#512DA8"
                            title="Submit" 
                            />
                        </View>
                        <View style={{marginLeft:10, marginRight:10}}>
                        <Button 
                            onPress = {() =>{this.toggleModal(); this.resetForm();}}
                            color="#808080"
                            title="Close" 
                            />
                        </View>
                    </View>
                </Modal>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    modal: {
        justifyContent: 'center',
        margin: 20
     },
     modalTitle: {
         fontSize: 24,
         fontWeight: 'bold',
         backgroundColor: '#512DA8',
         textAlign: 'center',
         color: 'white',
         marginBottom: 20
     },
     modalText: {
         fontSize: 18,
         margin: 10
     }
});

export default connect(mapStateToProps, mapDispatchToProps)(Dishdetail);