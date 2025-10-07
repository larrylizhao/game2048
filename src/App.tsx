import { ThemeProvider } from './theme';
import { Game } from './components/Game';

const App = () => {
  return (
    <ThemeProvider>
      <Game />
    </ThemeProvider>
  );
};

export default App;
