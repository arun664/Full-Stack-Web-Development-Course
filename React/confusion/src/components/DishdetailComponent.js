import React from 'react';
import { Card, CardImg, CardText, CardBody, CardTitle, Media } from 'reactstrap';


    function RenderDish({dish}) {
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

    function RenderComments({comments}) {
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
                                            <p>{ `${comment.author}, ${new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', 
                                                day: '2-digit'}).format(new Date(Date.parse(comment.date)))}`}</p>
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

    const DishDetail = (props) => {
        if(props.selectedDish != null) {
            return (
                <div className="container">
                    <div className="row">
                        <div  className="col-12 col-md-5 m-1">
                            <RenderDish dish={props.selectedDish}/>
                        </div>
                        <div className="col-12 col-md-5 m-1">
                            <RenderComments comments={props.selectedDish.comments}/>
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

export default DishDetail;