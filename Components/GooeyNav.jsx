// GooeyNav.jsx
import { useRef, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './GooeyNav.css';

const GooeyNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const containerRef = useRef(null);
  const navRef = useRef(null);
  const filterRef = useRef(null);
  const textRef = useRef(null);
  
  // Main navigation links (with animation)
  const mainItems = [
    { label: "Home", href: "/home" },
    { label: "Catalog", href: "/catalog" },
    { label: "Order Tracking", href: "/order-tracking" },
    { label: "Dashboard", href: "/dashboard" },
    { label: "Driver Console", href: "/driver-console" },
    { label: "Contact Us", href: "/contact-us" },
  ];

  // Auth links (NO animation, NO white active state)
  const authItems = [
    { label: "Login", href: "/login", noAnimation: true, noActiveState: true },
    { label: "Sign Up", href: "/signup", noAnimation: true, noActiveState: true, isPurple: true },
  ];

  const allItems = [...mainItems, ...authItems];

  // Find initial active index based on current route
  const initialActiveIndex = allItems.findIndex(item => item.href === location.pathname);
  const [activeIndex, setActiveIndex] = useState(initialActiveIndex !== -1 ? initialActiveIndex : 0);

  const noise = (n = 1) => n / 2 - Math.random() * n;

  const getXY = (distance, pointIndex, totalPoints) => {
    const angle = ((360 + noise(8)) / totalPoints) * pointIndex * (Math.PI / 180);
    return [distance * Math.cos(angle), distance * Math.sin(angle)];
  };

  const createParticle = (i, t, d, r) => {
    let rotate = noise(r / 10);
    return {
      start: getXY(d[0], 15 - i, 15),
      end: getXY(d[1] + noise(7), 15 - i, 15),
      time: t,
      scale: 1 + noise(0.2),
      color: [1, 2, 3, 1, 2, 3, 1, 4][Math.floor(Math.random() * 8)],
      rotate: rotate > 0 ? (rotate + r / 20) * 10 : (rotate - r / 20) * 10
    };
  };

  const makeParticles = element => {
    const d = [90, 10];
    const r = 100;
    const bubbleTime = 600 * 2 + 300;
    element.style.setProperty('--time', `${bubbleTime}ms`);

    for (let i = 0; i < 15; i++) {
      const t = 600 * 2 + noise(300 * 2);
      const p = createParticle(i, t, d, r);
      element.classList.remove('active');

      setTimeout(() => {
        const particle = document.createElement('span');
        const point = document.createElement('span');
        particle.classList.add('particle');
        particle.style.setProperty('--start-x', `${p.start[0]}px`);
        particle.style.setProperty('--start-y', `${p.start[1]}px`);
        particle.style.setProperty('--end-x', `${p.end[0]}px`);
        particle.style.setProperty('--end-y', `${p.end[1]}px`);
        particle.style.setProperty('--time', `${p.time}ms`);
        particle.style.setProperty('--scale', `${p.scale}`);
        particle.style.setProperty('--color', `var(--color-${p.color}, white)`);
        particle.style.setProperty('--rotate', `${p.rotate}deg`);

        point.classList.add('point');
        particle.appendChild(point);
        element.appendChild(particle);
        requestAnimationFrame(() => {
          element.classList.add('active');
        });
        setTimeout(() => {
          try {
            element.removeChild(particle);
          } catch {
            // Do nothing
          }
        }, t);
      }, 30);
    }
  };

  const updateEffectPosition = element => {
    if (!containerRef.current || !filterRef.current || !textRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const pos = element.getBoundingClientRect();

    const styles = {
      left: `${pos.x - containerRect.x}px`,
      top: `${pos.y - containerRect.y}px`,
      width: `${pos.width}px`,
      height: `${pos.height}px`
    };
    Object.assign(filterRef.current.style, styles);
    Object.assign(textRef.current.style, styles);
    textRef.current.innerText = element.innerText;
  };

  const handleClick = (e, index, href, noAnimation = false, noActiveState = false) => {
    e.preventDefault();
    const liEl = e.currentTarget;
    
    // Only set active state for links that should have it
    if (!noActiveState) {
      if (activeIndex === index) return;
      setActiveIndex(index);
    }

    // Only show animation for non-auth links
    if (!noAnimation && !noActiveState) {
      updateEffectPosition(liEl);

      if (filterRef.current) {
        const particles = filterRef.current.querySelectorAll('.particle');
        particles.forEach(p => filterRef.current.removeChild(p));
      }

      if (textRef.current) {
        textRef.current.classList.remove('active');
        void textRef.current.offsetWidth;
        textRef.current.classList.add('active');
      }

      if (filterRef.current) {
        makeParticles(filterRef.current);
      }
    }

    // Navigate to the route
    navigate(href);
  };

  const handleKeyDown = (e, index, href, noAnimation = false, noActiveState = false) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick(e, index, href, noAnimation, noActiveState);
    }
  };

  // Update active index when route changes (only for links that should have active state)
  useEffect(() => {
    const newActiveIndex = allItems.findIndex(item => item.href === location.pathname && !item.noActiveState);
    if (newActiveIndex !== -1 && newActiveIndex !== activeIndex) {
      setActiveIndex(newActiveIndex);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (!navRef.current || !containerRef.current) return;
    
    // Only update effect position for non-auth links
    const activeItem = allItems[activeIndex];
    if (activeItem && !activeItem.noAnimation && !activeItem.noActiveState) {
      const activeLi = navRef.current.querySelectorAll('li')[activeIndex];
      if (activeLi) {
        updateEffectPosition(activeLi);
        textRef.current?.classList.add('active');
      }
    }

    const resizeObserver = new ResizeObserver(() => {
      const activeItem = allItems[activeIndex];
      if (activeItem && !activeItem.noAnimation && !activeItem.noActiveState) {
        const currentActiveLi = navRef.current?.querySelectorAll('li')[activeIndex];
        if (currentActiveLi) {
          updateEffectPosition(currentActiveLi);
        }
      }
    });

    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, [activeIndex]);

  return (
    <div className="gooey-nav-container" ref={containerRef}>
      <nav>
        <ul ref={navRef}>
          {/* Main Navigation Links (with animation) */}
          {mainItems.map((item, index) => (
            <li key={index} className={activeIndex === index ? 'active' : ''}>
              <a 
                href={item.href} 
                onClick={e => handleClick(e, index, item.href, item.noAnimation, item.noActiveState)} 
                onKeyDown={e => handleKeyDown(e, index, item.href, item.noAnimation, item.noActiveState)}
                tabIndex={0}
              >
                {item.label}
              </a>
            </li>
          ))}
          
          {/* Separator */}
          <li className="nav-separator"></li>
          
          {/* Auth Links (NO animation, NO white active state) */}
          {authItems.map((item, index) => (
            <li 
              key={index + mainItems.length} 
              className={`auth-link ${item.isPurple ? 'purple-button' : ''}`}
            >
              <a 
                href={item.href} 
                onClick={e => handleClick(e, index + mainItems.length + 1, item.href, item.noAnimation, item.noActiveState)} 
                onKeyDown={e => handleKeyDown(e, index + mainItems.length + 1, item.href, item.noAnimation, item.noActiveState)}
                tabIndex={0}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <span className="effect filter" ref={filterRef} />
      <span className="effect text" ref={textRef} />
    </div>
  );
};

export default GooeyNav;