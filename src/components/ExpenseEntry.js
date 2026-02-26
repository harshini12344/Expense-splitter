import React from 'react';
import './Components.css';

const ExpenseEntry = ({
  totalAmount,
  setTotalAmount,
  numParticipants,
  setNumParticipants,
  onCalculate
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onCalculate();
  };

  return (
    <form onSubmit={handleSubmit} className="expense-form">
      <div className="form-group">
        <label htmlFor="totalAmount">Total Amount ($)</label>
        <input
          type="number"
          id="totalAmount"
          value={totalAmount}
          onChange={(e) => setTotalAmount(e.target.value)}
          placeholder="Enter total amount"
          min="0"
          step="0.01"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="numParticipants">Number of Participants</label>
        <input
          type="number"
          id="numParticipants"
          value={numParticipants}
          onChange={(e) => setNumParticipants(e.target.value)}
          placeholder="Enter number of people"
          min="1"
          required
        />
      </div>

      <button type="submit" className="btn btn-primary">
        Calculate Share
      </button>
    </form>
  );
};

export default ExpenseEntry;