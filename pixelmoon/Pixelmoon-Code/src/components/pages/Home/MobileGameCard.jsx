import React from 'react';
import { Link } from 'react-router-dom';
import styles from './MobileGameCard.module.css';

const MobileGameCard = ({ game, variant = 'horizontal' }) => {
  const getLowestPrice = () => {
    if (!game.packs || game.packs.length === 0) return '0';
    return Math.min(...game.packs.map(pack => pack.retailPrice));
  };

  return (
    <Link to={`/games/${game._id}`} className={`${styles.gameCard} ${styles[variant]}`}>
      <div className={styles.imageContainer}>
        <img src={game.image} alt={game.name} />
        {variant === 'horizontal' && <span className={styles.popularBadge}>Popular</span>}
      </div>
      <div className={styles.gameInfo}>
        <h3>{game.name}</h3>
        <p>₹{getLowestPrice()}</p>
      </div>
    </Link>
  );
};

export default MobileGameCard;