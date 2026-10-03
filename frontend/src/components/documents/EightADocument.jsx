import { forwardRef } from "react";

const EightADocument = forwardRef(({ data }, ref) => {
  if (!data) return null;

  const currentDate = new Date().toLocaleString("en-IN", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit", hour12: true,
  });

  return (
    <div ref={ref} className="bg-white p-8" style={{ fontFamily: "'Noto Sans Devanagari', sans-serif", minWidth: "900px" }}>
      <div className="border-2 border-gray-800 p-4">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="w-20 h-20 flex-shrink-0">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <circle cx="50" cy="50" r="45" fill="none" stroke="#1a1a1a" strokeWidth="2" />
              <text x="50" y="55" textAnchor="middle" fontSize="8" fill="#1a1a1a" fontWeight="bold">सत्यमेव जयते</text>
              <circle cx="50" cy="50" r="15" fill="#1a1a1a" />
            </svg>
          </div>

          <div className="text-center flex-1">
            <h1 className="text-2xl font-bold text-gray-900">महाराष्ट्र शासन</h1>
            <h2 className="text-xl font-bold text-gray-900 mt-1">गाव नमुना आठ अ ( 8A )</h2>
            <p className="text-sm font-semibold text-gray-800 mt-1">हक्क संधारण पत्रक</p>
            <p className="text-xs text-gray-700 mt-1">
              ( महाराष्ट्र जमीन महसूल अधिकार अभिलेख आणि नोंदवही नियम, १९७१ यातील नियम ३,४,६ आणि ७ )
            </p>
          </div>

          <div className="w-20 h-20 border-2 border-gray-800 flex items-center justify-center">
            <div className="grid grid-cols-5 gap-0.5">
              {[...Array(25)].map((_, i) => (
                <div key={i} className={`w-1.5 h-1.5 ${Math.random() > 0.5 ? "bg-gray-800" : "bg-white"}`}></div>
              ))}
            </div>
          </div>
        </div>

        {/* Basic Info */}
        <div className="grid grid-cols-4 gap-4 text-sm border-t border-b border-gray-400 py-3">
          <div><span className="font-semibold">गाव :</span> {data.village}</div>
          <div><span className="font-semibold">Survey No. / GAT No. :</span> {data.surveyNo}</div>
          <div><span className="font-semibold">दिनांक :</span> {currentDate}</div>
          <div className="border border-gray-800 p-2 text-center row-span-2">
            <div className="text-xs font-semibold">भूमापन क्रमांक</div>
            <div className="text-lg font-bold mt-1">{data.bhoomapanKramank}</div>
          </div>
          <div><span className="font-semibold">तालुका :</span> {data.taluka}</div>
          <div><span className="font-semibold">Sheet No. :</span> {data.sheetNo}</div>
          <div><span className="font-semibold">जमिनीचा प्रकार :</span> Agricultural</div>
          <div><span className="font-semibold">जिल्हा :</span> {data.district}</div>
          <div><span className="font-semibold">Area :</span> {data.areaHectare} Hectare</div>
          <div><span className="font-semibold">भोगवटादार वर्ग :</span> {data.bhogatdarVarga}</div>
        </div>

        {/* Owner Details Table */}
        <div className="mt-3">
          <div className="bg-gray-100 border border-gray-800 p-2 text-center font-semibold">
            खातेदार व हक्कदार यांचे तपशील
          </div>
          <table className="w-full border border-gray-800 text-xs">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-800 p-2">अ.क्र.</th>
                <th className="border border-gray-800 p-2">खातेदाराचे नाव</th>
                <th className="border border-gray-800 p-2">वडिलांचे/पतीचे नाव</th>
                <th className="border border-gray-800 p-2">पत्ता</th>
                <th className="border border-gray-800 p-2">हक्काचा प्रकार</th>
                <th className="border border-gray-800 p-2">हिस्सा</th>
                <th className="border border-gray-800 p-2">खाते क्रमांक</th>
                <th className="border border-gray-800 p-2">नोंद दिनांक</th>
                <th className="border border-gray-800 p-2">शेरा</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-800 p-2 text-center">1</td>
                <td className="border border-gray-800 p-2">{data.owner1Name}</td>
                <td className="border border-gray-800 p-2">{data.owner1FatherName}</td>
                <td className="border border-gray-800 p-2">{data.owner1Address}</td>
                <td className="border border-gray-800 p-2 text-center">{data.owner1HakkaPrakar}</td>
                <td className="border border-gray-800 p-2 text-center">{data.owner1Hissa}</td>
                <td className="border border-gray-800 p-2 text-center">{data.owner1KhateKramank}</td>
                <td className="border border-gray-800 p-2 text-center">{data.owner1NondDate}</td>
                <td className="border border-gray-800 p-2 text-center">{data.owner1Shera}</td>
              </tr>
              {data.owner2Name && (
                <tr>
                  <td className="border border-gray-800 p-2 text-center">2</td>
                  <td className="border border-gray-800 p-2">{data.owner2Name}</td>
                  <td className="border border-gray-800 p-2">{data.owner2FatherName}</td>
                  <td className="border border-gray-800 p-2">{data.owner2Address}</td>
                  <td className="border border-gray-800 p-2 text-center">{data.owner2HakkaPrakar}</td>
                  <td className="border border-gray-800 p-2 text-center">{data.owner2Hissa}</td>
                  <td className="border border-gray-800 p-2 text-center">{data.owner2KhateKramank}</td>
                  <td className="border border-gray-800 p-2 text-center">{data.owner2NondDate}</td>
                  <td className="border border-gray-800 p-2 text-center">{data.owner2Shera}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Land Details */}
        <div className="grid grid-cols-2 gap-4 mt-3">
          <div>
            <div className="bg-gray-100 border border-gray-800 p-2 text-center font-semibold text-sm">जमिनीचे तपशील</div>
            <table className="w-full border border-gray-800 text-xs">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-800 p-1">अ.क्र.</th>
                  <th className="border border-gray-800 p-1">क्षेत्र</th>
                  <th className="border border-gray-800 p-1">एकर व आकार</th>
                  <th className="border border-gray-800 p-1">भोगवटदार वर्ग</th>
                  <th className="border border-gray-800 p-1">पीक पद्धती</th>
                  <th className="border border-gray-800 p-1">सिंचन साधन</th>
                  <th className="border border-gray-800 p-1">लागवड क्षमता</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-800 p-1 text-center">1</td>
                  <td className="border border-gray-800 p-1 text-center">
                    {data.kshetraHectare}<br /><span className="text-xs">(हेक्टर)</span>
                  </td>
                  <td className="border border-gray-800 p-1 text-center">{data.acreAakaar}</td>
                  <td className="border border-gray-800 p-1 text-center">{data.bhogatdarVarga}</td>
                  <td className="border border-gray-800 p-1 text-center">{data.pikPaddhati}</td>
                  <td className="border border-gray-800 p-1 text-center">{data.sinchanSadhan}</td>
                  <td className="border border-gray-800 p-1 text-center">{data.lagwadKshamata}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div>
            <div className="bg-gray-100 border border-gray-800 p-2 text-center font-semibold text-sm">इतर अधिकार</div>
            <div className="border border-gray-800 p-3 text-sm" style={{ minHeight: "80px" }}>
              {data.shera || "कोणतेही नाही."}
            </div>
          </div>
        </div>

        {/* Remarks */}
        <div className="grid grid-cols-2 gap-4 mt-3">
          <div>
            <div className="bg-gray-100 border border-gray-800 p-2 text-sm font-semibold">शेरा</div>
            <div className="border border-gray-800 p-2 text-sm">{data.shera}</div>
          </div>
          <div>
            <div className="bg-gray-100 border border-gray-800 p-2 text-sm font-semibold">अधिभार / गहाण / इतर नोंदी</div>
            <div className="border border-gray-800 p-2 text-sm">{data.adhibhar}</div>
          </div>
        </div>

        {/* Footer */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="text-sm">
            <p><span className="font-semibold">तयार दिनांक :</span> {currentDate}</p>
            <p><span className="font-semibold">तयार करणारा :</span> {data.generatedBy || "System"}</p>
            <p><span className="font-semibold">गाव :</span> {data.village}</p>
            <p><span className="font-semibold">तालुका :</span> {data.taluka}</p>
            <p><span className="font-semibold">जिल्हा :</span> {data.district}</p>
          </div>

          <div className="flex justify-center items-center">
            <div className="w-24 h-24 rounded-full border-2 border-gray-800 flex items-center justify-center">
              <span className="text-xs text-center">Government<br />Seal</span>
            </div>
          </div>

          <div className="text-sm text-right">
            <p className="text-xs italic">टीप : हा दस्त्येवज संगणकीय प्रणालीद्वारे तयार करण्यात आलेला आहे.</p>
            <p className="text-xs italic">डिजिटल सहीची आवश्यकता नाही.</p>
            <div className="mt-6">
              <p className="font-semibold">तलाठी</p>
              <p>{data.taluka}</p>
              <p>सही / स्वाक्षरी</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

EightADocument.displayName = "EightADocument";
export default EightADocument;