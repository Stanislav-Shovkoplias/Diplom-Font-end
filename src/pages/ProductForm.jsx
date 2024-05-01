import { useState } from "react";

import { NavLink } from "react-router-dom";

import "./ProductForm.scss";

import  {REST} from "../env/config.jsx";


export default function ProductForm({userName}) {


   // photo
   const [image, setImage] = useState(null);
   const formData = new FormData();
   formData.append("file", image);
   // photo visual
   const imageName = image && image.name;
   const imageSrc = image && URL.createObjectURL(image); 

   // name
   const [name, setName] = useState("");

   // description
   const [desc, setDesc] = useState("");

   // price
   const [price, setPrice] = useState("");

   // author
   const [authorName, setAuthorName] = useState(userName);

   // contact
   const [contact, setContanct] = useState("");

   // fundType
   const [fund, setFund] = useState("1");

   // fundType
   const [fundPercentage, setFundPercentage] = useState("50");

   // expiraion
   const [minutes, setMinutes] = useState("");

   function generateExpirationDate(mins) {
      const currentDate = new Date();
      const newDate = new Date(currentDate.getTime() + mins * 60000);
      return newDate;
   }

   const submit = (e) => {
      e.preventDefault();
      const sendData = {
         name,
         desc, 

         authorName,
         contact,

         price,

         fund,
         fundPercentage,

         expirationTime: minutes
      };
      console.log(imageName, imageSrc);
      fetch(REST.postCreate,{
         method: "POST",
         headers:{
         ...sendData
      },
      body : formData
   })
   };
   return (
      <div className="overlayF">
         <form className="product-form" onSubmit={submit}>
            <NavLink to="/">Back</NavLink>
            <label className="photo">
               <div className="photoView">
            {imageSrc && <img src={imageSrc}/>}
               <p >{imageName ? imageName : "insert photo" }</p>
               </div>
               <input
                  type="file"
                  onChange={({ target }) => {
                     const fileX = target.files[0];
                     fileX && setImage(fileX);
                  }}
                  hidden
               />
            </label>
            <label className="name">
               <span>Product name</span>
               <input
                   name="name"
                  type="text"
                  value={name}
                  onChange={({ target }) => setName(() => target.value)}
               />
            </label>
            <label className="description">
               <span>Description</span>
               <input
                  type="text"
                  value={desc}
                  onChange={({ target }) => setDesc(() => target.value)}
               />
            </label>
            <label className="price">
               <span>Price</span>
               <input
                  type="number"
                  value={price}
                  onChange={({ target }) => setPrice(() => target.value)}
               />
            </label>

            <label className="author-name">
               <span>Author</span>
               <input
                  type="text"
                  value={authorName}
                  onChange={({ target }) => setAuthorName(() => target.value)}
               />
            </label>
            <label className="contact">
               <span>Contact</span>
               <input
                  type="text"
                  value={contact}
                  onChange={({ target }) => setContanct(() => target.value)}
               />
            </label>

            <label className="fund">
               <span>fund</span>
               <select
                  value={fund}
                  onChange={({ target }) => setFund(() => target.value)}
               >
                  <option value="1">Фонд сергія притули</option>
                  <option value="2">Save life</option>
                  <option value="3">KSE</option>
                  <option value="4">KOLO</option>
               </select>
            </label>
            <label className="fund-percentage">
               <span>скока деняг?</span>
               <select
                  value={fundPercentage}
                  onChange={({ target }) =>
                     setFundPercentage(() => target.value)
                  }
               >
                  <option value="50">50%</option>
                  <option value="75">75%</option>
                  <option value="90">90%</option>
                  <option value="100">100%</option>
               </select>
            </label>
            <label htmlFor="" className="minutes">
               <span>expiration</span>
               <input type="number"  value={minutes}
                  onChange={({ target }) => setMinutes(() => target.value)}/>
            </label>
            <button>submit</button>
         </form>
         </div>
   );
}
