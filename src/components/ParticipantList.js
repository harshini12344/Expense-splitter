import React, { useState } from 'react';
import './Components.css';

const ParticipantList = ({
  participants,
  onNameChange,
  expenses,
  onAddExpense,
  onRemoveExpense,
  perPersonShare
}) => {
  const [selectedParticipant, setSelectedParticipant] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseDesc, setExpenseDesc] = useState('');

  const handleAddExpense = (e) => {
    e.preventDefault();
    if (selectedParticipant && expenseAmount) {
      onAddExpense({
        paidBy: parseInt(selectedParticipant),
        amount: parseFloat(expenseAmount),
        description: expenseDesc || `Expense ${expenses.length + 1}`
      });
      setExpenseAmount('');
      setExpenseDesc('');
    }
  };

  return (
    <div className="participant-section">
      {/* Add Expense Form */}
      <div className="add-expense-form">
        <h3>Add Payment</h3>
        <form onSubmit={handleAddExpense}>
          <div className="form-row">
            <select
              value={selectedParticipant}
              onChange={(e) => setSelectedParticipant(e.target.value)}
              required
            >
              <option value="">Who paid?</option>
              {participants.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>

            <input
              type="number"
              value={expenseAmount}
              onChange={(e) => setExpenseAmount(e.target.value)}
              placeholder="Amount"
              min="0"
              step="0.01"
              required
            />

            <input
              type="text"
              value={expenseDesc}
              onChange={(e) => setExpenseDesc(e.target.value)}
              placeholder="Description (optional)"
            />

            <button type="submit" className="btn btn-small btn-success">
              Add
            </button>
          </div>
        </form>
      </div>

      {/* Participants List */}
      <div className="participants-grid">
        {participants.map(participant => (
          <div key={participant.id} className="participant-card">
            <input
              type="text"
              value={participant.name}
              onChange={(e) => onNameChange(participant.id, e.target.value)}
              className="participant-name-input"
            />
            
            <div className="participant-stats">
              <div className="stat">
                <span className="stat-label">Should pay:</span>
                <span className="stat-value">${perPersonShare.toFixed(2)}</span>
              </div>
              <div className="stat">
                <span className="stat-label">Paid:</span>
                <span className="stat-value">${participant.paid.toFixed(2)}</span>
              </div>
              <div className={`stat ${participant.balance >= 0 ? 'positive' : 'negative'}`}>
                <span className="stat-label">Balance:</span>
                <span className="stat-value">
                  ${Math.abs(participant.balance).toFixed(2)}
                  {participant.balance >= 0 ? ' (to receive)' : ' (to pay)'}
                </span>
              </div>
            </div>

            {/* Expenses paid by this participant */}
            <div className="participant-expenses">
              <h4>Payments made:</h4>
              {expenses.filter(e => e.paidBy === participant.id).length === 0 ? (
                <p className="no-expenses">No payments yet</p>
              ) : (
                expenses
                  .filter(e => e.paidBy === participant.id)
                  .map(expense => (
                    <div key={expense.id} className="expense-item">
                      <span>{expense.description}: ${expense.amount}</span>
                      <button
                        onClick={() => onRemoveExpense(expense.id)}
                        className="btn-remove-small"
                      >
                        ×
                      </button>
                    </div>
                  ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ParticipantList;