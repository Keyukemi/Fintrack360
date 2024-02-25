import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const useSession = (userId) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) {
      navigate('/home');
    }
  }, [userId, navigate]);
};

export default useSession;
