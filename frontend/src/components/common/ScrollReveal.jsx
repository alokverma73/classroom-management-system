import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const REVEAL_SELECTOR = [
  ".dashboard-hero",
  ".dashboard-section",
  ".stat-card",
  ".dashboard-stat-card",
  ".classroom-card",
  ".assignment-card",
  ".quick-action",
  ".progress-card",
  ".form-panel",
  ".announcement-card",
  ".result-card",
  ".member-list",
].join(", ");

function ScrollReveal() {
  const location = useLocation();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const elements = document.querySelectorAll(REVEAL_SELECTOR);

      if (!elements.length) {
        return;
      }

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("in-view");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
      );

      elements.forEach((element, index) => {
        element.classList.add("scroll-reveal");
        element.style.transitionDelay = `${Math.min(index * 0.05, 0.35)}s`;
        observer.observe(element);
      });

      return () => observer.disconnect();
    }, 50);

    return () => window.clearTimeout(timer);
  }, [location.pathname]);

  return null;
}

export default ScrollReveal;