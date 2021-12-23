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
        searchList: [],
        isInSearchMode: false,
        selectedFilterOption: 'Filter',
      },
    };
    this.textBoxField = React.createRef();
    this.hideErrorMessage = this.hideErrorMessage.bind(this);
    this.searchToDo = this.searchToDo.bind(this);
    this.clearSearch = this.clearSearch.bind(this);
    this.filterTasksBasedOnPriorityOrETA =
      this.filterTasksBasedOnPriorityOrETA.bind(this);
  }

  setToDo = (eve) => {
    let toDoContent = eve.target.value;
    this.setState(function (state) {
      return {
        toDoDetails: Object.assign({}, state.toDoDetails, {
          newToDo: toDoContent,
          isInSearchMode: false,
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
    if (e.key === 'Escape' && e.target.tagName === 'INPUT') {
      this.clearToDo();
      return false;
    }
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
          isInSearchMode: false,
        }),
      };
    });
  }
  removeToDo(index) {
    let toDoList = this.state.toDoDetails.todoList;
    let updatedToDoList = toDoList
      .slice(0, index)
      .concat(toDoList.slice(index + 1));
    this.setState(function (state) {
      return {
        toDoDetails: Object.assign({}, state.toDoDetails, {
          todoList: updatedToDoList,
        }),
      };
    });
    let priorityList = this.state.toDoDetails.selectedPriority;
    let priorityIndex = this.getIndexOfMatchedEntry(priorityList, index);
    if (priorityIndex != -1) {
      let updatedPriorityList = priorityList
        .slice(0, priorityIndex)
        .concat(priorityList.slice(priorityIndex + 1));
      this.setState(function (state) {
        return {
          toDoDetails: Object.assign({}, state.toDoDetails, {
            selectedPriority: updatedPriorityList,
          }),
        };
      });
    }

    let etaList = this.state.toDoDetails.todoETA;
    let etaIndex = this.getIndexOfMatchedEntry(etaList, index);

    if (etaIndex != -1) {
      let updatedETAList = etaList
        .slice(0, etaIndex)
        .concat(etaList.slice(etaIndex + 1));
      this.setState(function (state) {
        return {
          toDoDetails: Object.assign({}, state.toDoDetails, {
            todoETA: updatedETAList,
          }),
        };
      });
    }
    let paperWorkList = this.state.toDoDetails.paperwork;
    let paperWorkIndex = this.getIndexOfMatchedEntry(paperWorkList, index);
    if (paperWorkIndex != -1) {
      let updatedPaperWorkList = paperWorkList
        .slice(0, paperWorkIndex)
        .concat(paperWorkList.slice(paperWorkIndex + 1));
      this.setState(function (state) {
        return {
          toDoDetails: Object.assign({}, state.toDoDetails, {
            paperwork: updatedPaperWorkList,
          }),
        };
      });
    }
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
      priorityList.push({
        itemId: id,
        value: value,
        selectState: selectState,
        inDB: false,
      });
    } else {
      if (selectState === 'close') {
        itemexist.inDB = true;
      }
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
    // console.log(paperWorkList);
    this.setState(function (state) {
      return {
        toDoDetails: Object.assign({}, state.toDoDetails, {
          paperwork: paperWorkList,
        }),
      };
    });
  }
  renderTextAreaToAddPaperWork(obj, id, textareastate) {
    let paperWorkValue;
    if (typeof obj === 'undefined' || obj.value === 'undefined') {
      //console.log('inside');
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
  constructETAText(noOfDays) {
    return noOfDays === 0
      ? 'Today'
      : noOfDays > 1
      ? noOfDays + ' days'
      : noOfDays + ' day';
  }
  calculateDays(selectedDate, skipformat) {
    let selectedDateObj = new Date(selectedDate);
    let today = new Date();
    let differenceBetweenDatesInMilliSeconds =
      selectedDateObj.getTime() - today.getTime();
    let noOfDays = Math.ceil(
      differenceBetweenDatesInMilliSeconds / (1000 * 3600 * 24)
    );
    if (skipformat) {
      return Math.abs(noOfDays);
    } else {
      let etaText = this.constructETAText(noOfDays);
      return etaText;
    }
  }
  updateEstimatedTimeofCompletion(event, id, datestate = 'open') {
    //console.log(event.target.value);
    if (event.key === 'Enter') {
      //datestate = 'close';
      event.target.blur();
      return null;
    }
    let value = event.target.value;
    if (datestate === 'close') {
      let selectedDateObj = new Date(value);
      // console.log(selectedDateObj);
      let today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDateObj < today) {
        alert(
          "Katham Katham :) :) Once End it's always end..Please concentrate on present to glorify future"
        );
        return false;
      }
    }
    let noOfDays = this.calculateDays(value, true);
    let etaList = this.state.toDoDetails.todoETA.slice();
    let itemexist;
    itemexist = etaList.find(({ itemId }) => itemId === id);
    // console.log('item', itemexist);
    if (!itemexist) {
      etaList.push({
        itemId: id,
        value: value,
        datestate: datestate,
        noOfDays: noOfDays,
      });
    } else {
      itemexist.value = value;
      itemexist.datestate = datestate;
      itemexist.noOfDays = noOfDays;
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
    let toDoList =
      this.state.toDoDetails.isInSearchMode === true
        ? this.state.toDoDetails.searchList
        : this.state.toDoDetails.todoList;
    // console.log(toDoList);
    if (toDoList.length === 0) {
      return false;
    }
    return toDoList.map((value, index) => {
      if (Object.keys(value).length === 0 && value.constructor === Object) {
        return false;
      }
      let selectedPriority = this.state.toDoDetails.selectedPriority.find(
        ({ itemId }) => itemId === index + '-select'
      );
      if (typeof selectedPriority === 'undefined') {
        selectedPriority = {};
        selectedPriority.selectState = 'open';
        selectedPriority.inDB = false;
      }
      selectedPriority.textLabel = 'Select Priority';
      if (selectedPriority.inDB) {
        selectedPriority.textLabel = 'Update Priority';
      }
      //console.log(selectedPriority);
      let etaExist = this.state.toDoDetails.todoETA.find(
        ({ itemId }) => itemId === index + '-date'
      );
      if (typeof etaExist === 'undefined') {
        etaExist = {};
        etaExist.datestate = 'open';
        etaExist.value = new Date().toISOString().slice(0, 10);
      }
      //console.log(etaExist);
      let paperWorkExist = this.state.toDoDetails.paperwork.find(
        ({ itemId }) => itemId === index + '-textarea'
      );

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
                <span key={index + 'sp'}> {selectedPriority.textLabel}: </span>
                <select
                  key={index + '-select'}
                  style={{ cursor: 'pointer' }}
                  value={
                    selectedPriority.value === 'undefined'
                      ? 'Select an Option'
                      : selectedPriority.value
                  }
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
                    this.updatePriorityOfToDo(
                      { target: { value: selectedPriority.value } },
                      index + '-select',
                      'open'
                    );
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
                  value={etaExist.value}
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
                  onKeyDown={(eve) =>
                    this.updateEstimatedTimeofCompletion(eve, index + '-date')
                  }
                />{' '}
              </span>
            ) : (
              <span key={index + 'etainfo'}>
                {' '}
                ETA: {this.calculateDays(etaExist.value)}
                <span
                  key={index + 'editetainfo'}
                  style={{ cursor: 'pointer', color: '#1f29a4' }}
                  onClick={(evnt) => {
                    this.updateEstimatedTimeofCompletion(
                      { target: { value: etaExist.value } },
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
    //console.log('Patta Kutti');
    //this.setFocusToTextBox();
    document.title = 'To Do App';
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
  sortArrayElements(givenArray) {
    return givenArray.sort((a, b) => a - b);
  }
  getListOfMatchedEntries(list, pattern, property = 'value') {
    let matchedEntries = [];
    list.forEach((entry) => {
      //console.log(entry);
      let value = String(entry[property]);
      let uniqueId = entry.itemId;
      let entryExist;
      if (property !== 'value') {
        if (pattern === 0) {
          entryExist = +value === +pattern;
        } else if (pattern === 7) {
          if (value <= 7) {
            entryExist = true;
          }
        } else if (pattern === 31) {
          if (value <= 31) {
            entryExist = true;
          }
        } else if (pattern === 365) {
          if (value <= 365) {
            entryExist = true;
          }
        }
      } else {
        entryExist = value.includes(String(pattern));
      }
      if (entryExist) {
        matchedEntries.push(+uniqueId.split('-')[0]);
      }
    });
    //console.log('matchedEntries', matchedEntries);
    return matchedEntries;
  }
  getIndexOfMatchedEntry(list, pattern) {
    let IndexOfMatchedEntry = -1;
    list.forEach((entry, index) => {
      //console.log(entry);
      let uniqueId = entry.itemId;
      let entryExist = uniqueId.includes(String(pattern));

      if (entryExist) {
        // console.log('index is', index);
        IndexOfMatchedEntry = index;
      }
    });
    return IndexOfMatchedEntry;
  }
  clearSearch() {
    this.setState(function (state) {
      return {
        toDoDetails: Object.assign({}, state.toDoDetails, {
          isInSearchMode: false,
        }),
      };
    });
  }
  searchToDo() {
    let searchString = this.state.toDoDetails.newToDo;
    let contentIdsFromPaperWork = [];
    let indexesOfToDoList = [];
    this.state.toDoDetails.todoList.filter((toDoItem, index) => {
      let itemExist = toDoItem.includes(searchString);
      if (itemExist) {
        indexesOfToDoList.push(index);
      }
      return itemExist;
    });
    this.state.toDoDetails.paperwork.filter((paperWorkObj) => {
      let paperWorkContent = paperWorkObj.value;
      let paperWorkId = paperWorkObj.itemId;
      let paperWorkExist = paperWorkContent.includes(searchString);
      if (paperWorkExist) {
        contentIdsFromPaperWork.push(+paperWorkId.split('-')[0]);
      }
      return paperWorkExist;
    });
    //console.log(paperWorkList);
    let listOfIndexes = indexesOfToDoList.concat(contentIdsFromPaperWork);
    listOfIndexes.sort((a, b) => a - b);
    let searchContent = [];
    //console.log('listOfIndexes is', listOfIndexes);
    this.state.toDoDetails.todoList.forEach((toDoItem, index) => {
      if (listOfIndexes.includes(index)) {
        searchContent.push(toDoItem);
      } else {
        searchContent.push({});
      }
    });
    // console.log('searchContent', searchContent);
    this.setState(function (state) {
      return {
        toDoDetails: Object.assign({}, state.toDoDetails, {
          searchList: searchContent,
          isInSearchMode: true,
        }),
      };
    });
  }
  filterTasksBasedOnPriorityOrETA(event) {
    let input = event.target.value;
    this.setState(function (state) {
      return {
        toDoDetails: Object.assign({}, state.toDoDetails, {
          selectedFilterOption: input,
        }),
      };
    });
    let matchedEntries;
    let searchContent = [];
    //let dateRegex = /^\d{4}\-\d{1,2}\-\d{1,2}$/;
    if (isNaN(parseInt(input))) {
      // For ETA
      input =
        input === 'Today'
          ? 0
          : input === 'This Week'
          ? 7
          : input === 'This Month'
          ? 31
          : input === 'This Year'
          ? 365
          : 366;
      // console.log(input);
      matchedEntries = this.getListOfMatchedEntries(
        this.state.toDoDetails.todoETA,
        input,
        'noOfDays'
      );
      matchedEntries = this.sortArrayElements(matchedEntries);
    } else {
      // For Priority
      matchedEntries = this.getListOfMatchedEntries(
        this.state.toDoDetails.selectedPriority,
        input
      );
      matchedEntries = this.sortArrayElements(matchedEntries);
      //console.log(matchedEntries);
    }
    this.state.toDoDetails.todoList.forEach((toDoItem, index) => {
      if (matchedEntries.includes(index)) {
        searchContent.push(toDoItem);
      } else {
        searchContent.push({});
      }
    });
    console.log('searchContent', searchContent);
    this.setState(function (state) {
      return {
        toDoDetails: Object.assign({}, state.toDoDetails, {
          searchList: searchContent,
          isInSearchMode: true,
        }),
      };
    });
  }
  render() {
    let styleForSearchButton = {
      float: 'right',
      cursor: 'pointer',
      marginTop: '-10px',
      marginRight: '200px',
    };

    let styleForSelectDropDown = {
      cursor: 'pointer',
      float: 'right',
      marginTop: '-10px',
      marginRight: '100px',
    };
    let styleForClearButton = {
      cursor: 'pointer',
      float: 'right',
      marginTop: '-10px',
      marginRight: '250px',
    };
    return (
      <>
        <h3> To Do App </h3>
        {this.state.toDoDetails.todoList.length > 5 ? (
          <div className="filterandsearchcontainer">
            <button
              role="search"
              name="Search-Todo"
              onClick={this.searchToDo}
              style={styleForSearchButton}
            >
              {' '}
              Search To Do{' '}
            </button>
            <select
              style={styleForSelectDropDown}
              value={this.state.toDoDetails.selectedFilterOption}
              onChange={this.filterTasksBasedOnPriorityOrETA}
            >
              <option value="none"> Filter Your Tasks</option>
              <optgroup label="Filter Based On ETA">
                <option value="Today">Today</option>
                <option value="This Week">This Week</option>
                <option value="This Month">This Month</option>
                <option value="This Year">This Year</option>
              </optgroup>
              <optgroup label="Filter Based on Priority ">
                <option value="1">Low</option>
                <option value="2">Medium</option>
                <option value="3">Critical</option>
                <option value="4">High</option>
                <option value="5">ShowStopper</option>
              </optgroup>
            </select>
            <button
              role="Clear search"
              name="Clear-Search"
              disabled={!this.state.toDoDetails.isInSearchMode}
              onClick={this.clearSearch}
              style={styleForClearButton}
            >
              {' '}
              Show All Tasks{' '}
            </button>
          </div>
        ) : null}
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
