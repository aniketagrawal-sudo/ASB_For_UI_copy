import { Box } from '@mui/material';
import { styled } from '@mui/system';

const LoaderContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '10px 0',
});

const Dot = styled(Box)({
  width: '8px',
  height: '8px',
  margin: '0 2px',
  borderRadius: '50%',
  backgroundColor: '#F7901D',
  animation: 'dot-blink 1.4s infinite both',
  '@keyframes dot-blink': {
    '0%': { opacity: 0.2 },
    '20%': { opacity: 1 },
    '100%': { opacity: 0.2 },
  },
});

const Dot1 = styled(Dot)({
  animationDelay: '0s',
});
const Dot2 = styled(Dot)({
  animationDelay: '0.2s',
});
const Dot3 = styled(Dot)({
  animationDelay: '0.4s',
});

const LinearLoader = () => {
  return (
    <LoaderContainer>
      <Dot1 />
      <Dot2 />
      <Dot3 />
    </LoaderContainer>
  );
};

export default LinearLoader;
