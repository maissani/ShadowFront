
import React from 'react'
import { Button, Form, Grid, Header, Image, Message, Segment } from 'semantic-ui-react'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import ErrorMessage from './Error'
import Router from 'next/router'

const INITIAL_STATE = {
  login: '',
  password: '',
}

const SIGN_IN = gql`
  mutation($login: String!, $password: String!) {
    signIn(login: $login, password: $password) {
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


  onSubmit = (event, signIn) => {
    signIn().then(async ({ data }) => {
      this.setState({ ...INITIAL_STATE });

      localStorage.setItem('token', data.signIn.token);
      await Router.push({pathname:'/dashboard'})
    })

    event.preventDefault();
  }

  render() {
    const { login, password } = this.state;
    const isInvalid = password === '' || login === '';
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
            <Mutation mutation={SIGN_IN} variables={{ login, password }}>
              {(signIn, { data, loading, error }) => (
                <Form size='large' autoComplete="on" onSubmit={event => this.onSubmit(event, signIn)} >
                  <Segment stacked> 
                    <Form.Input fluid icon='user' iconPosition='left' placeholder='login' name="login" value={login} onChange={this.onChange} type="text" />
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
                      Login
                    </Button>
                  </Segment>
                  {error && <ErrorMessage error={error} />}
                </Form>
              )}
            </Mutation>
            <Message>
              New to us? <a href={`/register`}>Sign Up</a>
            </Message>
          </Grid.Column>
        </Grid>
      </div>
    )
  }
} 

export default LoginForm