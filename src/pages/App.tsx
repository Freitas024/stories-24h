import React, { useEffect, useState, useRef, use } from 'react';
import { initDB, getStory, addStory } from '../services/storage';
import { processImage } from '../lib/imageUtils'; 
import type { Story } from '../types/story';
import './App.css'

export default function App() {
  const [stories, setStories] = useState<Story[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadStories = async () => {
      await initDB();
      const data = await getStory();
      setStories(data);
    
      }; 
      loadStories();
    },[]);

    const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files?.[0];
      if(!files) return;

      try{
        const Base64 = await processImage(files);

        const newStory: Story = {
         id: crypto.randomUUID(), // Gera ID único nativo do navegador
         imageURL: Base64,
         timestamp: Date.now()
       };

       await addStory(newStory);
       setStories((prevStories) => [...prevStories, newStory]);
      }catch (error) {
        console.error('Erro ao processar a imagem:', error);
      }
    }

  return (
    <main className="main">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 10px' }}>
        <h2>Story 24h</h2>
        
        {/* 1. O GATILHO: Botão que clica no input invisível */}
        <button 
          onClick={() => fileInputRef.current?.click()}
          style={{ 
            fontSize: '24px', 
            background: 'none', 
            border: 'none', 
            color: 'white', 
            cursor: 'pointer' 
          }}
        >
          +
        </button>
      </header>

      {/* 2. A PORTA: Input invisível que recebe o arquivo */}
      <input 
        type="file" 
        ref={fileInputRef}
        style={{ display: 'none' }}
        accept="image/*"
        onChange={handleUpload}
      />

      <ul className="ul">
        {/* 3. O PAINEL: Renderiza apenas as stories que existem no estado */}
        {stories.map((story) => (
          <li key={story.id} className="li">
            <img 
              src={story.imageURL} 
              alt="story" 
              style={{ 
                width: '100%', 
                height: '100%', 
                borderRadius: '50%', 
                objectFit: 'cover', 
                border: '2px solid #e1306c' 
              }} 
            />
          </li>
        ))}

        {/* Feedback visual se não tiver nada */}
        {stories.length === 0 && <p style={{ color: '#666', fontSize: '12px', marginLeft: '10px' }}>Sem stories recentes</p>}
      </ul>
    </main>
  )
}


