import React from 'react';
import './App.css';
import { DragDropContext } from 'react-beautiful-dnd';
import { Droppable } from 'react-beautiful-dnd';
import { Draggable } from 'react-beautiful-dnd';

const reorder = (list, startIndex, endIndex) => { //reorder array function for drag and drop
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

class App extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      arr:[],  //this array is for store the whole fetched data
      subArr:[], //this array is for store initial 5 data and more data when click show more button
      startIndex:5,
    }
  }
 
  async fetchData() {  //fetching data from the api
    try {
        const url = 'http://5db1e7b0e9751d0014ccfecc.mockapi.io/tasks';
        const response = await fetch(url);
        const responseBody = await response.json();
        //console.log(responseBody);
        this.setState({arr: responseBody, subArr: responseBody.slice(0,5)});
        //console.log(this.state.subArr);
        //console.log(this.state.arr);    
    }
    catch (error) {
        console.error('Error:', error);
    }
}

  componentDidMount(){
    this.fetchData();  
  }

  showMoreTasks(){ //showmore tasks when click show more button
    let leftIndex = this.state.startIndex;
    //console.log(leftIndex);
    let rightIndex = leftIndex + 5;
    this.setState({subArr: [...this.state.subArr, ...this.state.arr.slice(leftIndex, rightIndex)], startIndex: rightIndex});
    //console.log(this.state.subArr);
  }

  onDragEnd(result) {  //drag and drop function
    // dropped outside the list
    if (!result.destination) {
      return;
    }
    const tasks = reorder(
      this.state.subArr,
      result.source.index,
      result.destination.index
    );

    this.setState({
      subArr:tasks
    });
  }

  checkboxChange(e){ //click check box, change the completed
    let subArr = this.state.subArr;
    for(let i = 0; i < subArr.length; i++){
      if(subArr[i].details === e.target.value){
        subArr[i].completed = e.target.checked;
      }
    }
    this.setState({subArr: subArr});
    console.log(this.state.subArr); //we can see the completed data changed through console log
  }

  render(){
    let tasks = this.state.subArr;
    return(
      <DragDropContext onDragEnd={(result)=>this.onDragEnd(result)}>
      <div>
        <h1>Tasks show here</h1>
        <ul>
          <Droppable droppableId="droppable">
            {(provided, snapshot)=>(
              <div ref={provided.innerRef} style={{ backgroundColor: snapshot.isDraggingOver ? 'pink' : 'white' }}{...provided.droppableProps}>
                {tasks.map((task,index) =>(
                <Draggable key={task.id} draggableId={task.id} index={index}>
                  {(provided) => (
                    <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                         <li key={task.id} style={{textDecoration: task.completed? 'line-through' : 'none'}}>
                           {task.details}
                           <input type = "checkbox"  value = {task.details} onChange = {(e)=>this.checkboxChange(e)}/>
                          </li>
                    </div>
                   )}
                 </Draggable>
                 ))}
                 {provided.placeholder}
                </div>
              )}
            </Droppable>
        </ul>
        <button onClick = {() => this.showMoreTasks()}>Show More</button>
      </div>
      </DragDropContext>
    );
  }
}

export default App;
