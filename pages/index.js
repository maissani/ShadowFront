import 'isomorphic-fetch'
import React from 'react'
import { connect } from 'react-redux'
import Navigation from '../components/Navigation'

import 'semantic-ui-css/semantic.min.css'

import {
	Container,
	Header,
	Image,
	Responsive,
	Segment,
	Visibility,
  } from 'semantic-ui-react'

import AuthService from '../utils/AuthService';

const HomepageHeading = ({ mobile }) => (
	<Container text>
	  <Image 
	   size='small'
	   centered 
	   src='static/img/logo.png' 
	   style={{
		marginTop: mobile ? '3em' : '6em',
	  }}
	  />
	  <Header
		as='h1'
		content='Product Center'
		inverted
		style={{
		  fontSize: mobile ? '2em' : '4em',
		  fontWeight: 'normal',
		  marginBottom: 0,
		  marginTop: mobile ? '0.5em' : '1em',
		}}
	  />
	</Container>
  )
  
  
const Auth = new AuthService('http://localhost:8000')

class Index extends React.Component {


	static async getInitialProps(ctx) {
		const {req, query, params} = ctx
		const userAgent = req ? req.headers['user-agent'] : navigator.userAgent
    return { userAgent }
	}
	
	componentDidMount () {
		this.setState({ isLoading: false })
	}

	render() {
		const { children } = this.props

		return (
			<Responsive minWidth={Responsive.onlyTablet.minWidth}>
			<Visibility
			  once={false}
			  onBottomPassed={this.showFixedMenu}
			  onBottomPassedReverse={this.hideFixedMenu}
			>
			  <Segment
				inverted
				textAlign='center'
				style={{ minHeight: 700, padding: '1em 0em'}}
				vertical
			  >
				<Navigation />
				<HomepageHeading {...this.props}/>
			  </Segment>
			</Visibility>
	
			{children}
		  </Responsive>
		)
	}
}

export default connect()(Index)
