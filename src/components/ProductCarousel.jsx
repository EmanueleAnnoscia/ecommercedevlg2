import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';
import styles from './ProductCarousel.module.css';

const ProductCarousel = ({ title, products, viewAllLink }) => {
  if (!products || products.length === 0) return null;

  const availableProducts = products.filter(product => product.stock > 0);
  if (availableProducts.length === 0) return null;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(getItemsPerView());

  // ✅ Rileva dimensione schermo per adattare itemsPerView
  useEffect(() => {
    const handleResize = () => {
      setItemsPerView(getItemsPerView());
      setCurrentIndex(0); // reset per sicurezza su resize
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  function getItemsPerView() {
    const width = window.innerWidth;
    if (width <= 480) return 1;
    if (width <= 768) return 2;
    if (width <= 1024) return 3;
    return 4; // desktop
  }

  const maxIndex = Math.max(0, availableProducts.length - itemsPerView);

  const goToPrevious = () => {
    setCurrentIndex(Math.max(0, currentIndex - 1));
  };

  const goToNext = () => {
    setCurrentIndex(Math.min(maxIndex, currentIndex + 1));
  };

  return (
    <div className={styles.carousel}>
      <div className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        {viewAllLink && (
          <Link to={viewAllLink} className={styles.viewAll}>
            Vedi tutto →
          </Link>
        )}
      </div>

      <div className={styles.carouselContainer}>
        <button
          className={`${styles.carouselButton} ${styles.prevButton}`}
          onClick={goToPrevious}
          disabled={currentIndex === 0}
        >
          ←
        </button>

        <div className={styles.carouselTrack}>
          <div
            className={styles.carouselItems}
            style={{
              transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`
            }}
          >
            {availableProducts.map((product, index) => (
              <div key={index} className={styles.carouselItem}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>

        <button
          className={`${styles.carouselButton} ${styles.nextButton}`}
          onClick={goToNext}
          disabled={currentIndex >= maxIndex}
        >
          →
        </button>
      </div>

      <div className={styles.indicators}>
        {Array.from({ length: maxIndex + 1 }).map((_, index) => (
          <button
            key={index}
            className={`${styles.indicator} ${index === currentIndex ? styles.indicatorActive : ''}`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductCarousel;
