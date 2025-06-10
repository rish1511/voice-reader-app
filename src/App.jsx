import { useEffect, useRef, useState } from "react";
import "./App.css";
import {FaCopy,FaTrash,FaMicrophone} from 'react-icons/fa'

function App() {
  const [notes, setNotes] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [allNotes, setAllNotes] = useState("");
  const [Lang, setlang] = useState("English");
  // Step 1: Load saved notes
useEffect(() => {
  const savedNotes = JSON.parse(localStorage.getItem("voice-notes"));
  if (savedNotes && Array.isArray(savedNotes)) {
    setNotes(savedNotes);
  }
}, []);

// Step 2: Save notes every time they change
useEffect(() => {
  localStorage.setItem("voice-notes", JSON.stringify(notes));
}, [notes]);


  let recognition = useRef(null);
useEffect(()=>{
if ("webkitSpeechRecognition" in window) {
    const SpeechRecognition = window.webkitSpeechRecognition;
    recognition.current = new SpeechRecognition();
    recognition.current.continuous = isListening;
    recognition.current.lang = Lang;

    recognition.current.onresult = (event) => {
      const transcript = event.results[event.results.length-1][0].transcript;
      setAllNotes(transcript);
      setNotes((prev) => [transcript, ...prev]);
    };
  } else {
    alert("Speech recognition is not supported in this browser.");
  }

},[isListening,Lang])
  
  const startMic = () => {
    console.log("Mic started");
    setIsListening(true)
    recognition.current.start();
  };
  const stopMic = () => {
    console.log("Mic stopped");
    setIsListening(false)
    if(recognition.current)
   { recognition.current.stop();}
  };

  return (
    <div className="box flex gap-5 flex-col md:flex-row justify-around items-center px-10 py-5">
      <div className="innerbox md:w-[400px] w-full flex flex-col gap-2 p-4 bg-cyan-100 rounded-2xl">
        <h1 className="font-bold text-blue-600  text-2xl md:text-4xl">Voice Reader:</h1>
       <div className="flex gap-1"  >
         <label htmlFor="select" className="md:text-xl text-[20px] text-gray-600">Select Your Language: </label>
        <select className="text-gray-800 font-extrabold"
          value={Lang}
          id="select"
          onChange={(e) => setlang(e.target.value)}
        >
          <option value="en-US">English</option>
          <option value="hi-IN">Hindi</option>
        </select>
       </div>
        <div className="flex justify-between">
          <button onClick={startMic} className='bg-white text-[20px] p-2 text-blue-400 rounded-2xl '>Start Mic</button>
        <button onClick={stopMic} className='bg-white text-[20px] p-2 text-blue-400 rounded-2xl'>Stop Mic</button>
        </div>

      <div>
          {isListening && <p> <FaMicrophone className="animate-ping pl-3"/>....listening</p>}
        {allNotes && <p>{allNotes}</p>}
      </div>
        
      </div>
      <div className="bg-amber-50 md:w-2xs w-full h-[80vh] overflow-auto rounded-xl ">
          <h2 className="md:text-3xl text-2xl py-4 px-2 ">All Notes:</h2>
        <ul className="px-3 list-none flex flex-col gap-1 ">
          {notes.map((note, index) => (
            <li key={index} className="bg-cyan-200 text-pink-800 font-bold rounded-xl flex justify-between items-center p-3"><span className="w-[80%]">{note}</span>
            <div onClick={()=>{navigator.clipboard.writeText(note);
              alert("its copied");
            }} >{<FaCopy className="animate-bounce"/>}</div>
            <div onClick={()=>{
              const update = notes.filter((note,i)=> i !== index);
              setNotes(update)
            }}>{<FaTrash className="animate-bounce"/>}</div>
            </li>
          ))}
        </ul>
        </div>
    </div>
  );
}

export default App;
