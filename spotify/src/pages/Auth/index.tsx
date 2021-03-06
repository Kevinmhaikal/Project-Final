import React, { useCallback, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import config from '../../lib/config';
import { useDocumentTitle } from '../../lib/customHooks';
import { getUserProfile } from '../../lib/fetchApi';
import { login } from '../../slice/authSlice';
import { Box, Button, Link, Text } from '@chakra-ui/react'
import { User } from '../../types/user';
import { useAppDispatch } from '../../store';

const Auth : React.FC = () => {
  const dispatch = useAppDispatch();
  const history = useHistory();
  useDocumentTitle('Spotify');

  const setLogin = useCallback(async (accessToken, expiresIn) => {
    try {
      const responseUser: User = await getUserProfile(accessToken);

      dispatch(login({
        accessToken,
        expiredDate: +new Date() + expiresIn * 1000,
        user: responseUser,
      }));

      history.push('/create-playlist');
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  }, [dispatch, history]);

  useEffect(() => {
    const accessTokenParams: string | null = new URLSearchParams(window.location.hash).get('#access_token');
    const expiresIn: string | null = new URLSearchParams(window.location.hash).get('expires_in');

    if (accessTokenParams !== null) {
      setLogin(accessTokenParams, expiresIn);
    }
  }, [setLogin]);

  const buildSpotifyLinkAuthorize: () => string = () => {
    const clientId = "0344ccf8dc2a4d3586af4e9e70b08df0";
    return `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&redirect_uri=http://localhost:3000/`;
  }

  return (
    <main>
      <Box className="center" gap={2}>
        <Text>Spotify</Text>

        <Link href={buildSpotifyLinkAuthorize()} _hover={{ textDecoration: 'none' }}>
          <Button>Login</Button>
        </Link>
      </Box>
      
    </main>
  )
}


export default Auth;
