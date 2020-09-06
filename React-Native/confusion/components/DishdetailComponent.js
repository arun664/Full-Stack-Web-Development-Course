import React, { Component } from 'react';
import { Text, View, ScrollView, FlatList, StyleSheet, Modal, Button } from 'react-native';
import { Card, Icon, Rating, Input } from 'react-native-elements';
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import { postFavorite, postComment, fetchComments } from '../redux/ActionCreators';

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

function RenderDish(props) {

    const dish = props.dish;
    console.log(dish);
    
        if (dish != null) {
            return(
                <Card
                featuredTitle={dish.name}
                image={{uri: baseUrl + dish.image}}
                >
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
                </View>
                </Card>
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
        <Card title='Comments' >
        <FlatList 
            data={comments}
            renderItem={renderCommentItem}
            keyExtractor={item => item.id.toString()}
            />
        </Card>
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