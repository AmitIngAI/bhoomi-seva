import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Phone, Mail, ChevronRight, X } from "lucide-react";
import { landRecordsAPI } from "../services/api";
import HeroCircle from "../components/HeroCircle";
import { useLanguage } from "../context/LanguageContext";

const STEPS = [
  {
    n: 1,
    titleKey: "step1Title",
    descKey: "step1Desc",
    circle: "from-orange-500 to-orange-600",
    glow: "bg-orange-400",
    card: "border-orange-500",
    iconBg: "bg-orange-100",
    iconColor: "text-orange-600",
    path: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
  },
  {
    n: 2,
    titleKey: "step2Title",
    descKey: "step2Desc",
    circle: "from-orange-500 to-orange-600",
    glow: "bg-orange-400",
    card: "border-orange-500",
    iconBg: "bg-orange-100",
    iconColor: "text-orange-600",
    path: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
  },
  {
    n: 3,
    titleKey: "step3Title",
    descKey: "step3Desc",
    circle: "from-green-500 to-green-600",
    glow: "bg-green-400",
    card: "border-green-500",
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
    path: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6",
  },
  {
    n: 4,
    titleKey: "step4Title",
    descKey: "step4Desc",
    circle: "from-green-500 to-green-600",
    glow: "bg-green-400",
    card: "border-green-500",
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
    path: "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4",
  },
];

