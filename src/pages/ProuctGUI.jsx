import { useState, useEffect } from "react";
import {REST,AUCTION, CHAT} from "../env/config.jsx";
import { json } from "react-router-dom";

export default function ProductGUI({userName, id, value,status}){
   const [bidData, setBidData] = useState({});

   const [bidStomp, setBidStomp] = useState(null);


   const [inputBidValue, setInputBidValue] = useState(0);

   useEffect(()=>{
      const socket = new SockJS(AUCTION.connect);
      const bidStomp = Stomp.over(socket);

      bidStomp.connect({}, ()=> {
         fetch(AUCTION.currentBid(id)).then(res=>res.json()).then(data=>{
            setBidData(data);
         }).catch(err=>{
            console.log(value);
            console.log(status);
            setBidData({value, name: "", status})
         })

         setBidStomp(bidStomp)
            bidStomp.subscribe(AUCTION.subscribe(id), (response)=>{
               // console.log("oleg");
               console.log(JSON.parse(response.body))
               setBidData(JSON.parse(response.body));
            });
         })
      return () => {
            if (bidStomp.connected) {
               bidStomp.disconnect();
            }
          };
      
   },[])
   return (<div className="product-gui">
      <div className="status-bar">
         <div className="status-status">
            <p>Status: <span className={bidData.status ? "status-active" : "status-closed"}>{bidData.status ? "active" : "closed"}</span></p>
         </div>
         <div className="bid-statu">
            <p>Current price: ${bidData.value}</p>
            <p>{bidData.name ? `last bidder: ${bidData.name}` : " "}</p>
         </div>
      </div>
      <form className="input-bar" onSubmit={(e)=>{
         e.preventDefault();
         const sendData={
            value: inputBidValue,
            name: userName
         }
         bidStomp.send(AUCTION.sendTo(id),{}, JSON.stringify(sendData))
      }}>
         <input type="number" value={inputBidValue} onChange={({target})=>setInputBidValue(target.value)}/>
         <button>BID</button>
      </form>
   </div>)
}