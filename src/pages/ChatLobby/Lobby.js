import React, { useEffect, useRef, useState }from "react";
import firebase from "firebase/app"
import ChatForm from "../../components/ChatForm"
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { Message } from "../../components/ChatMessage"
import ChatBoard from "../../components/ChatBoard";

const Dashboard = () => {
  const ref = useRef();
  const firestore = firebase.firestore()
  const auth = firebase.auth()
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt', 'desc').limit(25);
  const [messages] = useCollectionData(query, { idField: 'id' });
  const [message, setMessage] = useState('');

  const scrollToBottom = () => {
    ref.current.scrollIntoView({behavior: "smooth"})
  }

  const onMessageChange = (e) => {
    e.preventDefault()
    setMessage(e.target.value)
  }

  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid } = auth.currentUser;
    
    await messagesRef.add({
      text: message,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      createdBy: auth.currentUser.displayName,
      uid,
    })
    setMessage('');
  }

  useEffect(scrollToBottom,[messages])

  return (<>
    <ChatBoard>
      {messages && messages.slice(0).reverse().map(msg => <Message key={msg.id} message={msg} />)}
      <div ref={ref}/>
    </ChatBoard>
    <ChatForm onSubmit={sendMessage}>
      <ChatForm.Input value={message} onChange={(e) => onMessageChange(e)} placeholder="Say something" />
      <ChatForm.Button type="submit" disabled={!message}>Send</ChatForm.Button>
    </ChatForm>
  </>)
};

export default Dashboard;
