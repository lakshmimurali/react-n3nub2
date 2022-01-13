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
  }
  renderDetailsOfPaperWork(todoList,paperwork, givenTodoItem) {
      if(todoList !== 'undefined')
      {

    console.log('Need to load the content of paperWork',todoList,paperwork,givenTodoItem);
    let indexOfPaperWork;
    let paperWorkContent = '';
    todoList.filter((toDoItem, index) => {
      let itemExist = toDoItem.includes(givenTodoItem);
      if (itemExist) {
          console.log('inside  itemExist' ,toDoItem);
        indexOfPaperWork = index;
      }
      return itemExist;
    });
    paperwork.filter((paperWorkObj) => {
      let paperWorkId = paperWorkObj.itemId;
      let toDoId = +paperWorkId.split('-')[0];
      console.log('toDoId' , toDoId , 'indexOfPaperWork' , indexOfPaperWork);

      if (+toDoId === +indexOfPaperWork) {
        paperWorkContent = paperWorkObj.value;
        console.log('paperWorkContent', paperWorkContent);
      }
      return false;
    });
    return <span key={givenTodoItem}> {paperWorkContent} </span>;
}
else
{
    return null;
}
  }

  render() {
      return <span>Loading Details Page {this.props.match.params.id}
      {this.renderDetailsOfPaperWork(this.props.todoList,this.props.paperWork,this.props.paperWorkToLoad)}
      </span>
  }
}

export default withRouter(DetailsPage);