import './App.css'
import { Route, Routes, useNavigate } from 'react-router'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import CreateRestaurantPage from './pages/Restaurant/CreateRestaurantPage'
import Restaurant from './pages/Restaurant/Restaurant'
import CategoryPage from './pages/Restaurant/CategoryPage'
import ProfilePage from './pages/ProfilePage'
import OrderItems from './components/OrderItems'
import Order from './pages/customer/Order'
import Layout from './pages/Layout'
import RestaurantDashboard from './pages/Restaurant/RestaurantDashboard'
import Transaction from './pages/customer/Transactions'
import Dashboard from './components/charts/Dashboard'

function App() {

  return (
    <Routes>
        <Route path='/login' element={<Login/> } />
        <Route path='/register' element={<Register/>} />
      <Route path='/' element={<Layout/>} >
        <Route path='' element={ <Home/> } />
        <Route path='profile' element={<ProfilePage/>} />
        <Route path='restaurant' element={<RestaurantDashboard/>} />
        <Route path='restaurant/:id' element={<Restaurant/>} />
        <Route path='restaurant/:id/category/:categoryid' element={<CategoryPage/>} />
        <Route path='order/:id' element={<OrderItems/>} />
        <Route path='orders' element={<Order/>} />
        <Route path='transactions' element={<Transaction/>} />
        {/* <Route path='charts' element={<MenuOfRestaurantChart/>} /> */}
        <Route path='charts' element={<Dashboard/>} />
      </Route>
    </Routes>
  )
}

export default App
