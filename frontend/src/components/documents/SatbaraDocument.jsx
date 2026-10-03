import { forwardRef } from "react";

const SatbaraDocument = forwardRef(({ data, landRecord }, ref) => {
  if (!data) return null;

  const currentDate = new Date().toLocaleString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <div ref={ref} className="bg-white p-8" style={{ fontFamily: "'Noto Sans Devanagari', sans-serif", minWidth: "900px" }}>
      {/* Header */}
      <div className="border-2 border-gray-800 p-4">
        <div className="flex justify-between items-start mb-4">
          {/* Government Emblem */}
          <div className="w-20 h-20 flex-shrink-0">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <circle cx="50" cy="50" r="45" fill="none" stroke="#1a1a1a" strokeWidth="2" />
              <text x="50" y="55" textAnchor="middle" fontSize="8" fill="#1a1a1a" fontWeight="bold">
                सत्यमेव जयते
              </text>
              <circle cx="50" cy="50" r="15" fill="#1a1a1a" />
            </svg>
          </div>

          {/* Title */}
          <div className="text-center flex-1">
            <h1 className="text-2xl font-bold text-gray-900">महाराष्ट्र शासन</h1>
            <h2 className="text-xl font-bold text-gray-900 mt-1">
              गाव नमुना सात / बारा ( 7/12 )
            </h2>
            <p className="text-xs text-gray-700 mt-1">
              ( महाराष्ट्र जमीन महसूल अधिकार अभिलेख आणि नोंदवही नियम, १९७१ यातील नियम ३,४,६ आणि ७ )
            </p>
          </div>

          {/* QR Code Placeholder */}
          <div className="w-20 h-20 border-2 border-gray-800 flex items-center justify-center">
            <div className="grid grid-cols-5 gap-0.5">
              {[...Array(25)].map((_, i) => (
                <div key={i} className={`w-1.5 h-1.5 ${Math.random() > 0.5 ? "bg-gray-800" : "bg-white"}`}></div>
              ))}
            </div>
          </div>
        </div>

        {/* Basic Info */}
        <div className="grid grid-cols-4 gap-4 text-sm border-t border-gray-400 pt-3">
          <div><span className="font-semibold">गाव :</span> {data.village}</div>
          <div><span className="font-semibold">तालुका :</span> {data.taluka}</div>
          <div><span className="font-semibold">जिल्हा :</span> {data.district}</div>
          <div><span className="font-semibold">दिनांक :</span> {currentDate}</div>
          <div><span className="font-semibold">Survey No. / GAT No. :</span> {data.surveyNo}</div>
          <div><span className="font-semibold">Sheet No. :</span> {data.sheetNo}</div>
          <div><span className="font-semibold">क्षेत्र :</span> {data.areaHectare} Hectare</div>
          <div><span className="font-semibold">जमिनीचा प्रकार :</span> Agricultural</div>
        </div>

        {/* Main Table */}
        <table className="w-full border border-gray-800 mt-4 text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th colSpan="2" className="border border-gray-800 p-2">(1) भूमिधारकाचे नाव व पत्ता</th>
              <th colSpan="4" className="border border-gray-800 p-2">(2) शेताचे वर्णन</th>
              <th colSpan="4" className="border border-gray-800 p-2">(3) आकारणी</th>
            </tr>
            <tr className="bg-gray-50 text-xs">
              <th className="border border-gray-800 p-2">अ.क्र.</th>
              <th className="border border-gray-800 p-2">भूमिधारकाचे नाव व पत्ता</th>
              <th className="border border-gray-800 p-2">क्षेत्र</th>
              <th className="border border-gray-800 p-2">एकर व आकार</th>
              <th className="border border-gray-800 p-2">भोगवटदार वर्ग</th>
              <th className="border border-gray-800 p-2">पीक पद्धती</th>
              <th className="border border-gray-800 p-2">पोटखर्च</th>
              <th className="border border-gray-800 p-2">फ्रेस</th>
              <th className="border border-gray-800 p-2">इतर</th>
              <th className="border border-gray-800 p-2">एकूण</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-800 p-2 text-center">1</td>
              <td className="border border-gray-800 p-2">
                {data.ownerName}<br />
                <span className="text-xs">{data.ownerAddress}</span>
              </td>
              <td className="border border-gray-800 p-2 text-center">{data.kshetra}</td>
              <td className="border border-gray-800 p-2 text-center">{data.acreAakaar}</td>
              <td className="border border-gray-800 p-2 text-center">{data.bhogatdarVarga}</td>
              <td className="border border-gray-800 p-2 text-center">{data.pikPaddhati}</td>
              <td className="border border-gray-800 p-2 text-center">{data.potkharcha}</td>
              <td className="border border-gray-800 p-2 text-center">{data.fress}</td>
              <td className="border border-gray-800 p-2 text-center">{data.itar}</td>
              <td className="border border-gray-800 p-2 text-center font-semibold">{data.ekunAakarani}</td>
            </tr>
          </tbody>
        </table>

        {/* Crop Records */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <table className="w-full border border-gray-800 text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th colSpan="6" className="border border-gray-800 p-2">(4) पिकांची नोंद</th>
              </tr>
              <tr className="bg-gray-50 text-xs">
                <th className="border border-gray-800 p-1">हंगाम</th>
                <th className="border border-gray-800 p-1">खरीप / रब्बी</th>
                <th className="border border-gray-800 p-1">पीक</th>
                <th className="border border-gray-800 p-1">क्षेत्र</th>
                <th className="border border-gray-800 p-1">एकर</th>
                <th className="border border-gray-800 p-1">आकारणी</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-800 p-1 text-center">खरीप</td>
                <td className="border border-gray-800 p-1"></td>
                <td className="border border-gray-800 p-1 text-center">{data.kharipCrop}</td>
                <td className="border border-gray-800 p-1 text-center">{data.kharipArea}</td>
                <td className="border border-gray-800 p-1 text-center">-</td>
                <td className="border border-gray-800 p-1 text-center">{data.kharipAakarani}</td>
              </tr>
              <tr>
                <td className="border border-gray-800 p-1 text-center">रब्बी</td>
                <td className="border border-gray-800 p-1"></td>
                <td className="border border-gray-800 p-1 text-center">{data.rabiCrop}</td>
                <td className="border border-gray-800 p-1 text-center">{data.rabiArea}</td>
                <td className="border border-gray-800 p-1 text-center">-</td>
                <td className="border border-gray-800 p-1 text-center">{data.rabiAakarani}</td>
              </tr>
              <tr className="bg-gray-50 font-semibold">
                <td colSpan="2" className="border border-gray-800 p-1 text-center">एकूण</td>
                <td className="border border-gray-800 p-1"></td>
                <td className="border border-gray-800 p-1 text-center">{data.areaHectare}</td>
                <td className="border border-gray-800 p-1 text-center">-</td>
                <td className="border border-gray-800 p-1 text-center">
                  {(Number(data.kharipAakarani || 0) + Number(data.rabiAakarani || 0)).toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>

          <table className="w-full border border-gray-800 text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-800 p-2">(5) इतर अधिकार</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-800 p-2" style={{ height: "150px", verticalAlign: "top" }}>
                  {data.itarAdhikar}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="mt-4 text-sm">
          <p className="font-semibold">टीप :</p>
          <p className="text-xs mt-1">१. हा दाखला संगणकीय प्रणालीद्वारे तयार करण्यात आलेला आहे.</p>
          <p className="text-xs">२. या दाखल्यावर कोणत्याही सहीची आवश्यकता नाही.</p>
        </div>

        {/* Signature Row */}
        <div className="grid grid-cols-3 gap-4 mt-6 items-end">
          <div className="text-sm">
            <p><span className="font-semibold">तयार दिनांक :</span> {currentDate}</p>
            <p><span className="font-semibold">ठिकाण :</span> {data.taluka}</p>
          </div>

          <div className="flex justify-center">
            <div className="w-24 h-24 rounded-full border-2 border-gray-800 flex items-center justify-center">
              <span className="text-xs text-center">Government<br />Seal</span>
            </div>
          </div>

          <div className="text-sm text-right">
            <p><span className="font-semibold">तयार करणारा :</span> {data.generatedBy || "System"}</p>
            <p><span className="font-semibold">पद :</span> {data.talathiName}</p>
            <p><span className="font-semibold">गाव :</span> {data.village}</p>
          </div>
        </div>
      </div>
    </div>
  );
});

SatbaraDocument.displayName = "SatbaraDocument";
export default SatbaraDocument;