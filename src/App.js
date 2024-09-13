import React, {useEffect, useState, useCallback} from 'react';
import axios from 'axios';

import './App.css';

import List from './Components/List/List';
import Navbar from './Components/Navbar/Navbar';

function App() {
  const statusList = ['In progress', 'Backlog', 'Todo', 'Done', 'Cancelled']
  const userList = ['Anoop sharma', 'Yogesh', 'Shankar Kumar', 'Ramesh', 'Suresh']
  const priorityList = [{name:'No priority', priority: 0},
     {name:'Urgent', priority: 4},
      {name:'High', priority: 3}, 
      {name:'Medium', priority: 2},
       {name:'Low', priority: 1}]


const [groupValue, setgroupValue] = useState(() => {
  const storedGroupValue = localStorage.getItem('groupValue');
  return storedGroupValue ? JSON.parse(storedGroupValue) : 'status';
});

const [orderValue, setorderValue] = useState('title');


const [ticketDetails, setticketDetails] = useState([]);

const orderDataByValue = useCallback((cardsArray) => {
  const sortedCards = [...cardsArray]; 

  
  if (orderValue === 'priority') {
    sortedCards.sort((a, b) => b.priority - a.priority);
  } 

  else if (orderValue === 'title') {
    sortedCards.sort((a, b) => a.title.localeCompare(b.title, undefined, { sensitivity: 'base' }));
  }

  setticketDetails(sortedCards); 
}, [orderValue]);

  

  function saveStateToLocalStorage(state) {
    localStorage.setItem('groupValue', JSON.stringify(state));
  }
  // eslint-disable-next-line
  function getStateFromLocalStorage() {
    return JSON.parse(localStorage.getItem('groupValue')) || null;
  }
  
  useEffect(() => {
    
    saveStateToLocalStorage(groupValue);
  
    
    const fetchData = async () => {
      try {
   
        const response = await axios.get('https://api.quicksell.co/v1/internal/frontend-assignment');
  

        if (response.status === 200) {
          const { tickets, users } = response.data;
  
         
          const ticketArray = tickets
            .map(ticket => {
              const user = users.find(user => user.id === ticket.userId);
              return user ? { ...ticket, userObj: user } : null;
            })
            .filter(ticket => ticket !== null);
  
       
          setticketDetails(ticketArray);
          orderDataByValue(ticketArray);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  

    fetchData();
  }, [orderDataByValue, groupValue]);
  
  

  function handleGroupValue(value){
    setgroupValue(value);
  }

  function handleOrderValue(value){
    setorderValue(value);
  }
  
 return (
  <>
    <Navbar
      groupValue={groupValue}
      orderValue={orderValue}
      handleGroupValue={handleGroupValue}
      handleOrderValue={handleOrderValue}
    />
    <section className="canvas-info">
      <div className="canvas-list">
        {
          {
            'status': statusList.map(listItem => (
              <List
                key={listItem}
                groupValue='status'
                orderValue={orderValue}
                listTitle={listItem}
                listIcon=''
                statusList={statusList}
                ticketDetails={ticketDetails}
              />
            )),
            
            'user': userList.map(listItem => (
              <List
                key={listItem}
                groupValue='user'
                orderValue={orderValue}
                listTitle={listItem}
                listIcon=''
                userList={userList}
                ticketDetails={ticketDetails}
              />
            )),
            
            'priority': priorityList.map(listItem => (
              <List
                key={listItem.priority}
                groupValue='priority'
                orderValue={orderValue}
                listTitle={listItem.priority}
                listIcon=''
                priorityList={priorityList}
                ticketDetails={ticketDetails}
              />
            ))
          }[groupValue]
        }
      </div>
    </section>
  </>
);
}


export default App;
