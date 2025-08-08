import {Routes,Route} from "react-router-dom";
import Home from "../pages/home.jsx"
import Movimientos from "../pages/movimientos.jsx"


const AppRoutes=()=>{
    return(
        <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route path="/movimientos" element={<Movimientos />}></Route>
        </Routes>
    )
}

export default AppRoutes