function LandingPage() {
  const { t } = useLanguage();
  const [stats, setStats] = useState({
    totalRecords: 0,
    totalVillages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [showMapModal, setShowMapModal] = useState(false);

  useEffect(() => {
    loadStats();
  }, []);

  useEffect(() => {
  fetch("https://bhoomi-seva.onrender.com/health").catch(() => {});
  fetch("https://bhoomi-ml-api.onrender.com/health").catch(() => {});
  }, []);

  const loadStats = async () => {
    try {
      const response = await landRecordsAPI.getStats();
      setStats(response.data);
    } catch (error) {
      console.error("Error loading stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const totalRecords = Number(stats?.totalRecords) || 0;

  return (
    <div className="min-h-screen bg-white w-full overflow-x-hidden">

      {/* ============ MAIN HERO SECTION ============ */}
      <section
        className="relative min-h-[620px] md:min-h-[750px] pb-10 overflow-hidden"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/30 pointer-events-none"></div>

        {/* MAP button - Top Right */}
        <div className="absolute top-3 right-3 sm:top-6 sm:right-6 z-20">
          <button
            onClick={() => setShowMapModal(true)}
            className="bg-navy-800 hover:bg-navy-900 text-white py-1.5 px-3 sm:px-4 rounded-md font-bold text-xs transition shadow-lg border-b-2 border-orange-500 flex items-center gap-1.5"
          >
            <span>🗺️ {t("map")}</span>
            <span className="bg-red-500 text-white text-[8px] px-1.5 py-1.5 rounded-full font-bold">
              {t("new")}
            </span>
          </button>
        </div>

        {/* TITLE */}
        <div className="relative z-10 pt-14 sm:pt-10 pb-4 text-center px-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 drop-shadow-2xl leading-tight">
            {t("heroTitle1")}
            <br />
            {t("heroTitle2")}
          </h1>
          <p className="text-sm md:text-base text-white/95 drop-shadow-lg font-medium max-w-3xl mx-auto">
            {t("heroSubtitle")}
          </p>
        </div>

        {/* HERO CIRCLE */}
        <div className="relative z-10 flex items-center justify-center mt-4 w-full">
          <HeroCircle />
        </div>
      </section>

      {/* ============ STATISTICS CARDS ============ */}
      <section className="bg-gradient-to-r from-navy-900 via-navy-800 to-navy-900 py-8 sm:py-10 px-3 sm:px-4 shadow-2xl">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6">

            {/* Total Records */}
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-4 sm:p-6 shadow-2xl text-center md:hover:scale-105 transition duration-300 border-t-4 border-yellow-400">
              <div className="w-12 h-12 mx-auto mb-3 bg-white/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-[11px] sm:text-xs md:text-sm text-white/90 font-semibold mb-1 uppercase tracking-wide">
                {t("totalRecords")}
              </p>
              <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-white drop-shadow-lg">
                {loading ? "..." : `${totalRecords.toLocaleString()}+`}
              </p>
            </div>

            {/* Villages Covered */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-4 sm:p-6 shadow-2xl text-center md:hover:scale-105 transition duration-300 border-t-4 border-orange-400">
              <div className="w-12 h-12 mx-auto mb-3 bg-white/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <p className="text-[11px] sm:text-xs md:text-sm text-white/90 font-semibold mb-1 uppercase tracking-wide">
                {t("villagesCovered")}
              </p>
              <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-white drop-shadow-lg">
                {loading ? "..." : stats.totalVillages}
              </p>
            </div>

            {/* Predictions Made */}
            <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-xl p-4 sm:p-6 shadow-2xl text-center md:hover:scale-105 transition duration-300 border-t-4 border-yellow-400">
              <div className="w-12 h-12 mx-auto mb-3 bg-white/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <p className="text-[11px] sm:text-xs md:text-sm text-white/90 font-semibold mb-1 uppercase tracking-wide">
                {t("predictionsMade")}
              </p>
              <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-white drop-shadow-lg">
                1,200+
              </p>
            </div>

            {/* ML Model Accuracy */}
            <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl p-4 sm:p-6 shadow-2xl text-center md:hover:scale-105 transition duration-300 border-t-4 border-orange-400">
              <div className="w-12 h-12 mx-auto mb-3 bg-white/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <p className="text-[11px] sm:text-xs md:text-sm text-white/90 font-semibold mb-1 uppercase tracking-wide">
                {t("mlAccuracy")}
              </p>
              <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-white drop-shadow-lg">
                99.8%
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ============ HOW IT WORKS ============ */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-12 sm:py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-navy-800 mb-3">
              {t("howItWorks")}
            </h2>
            <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
              {t("howItWorksSubtitle")}
            </p>
          </div>

          <div className="relative">
            <div className="hidden md:block absolute top-10 left-0 right-0 h-1 mx-32">
              <div className="w-full h-full flex">
                <div className="w-1/3 bg-gradient-to-r from-orange-500 to-orange-400"></div>
                <div className="w-1/3 bg-gradient-to-r from-orange-400 to-green-400"></div>
                <div className="w-1/3 bg-gradient-to-r from-green-400 to-green-500"></div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-6 relative">
              {STEPS.map((s) => (
                <div key={s.n} className="text-center group">
                  <div className="relative inline-block mb-6">
                    <div
                      className={`w-20 h-20 bg-gradient-to-br ${s.circle} text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto shadow-xl group-hover:scale-110 transition duration-300 border-4 border-white relative z-10`}
                    >
                      {s.n}
                    </div>
                    <div
                      className={`absolute inset-0 ${s.glow} rounded-full blur-xl opacity-50 group-hover:opacity-75 transition`}
                    ></div>
                  </div>
                  <div
                    className={`bg-white rounded-xl p-6 shadow-lg hover:shadow-2xl transition duration-300 border-t-4 ${s.card}`}
                  >
                    <div
                      className={`w-12 h-12 mx-auto mb-3 ${s.iconBg} rounded-lg flex items-center justify-center`}
                    >
                      <svg className={`w-6 h-6 ${s.iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={s.path} />
                      </svg>
                    </div>
                    <h4 className="font-bold text-navy-800 text-lg mb-2">{t(s.titleKey)}</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">{t(s.descKey)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============ IMPORTANT NOTICE BAR ============ */}
      <div className="bg-navy-800 text-white py-3 flex items-center overflow-hidden w-full">
        <div className="bg-orange-500 px-3 sm:px-6 py-2 font-bold whitespace-nowrap text-xs sm:text-base shrink-0">
          {t("importantNotice")}
        </div>
        <div className="flex-1 min-w-0 overflow-hidden ml-3 sm:ml-4">
          <div className="whitespace-nowrap animate-marquee text-sm sm:text-base">
            {t("noticeText")}
          </div>
        </div>
        <button className="text-white px-3 sm:px-4 shrink-0">⏸</button>
      </div>

      {/* ============ FOOTER ============ */}
      <footer className="bg-navy-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 flex items-center justify-center bg-white rounded-full p-2 shrink-0">
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="#1E3A8A" strokeWidth="3" />
                    <circle cx="50" cy="50" r="8" fill="#1E3A8A" />
                    {[...Array(24)].map((_, i) => (
                      <line
                        key={i}
                        x1="50"
                        y1="50"
                        x2={50 + 40 * Math.cos((i * 15 * Math.PI) / 180)}
                        y2={50 + 40 * Math.sin((i * 15 * Math.PI) / 180)}
                        stroke="#1E3A8A"
                        strokeWidth="1.5"
                      />
                    ))}
                  </svg>
                </div>
                <div>
                  <h1 className="text-2xl font-bold font-hindi text-white leading-tight drop-shadow-md">
                    {t("bhoomiSevaHindi")}
                  </h1>
                  <p className="text-sm font-bold text-orange-300 leading-tight">
                    {t("bhoomiSevaEng")}
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-300 leading-relaxed">{t("footerTagline")}</p>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-4">{t("quickLinks")}</h4>
              <ul className="space-y-3">
                <li>
                  <Link to="/" className="text-sm text-gray-300 hover:text-white flex items-center gap-1">
                    <ChevronRight size={14} /> {t("home")}
                  </Link>
                </li>
                <li>
                  <Link to="/search" className="text-sm text-gray-300 hover:text-white flex items-center gap-1">
                    <ChevronRight size={14} /> {t("searchRecords")}
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="text-sm text-gray-300 hover:text-white flex items-center gap-1">
                    <ChevronRight size={14} /> {t("aboutUs")}
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-4">{t("contact")}</h4>
              <ul className="space-y-3 text-sm text-gray-300">
                <li className="flex items-center gap-2">
                  <Phone size={16} className="text-orange-400 shrink-0" />
                  <span>+91 90231-5234</span>
                </li>
                <li className="flex items-center gap-2">
                  <Phone size={16} className="text-orange-400 shrink-0" />
                  <span>+91 90230-6005</span>
                </li>
                <li className="flex items-center gap-2 mt-3">
                  <Mail size={16} className="text-orange-400 shrink-0" />
                  <span className="break-all">bhoomiseva@maharatra.gov.in</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-navy-700 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center gap-3 text-center md:text-left">
            <p className="text-xs text-gray-400">{t("copyright")}</p>
            <p className="text-xs text-gray-400">{t("developedFor")}</p>
          </div>
        </div>
      </footer>

      {/* ============ MAP MODAL ============ */}
      {showMapModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-auto relative">
            <button
              onClick={() => setShowMapModal(false)}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-navy-800 hover:bg-navy-900 text-white p-2 rounded-lg z-10"
            >
              <X size={20} />
            </button>
            <div className="p-4 sm:p-6">
              <h3 className="text-xl sm:text-2xl font-bold text-navy-800 mb-4 text-center pr-10">
                {t("maharashtraMap")}
              </h3>
              <img
                src="/images/maharashtra-map.png"
                alt="Maharashtra Map"
                className="w-full h-auto rounded-lg"
              />
              <div className="text-center mt-6">
                <button
                  onClick={() => setShowMapModal(false)}
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
