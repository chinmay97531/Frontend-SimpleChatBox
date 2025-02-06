import { useEffect, useState, useRef } from 'react'
import './App.css'

function App() {

  const inputElement = useRef<HTMLInputElement>(null);
  const [messages, setMessages] = useState(["Hi there", "Hello"]);
  const wsRef = useRef();

  useEffect(() => {
    const ws = new WebSocket("http://localhost:8080");
    ws.onmessage = (event) => {
      setMessages(m => [...m, event.data])
    }
    wsRef.current = ws;

    ws.onopen = () => {
      ws.send(JSON.stringify({
        type: "join",
        payload: {
          roomId: "red"
        }
      }))
    }
    return () => {
      ws.close()
    }
  }, []);

  return (
    <div className="h-screen bg-black">
      <div className="h-[90vh] pt-10">
        {messages.map(message => 
        <div className='m-8'>
          <span className="bg-white text-black rounded p-4">
            {message}
          </span> 
        </div>)}
      </div>
      <div className="w-full bg-white flex gap-5 p-4">
        <input ref={inputElement} type="text" className="flex-1 border rounded"></input>
        <button onClick={() => {
          if (inputElement.current) {
            wsRef.current.send(JSON.stringify({
              type: "chat",
              payload: {
                message: inputElement.current.value
              }
            }));
            inputElement.current.value = '';
          }
        }} className="bg-purple-600 text-white p-4 rounded-2xl">Send Message</button>
      </div>
    </div>
  )
}

export default App
