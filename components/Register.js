
import React from 'react'
import { Button, Form, Grid, Header, Image, Message, Segment } from 'semantic-ui-react'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import ErrorMessage from './Error'
import Router from 'next/router'

const INITIAL_STATE = {
  firstname: '',
  lastname: '',
  username: '',
  email: '',
  password: ''
}

const REGISTER_ME = gql`
  mutation($firstname: String!, $lastname: String!, $username: String!, $email: String!, $password: String!) {
    signUp(firstname: $firstname, lastname: $lastname, username: $username, email: $email, password: $password) {
      token
    }
  }
`

class LoginForm extends React.Component {
  state = { ...INITIAL_STATE };
  
  onChange = event => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  }


  onSubmit = (event, signUp) => {
    signUp().then(async ({ data }) => {
      this.setState({ ...INITIAL_STATE });

      localStorage.setItem('token', data.signUp.token);
      await Router.push({pathname:'/dashboard'})
    })

    event.preventDefault();
  }

  render() {
    const { firstname, lastname, username, email, password } = this.state;
    const isInvalid = firstname === '' || lastname === '' || username === '' || email === '' || password === '';
    return (
      
      <div className='login-form'>
        {/*
          Heads up! The styles below are necessary for the correct render of this example.
          You can do same with CSS, the main idea is that all the elements up to the `Grid`
          below must have a height of 100%.
        */}
        <style>{`
          body > div,
          body > div > div,
          body > div > div > div.login-form {
            height: 100%;
          }
        `}</style>
        <Grid textAlign='center' style={{ height: '100%' }} verticalAlign='middle'>
          <Grid.Column style={{ maxWidth: 450 }}>
            <Header as='h2' color='grey' textAlign='center'>
              <Image src='static/img/logo.png'  /> Log-in to your account
            </Header>
            <Mutation mutation={REGISTER_ME} variables={{ firstname, lastname, username, email, password }}>
              {(signUp, { data, loading, error }) => (
                <Form size='large' autoComplete="on" onSubmit={event => this.onSubmit(event, signUp)} >
                  <Segment stacked> 
                  <Form.Input fluid icon='user' iconPosition='left' placeholder='firstname' name="firstname" value={firstname} onChange={this.onChange} type="text" />   
                  <Form.Input fluid icon='user' iconPosition='left' placeholder='lastname' name="lastname" value={lastname} onChange={this.onChange} type="text" /> 
                  <Form.Input fluid icon='user' iconPosition='left' placeholder='username' name="username" value={username} onChange={this.onChange} type="text" /> 
                  <Form.Input fluid icon='user' iconPosition='left' placeholder='email' name="email" value={email} onChange={this.onChange} type="text" />
                  <Form.Input
                    fluid
                    icon='lock'
                    iconPosition='left'
                    name='password'
                    autoComplete="on"
                    value={password}
                    onChange={this.onChange}
                    placeholder='Password'
                    type='password'
                  />
                    <Button disabled={isInvalid || loading} color='teal' fluid size='large' type="sumbit">
                      Register
                    </Button>
                  </Segment>
                  {error && <ErrorMessage error={error} />}
                </Form>
              )}
            </Mutation>
            <Message>
              Already have an account<a href={`/login`}>Login</a>
            </Message>
          </Grid.Column>
        </Grid>
      </div>
    )
  }
} 

export default LoginForm