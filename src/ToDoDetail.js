import React from 'react';
import ReactDOM from 'react-dom';
import { withRouter } from 'react-router-dom';

/*export default function DetailsPage() {
  // We can use the `useParams` hook here to access
  // the dynamic pieces of the URL.
  let { id } = useParams();

  return (
    <div>
      <h3>ID: {id}</h3>
    </div>
  );
}*/


export default class DetailsPage extends React.Component {
  componentDidMount() {
      const id = this.props.match.params.id;
      this.fetchData(id);
  }

  fetchData = id => {
      console.log('ToDo Item ID is>>>>' ,id);
  };

  render() {
      return <div>Yo</div>;
  }
}

export default withRouter(DetailsPage);