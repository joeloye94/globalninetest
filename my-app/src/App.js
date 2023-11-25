
import './App.css';
import AppRouter from './route/AppRouter';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';

function App() {
  return (
    <div className="App">
      <Container >
        <Box>
          <AppRouter />
        </Box>
      </Container>
      
      
    </div>
  );
}

export default App;
