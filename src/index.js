import React from 'react';
import ReactDOM from 'react-dom';

import AddToDo from './App';

const hats = { title: 'Favorite Hats', contents: 'Fedoras are classy' };
const footware = {
  title: 'Favorite Footware',
  contents: 'Flipflops are the best',
};
ReactDOM.render(<AddToDo />, document.getElementById('root'));
