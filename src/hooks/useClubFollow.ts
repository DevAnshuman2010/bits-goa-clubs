import { useState, useEffect } from 'react';

const STORAGE_KEY = 'followedClubs';

export const useClubFollow = () => {
  const [followedClubs, setFollowedClubs] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setFollowedClubs(JSON.parse(stored));
    }
  }, []);

  const followClub = (clubId: string) => {
    const updated = [...followedClubs, clubId];
    setFollowedClubs(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const unfollowClub = (clubId: string) => {
    const updated = followedClubs.filter(id => id !== clubId);
    setFollowedClubs(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const isFollowing = (clubId: string) => {
    return followedClubs.includes(clubId);
  };

  return { followedClubs, followClub, unfollowClub, isFollowing };
};
