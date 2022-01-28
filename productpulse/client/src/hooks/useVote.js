import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { upvoteProduct } from '../api/products';
import useAuth from './useAuth';

// The optimistic-UI lesson for ProductPulse.
//
// When the user taps upvote we flip the button and adjust the count
// *immediately*, before the network call resolves — the UI feels instant.
// We then await the server and reconcile with its authoritative numbers. If
// the request fails, we roll back to the exact pre-click state and toast.
const useVote = (productId, initialCount, initialHasVoted) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [count, setCount] = useState(initialCount);
  const [hasVoted, setHasVoted] = useState(initialHasVoted);
  const [pending, setPending] = useState(false);

  // Guard against double-fires from rapid clicks while a request is in flight.
  const inFlight = useRef(false);

  const toggle = async () => {
    if (!isAuthenticated) {
      toast.info('Sign in to upvote launches');
      navigate('/login');
      return;
    }
    if (inFlight.current) return;
    inFlight.current = true;
    setPending(true);

    // Snapshot so we can roll back on failure.
    const prevCount = count;
    const prevHasVoted = hasVoted;

    // Optimistic flip.
    const nextHasVoted = !prevHasVoted;
    setHasVoted(nextHasVoted);
    setCount(prevCount + (nextHasVoted ? 1 : -1));

    try {
      const result = await upvoteProduct(productId);
      // Reconcile with the server's authoritative values.
      setCount(result.voteCount);
      setHasVoted(result.hasVoted);
    } catch (err) {
      // Roll back to the pre-click state.
      setCount(prevCount);
      setHasVoted(prevHasVoted);
      toast.error(err.message || 'Could not register your vote');
    } finally {
      inFlight.current = false;
      setPending(false);
    }
  };

  return { count, hasVoted, pending, toggle };
};

export default useVote;
