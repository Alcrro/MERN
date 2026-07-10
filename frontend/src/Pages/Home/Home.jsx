import React from "react";
import { useGetProductsQuery, useGetCategoriesQuery } from "../../features/product/rtkProducts";
import ProductCarousel from "../../Components/UI/ProductCarousel";
import HeroSection from "../../Components/home/HeroSection";
import FeaturesStrip from "../../Components/home/FeaturesStrip";
import CategoriesSection from "../../Components/home/CategoriesSection";
import PromoBanner from "../../Components/home/PromoBanner";
import HomeStats from "../../Components/home/HomeStats";
import NewsletterSection from "../../Components/home/NewsletterSection";
import "./Home.css";

const Home = () => {
  const { data: newest,   isLoading: loadingNewest } = useGetProductsQuery({ limit: 10, page: 1, sort: "Newest",  brand: [], rating: [], model: [] });
  const { data: topRated, isLoading: loadingTop }    = useGetProductsQuery({ limit: 10, page: 1, sort: "-rating", brand: [], rating: [], model: [] });
  const { data: catData,  isLoading: loadingCats }   = useGetCategoriesQuery();
  const categories = catData?.categories ?? [];

  return (
    <main className="home-page">
      <HeroSection />
      <FeaturesStrip />
      <CategoriesSection categories={categories} isLoading={loadingCats} />

      <div className="home-carousel-wrap home-carousel-wrap--blue">
        <div className="home-carousel-inner">
          <ProductCarousel title="Produse recente" linkTo="/products?sort=Newest" data={newest?.queryProducts} isLoading={loadingNewest} />
        </div>
      </div>

      <PromoBanner />

      <div className="home-carousel-wrap home-carousel-wrap--purple">
        <div className="home-carousel-inner">
          <ProductCarousel title="Top vânzări" linkTo="/products?sort=-rating" data={topRated?.queryProducts} isLoading={loadingTop} />
        </div>
      </div>

      <HomeStats />
      <NewsletterSection />
    </main>
  );
};

export default Home;
