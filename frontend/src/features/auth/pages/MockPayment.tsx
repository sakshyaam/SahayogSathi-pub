import React, { useState } from 'react';
import api from '../services/auth.api';

const MockPayment = () => {
  const [orderId, setOrderId] = useState('');
  const [gateway, setGateway] = useState('khalti');
  const [status, setStatus] = useState<string | null>(null);
  const [paymentData, setPaymentData] = useState<any>(null);

  const handleInitiate = async () => {
    try {
      const res = await api.post('/api/v1/payments/initiate', {
        orderId,
        gateway
      });
      
      setPaymentData(res.data.data);
      setStatus('Payment Initiated! Mocking Gateway redirect...');
    } catch (err: any) {
      setStatus(`Error: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleVerify = async () => {
    try {
      if (!paymentData) return;
      
      const res = await api.post('/api/v1/payments/verify', {
        orderId: paymentData.orderId,
        gateway: paymentData.gateway,
        transactionId: `mock_success_${Date.now()}`
      });
      
      setStatus('Payment Verified! Funds are now in Escrow.');
    } catch (err: any) {
      setStatus(`Error: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleMockSubmit = async () => {
    try {
      const idToSubmit = orderId || paymentData?.orderId;
      if (!idToSubmit) {
        setStatus('Error: Please enter an Order ID first.');
        return;
      }
      await api.post(`/api/v1/orders/${idToSubmit}/submit`, {
        deliverables: [{ url: 'https://mock-link.com/project', filename: 'Mock Project' }]
      });
      
      setStatus('Work Submitted! Order is now in "submitted" state.');
    } catch (err: any) {
      setStatus(`Error: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleReleaseEscrow = async () => {
    try {
      const idToRelease = orderId || paymentData?.orderId;
      if (!idToRelease) {
        setStatus('Error: Please enter an Order ID first.');
        return;
      }
      const res = await api.post(`/api/v1/payments/${idToRelease}/release`, {});
      
      setStatus('Escrow Released! Worker has been paid.');
    } catch (err: any) {
      setStatus(`Error: ${err.response?.data?.message || err.message}`);
    }
  };

  return (
    <div className="p-8 max-w-xl mx-auto bg-white shadow-md rounded mt-10">
      <h1 className="text-2xl font-bold mb-4">Payment & Escrow Testing</h1>
      
      <div className="mb-4">
        <label className="block mb-1">Order ID</label>
        <input 
          type="text" 
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          className="w-full border p-2 rounded"
          placeholder="Enter Order ID"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1">Gateway</label>
        <select 
          value={gateway} 
          onChange={(e) => setGateway(e.target.value)}
          className="w-full border p-2 rounded"
        >
          <option value="khalti">Khalti (NPR)</option>
          <option value="esewa">eSewa (NPR)</option>
          <option value="stripe">Stripe (USD)</option>
        </select>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <button 
          onClick={handleInitiate}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          1. Initiate Payment
        </button>

        <button 
          onClick={handleVerify}
          disabled={!paymentData}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
        >
          2. Verify Payment
        </button>

        <button 
          onClick={handleMockSubmit}
          className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
        >
          2.5. Submit Work
        </button>
      </div>

      <div className="border-t pt-4 mt-4">
        <h2 className="font-semibold mb-2">Client Actions</h2>
        <button 
          onClick={handleReleaseEscrow}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        >
          3. Approve Work & Release Escrow
        </button>
      </div>

      {status && (
        <div className="mt-6 p-4 bg-gray-100 rounded text-sm font-mono">
          <strong>Status:</strong> {status}
        </div>
      )}
    </div>
  );
};

export default MockPayment;
