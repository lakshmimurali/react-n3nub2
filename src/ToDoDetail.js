import React from 'react';
import ReactDOM from 'react-dom';
import { withRouter } from 'react-router-dom';

export default class DetailsPage extends React.Component {
  componentDidMount() {
      const id = this.props.match.params.id;
      this.fetchData(id);
  }

  fetchData = id => {
      console.log('ToDo Item ID is>>>>' ,id);
  };

  render() {
      return <div>Loading Details Page {this.props.match.params.id}</div>;
  }
}

export default withRouter(DetailsPage);