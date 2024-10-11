import './App.css'
import RequireAuth from './Components/SignIn/RequireAuth.jsx'
import PersistLogin from './Components/SignIn/PersistLogin.jsx'
import Unauthorized from './Components/SignIn/Unauthorized.jsx'
import Layouts from './Components/Pages/Layouts.jsx'
import Home from "./Components/Pages/Home/Home.jsx"
import Shop from './Components/Pages/Shop/Shop.jsx'
import AboutUs from './Components/Pages/About/AboutUs.jsx'
import TermsConditions from './Components/Pages/About/TermsConditions.jsx'
import ShippingPolicy from './Components/Pages/About/ShippingPolicy.jsx'
import RefundPolicy from './Components/Pages/About/RefundPolicy.jsx'
import PrivacyPolicy from './Components/Pages/About/PrivacyPolicy.jsx'
import SignInPage from './Components/SignIn/SignInPage.jsx'
import Account from './Components/Pages/Account/Account.jsx'
import Cart from './Components/Pages/Cart/Cart.jsx'
import Orders from './Components/Pages/Account/Orders/Orders.jsx'
import SingleProductDetail from './Components/Pages/Shop/SingleProductDetail.jsx'
import AccDetails from './Components/Pages/Account/Details/AccDetails.jsx'
import Admin from './Components/Pages/Account/Admin/Admin.jsx'
import AddProducts from './Components/Pages/Account/Admin/AddProducts.jsx'
import Address from './Components/Pages/Account/Address/Address.jsx'
import AddCategory from './Components/Pages/Account/Admin/AddCategory.jsx'
import AddSliders from './Components/Pages/Account/Admin/AddSlider.jsx'
import AddCoupon from './Components/Pages/Account/Admin/AddCoupon.jsx'
import UserOrders from './Components/Pages/Account/Orders/UserOrders.jsx'
import TrackOrder from './Components/Pages/Account/Admin/TrackOrder.jsx'
import Footer from './Components/Footer/Footer.jsx'
import Header from './Components/Header/Header.jsx'


import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; 

import { Provider } from 'react-redux'
import {store} from './app/store.jsx'

const Roles={
  'User':2001,
  'Admin':5150
}
const App =()=>{
  return (
    <Provider store={store}>
      <Router>
        <Routes>
        <Route path='/signin' element={<SignInPage/>}/>
        <Route path='/unauthorized' element={<Unauthorized/>} />
          <Route path='/' element ={<Layouts />} >
            {/* public routes */}
            <Route index element={<Home/>}/>
            <Route path='about' element={<AboutUs/>} />
            <Route path='privacy-policy' element={<PrivacyPolicy/>} />
            <Route path='refund-policy' element={<RefundPolicy/>} />
            <Route path='terms-conditions' element={<TermsConditions/>} />
            <Route path='shippingPolicy' element={<ShippingPolicy/>} />
            
            {/* <Route path='about' element={<About/>}/> */}
            
            
            We want to protect these routes
            <Route element={<PersistLogin/>}>
                <Route element={<RequireAuth allowedRoles={[Roles.User,Roles.Admin]}/>}>
                    <Route path='shop' element={<Shop/>}/>
                    <Route path='account' element={<Account/>}/>
                    <Route path='account/my-orders' element={<Orders/>}/>
                    <Route path='account/account-details' element={<AccDetails/>}/>
                    <Route path='account/address' element={<Address/>}/>
                    <Route path='cart' element={<Cart/>}/>
                    <Route path='shop/:_id' element={<SingleProductDetail/>}/>
                </Route>

                <Route element={<RequireAuth allowedRoles={[Roles.Admin]}/>}>
                    <Route path='account/admin' element={<Admin/>}/>
                    <Route path='account/admin/addSlider' element={<AddSliders/>}/>
                    <Route path='account/admin/addCategory' element={<AddCategory/>}/>
                    <Route path='account/admin/addProducts' element={<AddProducts/>}/>
                    <Route path='account/admin/trackOrders' element={<TrackOrder/>}/>
                    <Route path='account/admin/addCoupon' element={<AddCoupon/>}/>
                </Route>
            </Route>

          </Route>
        </Routes>
      </Router>
    </Provider>
  )
}

export default App
