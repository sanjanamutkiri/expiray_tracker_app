'use client';

import React, { useState } from 'react';
import axios from 'axios';

export default function VoiceScan() {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [status, setStatus] = useState('');

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Speech Recognition not supported in this browser.');
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      setStatus('Listening...');
    };

    recognition.onresult = (event) => {
      const speechResult = event.results[0][0].transcript;
      setTranscript(speechResult);
      setIsListening(false);
      setStatus('Processing...');
      saveToDatabase(speechResult);
    };

    recognition.onerror = (event) => {
      setStatus('Error occurred: ' + event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const saveToDatabase = async (text) => {
    // You can make this smarter by parsing speech for item, quantity, etc.
    const newItem = {
      name: text,
      category: 'Voice Input',
      purchaseDate: new Date().toISOString().split('T')[0],
      expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // +7 days
      quantity: 1,
      unit: 'item',
      notes: 'Added via voice'
    };

    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:3002/api/items', newItem, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setStatus('✅ Item added!');
    } catch (error) {
      setStatus('❌ Error adding item: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">🎤 Voice Scan Page</h2>
      <button
        onClick={startListening}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        disabled={isListening}
      >
        {isListening ? 'Listening...' : 'Start Voice Scan'}
      </button>

      {transcript && (
        <div className="text-gray-800">
          <strong>Transcription:</strong> {transcript}
        </div>
      )}

      {status && <div className="text-green-600">{status}</div>}
    </div>
  );
}
