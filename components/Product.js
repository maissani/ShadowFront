import React from 'react'
import { connect } from 'react-redux'
import { Menu, Button, Container, List, Segment} from 'semantic-ui-react'
import AuthService from '../utils/AuthService'
import { Query } from "react-apollo"
import gql from 'graphql-tag'
import Router from 'next/router'

const PODUCT_LIST = gql`
  query {
    me {
      id,role
    }
    products {
      edges {
        id,
        name,
        description,
        price,
        user {
          id,
          username
        }
      },
      pageInfo {
        hasNextPage
      }
    }
  }
`;

class Product extends React.Component {

  componentDidMount() {

  }

  displayAdminButton(product, data) {
    if(data.me.role === "ADMIN") {
      return (
        <div>
          <List.Content>
            <Button>Delete</Button>
          </List.Content>
        </div>
      )
    }
  }

  render() {
    return (
      <Container>
        <List divided verticalAlign="middle">
          <Query query={PODUCT_LIST}>
              {({ loading, error, data }) => {
                if(data.me === null){
                  auth.logout()
                  Router.push({pathname:'/'})
                }
                if (loading) return "Loading...";
                  return data.products.edges.map((product)=> {
                    return (
                        <List.Item key={product.id}>
                          <List.Content floated='right'>
                            <Button>{product.price} € Buy</Button>
                            { this.displayAdminButton(product, data)}
                          </List.Content>
                          <List.Content>{product.name}</List.Content>
                          <List.Content>{product.description}</List.Content>
                          <List.Content>Created by: {product.user.username}</List.Content>
                          
                        </List.Item>
                    )
                  })
              }}
          </Query>  
        </List>
      </Container>
    )

  }
}

export default connect()(Product)