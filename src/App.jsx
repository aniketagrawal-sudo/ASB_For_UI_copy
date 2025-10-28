import { Provider } from 'react-redux';
import { StyledEngineProvider } from '@mui/material';
import AppTheme from './styles/theme/Theme';
import './App.scss';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorFallback from './components/ErrorFallback';
import AppRouter from './routes';
import store from './redux/store';
import { MicroStrategyProvider } from './contexts/MicroStrategyContext.jsx';

function App() {
  return (
    <Provider store={store}>
      <MicroStrategyProvider>
        <StyledEngineProvider injectFirst={true}>
          <AppTheme>
            <ErrorBoundary fallback={<ErrorFallback />}>
              <AppRouter />
            </ErrorBoundary>
          </AppTheme>
        </StyledEngineProvider>
      </MicroStrategyProvider>
    </Provider>
  );
}

export default App;
