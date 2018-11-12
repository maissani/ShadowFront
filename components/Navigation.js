import React from 'react'
import { connect } from 'react-redux'
import { Menu, Button, Container} from 'semantic-ui-react'
import AuthService from '../utils/AuthService'
import { Query } from "react-apollo";
import gql from 'graphql-tag';
import Router from 'next/router'


import { client } from '../pages/_app'

const WHO_IAM = gql`
  query {
    me {
      id,
      firstname,
      lastname,
      role
    }
  }
`;

class Navigation extends React.Component {
    constructor(props) {
      super(props)
      this.auth = new AuthService()
      this.handleConnect = this.handleConnect.bind(this)
      this.handleLogout = this.handleLogout.bind(this)
      this.state = {
        username: 'anonymous'
      }
    }

    componentDidMount() {
      if(this.auth.loggedIn()) {
        console.log("loggedIn")
        this.setState({ username: this.auth.getProfile().username })
      } else {
        console.log("notloggedin")
      }
    }

    handleConnect(e) {
      e.preventDefault()
      this.props.url.replaceTo('/')
      auth.login().then(res => {
        console.log(res)
      }).catch(e => console.log(e))
    }

    handleLogout(e) {
      e.preventDefault()
      this.auth.logout()
      Router.push({pathname:'/'})
    }

    handleAddProduct(e) {
      e.preventDefault()
      Router.push({pathname:'/product/add'})
    }


    displayConnectButton(fixed) {
      if(!this.auth.loggedIn()) {
        return (
          <div>
            <Button href="/signin" as='a' inverted={fixed} primary={!fixed} style={{ marginLeft: '0.5em' }}>
              Se connecter
            </Button >
            <Button href="/register" as='a' inverted={fixed} primary={!fixed} style={{ marginLeft: '0.5em' }}>
              S'enreregistrer
            </Button >
          </div>
        )
      }
    }

    displayAddButton(data, fixed){
      if(data.me.role === "ADMIN"){
        return(
          <Button as='a' onClick={this.handleAddProduct} inverted={fixed} primary={!fixed} style={{ marginLeft: '0.5em' }}>
            Add product
          </Button >
        )
      }
    }

    displayMenuButton(fixed) {
      if(this.auth.loggedIn()) {
        return (
          <Query query={WHO_IAM}>
            {({ loading, error, data }) => {
              if(error){
                this.auth.logout()
              }
              if (loading) return <div>Loading...</div>;
              return(
                <div>
                  <Button as='a' href="/dashboard" inverted={fixed} primary={!fixed} style={{ marginLeft: '0.5em' }}>
                    {data.me.firstname} {data.me.lastname}
                  </Button >
                  {this.displayAddButton(data, fixed)}
                  <Button as='a' onClick={this.handleLogout} inverted={fixed} primary={!fixed} style={{ marginLeft: '0.5em' }}>
                    logout
                  </Button >
                </div>
              )
            }}
          </Query>
        )
      }
    }

    render() {
        const fixed = false
        return (
            <Menu
            fixed={fixed ? 'top' : null}
            inverted={fixed}
            pointing={fixed}
            secondary={fixed}
            size='large'
            style = {{ background: 'transparent'}}
          >
            <Container>
            <Menu.Item position='right'>
              {this.displayConnectButton(fixed)}
              {this.displayMenuButton(fixed)}
            </Menu.Item>
            </Container>
          </Menu>
        )
    }
}

export default connect()(Navigation)
