import React from 'react';
import Home from './features/Home/Home';
import Header from './features/Header/Header';
import Footer from './features/Footer/Footer';
import Card from './components/Card/Card';

function App() {
  return (
    <>
      <Header />
      <main>
        <Card className="subreddit-card">
          <Home />
        </Card>
      </main>
        <Footer />
    </>
  );
}

export default App;
