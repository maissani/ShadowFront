import React from 'react'
import { connect } from 'react-redux'
import { Menu, Button, Container,  Form, Segment} from 'semantic-ui-react'
import AuthService from '../utils/AuthService'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import Router from 'next/router'
import ErrorMessage from './Error'

const ADD_PRODUCT = gql`
mutation($name: String!, $description: String!, $price: Float!) {
  createProduct(name: $name, description: $description, price: $price) {
    id,
    name,
    description,
    price
  }
}
`;

const INITIAL_STATE = {
  name: '',
  description: '',
  price: ''
}

class AddProduct extends React.Component {

  state = { ...INITIAL_STATE };

  componentDidMount() {
    const auth = new AuthService()
  }

  onChange = event => {
    const { name, value } = event.target;
    let expectedValue = value
    if(name === "price"){
      expectedValue = parseFloat(value)
    }
    this.setState({ [name]: expectedValue });
  }


  onSubmit = (event, addProduct) => {
    addProduct().then(async ({ data }) => {
      this.setState({ ...INITIAL_STATE });
      await Router.push({pathname:'/dashboard'})
    })

    event.preventDefault();
  }

  render() {
    const { name, description, price} = this.state;
    const isInvalid = name === '' || description === '' || price === '';
    return (
      <Container>
          <Mutation mutation={ADD_PRODUCT} variables={{ name, description, price}}>
            {(addProduct, { data, loading, error }) => (
              <Form size='large' autoComplete="on" onSubmit={event => this.onSubmit(event, addProduct)} >
                <Segment stacked> 
                <Form.Input fluid icon='user' iconPosition='left' placeholder='name' name="name" value={name} onChange={this.onChange} type="text" />   
                <Form.Input fluid icon='user' iconPosition='left' placeholder='description' name="description" value={description} onChange={this.onChange} type="text" /> 
                <Form.Input fluid icon='user' iconPosition='left' placeholder='price' name="price" value={price} onChange={this.onChange} type="text" /> 
                  <Button disabled={isInvalid || loading} color='teal' fluid size='large' type="sumbit">
                    Add a Product
                  </Button>
                </Segment>
                {error && <ErrorMessage error={error} />}
              </Form>
            )}
          </Mutation>
      </Container>
    )
  }
}

export default connect()(AddProduct)