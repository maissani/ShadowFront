// utils/withAuth.js - a HOC for protected pages
import React, {Component} from 'react'
import AuthService from './auth'

export default function withAuth(AuthComponent) {
    
    return class Authenticated extends Component {
      constructor(props) {
        const auth = new AuthService(this.props.client)
        super(props)
        this.state = {
          isLoading: true
        };
      }

      componentDidMount () {
        if (!auth.loggedIn()) {
          this.props.url.replaceTo('/')
        }
        this.setState({ isLoading: false })
      }

      render() {
        return (
          <div>
          {this.state.isLoading ? (
              <div>LOADING....</div>
            ) : (
              <AuthComponent {...this.props}  auth={Auth} />
            )}
          </div>
        )
      }
    }
}