import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Search, FileText, TrendingUp, MapPin, Phone, Mail, ChevronRight,
  Volume2, ShoppingCart, Palette, Mic, X, ChevronDown
} from "lucide-react";
import { landRecordsAPI } from "../services/api";
import HeroCircle from "../components/HeroCircle";
import { useLanguage } from "../context/LanguageContext";

function LandingPage() {
  const { t } = useLanguage();
  const [stats, setStats] = useState({
    totalRecords: 0,
    totalVillages: 0,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [showMapModal, setShowMapModal] = useState(false);
  const [language, setLanguage] = useState("EN");
  const [activeTab, setActiveTab] = useState("news");

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await landRecordsAPI.getStats();
      setStats(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error loading stats:", error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
  

          {/* ============ MAIN HERO SECTION - FULL WIDTH ============ */}
      <section
        className="relative min-h-[750px]"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/30 pointer-events-none"></div>

        {/* SEARCH + MAP - Top Right Corner (Absolute) */}
        <div className="absolute top-6 right-6 z-20 w-64">
          {/* Map Button - Right aligned, small width */}
          <div className="flex justify-end">
            <button
              onClick={() => setShowMapModal(true)}
              className="bg-navy-800 hover:bg-navy-900 text-white py-1.5 px-4 rounded-md font-bold text-xs transition shadow-lg relative border-b-2 border-orange-500 flex items-center gap-1.5"
            >
              <span>🗺️ {t("map")}</span>
              <span className="bg-red-500 text-white text-[8px] px-1.5 py-1.5 rounded-full font-bold">
                {t("new")}
              </span>
            </button>
          </div>
        </div>

        {/* TITLE - Center Top (Above Hero Circle) */}
        <div className="relative z-10 pt-10 pb-4 text-center px-4">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 drop-shadow-2xl leading-tight">
            {t("heroTitle1")}
            <br />
            {t("heroTitle2")}
          </h1>
          <p className="text-sm md:text-base text-white/95 drop-shadow-lg font-medium max-w-3xl mx-auto">
            {t("heroSubtitle")}
          </p>
        </div>

        {/* HERO CIRCLE - Center below title */}
        <div className="relative z-10 flex items-center justify-center mt-4">
          <HeroCircle />
        </div>

      </section>

            {/* ============ STATISTICS CARDS - Dashboard Theme ============ */}
      <section className="bg-gradient-to-r from-navy-900 via-navy-800 to-navy-900 py-10 px-4 shadow-2xl">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">

            {/* Card 1 - Total Records */}
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 shadow-2xl text-center transform hover:scale-105 transition duration-300 border-t-4 border-yellow-400">
              <div className="w-12 h-12 mx-auto mb-3 bg-white/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-xs md:text-sm text-white/90 font-semibold mb-1 uppercase tracking-wide">
                {t("totalRecords")}
              </p>
              <p className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">
                {loading ? "..." : `${stats.totalRecords.toLocaleString()}+`}
              </p>
            </div>

            {/* Card 2 - Villages Covered */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 shadow-2xl text-center transform hover:scale-105 transition duration-300 border-t-4 border-orange-400">
              <div className="w-12 h-12 mx-auto mb-3 bg-white/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <p className="text-xs md:text-sm text-white/90 font-semibold mb-1 uppercase tracking-wide">
                {t("villagesCovered")}
              </p>
              <p className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">
                {loading ? "..." : stats.totalVillages}
              </p>
            </div>

            {/* Card 3 - Predictions Made */}
            <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-xl p-6 shadow-2xl text-center transform hover:scale-105 transition duration-300 border-t-4 border-yellow-400">
              <div className="w-12 h-12 mx-auto mb-3 bg-white/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <p className="text-xs md:text-sm text-white/90 font-semibold mb-1 uppercase tracking-wide">
                {t("predictionsMade")}
              </p>
              <p className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">
                1,200+
              </p>
            </div>

            {/* Card 4 - ML Model Accuracy */}
            <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl p-6 shadow-2xl text-center transform hover:scale-105 transition duration-300 border-t-4 border-orange-400">
              <div className="w-12 h-12 mx-auto mb-3 bg-white/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <p className="text-xs md:text-sm text-white/90 font-semibold mb-1 uppercase tracking-wide">
                {t("mlAccuracy")}
              </p>
              <p className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">
                99.8%
              </p>
            </div>

          </div>
        </div>
      </section>

      
     
           {/* ============ HOW IT WORKS SECTION - Professional ============ */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-navy-800 mb-3">
              {t("howItWorks")}
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              {t("howItWorksSubtitle")}
            </p>
          </div>

          {/* Steps Container */}
          <div className="relative">
            {/* Connecting Line (Desktop Only) */}
            <div className="hidden md:block absolute top-10 left-0 right-0 h-1 mx-32">
              <div className="w-full h-full flex">
                <div className="w-1/3 bg-gradient-to-r from-orange-500 to-orange-400"></div>
                <div className="w-1/3 bg-gradient-to-r from-orange-400 to-green-400"></div>
                <div className="w-1/3 bg-gradient-to-r from-green-400 to-green-500"></div>
              </div>
            </div>

            {/* 4 Steps Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-6 relative">

              {/* Step 1 */}
              <div className="text-center group">
                <div className="relative inline-block mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto shadow-xl group-hover:scale-110 transition duration-300 border-4 border-white relative z-10">
                    1
                  </div>
                  <div className="absolute inset-0 bg-orange-400 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition"></div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-2xl transition duration-300 border-t-4 border-orange-500">
                  <div className="w-12 h-12 mx-auto mb-3 bg-orange-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <h4 className="font-bold text-navy-800 text-lg mb-2">
                    {t("step1Title")}
                  </h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {t("step1Desc")}
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="text-center group">
                <div className="relative inline-block mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto shadow-xl group-hover:scale-110 transition duration-300 border-4 border-white relative z-10">
                    2
                  </div>
                  <div className="absolute inset-0 bg-orange-400 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition"></div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-2xl transition duration-300 border-t-4 border-orange-500">
                  <div className="w-12 h-12 mx-auto mb-3 bg-orange-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h4 className="font-bold text-navy-800 text-lg mb-2">
                    {t("step2Title")}
                  </h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {t("step2Desc")}
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="text-center group">
                <div className="relative inline-block mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto shadow-xl group-hover:scale-110 transition duration-300 border-4 border-white relative z-10">
                    3
                  </div>
                  <div className="absolute inset-0 bg-green-400 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition"></div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-2xl transition duration-300 border-t-4 border-green-500">
                  <div className="w-12 h-12 mx-auto mb-3 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <h4 className="font-bold text-navy-800 text-lg mb-2">
                    {t("step3Title")}
                  </h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {t("step3Desc")}
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="text-center group">
                <div className="relative inline-block mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto shadow-xl group-hover:scale-110 transition duration-300 border-4 border-white relative z-10">
                    4
                  </div>
                  <div className="absolute inset-0 bg-green-400 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition"></div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-2xl transition duration-300 border-t-4 border-green-500">
                  <div className="w-12 h-12 mx-auto mb-3 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </div>
                  <h4 className="font-bold text-navy-800 text-lg mb-2">
                    {t("step4Title")}
                  </h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {t("step4Desc")}
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ============ IMPORTANT NOTICE BAR (Bottom Scrolling) ============ */}
      <div className="bg-navy-800 text-white py-3 flex items-center overflow-hidden">
        <div className="bg-orange-500 px-6 py-2 font-bold whitespace-nowrap">
          {t("importantNotice")}
        </div>
        <div className="flex-1 overflow-hidden ml-4">
          <div className="whitespace-nowrap animate-marquee">
           {t("noticeText")}
          </div>
        </div>
        <button className="text-white px-4">
          ⏸
        </button>
      </div>

      {/* ============ FOOTER ============ */}
      <footer className="bg-navy-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 flex items-center justify-center bg-white rounded-full p-2">
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="#1E3A8A" strokeWidth="3"/>
                    <circle cx="50" cy="50" r="8" fill="#1E3A8A"/>
                    {[...Array(24)].map((_, i) => (
                      <line key={i} x1="50" y1="50"
                        x2={50 + 40 * Math.cos((i * 15 * Math.PI) / 180)}
                        y2={50 + 40 * Math.sin((i * 15 * Math.PI) / 180)}
                        stroke="#1E3A8A" strokeWidth="1.5"/>
                    ))}
                  </svg>
                </div>
                <div>
                  <h1 className="text-2xl font-bold font-hindi text-white leading-tight drop-shadow-md">
                {t("bhoomiSevaHindi")}
              </h1>
              <p className="text-sm font-bold text-orange-8000 leading-tight">
                {t("bhoomiSevaEng")}
              </p>
                </div>
              </div>
              <p className="text-sm text-gray-300 leading-relaxed">
                {t("footerTagline")}
              </p>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-4">{t("quickLinks")}</h4>
              <ul className="space-y-3">
                <li><Link to="/" className="text-sm text-gray-300 hover:text-white flex items-center gap-1"><ChevronRight size={14} /> {t("home")}</Link></li>
                <li><Link to="/search" className="text-sm text-gray-300 hover:text-white flex items-center gap-1"><ChevronRight size={14} /> {t("searchRecords")}</Link></li>
                <li><Link to="/about" className="text-sm text-gray-300 hover:text-white flex items-center gap-1"><ChevronRight size={14} /> {t("aboutUs")}</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-4">{t("contact")}</h4>
              <ul className="space-y-3 text-sm text-gray-300">
                <li className="flex items-center gap-2"><Phone size={16} className="text-orange-400" /><span>+91 90231-5234</span></li>
                <li className="flex items-center gap-2"><Phone size={16} className="text-orange-400" /><span>+91 90230-6005</span></li>
                <li className="flex items-center gap-2 mt-3"><Mail size={16} className="text-orange-400" /><span>bhoomiseva@maharatra.gov.in</span></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-navy-700 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center gap-3">
            <p className="text-xs text-gray-400">{t("copyright")}</p>
            <p className="text-xs text-gray-400">{t("developedFor")}</p>
          </div>
        </div>
      </footer>

      {/* ============ MAP MODAL ============ */}
      {showMapModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-auto relative">
            <button
              onClick={() => { setShowMapModal(false); setActiveTab("news"); }}
              className="absolute top-4 right-4 bg-navy-800 hover:bg-navy-900 text-white p-2 rounded-lg z-10"
            >
              <X size={20} />
            </button>
            <div className="p-6">
              <h3 className="text-2xl font-bold text-navy-800 mb-4 text-center">
                {t("maharashtraMap")}
              </h3>
            <img
              src="/images/maharashtra-map.png"
              alt="Maharashtra Map"
              className="w-full h-auto rounded-lg"
            />
              <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                {[
                ].map((div, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div className={`w-4 h-4 ${div.color} rounded`}></div>
                    <span className="text-gray-700">{div.name}</span>
                  </div>
                ))}
              </div>
              <div className="text-center mt-6">
                <button
                  onClick={() => { setShowMapModal(false); setActiveTab("news"); }}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-2 rounded-lg font-semibold"
                >
                  {t("close")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LandingPage;