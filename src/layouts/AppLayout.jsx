import { Grid2 as Grid, IconButton } from '@mui/material';
import Appbar from './components/Appbar';
import houseBlank from '../assets/house-blank.svg';
import chatBlank from '../assets/chat-blank.svg';
import houseFocused from '../assets/house-focused.svg';
import chatFocused from '../assets/chat-focused.svg';
import bookmark from '../assets/bookmark.svg';
import { useState, useEffect } from 'react';
import classes from './AppLayout.module.scss';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { resetConversationData } from '../redux/store/conversationSlice';
import CustomSnackbar from '../components/Snackbar';

/** changes made  
v1.1.0 :  
  => added toast messages to display error, info, and warning notifications using the CustomSnackbar component  
**/

export default function AppLayout() {
  const [isConversations, setIsConversations] = useState(false);
  const [isHome, setIsHome] = useState(false);
  const [isBookMarks, setIsBookMarks] = useState(false);

  // Get current location to determine which nav button should be active
  const location = useLocation();
  const dispatch = useDispatch();

  // Update active states based on current path
  useEffect(() => {
    const path = location.pathname;

    // Check if path starts with /conversations
    if (path.startsWith('/conversations')) {
      setIsConversations(true);
      setIsHome(false);
      setIsBookMarks(false);
    }
    // Check if path is / or /home
    else if (path === '/' || path === '/home') {
      setIsConversations(false);
      setIsHome(true);
      setIsBookMarks(false);
      dispatch(resetConversationData());
    }
    // For any bookmark routes in the future
    else if (path.startsWith('/bookmarks')) {
      setIsConversations(false);
      setIsHome(false);
      setIsBookMarks(true);
    }
  }, [location.pathname, dispatch]);

  return (
    <>
      <Appbar appName={'DeepThought'}>
        <Grid className={classes.itemsContainer}>
          <Grid item className={classes.item}>
            <Link to="/home">
              <IconButton>
                {isHome ? (
                  <img src={houseFocused} alt="house-focused" className={classes.iconImg} />
                ) : (
                  <img src={houseBlank} className={classes.iconImg} alt="house-blank" />
                )}
              </IconButton>
            </Link>
          </Grid>
          <Grid item className={classes.item}>
            <Link to="/conversations/new">
              <IconButton>
                {isConversations ? (
                  <img src={chatFocused} className={classes.iconImg} alt="chat-focused" />
                ) : (
                  <img src={chatBlank} className={classes.iconImg} alt="chat-blank" />
                )}
              </IconButton>
            </Link>
          </Grid>
          <Grid item className={classes.item}>
            <Link to="/">
              <IconButton>
                {isBookMarks ? (
                  <img src={bookmark} className={classes.iconImg} alt="bookmark-focused" />
                ) : (
                  <img src={bookmark} className={classes.iconImg} alt="bookmark-blank" />
                )}
              </IconButton>
            </Link>
          </Grid>
        </Grid>
      </Appbar>
      <main className={classes.mainContainer}>
        <Outlet />
      </main>
      {/* v1.1.0 added toast messages to display error, info, and warning notifications using the CustomSnackbar component   */}
      <CustomSnackbar />
    </>
  );
}
