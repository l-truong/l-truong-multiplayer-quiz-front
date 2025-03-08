import config from "@/config/gameConfig";

export const scrollMixin = {
  data() {
    return {             
      isOverflowing: false,
      scrollBackToTop: false,
      isSmallScreen: false
    }
  },
  mounted() {
    window.addEventListener('resize', this.checkWindowWidth);    
    window.addEventListener('scroll', this.checkOverflow);
    this.checkWindowWidth();
    this.checkOverflow();
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.checkWindowWidth);
    window.removeEventListener('scroll', this.checkOverflow);
  },
  methods: {
    checkWindowWidth() {      
      this.isSmallScreen = window.innerWidth <= config.scroll.smallScreenWidth || window.innerHeight <= config.scroll.smallScreenHeight;      
      if (this.isSmallScreen) {
        this.scrollBackToTop = false;      
      }
    },
    checkOverflow() {
      this.isOverflowing = document.documentElement.scrollHeight > window.innerHeight;
    },
    handleScroll(scrollTarget) {      
      if (scrollTarget && scrollTarget.scrollTo) {
        this.scrollBackToTop = scrollTarget.scrollTop > config.scroll.minResultsScroll;
      }
    },
    scrollToTop(scrollTarget) {      
      if (scrollTarget && scrollTarget.scrollTo) {
        scrollTarget.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      } else {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: "smooth",
        });
      }
    }
  },
  computed: {
    showGoToTopButton() {
      return this.isSmallScreen && this.isOverflowing;
    }
  }
};