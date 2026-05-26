import { useState } from 'react';
import { pdf } from '@react-pdf/renderer';
import OrderForm from './components/OrderForm.jsx';
import OrderOfServicePDF from './pdf/OrderOfServicePDF.jsx';

// Defaults from the reference PDF so the user can click "Generate" immediately and see something.
const DEFAULT_STATE = {
  date: { day: '23', month: 'May' },
  people: {
    av: 'Marlon & Caleb',
    pianist: 'Jenna',
    songTeam: 'Brandon, Kelly, Jayvee',
  },
  classes: {
    frontOfChurch: 'David',
    backOfChurch: 'Rex',
    seekersHall: 'Rod',
    threeAngels: 'Alex',
  },
  praiseWorship: [
    { id: 'pw1', number: 526, title: 'Because He Lives', key: 'E', modulation: null },
    { id: 'pw2', number: 388, title: 'Don’t Forget The Sabbath', key: 'G', modulation: null },
    { id: 'pw3', number: 460, title: 'As Water To The Thirsty', key: 'D', modulation: null },
  ],
  kidsSong: { id: 'kids', number: null, title: 'He’s Able', key: 'E', modulation: null },
  hymns: {
    invocational: { number: 567, title: 'Have Thine Own Way', key: 'C', modulation: null },
    postOffering: { number: 12, title: 'Joyful Joyful', key: 'D', modulation: null },
    beforeSermon: { number: 499, title: 'What A Friend We Have in Jesus', key: 'C', modulation: null },
    closing: { number: 530, title: 'It Is Well', key: 'G', modulation: 'A' },
  },
};

export default function App() {
  const [state, setState] = useState(DEFAULT_STATE);
  const [generating, setGenerating] = useState(false);

  async function handleGenerate() {
    setGenerating(true);
    try {
      const blob = await pdf(<OrderOfServicePDF state={state} />).toBlob();
      const url = URL.createObjectURL(blob);
      const year = new Date().getFullYear();
      const fileName = `Order of Service - ${state.date.day} ${state.date.month} ${year}.pdf`;
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div className="app">
      <h1>Order of Service Generator</h1>
      <p className="subtitle">Wauchope SDA — generates a printable PDF (A4 landscape, two halves to cut down the middle).</p>
      <OrderForm
        state={state}
        setState={setState}
        onGenerate={handleGenerate}
        generating={generating}
      />
    </div>
  );
}
