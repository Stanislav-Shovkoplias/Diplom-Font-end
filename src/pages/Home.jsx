import { NavLink, Outlet } from "react-router-dom";

import { useEffect, useState } from "react";
import "./Home.scss";
// import "./HomeCheckbox.scss";

import {Plus} from "../components/UiIcons.jsx";

import {REST} from "../env/config.jsx"

export default function Home() {
    const [auctions, setAuctions] = useState([]);
   const [filterIsClosed, setFilterIsClosed] = useState(0);
   const [filterSort, setFilterSort] = useState("new");

   const submitFilterForm = (e) =>{
      e.preventDefault();
      console.log(REST.getAll(filterIsClosed,filterSort));
      fetch(REST.getAll(filterIsClosed,filterSort)).then(res=>res.json()).then(
         (data)=>{
             setAuctions(data);
         }
     )
   }
   useEffect(() => {
       fetch(REST.getAll(0,"new")).then(res=>res.json()).then(
           (data)=>{
               setAuctions(data);
           }
       )
       ;
   },[])
   return (
      <main>
         <Outlet />
         <h1>Auctions</h1>
         <form className="filters" onSubmit={submitFilterForm}>
            <div className="filter-input">
               <span>Closed</span>
               <label className="custom-checkbox">
    <input type="checkbox" checked={filterIsClosed} onChange={({target})=> setFilterIsClosed(target.checked ? 1: 0)}/>
    <span className="checkmark"></span>
  </label>
               
            </div>
            <label className="filter-input">
               <span>Sort by</span>
               <div className="custom-select">
    <select value={filterSort} onChange={({target})=> setFilterSort(target.value)}>
      <option value="new">New</option>
      <option value="old">Old</option>
    </select>
  </div>
            </label>
            <button>refresh</button>
         </form>
         <ul className="product-container">
            <li>
                  <NavLink className="create" to="/create"><Plus /><span>new auction</span></NavLink>
            </li>
            {auctions && auctions.map((el, i) => (
               <ProductPreview
                  key={i}
                  id={el.id}
                  name={el.name}
                  description={el.description}
                  price={el.startValue}
                  src={el.photo}
               />
            ))}
         </ul>
      </main>
   );
}

function ProductPreview({ id, name, description, price, src }) {
   return (
      <li>
         <div className="data-container">
            <div className="left">
               <img src={src}/>
            </div>
            <div className="right">
               <h3>{name}</h3>
               {/*<p>10 minutes</p>*/}
               <p>{price}</p>
               <p>{description}</p>
            </div>
         </div>
         <NavLink className="details" to={`/auction/${id}`}>
            Details
         </NavLink>
      </li>
   );
}
