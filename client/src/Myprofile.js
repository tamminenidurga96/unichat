import React, { useContext, useState, useEffect } from 'react';
import { store } from "./App";
import { Navigate } from 'react-router-dom'; // Use Navigate instead of Redirect
import axios from 'axios';
import Moment from 'react-moment';


const Myprofile = () => {
  const [token, setToken] = useContext(store); // Keep setToken for the logout button
  const [data, setData] = useState(null);
  const [allmsg, setAllmsg] = useState([]);
  const [newmsg, setNewmsg] = useState("");

  useEffect(() => {
    if (token) {
      axios.get('http://localhost:5000/myprofile', {
        headers: {
          'x-token': token
        }
      })
      .then(res => setData(res.data))
      .catch((err) => console.log(err));
      
      axios.get('http://localhost:5000/getmsg', {
        headers: {
          'x-token': token
        }
      })
      .then(res => setAllmsg(res.data))
      .catch((err) => console.log(err));
    }
  }, [token]); // Include token in the dependency array
  const submitHandler= e=> {
    e.preventDefault();
    axios.post('http://localhost:5000/addmsg', {text:newmsg},{
      headers: {
        'x-token': token
      }
    })
    .then(res => setAllmsg(res.data))
    .catch((err) => console.log(err));
  }

  if (!token) {
    return <Navigate to='/login' />; // Use Navigate instead of Redirect
  }

  return (
    <div>
      {data && (
        <center>
          <br />
          <div className="card" style={{ "width": "38rem", "textAlign": "left" }}>
            <div className="card-body">
              {
                allmsg.length > 0 ? (
                  allmsg.map(message => (
                    <div className="card" key={message._id}> {/* Add a unique key */}
                      <div className="card-body">
                        <h5 className="card-title">{message.username} <br /><Moment style={{"fontSize":"11px"}} format="hh:mm:ss" >{message.date}</Moment></h5> {/* Use className */}
                        <p>{message.text}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <h1>Message Loading....</h1>
                )
              }
              <form onSubmit={submitHandler}>
                <input type ="text" onChange={e => setNewmsg(e.target.value)} />
                <input type="submit" value="send message" />
              </form>
              <button onClick={() => setToken(null)}>Logout</button>
            </div>
          </div>
        </center>
      )}
    </div>
  );
};

export default Myprofile;
