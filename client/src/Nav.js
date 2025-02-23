import React,{useContext} from 'react'
import {Link} from 'react-router-dom';
import { store} from './App'

const Nav = () => {
  const [token] = useContext(store)
  return (
    <div>
      {!token &&
      <ul>
        <Link to= '/register'><li>Register</li></Link>
        <Link to= '/login'><li>Login</li></Link>
</ul>
}
    </div>
  )
} 

export default Nav
