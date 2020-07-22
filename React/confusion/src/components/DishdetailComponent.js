import React, { Component } from 'react';
import { Card, CardImg, CardText, CardBody, CardTitle, Media } from 'reactstrap';

class DishDetail extends Component {

    constructor(props) {
        super(props);
        this.state = {

        }
    }

    renderDish(dish) {
        if (dish != null)
            return(
                <Card>
                    <CardImg top src={dish.image} alt={dish.name} />
                    <CardBody>
                      <CardTitle>{dish.name}</CardTitle>
                      <CardText>{dish.description}</CardText>
                    </CardBody>
                </Card>
            );
        else
            return(
                <div></div>
            );
    }

    renderComments(comments) {
        if (comments != null) {
            return (
                <div>
                    <h4>Comments</h4>
                    <Media list className='list-unstyled'>
                        {comments.map((comment) => {
                            return (
                                <div key={comment.id}>
                                    <Media tag='li'>
                                        <Media body>
                                            <p>{comment.comment}</p>
                                            <p>{`-- ${comment.author}, ${new Intl.DateTimeFormat({
                                                dateStyle: 'long'
                                            }).format(new Date(comment.date))}`}</p>
                                        </Media>
                                    </Media>
                                </div>
                            )
                        })}
                    </Media>

                </div>
            )
        } else {
            return (
                <div></div>
            );
        }
    }

    render() {
        console.log(this.props.comments)
        if(this.props.selectedDish != null) {
            return (
                <div className="container">
                    <div className="row">
                        <div  className="col-12 col-md-5 m-1">
                            {this.renderDish(this.props.selectedDish)}
                        </div>
                        <div className="col-12 col-md-5 m-1">
                            {this.renderComments(this.props.comments)}
                        </div>
                    </div>
                </div>
            );
        }
        else {
            return(
                <div></div>
            )
        }
    }
}

export default DishDetail;