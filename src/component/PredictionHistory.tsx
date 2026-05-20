import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button } from '@mui/material';

interface Prediction {
  id: number;
  created_at: string;
  city: string;
  thana: string;
  area_sqft: number;
  bedrooms: number;
  predicted_price: number;
  formatted_price: string;
}

export default function PredictionHistory() {
  const [history, setHistory] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    try {
      const res = await axios.get('https://bd-house-price-prediction.onrender.com/api/predictions/history/');
      setHistory(res.data);
    } catch (err) {
      console.error("Failed to fetch history", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex justify-between items-center mb-8">
        <Typography variant="h4" fontWeight="bold">
          Prediction History
        </Typography>
        <Button variant="contained" onClick={fetchHistory}>
          Refresh
        </Button>
      </div>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Date & Time</strong></TableCell>
              <TableCell><strong>Location</strong></TableCell>
              <TableCell><strong>Area (sqft)</strong></TableCell>
              <TableCell><strong>Bedrooms</strong></TableCell>
              <TableCell align="right"><strong>Predicted Price</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {history.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.created_at}</TableCell>
                <TableCell>{item.city}, {item.thana}</TableCell>
                <TableCell>{item.area_sqft}</TableCell>
                <TableCell>{item.bedrooms}</TableCell>
                <TableCell align="right" style={{ fontWeight: 'bold', color: '#10b981' }}>
                  ৳ {item.formatted_price}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {history.length === 0 && !loading && (
        <p className="text-center text-gray-500 mt-10">No predictions yet.</p>
      )}
    </div>
  );
}