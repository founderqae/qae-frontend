import CarouselSection from '../components/Home/CarouselSection';
import MarqueeBar from '../components/Home/MarqueeBar';
import HeroContentSection from '../components/Home/HeroContentSection';
import StatsSection from '../components/Home/StatsSection';
import RankingCriteriaSection from '../components/Home/RankingCriteriaSection';
import TopCollegesSection from '../components/Home/TopCollegesSection';

const HomePage = () => {
  return (
    <>
      <CarouselSection />
      <MarqueeBar />
      <HeroContentSection />
      <StatsSection />
      <RankingCriteriaSection />
      {/* <TopCollegesSection /> */}
    </>
  );
};

export default HomePage;