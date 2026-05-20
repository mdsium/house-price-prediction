import {StrictMode} from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import PredictionHistory from '../component/PredictionHistory';
import Footer from './Footer';



export default function PredictionHistoryPage() {
  return (
      <PredictionHistory />
  );
}
