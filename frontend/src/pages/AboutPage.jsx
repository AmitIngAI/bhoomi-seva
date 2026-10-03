import { Link } from "react-router-dom";
import { CheckCircle, Award, Users, Target, Zap, Shield, TrendingUp, Database, Cpu, MapPin, Mail, Phone } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

function AboutPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <section
        className="relative py-20"
        style={{
          backgroundImage: "linear-gradient(rgba(30, 58, 138, 0.85), rgba(30, 58, 138, 0.85)), url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 text-center text-white">
          <span className="inline-block bg-orange-500 px-4 py-1.5 rounded-full text-sm font-bold mb-4 uppercase tracking-wider">
            {t("aboutBadge")}
          </span>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
            {t("aboutHeroTitle")}
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto opacity-95">
            {t("aboutHeroSubtitle")}
          </p>
        </div>
      </section>

      {/* Short Introduction */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-orange-500 font-bold text-sm uppercase tracking-wider">{t("ourMissionLabel")}</span>
              <h2 className="text-4xl font-bold text-navy-800 mt-2 mb-4">
                {t("aboutSectionTitle")}
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                {t("aboutPara1a")} <strong className="text-navy-800">{t("aboutPara1b")}</strong> {t("aboutPara1c")}
              </p>
              <p className="text-gray-600 leading-relaxed">
                {t("aboutPara2")}
              </p>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80"
                alt="About"
                className="rounded-2xl shadow-2xl w-full"
              />
              <div className="absolute -bottom-6 -right-6 bg-orange-500 text-white p-6 rounded-2xl shadow-2xl">
                <p className="text-4xl font-bold">99.8%</p>
                <p className="text-sm">{t("mlAccuracyLabel")}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-orange-500 font-bold text-sm uppercase tracking-wider">{t("whatWeOffer")}</span>
            <h2 className="text-4xl font-bold text-navy-800 mt-2">{t("keyFeatures")}</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Database, title: t("feature1Title"), desc: t("feature1Desc"), color: "orange" },
              { icon: Cpu, title: t("feature2Title"), desc: t("feature2Desc"), color: "blue" },
              { icon: MapPin, title: t("feature3Title"), desc: t("feature3Desc"), color: "green" },
              { icon: Shield, title: t("feature4Title"), desc: t("feature4Desc"), color: "purple" },
              { icon: Zap, title: t("feature5Title"), desc: t("feature5Desc"), color: "red" },
              { icon: TrendingUp, title: t("feature6Title"), desc: t("feature6Desc"), color: "yellow" },
            ].map((feature, idx) => (
              <div key={idx} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-2xl transition duration-300 border-t-4 border-orange-500">
                <div className="w-14 h-14 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="text-orange-600" size={28} />
                </div>
                <h3 className="font-bold text-navy-800 text-lg mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      
      {/* Impact Stats */}
      <section className="py-16 px-4 bg-orange-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-navy-800">{t("ourImpact")}</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { number: "1,000+", label: t("landRecords"), icon: Database },
              { number: "3", label: t("villagesCovered"), icon: MapPin },
              { number: "1,200+", label: t("predictionsMade"), icon: TrendingUp },
              { number: "99.8%", label: t("mlAccuracy"), icon: Award },
            ].map((stat, idx) => (
              <div key={idx} className="bg-white rounded-xl p-6 text-center shadow-lg">
                <stat.icon className="text-orange-500 mx-auto mb-3" size={32} />
                <p className="text-4xl font-bold text-navy-800">{stat.number}</p>
                <p className="text-gray-600 text-sm mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team / Objective */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-2xl p-8 shadow-xl">
              <Target size={40} className="mb-4" />
              <h3 className="text-2xl font-bold mb-3">{t("ourVision")}</h3>
              <p className="leading-relaxed">
                {t("ourVisionDesc")}
              </p>
            </div>
            <div className="bg-gradient-to-br from-navy-700 to-navy-800 text-white rounded-2xl p-8 shadow-xl">
              <Users size={40} className="mb-4" />
              <h3 className="text-2xl font-bold mb-3">{t("ourMission")}</h3>
              <p className="leading-relaxed">
                {t("ourMissionDesc")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-gradient-to-r from-orange-500 to-orange-600 text-center">
        <div className="max-w-4xl mx-auto text-white">
          <h2 className="text-4xl font-bold mb-4">{t("readyToStart")}</h2>
          <p className="text-lg mb-8 opacity-95">{t("readyToStartDesc")}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/search" className="bg-white text-orange-600 px-8 py-4 rounded-lg font-bold hover:bg-gray-100 transition shadow-xl">
              {t("searchRecords")}
            </Link>
            <Link to="/contact" className="bg-navy-800 text-white px-8 py-4 rounded-lg font-bold hover:bg-navy-900 transition shadow-xl">
              {t("contactUs")}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AboutPage;