import { useState } from "react";
import { Phone, Mail, MapPin, Send, Clock, Globe } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { contactAPI } from "../services/api";

function ContactPage() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await contactAPI.send(formData);
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      alert("Failed to send message. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-navy-800 to-navy-900 text-white py-16 px-4 text-center">
        <h1 className="text-5xl font-bold mb-3">{t("contactUsTitle")}</h1>
        <p className="text-lg opacity-90">{t("contactUsSubtitle")}</p>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-6 mb-12">
          {[
            { icon: Phone, title: t("callUs"), info: "+91 90231-52345", sub: t("callUsHours"), color: "orange" },
            { icon: Mail, title: t("emailUs"), info: "admin@bhoomiseva.gov.in", sub: t("emailResponse"), color: "blue" },
            { icon: MapPin, title: t("visitUs"), info: t("visitUsDept"), sub: t("visitUsAddress"), color: "green" },
          ].map((item, idx) => (
            <div key={idx} className="bg-white rounded-xl p-6 text-center shadow-lg hover:shadow-2xl transition">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <item.icon className="text-orange-600" size={28} />
              </div>
              <h3 className="font-bold text-navy-800 text-lg mb-2">{item.title}</h3>
              <p className="text-navy-800 font-semibold">{item.info}</p>
              <p className="text-gray-500 text-sm mt-1">{item.sub}</p>
            </div>
          ))}
        </div>

        {/* Contact Form */}
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-3xl font-bold text-navy-800 mb-6 text-center">{t("sendMessage")}</h2>

          {submitted && (
            <div className="bg-green-100 text-green-800 p-4 rounded-lg mb-6 text-center">
              {t("thankYouMessage")}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder={t("yourName")}
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
              />
              <input
                type="email"
                placeholder={t("yourEmail")}
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
              />
            </div>
            <input
              type="text"
              placeholder={t("subject")}
              value={formData.subject}
              onChange={(e) => setFormData({...formData, subject: e.target.value})}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
            />
            <textarea
              placeholder={t("yourMessage")}
              rows="5"
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
            ></textarea>
            <button type="submit" className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-lg font-bold hover:from-orange-600 hover:to-orange-700 transition flex items-center justify-center gap-2 shadow-xl">
              <Send size={18} />
              {t("sendMessageBtn")}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

export default ContactPage;