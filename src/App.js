import React from 'react';
import './style.css';

export default class AddToDo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      toDoDetails: {
        newToDo: '',
        todoList: [],
        isEdit: false,
        editIndex: 0,
        labelText: 'Add',
        errorMessage: null,
        selectedPriority: [],
        paperwork: [],
        todoETA: [],
      },
    };
    this.textBoxField = React.createRef();
    this.buttonRef = React.createRef();
    this.hideErrorMessage = this.hideErrorMessage.bind(this);
  }

  setToDo = (eve) => {
    let toDoContent = eve.target.value;
    this.setState(function (state) {
      return {
        toDoDetails: Object.assign({}, state.toDoDetails, {
          newToDo: toDoContent,
        }),
      };
    });
  };
  setFocusToTextBox() {
    this.textBoxField.current.focus();
  }
  clearToDo() {
    //console.log(this.state);
    this.setFocusToTextBox();
    this.setState(function (state) {
      return {
        toDoDetails: Object.assign({}, state.toDoDetails, {
          newToDo: '',
        }),
      };
    });
  }
  checkToDoExist(toDoContent) {
    let isToDOExist = this.state.toDoDetails.todoList.includes(toDoContent);
    // console.log(isToDOExist);
    return isToDOExist;
  }
  storeToDoInList(e, toDoContent) {
    let trimmedContent = toDoContent.trim();
    //console.log(e.target.tagName);
    if (
      e.key === 'Enter' ||
      (e.type === 'click' && e.target.tagName === 'BUTTON')
    ) {
      if (this.checkToDoExist(trimmedContent)) {
        this.setState(function (state) {
          return {
            toDoDetails: Object.assign({}, state.toDoDetails, {
              errorMessage: 'Already Added',
            }),
          };
        });
        return false;
      }
      //console.log('value is', toDoContent);
      if (!this.state.toDoDetails.isEdit) {
        this.setState(function (state) {
          return {
            toDoDetails: Object.assign({}, state.toDoDetails, {
              todoList: this.state.toDoDetails.todoList.concat(toDoContent),
              errorMessage: null,
            }),
          };
        });
      } else {
        //console.log('inside else block');
        let tempToDoList = this.state.toDoDetails.todoList.slice();
        let updatedTempList = tempToDoList.splice(
          this.state.toDoDetails.editIndex,
          1,
          toDoContent
        );
        this.setState(function (state) {
          return {
            toDoDetails: Object.assign({}, state.toDoDetails, {
              todoList: tempToDoList,
              isEdit: false,
              editIndex: 0,
              labelText: 'Add',
              errorMessage: null,
            }),
          };
        });
      }
      this.clearToDo();
    } else {
      return null;
    }
  }
  editToDo(index, content) {
    this.setFocusToTextBox();
    this.setState(function (state) {
      return {
        toDoDetails: Object.assign({}, state.toDoDetails, {
          isEdit: true,
          newToDo: content,
          editIndex: index,
          labelText: 'Update',
        }),
      };
    });
  }
  removeToDo(index) {
    let updatedToDoList = this.state.toDoDetails.todoList
      .slice(0, index)
      .concat(this.state.toDoDetails.todoList.slice(index + 1));
    this.setState(function (state) {
      return {
        toDoDetails: Object.assign({}, state.toDoDetails, {
          todoList: updatedToDoList,
        }),
      };
    });
  }
  updatePriorityOfToDo(evnt, id, selectState) {
    let value = evnt.target.value;
    if (value === 'none') {
      return false;
    }
    let priorityList = this.state.toDoDetails.selectedPriority.slice();
    let itemexist;
    itemexist = priorityList.find(({ itemId }) => itemId === id);

    //console.log('item', itemexist);
    if (!itemexist) {
      priorityList.push({ itemId: id, value: value, selectState: selectState });
    } else {
      itemexist.value = value;
      itemexist.selectState = selectState;
      priorityList.forEach((item_priority, index) => {
        if (item_priority.itemId === id) {
          priorityList[index] = itemexist;
        }
      });
    }
    this.setState(function (state) {
      return {
        toDoDetails: Object.assign({}, state.toDoDetails, {
          selectedPriority: priorityList,
        }),
      };
    });
  }
  updatePaperWorkForToDo(value = '', id, textareastate) {
    let paperWorkList = this.state.toDoDetails.paperwork.slice();
    let itemexist;
    itemexist = paperWorkList.find(({ itemId }) => itemId === id);
    if (!itemexist) {
      paperWorkList.push({
        itemId: id,
        value: value,
        textareastate: textareastate,
      });
    } else {
      itemexist.value = value;
      itemexist.textareastate = textareastate;
      paperWorkList.forEach((item_paperwork, index) => {
        if (item_paperwork.itemId === id) {
          paperWorkList[index] = itemexist;
        }
      });
    }
    console.log(paperWorkList);
    this.setState(function (state) {
      return {
        toDoDetails: Object.assign({}, state.toDoDetails, {
          paperwork: paperWorkList,
        }),
      };
    });
  }
  renderTextAreaToAddPaperWork(obj, id, textareastate) {
    console.log(obj, id);
    let paperWorkValue;
    if (typeof obj === 'undefined' || obj.value === 'undefined') {
      console.log('inside');
      paperWorkValue = '';
    } else {
      paperWorkValue = obj.value;
    }
    this.updatePaperWorkForToDo(
      paperWorkValue,
      id + '-textarea',
      textareastate
    );
  }
  updateEstimatedTimeofCompletion(event, id, datestate) {
    // console.log(event.target.value);
    let value = event.target.value;
    let etaList = this.state.toDoDetails.todoETA.slice();
    let itemexist;
    itemexist = etaList.find(({ itemId }) => itemId === id);

    // console.log('item', itemexist);
    if (!itemexist) {
      etaList.push({ itemId: id, value: value, datestate: datestate });
    } else {
      itemexist.value = value;
      itemexist.datestate = datestate;
      etaList.forEach((item_priority, index) => {
        if (item_priority.itemId === id) {
          etaList[index] = itemexist;
        }
      });
    }

    // console.log(etaList);
    this.setState(function (state) {
      return {
        toDoDetails: Object.assign({}, state.toDoDetails, {
          todoETA: etaList,
        }),
      };
    });
  }
  setFocusToTextArea(event) {
    //console.log(event);
    event.target.selectionEnd = (0, event.target.value.length);
  }
  renderToDoItems() {
    if (this.state.toDoDetails.todoList.length === 0) {
      return false;
    }
    return this.state.toDoDetails.todoList.map((value, index) => {
      // console.log('regarding paperwork', this.state.toDoDetails.paperwork);
      let selectedPriority = this.state.toDoDetails.selectedPriority.find(
        ({ itemId }) => itemId === index + '-select'
      );
      if (typeof selectedPriority === 'undefined') {
        selectedPriority = {};
        selectedPriority.selectState = 'open';
      }
      let etaExist = this.state.toDoDetails.todoETA.find(
        ({ itemId }) => itemId === index + '-date'
      );
      if (typeof etaExist === 'undefined') {
        etaExist = {};
        etaExist.datestate = 'open';
      }
      let paperWorkExist = this.state.toDoDetails.paperwork.find(
        ({ itemId }) => itemId === index + '-textarea'
      );
      console.log('paperWorkExist', paperWorkExist);
      let date = new Date();
      let today =
        date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();

      return (
        <div key={index + 'containerdiv'}>
          <p key={index}>
            <span
              style={{ cursor: 'pointer', color: 'blue' }}
              onClick={() =>
                this.renderTextAreaToAddPaperWork(
                  paperWorkExist,
                  index,
                  'close'
                )
              }
            >
              {' '}
              {value}{' '}
            </span>
            <span
              style={{ cursor: 'pointer' }}
              title="Delete-ToDo"
              key={index + '-x'}
              onClick={() => this.removeToDo(index)}
            >
              &nbsp; | X |
            </span>
            <span
              style={{ cursor: 'pointer', color: 'green' }}
              key={index + '-e'}
              onClick={() => this.editToDo(index, value)}
            >
              {' '}
              Edit
            </span>{' '}
            |
            {selectedPriority.selectState === 'open' ? (
              <span>
                {' '}
                <span key={index + 'sp'}> Set Priority: </span>
                <select
                  key={index + '-select'}
                  style={{ cursor: 'pointer' }}
                  onChange={(event) =>
                    this.updatePriorityOfToDo(event, index + '-select', 'open')
                  }
                  onBlur={(evt) =>
                    this.updatePriorityOfToDo(evt, index + '-select', 'close')
                  }
                >
                  <option key={index + 'none'} value="none">
                    Select an Option
                  </option>

                  <option key={index + '1'} value="1">
                    Low Priority
                  </option>
                  <option key={index + '2'} value="2">
                    Medium
                  </option>
                  <option key={index + '3'} value="3">
                    Critical
                  </option>
                  <option key={index + '4'} value="4">
                    High
                  </option>
                  <option key={index + '5'} value="5">
                    ShowStopper
                  </option>
                </select>{' '}
                &nbsp;
              </span>
            ) : (
              <span key={index + '-priority'}>
                {' '}
                Selected Priorty: {selectedPriority.value}{' '}
                <span
                  key={index + 'editpriority'}
                  style={{ cursor: 'pointer', color: '#1f29a4' }}
                  onClick={(evnt) => {
                    this.updatePriorityOfToDo(evnt, index + '-select', 'open');
                  }}
                >
                  {' '}
                  - Edit Priority &nbsp;
                </span>
              </span>
            )}
            | &nbsp;
            {etaExist.datestate === 'open' ? (
              <span key={index + '-date-apply-eta'}>
                {' '}
                Apply ETA: &nbsp;{' '}
                <input
                  style={{ cursor: 'pointer' }}
                  type="date"
                  value={etaExist.value || today}
                  key={index + '-date'}
                  onChange={(evnt) => {
                    this.updateEstimatedTimeofCompletion(
                      evnt,
                      index + '-date',
                      'open'
                    );
                  }}
                  onBlur={(event) =>
                    this.updateEstimatedTimeofCompletion(
                      event,
                      index + '-date',
                      'close'
                    )
                  }
                />{' '}
              </span>
            ) : (
              <span key={index + 'etainfo'}>
                {' '}
                ETA: {etaExist.value}{' '}
                <span
                  key={index + 'editetainfo'}
                  style={{ cursor: 'pointer', color: '#1f29a4' }}
                  onClick={(evnt) => {
                    this.updateEstimatedTimeofCompletion(
                      evnt,
                      index + '-date',
                      'open'
                    );
                  }}
                >
                  {' '}
                  - Edit ETA
                </span>{' '}
              </span>
            )}{' '}
          </p>
          {typeof paperWorkExist !== 'undefined' &&
          paperWorkExist.textareastate === 'close' ? (
            <textarea
              key={index + '-textarea'}
              placeholder="Plan your paper work here. To Save click outside the box"
              onChange={(evt) =>
                this.renderTextAreaToAddPaperWork(evt.target, index, 'close')
              }
              value={paperWorkExist.value}
              onBlur={(event) =>
                this.updatePaperWorkForToDo(
                  event.target.value,
                  index + '-textarea',
                  'open'
                )
              }
              onFocus={(evnt) => this.setFocusToTextArea(evnt)}
              autoFocus
              rows={5}
              cols={60}
            />
          ) : paperWorkExist && paperWorkExist.value !== '' ? (
            <p key={index + 'pwp'} style={{ whiteSpace: 'pre' }}>
              {' '}
              <span key={index + 'pwpdetails'} style={{ marginLeft: -10 }}>
                Details: <br /> {paperWorkExist.value}
              </span>
            </p>
          ) : null}
          <hr key={index + 'hr'} />
        </div>
      );
    });
  }
  componentDidMount() {
    console.log('Patta Kutti');
    //this.setFocusToTextBox();
  }
  hideErrorMessage(event) {
    this.setState(function (state) {
      return {
        toDoDetails: Object.assign({}, state.toDoDetails, {
          errorMessage: null,
        }),
      };
    });
  }
  render() {
    return (
      <>
        <h3> To Do App </h3>
        <input
          type="text"
          name="gettodo"
          onChange={this.setToDo}
          value={this.state.toDoDetails.newToDo}
          onKeyDown={(event) =>
            this.storeToDoInList(event, this.state.toDoDetails.newToDo)
          }
          ref={this.textBoxField}
          placeholder="It is time to plan your tasks"
          data-testid="add-todo-box"
        />{' '}
        &nbsp;
        <button
          type="button"
          name="SubmitToDo"
          onClick={(event) =>
            this.storeToDoInList(event, this.state.toDoDetails.newToDo)
          }
          onKeyDown={(event) =>
            this.storeToDoInList(event, this.state.toDoDetails.newToDo)
          }
          style={{ cursor: 'pointer' }}
        >
          {this.state.toDoDetails.labelText}
        </button>
        <br />
        {this.state.toDoDetails.errorMessage !== null ? (
          <span
            style={{
              color: 'red',
              visibiity: 'visible',
              position: 'absolute',
              top: '63px',
            }}
          >
            <br />
            {this.state.toDoDetails.errorMessage} &nbsp;{' '}
            <span style={{ cursor: 'pointer' }} onClick={this.hideErrorMessage}>
              X
            </span>
          </span>
        ) : null}
        {this.renderToDoItems()}
      </>
    );
  }
}
