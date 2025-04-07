'use client';

import React, { useRef, useState } from 'react';
import { BrowserMultiFormatReader } from '@zxing/browser';

export default function BarcodeScan() {
  const fileInputRef = useRef(null);
  const [imagePreview, setImagePreview] = useState('');
  const [result, setResult] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    setImagePreview(imageUrl);
    setErrorMsg('');
    setResult('');

    try {
      const img = new Image();
      img.src = imageUrl;

      img.onload = async () => {
        const codeReader = new BrowserMultiFormatReader();
        const result = await codeReader.decodeFromImageElement(img);
        setResult(result.getText());
      };

      img.onerror = () => {
        setErrorMsg('Failed to load image.');
      };
    } catch (error) {
      setErrorMsg('No barcode/QR code found in image.');
      console.error(error);
    }
  };

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-xl font-bold">📁 Upload QR/Barcode Image</h2>

      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        ref={fileInputRef}
        className="block"
      />

      {imagePreview && (
        <img
          src={imagePreview}
          alt="Preview"
          className="w-60 border rounded shadow"
        />
      )}

      {result && (
        <div className="text-green-600 font-semibold break-words">
          ✅ Scanned Result: {result}
        </div>
      )}

      {errorMsg && (
        <div className="text-red-600 font-semibold">{errorMsg}</div>
      )}
    </div>
  );
}
