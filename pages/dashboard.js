import 'isomorphic-fetch'
import React from 'react'
import { connect } from 'react-redux'
import Navigation from '../components/Navigation'
import Product from '../components/Product'
import 'semantic-ui-css/semantic.min.css'
import {
	Responsive,
	Segment,
	Visibility,
} from 'semantic-ui-react'

class Dashboard extends React.Component{
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
				style={{ minHeight: 700, padding: '0em 0em'}}
			  >
				<Navigation />
				<Product/>
			  </Segment>
			</Visibility>
	
			{children}
		  </Responsive>
		)
	}
}

export default connect()(Dashboard)