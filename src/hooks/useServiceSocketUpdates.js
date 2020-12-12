import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import feelService from '../utils/api/gcc/feelService';

/**
 *
 * @param {object} event - Sock event data fired by Feel Service
 * @returns {array} - [boolean, function]
 */
const useServiceSocketUpdates = (event) => {
  const network = useSelector(state => state.network);
  const [isUpdateAvailable, setUpdateAvailable] = useState(false);
  const reset = () => setUpdateAvailable(false);

  useEffect(() => {
    const cleanUp = feelService.listenToBlockchainEvents({
      network,
      event,
      callback: () => setUpdateAvailable(true),
    });

    return cleanUp;
  }, [network.name]);

  return [isUpdateAvailable, reset];
};

export default useServiceSocketUpdates;
