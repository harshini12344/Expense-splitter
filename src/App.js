import React, { useState, useEffect } from 'react';
import './App.css';
import ExpenseEntry from './components/ExpenseEntry';
import ParticipantList from './components/ParticipantList';
import SettlementDisplay from './components/SettlementDisplay';
import ExpenseChart from './components/ExpenseChart';
import ResetButton from './components/ResetButton';

function App() {
  // State management with local storage initialization
  const [totalAmount, setTotalAmount] = useState(() => {
    const saved = localStorage.getItem('totalAmount');
    return saved !== null ? saved : '';
  });
  
  const [numParticipants, setNumParticipants] = useState(() => {
    const saved = localStorage.getItem('numParticipants');
    return saved !== null ? saved : '';
  });
  
  const [participants, setParticipants] = useState(() => {
    const saved = localStorage.getItem('participants');
    return saved !== null ? JSON.parse(saved) : [];
  });
  
  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem('expenses');
    return saved !== null ? JSON.parse(saved) : [];
  });
  
  const [perPersonShare, setPerPersonShare] = useState(() => {
    const saved = localStorage.getItem('perPersonShare');
    return saved !== null ? parseFloat(saved) : 0;
  });
  
  const [showResults, setShowResults] = useState(() => {
    const saved = localStorage.getItem('showResults');
    return saved !== null ? JSON.parse(saved) : false;
  });
  
  const [error, setError] = useState('');
  const [chartKey, setChartKey] = useState(0);

  // Save to local storage whenever state changes
  useEffect(() => {
    localStorage.setItem('totalAmount', totalAmount);
  }, [totalAmount]);

  useEffect(() => {
    localStorage.setItem('numParticipants', numParticipants);
  }, [numParticipants]);

  useEffect(() => {
    localStorage.setItem('participants', JSON.stringify(participants));
  }, [participants]);

  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('perPersonShare', perPersonShare.toString());
  }, [perPersonShare]);

  useEffect(() => {
    localStorage.setItem('showResults', JSON.stringify(showResults));
  }, [showResults]);

  // Initialize participants when number changes
  useEffect(() => {
    if (numParticipants && !isNaN(numParticipants) && numParticipants > 0) {
      // Only initialize if participants array is empty or length doesn't match
      if (participants.length !== parseInt(numParticipants)) {
        const newParticipants = Array(parseInt(numParticipants))
          .fill(null)
          .map((_, index) => ({
            id: index,
            name: `Person ${index + 1}`,
            paid: 0,
            balance: 0,
            owes: 0,
            gets: 0
          }));
        setParticipants(newParticipants);
        setExpenses([]);
        setShowResults(false);
        setChartKey(prev => prev + 1);
      }
    }
  }, [numParticipants]);

  // Rest of your functions remain the same...
  const calculateShare = () => {
    if (!totalAmount || totalAmount <= 0) {
      setError('Please enter a valid total amount');
      return;
    }
    if (!numParticipants || numParticipants <= 0) {
      setError('Please enter valid number of participants');
      return;
    }

    const share = parseFloat(totalAmount) / parseInt(numParticipants);
    setPerPersonShare(share);
    calculateSettlements(share);
    setShowResults(true);
    setError('');
    setChartKey(prev => prev + 1);
  };

  const calculateSettlements = (share) => {
    const updatedParticipants = participants.map(participant => {
      const paidAmount = expenses
        .filter(expense => expense.paidBy === participant.id)
        .reduce((sum, expense) => sum + expense.amount, 0);

      const balance = paidAmount - share;
      
      return {
        ...participant,
        paid: paidAmount,
        balance: balance,
        owes: balance < 0 ? Math.abs(balance) : 0,
        gets: balance > 0 ? balance : 0
      };
    });

    setParticipants(updatedParticipants);
  };

  const handleAddExpense = (expenseData) => {
    const newExpense = {
      id: Date.now(),
      ...expenseData,
      amount: parseFloat(expenseData.amount)
    };

    const updatedExpenses = [...expenses, newExpense];
    setExpenses(updatedExpenses);
    
    if (perPersonShare > 0) {
      calculateSettlements(perPersonShare);
    }
    setChartKey(prev => prev + 1);
    setError('');
  };

  const handleRemoveExpense = (expenseId) => {
    const updatedExpenses = expenses.filter(expense => expense.id !== expenseId);
    setExpenses(updatedExpenses);
    
    if (perPersonShare > 0) {
      calculateSettlements(perPersonShare);
    }
    setChartKey(prev => prev + 1);
  };

  const handleNameChange = (id, newName) => {
    const updatedParticipants = participants.map(p =>
      p.id === id ? { ...p, name: newName } : p
    );
    setParticipants(updatedParticipants);
  };

  const handleReset = () => {
    // Clear all state
    setTotalAmount('');
    setNumParticipants('');
    setParticipants([]);
    setExpenses([]);
    setPerPersonShare(0);
    setShowResults(false);
    setError('');
    setChartKey(prev => prev + 1);
    
    // Clear local storage
    localStorage.removeItem('totalAmount');
    localStorage.removeItem('numParticipants');
    localStorage.removeItem('participants');
    localStorage.removeItem('expenses');
    localStorage.removeItem('perPersonShare');
    localStorage.removeItem('showResults');
  };

  // Optional: Add a "Save Session" button
  const saveSession = () => {
    const session = {
      totalAmount,
      numParticipants,
      participants,
      expenses,
      perPersonShare,
      showResults,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('savedSession', JSON.stringify(session));
    alert('Session saved successfully!');
  };

  // Optional: Add a "Load Last Session" button
  const loadLastSession = () => {
    const saved = localStorage.getItem('savedSession');
    if (saved) {
      const session = JSON.parse(saved);
      setTotalAmount(session.totalAmount);
      setNumParticipants(session.numParticipants);
      setParticipants(session.participants);
      setExpenses(session.expenses);
      setPerPersonShare(session.perPersonShare);
      setShowResults(session.showResults);
      setChartKey(prev => prev + 1);
      alert('Session loaded successfully!');
    } else {
      alert('No saved session found!');
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>💰 Expense Splitter App</h1>
        <p>Split expenses easily among friends and groups</p>
        {/* Optional: Add session management buttons */}
        <div className="session-buttons">
          <button onClick={saveSession} className="btn btn-small btn-secondary">
            💾 Save Session
          </button>
          <button onClick={loadLastSession} className="btn btn-small btn-secondary">
            📂 Load Session
          </button>
        </div>
      </header>

      <main className="app-main">
        {error && <div className="error-message">{error}</div>}

        {/* Expense Entry Module */}
        <section className="card">
          <h2>Expense Details</h2>
          <ExpenseEntry
            totalAmount={totalAmount}
            setTotalAmount={setTotalAmount}
            numParticipants={numParticipants}
            setNumParticipants={setNumParticipants}
            onCalculate={calculateShare}
          />
        </section>

        {showResults && (
          <>
            {/* Participant List Module */}
            <section className="card">
              <h2>Participants</h2>
              <ParticipantList
                participants={participants}
                onNameChange={handleNameChange}
                expenses={expenses}
                onAddExpense={handleAddExpense}
                onRemoveExpense={handleRemoveExpense}
                perPersonShare={perPersonShare}
              />
            </section>

            {/* Charts Module */}
            <div className="charts-container">
              <section className="card chart-card">
                <h2>Payment Distribution</h2>
                <ExpenseChart 
                  key={`doughnut-${chartKey}`}
                  participants={participants} 
                  type="doughnut" 
                />
              </section>

              <section className="card chart-card">
                <h2>Balance Overview</h2>
                <ExpenseChart 
                  key={`bar-${chartKey}`}
                  participants={participants} 
                  type="bar" 
                />
              </section>
            </div>

            {/* Settlement Display Module */}
            <section className="card">
              <h2>Settlement Summary</h2>
              <SettlementDisplay 
                participants={participants} 
                perPersonShare={perPersonShare}
                totalAmount={totalAmount}
              />
            </section>
          </>
        )}

        {/* Reset Module */}
        <div className="reset-container">
          <ResetButton onReset={handleReset} />
        </div>
      </main>
    </div>
  );
}

export default App;