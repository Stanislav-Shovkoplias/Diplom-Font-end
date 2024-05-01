import { useState, useEffect } from "react";
import {REST,AUCTION, CHAT} from "../env/config.jsx";
// import { json } from "react-router-dom";
const messageData = [
   {sender: "oleg", message: "bili jin nasral v kuvshin",
color: "#dc4c64"},
   {sender: "oleg", message: "bili jin nasral v kuvshin",
color: "#dc4c64"},
   {sender: "oleg", message: "bili jin nasral v kuvshin",
color: "fbfbfb"},
   {sender: "oleg", message: "bili jin nasral v kuvshin",
color: "fbfbfb"},
   {sender: "oleg", message: "bili jin nasral v kuvshin",
color: "fbfbfb"},
   {sender: "oleg", message: "bili jin nasral v kuvshin",
color: "fbfbfb"},
]

export default function Chat({userName, id}){
   const [chatStomp, setChatStomp] = useState(null);
   const [messages, setMessages] = useState([]);

   useEffect(()=>{
      const socket = new SockJS(CHAT.connect);
      const chatStomp = Stomp.over(socket);
      chatStomp.connect({}, ()=> {
         fetch(CHAT.getMessages(id)).then(res=>res.json()).then(data=>{
            setMessages(data)
         })

         setChatStomp(chatStomp)
         chatStomp.subscribe(CHAT.subscribe(id), (response)=>{
            console.log(JSON.parse(response.body))
               setMessages((mesgs)=>[...mesgs, JSON.parse(response.body)])
            });
         })
      return () => {
            if (chatStomp.connected) {
               chatStomp.disconnect();
            }
          };
   },[])
   return (<aside className="chat">
      <ul className="message-list">
      {messages && messages.map((el,i)=> <Message key={i} sender={el.sender} message={el.message} color={el.color}/>)}
   </ul>
      <ChatUI chatStomp={chatStomp} userName={userName} id={id}/>
   </aside>)
}

function Message({sender, message, color}){
   return (<li><span style={{color: color}}>{sender}: </span> <span>{message}</span></li>)
}

function ChatUI({chatStomp, userName, id}){
   const [color, setColor] = useState("#fbfbfb");
   const [message, setMessage] = useState("");
   return (<form className="chat-ui" onSubmit={(e)=>{
      e.preventDefault();
      const sendData={
         message,
         sender: userName,
         color
      }
      // bidStomp.send(CHAT.sendTo(id),{}, )
      chatStomp.send(CHAT.sendTo(id),{},JSON.stringify(sendData))
   }}>
      <fieldset className="left"><textarea value={message} onChange={({target})=>setMessage(target.value)}></textarea></fieldset>
      <fieldset className="right">
      <button>send</button>
         <select value={color} onChange={({target})=>setColor(target.value)}>
            <option value="#fbfbfb">white</option>
            <option value="#dc4c64">red</option>
            <option value="#14a44d">green</option>
            <option value="#3b71ca">blue</option>
         </select>
      </fieldset>
   </form>)
}