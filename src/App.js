import React from 'react';
import { withRouter } from 'react-router-dom';
import { Link } from 'react-router-dom';
import LogoutButton from './Logout.js';
import './style.css';

export default class AddToDo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      toDoDetails: {
        newToDo: '',
        todoList: [],
        searchList: [],
        paginatedList: [],
        isEdit: false,
        editIndex: 0,
        labelText: 'Add',
        errorMessage: null,
        selectedPriority: [],
        paperwork: [],
        todoETA: [],
        status: [],
        checkedItems: new Map(),
        isInSearchMode: false,
        selectedFilterOption: 'Filter',
        paginationReached: false,
        paginationBatch: 1,
        selectedPaginationIndex: 1,
        searchListPaginationStartIndices: [],
        fromBrowserStore: false,
        isDetailsPage:false,
        toDotemToLoad:''
      },
    };
    this.textBoxField = React.createRef();
    this.hideErrorMessage = this.hideErrorMessage.bind(this);
    this.loadPaginatedToDoList = this.loadPaginatedToDoList.bind(this);
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
        this.setState(
          function (state) {
            return {
              toDoDetails: Object.assign({}, state.toDoDetails, {
                todoList: this.state.toDoDetails.todoList.concat(toDoContent),
                errorMessage: null,
              }),
            };
          },
          () => {
            this.handlerForPaginationButtonStates();
            this.clearToDo();
          }
        );
      } else {
        let tempToDoList = this.state.toDoDetails.todoList.slice();
        let updatedTempList = tempToDoList.splice(
          this.state.toDoDetails.editIndex,
          1,
          toDoContent
        );
        this.setState(
          function (state) {
            
            return {
              toDoDetails: Object.assign({}, state.toDoDetails, {
                todoList: tempToDoList,
                isEdit: false,
                editIndex: 0,
                labelText: 'Add',
                errorMessage: null,
              }),
            };
          },
          () => {
            this.handlerForPaginationButtonStates(
              this.state.toDoDetails.paginationBatch,
              'edit'
            );
            this.clearToDo();
          }
        );
      }
    } else {
      return null;
    }
  }
  storeDataInBrowserStore(entity, data) {
    if (localStorage.getItem('browserStoretoDoList') === null) {
            localStorage.setItem(
        'browserStoretoDoList',
        JSON.stringify({
          todoList: [],
          eta: [],
          paperwork: [],
          status: [],
          priority: [],
        })
      );
    }
    let dataObJfromLocalStorage = JSON.parse(
      localStorage.getItem('browserStoretoDoList')
    );
    dataObJfromLocalStorage[entity] = data;
    localStorage.setItem(
      'browserStoretoDoList',
      JSON.stringify(dataObJfromLocalStorage)
    );
  }
  handlerForPaginationButtonStates(index = 0, action) {
    // localStorage.setItem('')
    if (this.state.toDoDetails.isInSearchMode === false) {
      this.storeDataInBrowserStore('todoList', this.state.toDoDetails.todoList);
    }
    let toDoList =
      this.state.toDoDetails.isInSearchMode === true
        ? this.state.toDoDetails.searchList
        : this.state.toDoDetails.todoList;
    let paginationReached = this.state.toDoDetails.paginationReached;
    let paginationBatch = this.state.toDoDetails.paginationBatch;

    if (toDoList.length === 11 && paginationReached === false) {
      this.setState(function (state) {
        return {
          toDoDetails: Object.assign({}, state.toDoDetails, {
            paginationReached: true,
          }),
        };
      });
    }
    let pagiCount = Math.ceil(toDoList.length / 12);
    let countOfLastSetOfToDo = toDoList.length % 12;

    if (
      (action === 'remove' && countOfLastSetOfToDo > 0) ||
      action === 'edit'
    ) {
      index = this.state.toDoDetails.selectedPaginationIndex;
    }
    let showNextSetOfToDoList =
      paginationBatch < pagiCount && paginationReached;
    if (showNextSetOfToDoList) {
      this.setState(
        function (state) {
          return {
            toDoDetails: Object.assign({}, state.toDoDetails, {
              paginationBatch: pagiCount,
            }),
          };
        },
        () => {
          this.renderPaginatedList(index);
        }
      );
    }
    let showPreviousSetOfToDoList =
      paginationBatch > pagiCount && paginationReached;
    if (showPreviousSetOfToDoList) {
      this.setState(
        function (state) {
          return {
            toDoDetails: Object.assign({}, state.toDoDetails, {
              paginationBatch: pagiCount,
            }),
          };
        },
        () => {
          this.renderPaginatedList(this.state.toDoDetails.paginationBatch);
        }
      );
    }
    if (!showNextSetOfToDoList && !showPreviousSetOfToDoList) {
      this.renderPaginatedList(index);
    }
  }
  renderPaginatedList(index) {
    // console.log('inside');
    console.log(
      this.state.toDoDetails.paginationReached,
      this.state.toDoDetails.paginationBatch,
      index
    );
    let paginatedList = [];

    if (this.state.toDoDetails.paginationReached) {
      let startValue =
        ((index || this.state.toDoDetails.paginationBatch) - 1) * 12;

      console.log('paginatedList', startValue, startValue + 12);

      let iterableLIst =
        this.state.toDoDetails.isInSearchMode === true
          ? this.state.toDoDetails.searchList
          : this.state.toDoDetails.todoList;
      console.log('iterableLIst length', iterableLIst.length);
      if (this.state.toDoDetails.isInSearchMode === false) {
        iterableLIst.forEach((toDoItem, ind) => {
          console.log('toDoItem', toDoItem, 'index', ind);
          if (+ind >= startValue && +ind < startValue + 12) {
            paginatedList.push(toDoItem);
          } else {
            paginatedList.push({});
          }
        });
      } else {
        let startIndex = index - 1;
        let endIndex;
        let lengthOfsearchListPaginationStartIndices =
          this.state.toDoDetails.searchListPaginationStartIndices.length;
        if (index === lengthOfsearchListPaginationStartIndices) {
          let endIndexDiff =
            this.state.toDoDetails.searchList.length -
            this.state.toDoDetails.searchListPaginationStartIndices[startIndex];
          endIndex =
            this.state.toDoDetails.searchListPaginationStartIndices[
              startIndex
            ] + endIndexDiff;
        } else {
          endIndex =
            this.state.toDoDetails.searchListPaginationStartIndices[
              startIndex
            ] + 12;
        }

        let pagistartIndex =
          this.state.toDoDetails.searchListPaginationStartIndices[startIndex];

        console.log('pagistartIndex', pagistartIndex, 'endIndex', endIndex);
        paginatedList = this.state.toDoDetails.searchList.slice(
          pagistartIndex,
          endIndex
        );
      }
      this.setState(function (state) {
        return {
          toDoDetails: Object.assign({}, state.toDoDetails, {
            paginatedList: paginatedList,
            isInSearchMode: this.state.toDoDetails.isInSearchMode,
            selectedPaginationIndex:
              index || this.state.toDoDetails.paginationBatch,
          }),
        };
      });
    } else {
      let iterableLIst =
        this.state.toDoDetails.isInSearchMode === true
          ? this.state.toDoDetails.searchList
          : this.state.toDoDetails.todoList;

      this.setState(function (state) {
        return {
          toDoDetails: Object.assign({}, state.toDoDetails, {
            paginatedList: iterableLIst,
            isInSearchMode: this.state.toDoDetails.isInSearchMode,
            selectedPaginationIndex:
              index || this.state.toDoDetails.paginationBatch,
          }),
        };
      });
    }
  }
  insertAt(array, index, ...elementsArray) {
    array.splice(index, 0, ...elementsArray);
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
    let inSearchMode = this.state.toDoDetails.isInSearchMode;
    let updatedSearchList;
    if (inSearchMode === true) {
      let searchList = this.state.toDoDetails.searchList;
      updatedSearchList = searchList
        .slice(0, index)
        .concat(searchList.slice(index + 1));
    }
   // console.log('updatedSearchList is', updatedSearchList);
    this.setState(
      function (state) {
        return {
          toDoDetails: Object.assign({}, state.toDoDetails, {
            todoList: updatedToDoList,
            searchList: updatedSearchList,
          }),
        };
      },
      () => {
        this.handlerForPaginationButtonStates(
          this.state.toDoDetails.paginationBatch,
          'remove'
        );
      }
    );

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
    let statusList = this.state.toDoDetails.status;
    let statusIndex = this.getIndexOfMatchedEntry(statusList, index);
    if (statusIndex != -1) {
      let updatedStatusList = statusList
        .slice(0, statusIndex)
        .concat(statusList.slice(statusIndex + 1));
      this.setState(function (state) {
        return {
          toDoDetails: Object.assign({}, state.toDoDetails, {
            status: updatedStatusList,
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

    if (
      this.state.toDoDetails.todoList.length === 11 &&
      this.state.toDoDetails.paginationReached === true
    ) {
      this.setState(function (state) {
        return {
          toDoDetails: Object.assign({}, state.toDoDetails, {
            paginationReached: false,
          }),
        };
      });
    }
  }
  updatePriorityOfToDo(evnt, id, selectState) {
    let startTime = performance.now();
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
    this.setState(
      function (state) {
        return {
          toDoDetails: Object.assign({}, state.toDoDetails, {
            selectedPriority: priorityList,
          }),
        };
      },
      () => {
        let endTime = performance.now();
        /*rg4js('trackEvent', {
          type: 'customTiming',
          name: 'Priority Update Time',
          duration: (endTime - startTime)
        });*/
        console.log('duration is' , (endTime - startTime) );
        this.storeDataInBrowserStore(
          'priority',
          this.state.toDoDetails.selectedPriority
        );
      }
    );
  }
  handleStatusChange(evt, id) {
    const item = evt.target.name;
    const isChecked = evt.target.checked;
    this.setState(function (prevState) {
      // console.log(prevState.toDoDetails.checkedItems);
      return {
        toDoDetails: Object.assign({}, prevState.toDoDetails, {
          checkedItems: prevState.toDoDetails.checkedItems.set(id, isChecked),
        }),
      };
    });
  }
  resetCheckBoxOfStatus(id) {
    this.setState(function (prevState) {
      //console.log(prevState.toDoDetails.checkedItems);
      return {
        toDoDetails: Object.assign({}, prevState.toDoDetails, {
          checkedItems: prevState.toDoDetails.checkedItems.set(id, false),
        }),
      };
    });
  }
  updateStatusOfToDoItems(obj) {
    for (const [key, value] of this.state.toDoDetails.checkedItems.entries()) {
      //console.log(key + ' = ' + value);
      //console.log(obj, key);
      let that = this;
      setTimeout(function () {
        if (value === true) {
          that.updateStatusOfToDo(obj, key, 'close');
          that.resetCheckBoxOfStatus(key);
        }
      }, 100);
    }
  }
  massUpdateStatusOfToDo(value) {
    // console.log(value);
    this.updateStatusOfToDoItems({ target: { value: value } });
  }
  updateStatusOfToDo(evnt, id, actionState) {
    // console.log(id, actionState);
    performance.mark('update-status-start');
    let startTime = performance.now();

    let value = evnt.target.value;
    if (value === 'none') {
      return false;
    }
    let statusList = this.state.toDoDetails.status.slice();
    let itemexist;
    itemexist = statusList.find(({ itemId }) => itemId === id);

    //console.log('item', itemexist);
    if (!itemexist) {
      statusList.push({
        itemId: id,
        value: value,
        action: actionState,
        inDB: false,
      });
    } else {
      if (actionState === 'close') {
        itemexist.inDB = true;
      }
      itemexist.value = value;
      itemexist.action = actionState;
      statusList.forEach((item_priority, index) => {
        if (item_priority.itemId === id) {
          statusList[index] = itemexist;
        }
      });
    }
    this.setState(
      function (state) {
        return {
          toDoDetails: Object.assign({}, state.toDoDetails, {
            status: statusList,
          }),
        };
      },
      () => {
        let endTime = performance.now();
        /*rg4js('trackEvent', {
          type: 'customTiming',
          name: 'Update Status',
          duration: (endTime - startTime)
        });
        console.log('Log duration' ,endTime - startTime);*/
        performance.mark('update-status-end');
        performance.measure('UpdateStatusofTodo', 'update-status-start', 'update-status-end');


        this.storeDataInBrowserStore('status', this.state.toDoDetails.status);
      }
    );
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
    this.setState(
      function (state) {
        return {
          toDoDetails: Object.assign({}, state.toDoDetails, {
            paperwork: paperWorkList,
          }),
        };
      },
      () => {
        this.storeDataInBrowserStore(
          'paperwork',
          this.state.toDoDetails.paperwork
        );
      }
    );
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
  renderDetailsOfPaperWork(givenTodoItem) {
    //console.log('Need to load the content of paperWork');
    let indexOfPaperWork;
    let paperWorkContent = '';
    this.state.toDoDetails.todoList.filter((toDoItem, index) => {
      let itemExist = toDoItem.includes(givenTodoItem);
      if (itemExist) {
        indexOfPaperWork = index;
      }
      return itemExist;
    });
    this.state.toDoDetails.paperwork.filter((paperWorkObj) => {
      let paperWorkId = paperWorkObj.itemId;
      let toDoId = +paperWorkId.split('-')[0];
      if (+toDoId === +indexOfPaperWork) {
        paperWorkContent = paperWorkObj.value;
       // console.log('paperWorkContent', paperWorkContent);
      }
      return false;
    });
    return <div key={givenTodoItem+"div"}> <Link to="/todo/list">Back To List View</Link> <p style={{ whiteSpace: 'pre' }} key={givenTodoItem}> {paperWorkContent} </p></div>;
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
    this.setState(
      function (state) {
        return {
          toDoDetails: Object.assign({}, state.toDoDetails, {
            todoETA: etaList,
          }),
        };
      },
      () => {
        this.storeDataInBrowserStore('eta', this.state.toDoDetails.todoETA);
      }
    );
  }
  setFocusToTextArea(event) {
    //console.log(event);
    event.target.selectionEnd = (0, event.target.value.length);
  }
  handleHover(event, id) {
    //console.log(id);
    this.setState(function (prevState) {
      let checkeBoxStatus = prevState.toDoDetails.checkedItems.get(id);
      let newStatus = 'hovered';
      if (checkeBoxStatus === true) {
        newStatus = true;
      }
      //console.log(prevState.toDoDetails.checkedItems);
      return {
        toDoDetails: Object.assign({}, prevState.toDoDetails, {
          checkedItems: prevState.toDoDetails.checkedItems.set(id, newStatus),
        }),
      };
    });
  }
  handleLeave(event, id) {
    this.setState(function (prevState) {
      let checkeBoxStatus = prevState.toDoDetails.checkedItems.get(id);
      let newStatus = false;
      //console.log(checkeBoxStatus);
      if (checkeBoxStatus === true) {
        newStatus = true;
      }
     // console.log('checkedStatus', checkeBoxStatus);
      return {
        toDoDetails: Object.assign({}, prevState.toDoDetails, {
          checkedItems: prevState.toDoDetails.checkedItems.set(id, newStatus),
        }),
      };
    });
  }
  renderToDoItems(index = 0) {
    // console.log('inside renderToDotems', index);
    if(this.state.toDoDetails.isDetailsPage === true)
    {
      return this.renderDetailsOfPaperWork(this.state.toDoDetails.toDotemToLoad);
    }

    let toDoList;
    if (this.state.toDoDetails.fromBrowserStore) {
      toDoList = this.state.toDoDetails.todoList;
    } else {
      toDoList = this.state.toDoDetails.paginatedList;
    }
    /*console.log(
      'fromBrowserStore',
      this.state.toDoDetails.fromBrowserStore,
      toDoList
    );*/
    let isSearchMatchsCriteria = 0;
  //  console.log(toDoList);
    if (toDoList.length === 0 && this.state.toDoDetails.isInSearchMode) {
      return <p> Data Not Found </p>;
    }

    return toDoList.map((value, index) => {
     // console.log('inside>>>>>>>>>>>>>>>', value, index);
      if (Object.keys(value).length === 0 && value.constructor === Object) {
        isSearchMatchsCriteria++;
        if (isSearchMatchsCriteria === toDoList.length) {
          return <p> Data Not Found </p>;
        } else {
          return false;
        }
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
      let selectedStatus = this.state.toDoDetails.status.find(
        ({ itemId }) => itemId === index + '-statusselect'
      );
      if (typeof selectedStatus === 'undefined') {
        selectedStatus = {};
        selectedStatus.action = 'open';
        selectedStatus.inDB = false;
      }
      selectedStatus.textLabel = 'Select Status';
      if (selectedStatus.inDB) {
        selectedStatus.textLabel = 'Update Status';
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
      let cbStatus = this.state.toDoDetails.checkedItems.get(
        index + '-statusselect'
      );
      return (
        <div key={index + 'todo-pagicontainer'}>
          <div
            className="todolistrow"
            key={index + 'todocontainer'}
            onMouseOver={(hoverEvent) =>
              this.handleHover(hoverEvent, index + '-statusselect')
            }
            onMouseLeave={(mouseEvent) =>
              this.handleLeave(mouseEvent, index + '-statusselect')
            }
          >
            <p key={index}>
              {cbStatus === true || cbStatus === 'hovered' ? (
                <input
                  type="checkbox"
                  key={index + '-checkbox'}
                  name={index + '-statusselect'}
                  onChange={(eve) =>
                    this.handleStatusChange(eve, index + '-statusselect')
                  }
                />
              ) : null}
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
                  <span key={index + 'sp'}>
                    {' '}
                    {selectedPriority.textLabel}:{' '}
                  </span>
                  <select
                    key={index + '-select'}
                    style={{ cursor: 'pointer' }}
                    value={
                      selectedPriority.value === 'undefined'
                        ? 'Select an Option'
                        : selectedPriority.value
                    }
                    onChange={(event) =>
                      this.updatePriorityOfToDo(
                        event,
                        index + '-select',
                        'open'
                      )
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
              | &nbsp;
              {selectedStatus.action === 'open' ? (
                <span>
                  {' '}
                  <span key={index + 'statussp'}>
                    {' '}
                    {selectedStatus.textLabel}:{' '}
                  </span>
                  <select
                    key={index + '-statusselect'}
                    style={{ cursor: 'pointer' }}
                    value={
                      selectedStatus.value === 'undefined'
                        ? 'Select an Option'
                        : selectedStatus.value
                    }
                    onChange={(event) =>
                      this.updateStatusOfToDo(
                        event,
                        index + '-statusselect',
                        'open'
                      )
                    }
                    onBlur={(evt) =>
                      this.updateStatusOfToDo(
                        evt,
                        index + '-statusselect',
                        'close'
                      )
                    }
                  >
                    <option key={index + 'statusnone'} value="none">
                      Select an Option
                    </option>

                    <option key={index + '1'} value="1">
                      Not Started
                    </option>
                    <option key={index + '2'} value="2">
                      In-Progress
                    </option>
                    <option key={index + '3'} value="3">
                      On-Hold
                    </option>
                    <option key={index + '4'} value="4">
                      Finished
                    </option>
                  </select>{' '}
                  &nbsp;
                </span>
              ) : (
                <span key={index + '-status'}>
                  {' '}
                  Selected Status: {selectedStatus.value}{' '}
                  <span
                    key={index + 'editStatus'}
                    style={{ cursor: 'pointer', color: '#1f29a4' }}
                    onClick={(evnt) => {
                      this.updateStatusOfToDo(
                        { target: { value: selectedStatus.value } },
                        index + '-statusselect',
                        'open'
                      );
                    }}
                  >
                    {' '}
                    - Edit Status &nbsp;
                  </span>
                </span>
              )}
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
                <span key={index+'more'}> <Link to={`/todo/detail/${value}`}>More...</Link> </span>
              </p>
            ) : null}

            <hr key={index + 'hr'} />
          </div>
        </div>
      );
    });
  }
  loadPaginatedToDoList(ev, index) {
    this.renderPaginatedList(index);
  }
  componentDidMount() {
    //console.log('Patta Kutti');
    //this.setFocusToTextBox();
    document.title = 'To Do App';
    const toToDoLabel = this.props.match.params.id;
    let isDetailsPage = false;
    if(typeof toToDoLabel !== 'undefined' )
    {
      isDetailsPage = true;
    }
    if (localStorage.getItem('browserStoretoDoList') != null) {
      let dataFromBrowserStore = JSON.parse(
        localStorage.getItem('browserStoretoDoList')
      );
      this.setState(function (prevState) {
        // console.log(prevState.toDoDetails.checkedItems);
        return {
          toDoDetails: Object.assign({}, prevState.toDoDetails, {
            todoList: dataFromBrowserStore.todoList,
            selectedPriority: dataFromBrowserStore.priority,
            todoETA: dataFromBrowserStore.eta,
            status: dataFromBrowserStore.status,
            paperwork: dataFromBrowserStore.paperwork,
            fromBrowserStore: true,
            isDetailsPage:isDetailsPage,
            toDotemToLoad:toToDoLabel
          }),
        };
      });
    }
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
      // console.log(value);

      let uniqueId = entry.itemId;
      // console.log(uniqueId);
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
    this.renderPaginatedList();
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
    let searchCount = 0;
    //console.log('listOfIndexes is', listOfIndexes);
    let paginateddataStartIndexes = [];
    this.state.toDoDetails.todoList.forEach((toDoItem, index) => {
      if (listOfIndexes.includes(index)) {
        if (searchCount === 0 || index % 12 === 0) {
          paginateddataStartIndexes.push(index);
        }
        searchContent.push(toDoItem);
        searchCount++;
      } else {
        searchContent.push({});
      }
    });
    // console.log('searchContent', searchContent);
    this.setState(
      function (state) {
        return {
          toDoDetails: Object.assign({}, state.toDoDetails, {
            searchList: searchContent,
            isInSearchMode: true,
            searchListPaginationStartIndices: paginateddataStartIndexes,
          }),
        };
      },
      () => {
        this.showPaginationButton(Math.ceil(searchCount / 12));
      }
    );
  }

  showPaginationButton(buttonCount) {
    let paginationReached = false;
    if (buttonCount > 1) {
      paginationReached = true;
    }
    this.setState(
      function (state) {
        return {
          toDoDetails: Object.assign({}, state.toDoDetails, {
            paginationBatch: buttonCount,
            selectedPaginationIndex: 1,
            paginationReached: paginationReached,
          }),
        };
      },
      () => {
        this.renderPaginatedList();
      }
    );
  }
  filterTasksBasedOnPriorityOrETA(event) {
    let input = event.target.value;
    // console.log(input);
    this.setState(function (state) {
      return {
        toDoDetails: Object.assign({}, state.toDoDetails, {
          selectedFilterOption: input,
        }),
      };
    });
    let matchedEntries;
    let searchContent = [];
    let searchCount = 0;
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
      // console.log(input.endsWith('n'));
      if (input.endsWith('n')) {
        matchedEntries = this.getListOfMatchedEntries(
          this.state.toDoDetails.status,
          input.split('n')[0]
        );
        matchedEntries = this.sortArrayElements(matchedEntries);
      } else {
        // For Priority
        matchedEntries = this.getListOfMatchedEntries(
          this.state.toDoDetails.selectedPriority,
          input
        );
        matchedEntries = this.sortArrayElements(matchedEntries);
      }
      //console.log(matchedEntries);
    }
    let paginateddataStartIndexes = [];
    this.state.toDoDetails.todoList.forEach((toDoItem, index) => {
      if (matchedEntries.includes(index)) {
        if (searchCount === 0 || index % 12 === 0) {
          paginateddataStartIndexes.push(index);
        }

        searchContent.push(toDoItem);
        searchCount++;
      } else {
        searchContent.push({});
      }
    });
   // console.log('paginateddataStartIndexes', paginateddataStartIndexes);
    // console.log('searchContent', searchContent);
    this.setState(
      function (state) {
        return {
          toDoDetails: Object.assign({}, state.toDoDetails, {
            searchList: searchContent,
            isInSearchMode: true,
            searchListPaginationStartIndices: paginateddataStartIndexes,
          }),
        };
      },
      () => {
        this.showPaginationButton(Math.ceil(searchCount / 12));
      }
    );
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
      marginRight: '250px',
    };
    let styleForClearButton = {
      cursor: 'pointer',
      float: 'right',
      marginTop: '-10px',
      marginRight: '300px',
    };
    let styleForStatusButton = {
      cursor: 'pointer',
      float: 'right',
      marginTop: '-10px',
      marginRight: '100px',
    };
    let styleForPaginationButton = {
      cursor: 'pointer',
    };

    let paginationHTML = [];
    if (
      this.state.toDoDetails.paginationReached &&
      this.state.toDoDetails.paginationBatch > 1
    ) {
      for (
        let index = 1;
        index <= this.state.toDoDetails.paginationBatch;
        index++
      ) {
        paginationHTML.push(
          <span
            className={`handcursor ${
              index === this.state.toDoDetails.selectedPaginationIndex
                ? 'highlight'
                : ''
            }`}
            key={index}
            onClick={(evet) => this.loadPaginatedToDoList(evet, index)}
          >
            {index} &nbsp; &nbsp;{' '}
          </span>
        );
      }
    }
    return (
      <>
        <h3 elementtiming="featured-heading"> To Do App </h3>
        {this.state.toDoDetails.todoList.length > 5 ? (
          <div className="filterandsearchcontainer">
            <button
              role="search"
              name="Search-Todo"
              onClick={this.searchToDo}
              /*onClick={(evet) => this.renderDetailsOfPaperWork('UCL')}*/
              style={styleForSearchButton}
            >
              {' '}
              Search To Do{' '}
            </button>
            <select
              style={styleForStatusButton}
              onBlur={(event) =>
                this.massUpdateStatusOfToDo(event.target.value)
              }
            >
              <option key="statusnone" value="none">
                Mass Update Status
              </option>

              <option key="statusnotstarted" value="1">
                Not Started
              </option>
              <option key="status-inprogress" value="2">
                In-Progress
              </option>
              <option key="status-onhold" value="3">
                On-Hold
              </option>
              <option key="status-finished" value="4">
                Finished
              </option>
            </select>

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
              <optgroup label="Filter Based on Priority">
                <option value="1">Low</option>
                <option value="2">Medium</option>
                <option value="3">Critical</option>
                <option value="4">High</option>
                <option value="5">ShowStopper</option>
              </optgroup>
              <optgroup label="Filter Based on Status">
                <option value="1n">Not Started</option>
                <option value="2n">In-Progress</option>
                <option value="3n">On-Hold</option>
                <option value="4n">Finished</option>
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
        <LogoutButton />
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
        {this.state.toDoDetails.paginationBatch > 1 ? (
          <div className="paginationContainer">{paginationHTML}</div>
        ) : null}
      </>
    );
  }
}
export default withRouter(AddToDo);