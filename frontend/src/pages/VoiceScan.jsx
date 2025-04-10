'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // for routing to dashboard

export default function VoiceScan() {
  const [step, setStep] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [status, setStatus] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    purchaseDate: '',
    expiryDate: '',
  });

  const navigate = useNavigate(); // for navigation

  const questions = ['What is the name of the product?', 'What is the purchase date?', 'What is the expiry date?'];

  const formatDate = (spokenDate) => {
    try {
      const date = new Date(spokenDate);
      return date.toISOString().split('T')[0];
    } catch {
      return '';
    }
  };

  const speakQuestion = (text, callback) => {
    const synth = window.speechSynthesis;
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'en-US';
    utter.onend = () => {
      setTimeout(callback, 500); // Small delay for better flow
    };
    synth.speak(utter);
  };

  const startVoiceFlow = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Speech Recognition not supported in this browser.');
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    const askAndListen = (stepIndex) => {
      if (stepIndex >= questions.length) {
        saveToDatabase(formData);
        setStatus('✅ All answers received!');
        setStep(0);
        return;
      }

      speakQuestion(questions[stepIndex], () => {
        recognition.start();

        recognition.onstart = () => {
          setIsListening(true);
          setStatus(`🎤 Listening: ${questions[stepIndex]}`);
        };

        recognition.onresult = (event) => {
          const result = event.results[0][0].transcript.trim();
          const updatedData = { ...formData };

          if (stepIndex === 0) updatedData.name = result;
          if (stepIndex === 1) updatedData.purchaseDate = formatDate(result);
          if (stepIndex === 2) updatedData.expiryDate = formatDate(result);

          setFormData(updatedData);
          setIsListening(false);
          recognition.stop();

          setTimeout(() => {
            askAndListen(stepIndex + 1);
          }, 800);
        };

        recognition.onerror = (event) => {
          setStatus(`❌ Error: ${event.error}`);
          setIsListening(false);
          recognition.stop();
        };
      });
    };

    askAndListen(0);
  };

  const saveToDatabase = async (data) => {
    const newItem = {
      name: data.name,
      category: 'Voice Input',
      purchaseDate: data.purchaseDate,
      expiryDate: data.expiryDate,
      quantity: 1,
      unit: 'item',
      notes: 'Added via voice',
    };

    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:3002/api/items', newItem, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setStatus('✅ Item successfully added!');
    } catch (error) {
      setStatus('❌ Error adding item: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleCancel = () => {
    setStep(0);
    setFormData({ name: '', purchaseDate: '', expiryDate: '' });
    setStatus('❌ Canceled');
    navigate('/dashboard');
  };

  const handleRetry = () => {
    setStep(0);
    setFormData({ name: '', purchaseDate: '', expiryDate: '' });
    setStatus('🔄 Retrying...');
    startVoiceFlow();
  };

  return (
    <div className="p-6 max-w-md mx-auto mt-10 bg-white rounded-xl shadow-md space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">🎤 Voice Scan Page</h2>

      <button
        onClick={startVoiceFlow}
        className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        disabled={isListening}
      >
        {isListening ? 'Listening...' : 'Start Voice Scan'}
      </button>

      <div className="text-gray-700 space-y-2">
        <div><strong>Product Name:</strong> {formData.name}</div>
        <div><strong>Purchase Date:</strong> {formData.purchaseDate}</div>
        <div><strong>Expiry Date:</strong> {formData.expiryDate}</div>
      </div>

      {status && <div className="text-sm text-green-600">{status}</div>}

      <div className="flex justify-between pt-4">
        <button
          onClick={handleCancel}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Cancel
        </button>
        <button
          onClick={handleRetry}
          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
        >
          Retry
        </button>
        <button
          onClick={() => navigate('/dashboard')}
          className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
}
