import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';

var defaultState = {
  todo: {
    items: []
  }
};

function addTodo(message) {
  return {
    type: 'ADD_TODO',
    message: message,
    completed: false
  };
}

function todoApp(state, action) {
  switch (action.type) {
    case 'ADD_TODO':
      var items = [].concat(state.todo.items);
      return Object.assign({}, state, {
        todo: {
          items: items.concat([{
            message: action.message,
            completed: false
          }])
        }
      });

    default:
      return state;
  }
}

var store = createStore(todoApp, defaultState);

// create components
class AddTodoForm extends React.Component {
  state = {
    message: ''
  };

  onFormSubmit(e) {
    e.preventDefault();
    store.dispatch(addTodo(this.state.message));
    this.setState({message: ''});
  }

  onMessageChanged(e) {
    var message = e.target.value;
    this.setState({
      message: message
    })
  }

  render() {
    return (
      <form onSubmit={this.onFormSubmit.bind(this)}>
        <input type="text" onChange={this.onMessageChanged.bind(this)} value={this.state.message} />
        <input type="submit" value="add" />
      </form>
    );
  }
}

class TodoItem extends React.Component {
  render() {
    return (
      <li>
        {this.props.value}
      </li>
    )
  }
}

class TodoList extends React.Component {

  state = {
    items:[]
  }

  componentWillMount() {
    store.subscribe(() => {
      var state = store.getState();
      this.setState({
        items: state.todo.items
      });
    });
  }

  render() {
    var items = [];

    console.log(this);

    this.state.items.forEach((item, index) => {
      items.push(<TodoItem value={item.message} />);
    });
    if(!items.length) {
      return (<p> please enter vals </p>);
    }
    return (<ol>{items}</ol>);
  }
}

ReactDOM.render(
  <div>
    <AddTodoForm />
    <TodoList />
  </div>,
  document.getElementById('container')
);
