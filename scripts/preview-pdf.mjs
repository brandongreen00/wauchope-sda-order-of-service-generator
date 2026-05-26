// Dev-only: render the PDF server-side so we can eyeball it without spinning up the browser.
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = fileURLToPath(import.meta.url);
const publicDir = resolve(here, '..', '..', 'public');
process.env.FONT_BASE_OVERRIDE = `${publicDir}/`;

const { renderToFile } = await import('@react-pdf/renderer');
const React = (await import('react')).default;
const OrderOfServicePDF = (await import('../src/pdf/OrderOfServicePDF.jsx')).default;

const state = {
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

await renderToFile(React.createElement(OrderOfServicePDF, { state }), '/tmp/preview.pdf');
console.log('Wrote /tmp/preview.pdf');
