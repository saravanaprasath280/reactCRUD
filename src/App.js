import logo from './logo.svg';
import './App.css';
import { useState ,useEffect } from 'react';
import { Button,EditableText,InputGroup,Toaster} from '@blueprintjs/core';


const AppToaster = Toaster.create({
   position: "top"
})
function App() {
  const [users, setUsers] = useState([]);
  const [newName, setnewName] = useState("");
  const [newEmail, setnewEmail] = useState("");
  const [newWebsite, setnewWebsite] = useState("");

  useEffect(() =>{
    fetch('https://jsonplaceholder.typicode.com/users')
    .then((response) => response.json() )
    .then((json) => setUsers(json))
  },[])

  function addUser()
  {
    const name = newName.trim();
    const email = newEmail.trim();
    const website = newWebsite.trim();

    if(name && email && website){
     fetch('https://jsonplaceholder.typicode.com/users',
      {
      method: "POST",
      body: JSON.stringify({
        name,
        email,
        website
      }),
      headers:{
        "Content-Type":"application/json; charset=UTF-8"
      }
     })
    .then((response) => response.json() )
    .then(data => {
      setUsers([...users,data])
      AppToaster.show({
        message: "user added successfully",
        intent: "success",
        timeout:3000
      })
      setnewName("");
      setnewEmail("");
      setnewWebsite("");
    })

    }
  }

  
 function onChangeHandler(id, key, value) {
  setUsers((users) => {
   return users.map(user => { 
    return user.id=== id ? {...user,[key]: value}:user;

   })
  })
 }

 function updateUser(id){
  const user = users.find((user) => user.id === id );
  fetch(`https://jsonplaceholder.typicode.com/users/${id}`,
      {
      method: "PUT",
      body: JSON.stringify(user),
      headers:{
        "Content-Type":"application/json; charset=UTF-8"
      }
     })
    .then((response) => response.json() )
    .then(data => {
      AppToaster.show({
        message: "user updated successfully",
        intent: "success",
        timeout:3000
      })
    })


 }

 function deleteUser(id){
fetch(`https://jsonplaceholder.typicode.com/users/${id}`,
      {
      method: "DELETE",
     })
    .then((response) => response.json() )
    .then(data => {

      setUsers((users) => {
        return users.filter(user => user.id !== id)
      })

      AppToaster.show({
        message: "user Deleted successfully",
        intent: "success",
        timeout:3000
      })
    })

 }
  return (
    <div className="App">
     <table className='bp4-html-table modifier'>
       <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Website</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td><EditableText onChange={value => onChangeHandler(user.id,'name', value)}value={user.name}/></td>
              <td><EditableText onChange={value => onChangeHandler(user.id,'email', value)} value={user.email}/></td>
              <td><EditableText onChange={value => onChangeHandler(user.id,'website', value)} value={user.website}/></td>
              <td>
                <Button intent='primary' onClick={() => updateUser(user.id)}>Updated</Button> 
                <Button intent='danger' onClick={() => deleteUser(user.id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td></td>
            <td>
              <InputGroup
              value={newName}
              onChange={(e) => setnewName(e.target.value)}
              placeholder='Enter Name...'/>
            </td>
            <td>
              <InputGroup
              value={newEmail}
              onChange={(e) => setnewEmail(e.target.value)}
              placeholder='Enter Email...'/>
            </td>
            <td>
              <InputGroup
              value={newWebsite}
              onChange={(e) => setnewWebsite(e.target.value)}
              placeholder='Enter Website...'/>
            </td>
            <td><Button intent='success' onClick={addUser}>Add user</Button></td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

export default App;
