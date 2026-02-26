import React from 'react';
import './Components.css';

const SettlementDisplay = ({ participants, perPersonShare, totalAmount }) => {
  // Calculate settlements (who owes whom)
  const calculateSettlements = () => {
    const settlements = [];
    const debtors = participants.filter(p => p.balance < 0);
    const creditors = participants.filter(p => p.balance > 0);

    debtors.forEach(debtor => {
      let remainingDebt = Math.abs(debtor.balance);
      
      creditors.forEach(creditor => {
        if (remainingDebt > 0 && creditor.balance > 0) {
          const amount = Math.min(remainingDebt, creditor.balance);
          if (amount > 0.01) { // Ignore very small amounts
            settlements.push({
              from: debtor.name,
              to: creditor.name,
              amount: amount.toFixed(2)
            });
            remainingDebt -= amount;
          }
        }
      });
    });

    return settlements;
  };

  const settlements = calculateSettlements();
  const totalPaid = participants.reduce((sum, p) => sum + p.paid, 0);

  return (
    <div className="settlement-display">
      {/* Summary Stats */}
      <div className="summary-stats">
        <div className="stat-card">
          <span className="stat-label">Total Amount</span>
          <span className="stat-value">${parseFloat(totalAmount).toFixed(2)}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Total Paid</span>
          <span className="stat-value">${totalPaid.toFixed(2)}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Per Person</span>
          <span className="stat-value">${perPersonShare.toFixed(2)}</span>
        </div>
      </div>

      {/* Settlement Instructions */}
      <div className="settlements-list">
        <h3>Settlement Instructions</h3>
        {settlements.length === 0 ? (
          <p className="no-settlements">Everyone is settled up! 🎉</p>
        ) : (
          <ul className="settlement-items">
            {settlements.map((settlement, index) => (
              <li key={index} className="settlement-item">
                <span className="from">{settlement.from}</span>
                <span className="arrow">→</span>
                <span className="to">{settlement.to}</span>
                <span className="amount">${settlement.amount}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Balance Summary */}
      <div className="balance-summary">
        <h3>Balance Summary</h3>
        <div className="balance-grid">
          {participants.map(p => (
            <div key={p.id} className="balance-row">
              <span className="name">{p.name}</span>
              <span className={`amount ${p.balance >= 0 ? 'positive' : 'negative'}`}>
                {p.balance >= 0 ? '+' : '-'}${Math.abs(p.balance).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SettlementDisplay;