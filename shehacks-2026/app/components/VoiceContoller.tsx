"use client";

import { useState } from "react";

// This tells the app that SpeechRecognition exists in the browser
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

const VoiceController  = () => {
const [isListening, setIsListening] = useState(false);

  const startListening = () => {
    // 1. Safety Check: Ensure we are in the browser
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

      if (!SpeechRecognition) {
        alert("Speech Recognition is not supported in this browser. Try Chrome!");
        return;
      }

      const recognition = new SpeechRecognition();
      recognition.lang = "en-US";
      recognition.continuous = false;

      recognition.onstart = () => {
        setIsListening(true);
        console.log("Listening started...");
      };

      recognition.onend = () => {
        setIsListening(false);
        console.log("Listening ended.");
      };

      // 2. Fixed Result Logic
      recognition.onresult = (event: any) => {
        // Digging into the event object to find the words
        const transcript = event.results[0][0].transcript;
        console.log("Recognized:", transcript);
      };

      recognition.onerror = (err: any) => {
        console.error("Speech Error:", err.error);
      };

      recognition.start();
    }
  };

  return (
    <div className="p-4 border rounded-lg shadow-sm">
      <button 
        onClick={startListening}
        className={`px-4 py-2 rounded font-bold text-white ${isListening ? 'bg-red-500' : 'bg-green-600'}`}
      >
        {isListening ? "Listening..." : "Start Listening"}
      </button>
    </div>
  );
}
export default VoiceController;