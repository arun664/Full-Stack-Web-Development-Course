import React, { Component } from 'react';
import { Card, CardImg, CardText, CardBody, CardTitle, Media, Modal, ModalHeader, ModalBody, Label, Breadcrumb, BreadcrumbItem, Button, Row, Col  } from 'reactstrap';
import { Link } from 'react-router-dom';
import { Control, LocalForm, Errors } from 'react-redux-form';

    
    class CommentForm extends Component {
        constructor(props) {
            super(props);

            this.toggleModal = this.toggleModal.bind(this);
            this.handleComment = this.handleComment.bind(this);
      
            this.state = {
              isNavOpen: false,
              isModalOpen: false
            };
          }
  
        toggleModal() {
          this.setState({
            isModalOpen: !this.state.isModalOpen
          });
        }
  
        handleComment(values) {
            this.props.addComment(this.props.dishId, values.rating, values.author, values.comment);
        }

        
        render() {

            const required = (val) => val && val.length;
            const maxLength = (len) => (val) => !(val) || (val.length <= len);
            const minLength = (len) => (val) => val && (val.length >= len);

            return (
                <div>
                    <Button className="fa fa-pencil" outline color="secondary" onClick={this.toggleModal}> Submit Comment</Button>
                    <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
                        <ModalHeader toggle={this.toggleModal}>Submit Comment</ModalHeader>
                        <ModalBody>
                        <LocalForm onSubmit={(values) => this.handleComment(values)}>
                            <Row className="form-group">
                                <Label htmlFor="rating" md={12}>Rating</Label>
                                <Col>
                                    <Control.select model=".rating" name="rating"
                                        className="form-control">
                                        <option>1</option>
                                        <option>2</option>
                                        <option>3</option>
                                        <option>4</option>
                                        <option>5</option>
                                    </Control.select>
                                </Col>
                            </Row>
                            <Row className="form-group">
                                <Label htmlFor="author" md={12}>Your Name</Label>
                                <Col md={12}>
                                    <Control.text model=".author" id="author" name="author"
                                        placeholder="Your Name"
                                        className="form-control"
                                        validators={{
                                            required, minLength: minLength(3), maxLength: maxLength(15)
                                        }}
                                        />
                                    <Errors
                                        className="text-danger"
                                        model=".author"
                                        show="touched"
                                        messages={{
                                            required: 'Required',
                                            minLength: 'Must be greater than 2 characters',
                                            maxLength: 'Must be 15 characters or less'
                                        }}
                                    />
                                </Col>
                            </Row>
                            <Row className="form-group">
                                <Label htmlFor="comment" md={12}>Comment</Label>
                                <Col md={12}>
                                    <Control.textarea model=".comment" id="comment" name="comment"
                                        rows="6"
                                        className="form-control" />
                                </Col>
                            </Row>
                            <Row className="form-group">
                                <Col md={12}>
                                    <Button type="submit" color="primary">
                                    Submit
                                    </Button>
                                </Col>
                            </Row>
                        </LocalForm>
                        </ModalBody>
                    </Modal>
                </div>
            );
        }
    }

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

    function RenderComments({comments, addComment, dishId}) {
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
                    <CommentForm dishId={dishId} addComment={addComment} />
                </div>
            )
        } else {
            return (
                <div></div>
            );
        }
    }

    const DishDetail = (props) => {
        if(props.dish != null) {
            return (
                <div className="container">
                <div className="row">
                    <Breadcrumb>
                        <BreadcrumbItem><Link to="/menu">Menu</Link></BreadcrumbItem>
                        <BreadcrumbItem active>{props.dish.name}</BreadcrumbItem>
                    </Breadcrumb>
                    <div className="col-12">
                        <h3>{props.dish.name}</h3>
                        <hr />
                    </div>                
                </div>
                <div className="row">
                    <div className="col-12 col-md-5 m-1">
                        <RenderDish dish={props.dish} />
                    </div>
                    <div className="col-12 col-md-5 m-1">
                    <RenderComments comments={props.comments}
                        addComment={props.addComment}
                        dishId={props.dish.id}
                    />
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