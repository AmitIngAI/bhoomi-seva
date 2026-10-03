import { forwardRef } from "react";

const PropertyCardDocument = forwardRef(({ data }, ref) => {
  if (!data) return null;

  const currentDate = new Date().toLocaleString("en-IN", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit", hour12: true,
  });

  const formatCurrency = (num) => {
    if (!num) return "₹ 0";
    return "₹ " + Number(num).toLocaleString("en-IN");
  };

  return (
    <div ref={ref} className="bg-white p-6" style={{ fontFamily: "'Noto Sans Devanagari', sans-serif", minWidth: "1000px" }}>
      <div className="border-2 border-gray-800">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b-2 border-gray-800">
          <div className="w-20 h-20 flex-shrink-0">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <circle cx="50" cy="50" r="45" fill="none" stroke="#1a1a1a" strokeWidth="2" />
              <circle cx="50" cy="50" r="15" fill="#1a1a1a" />
            </svg>
          </div>

          <div className="text-center flex-1">
            <h1 className="text-xl font-bold text-gray-900">{data.corporationName}</h1>
            <div className="bg-blue-900 text-white px-4 py-1 inline-block mt-2 rounded">
              <span className="font-semibold">मालमत्ता पत्रिका / PROPERTY CARD</span>
            </div>
            <p className="text-xs text-gray-700 mt-1">(महाराष्ट्र महानगरपालिका अधिनियम, १९४९ कलम १४९ अन्वये)</p>
            <p className="text-xs text-gray-600">(Under Section 149 of Maharashtra Municipal Corporations Act, 1949)</p>
          </div>

          <div className="text-right">
            <p className="text-xs">Property ID :</p>
            <p className="text-sm font-bold">{data.propertyId}</p>
            <div className="w-16 h-16 border-2 border-gray-800 mt-2 flex items-center justify-center">
              <div className="grid grid-cols-4 gap-0.5">
                {[...Array(16)].map((_, i) => (
                  <div key={i} className={`w-1 h-1 ${Math.random() > 0.5 ? "bg-gray-800" : "bg-white"}`}></div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Section 1 & 2: Owner + Location */}
        <div className="grid grid-cols-2 gap-0">
          {/* Owner Details */}
          <div className="border-r border-gray-800 p-3">
            <div className="bg-gray-100 -m-3 mb-2 p-2 border-b border-gray-800 text-sm font-bold">
              1. मालकाचे तपशील / PROPERTY OWNER DETAILS
            </div>
            <div className="space-y-1 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <span className="font-semibold">मालकाचे नाव / Owner Name :</span>
                <span>{data.ownerName}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <span className="font-semibold">प्रतिनिधी नाव / Authorized Person :</span>
                <span>{data.authorizedPerson}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <span className="font-semibold">पत्ता / Address :</span>
                <span>{data.ownerAddress}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <span className="font-semibold">मोबाईल क्रमांक / Mobile No. :</span>
                <span>{data.mobileNo}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <span className="font-semibold">ईमेल / Email :</span>
                <span>{data.email}</span>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="p-3">
            <div className="bg-gray-100 -m-3 mb-2 p-2 border-b border-gray-800 text-sm font-bold">
              २. मालमत्तेचे स्थान / PROPERTY LOCATION
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-2 space-y-1 text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <span className="font-semibold">मालमत्ता क्रमांक / Property No. :</span>
                  <span>{data.propertyNo}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <span className="font-semibold">गाव / Village :</span>
                  <span>{data.village}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <span className="font-semibold">प्रभाग / Ward :</span>
                  <span>Ward No. {data.wardNo}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <span className="font-semibold">क्षेत्र / Area :</span>
                  <span>{data.areaSqm} Sq. Meter</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <span className="font-semibold">सर्वे क्रमांक / Survey No. :</span>
                  <span>{data.surveyNo}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <span className="font-semibold">हिस्सा क्रमांक / Hissa No. :</span>
                  <span>{data.hissaNo}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <span className="font-semibold">धारक नकाशा क्र. / TPS No. :</span>
                  <span>{data.tpsNo}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <span className="font-semibold">प्लॉट क्रमांक / Plot No. :</span>
                  <span>{data.plotNo}</span>
                </div>
              </div>
              <div className="text-center">
                <div className="text-xs font-semibold">Property Photo</div>
                <div className="w-24 h-20 bg-gray-200 border border-gray-400 flex items-center justify-center mt-1">
                  <span className="text-xs text-gray-500">Photo</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3 & 4: Property Type + Building */}
        <div className="grid grid-cols-2 gap-0 border-t-2 border-gray-800">
          <div className="border-r border-gray-800 p-3">
            <div className="bg-gray-100 -m-3 mb-2 p-2 border-b border-gray-800 text-sm font-bold">
              3. मालमत्तेचा प्रकार / TYPE OF PROPERTY
            </div>
            <div className="space-y-1 text-xs">
              {[
                ["वापराचा प्रकार / Usage Type", data.usageType],
                ["मालमत्तेचा प्रकार / Property Type", data.propertyType],
                ["बांधकामाचा प्रकार / Building Type", data.buildingType],
                ["व्यवसाय प्रकार / Business Type", data.businessType],
                ["बांधकाम स्थिती / Building Status", data.buildingStatus],
                ["बांधकाम मान्यता क्रमांक / Approval No.", data.approvalNo],
                ["मान्यता दिनांक / Approval Date", data.approvalDate],
                ["कार्यप्रवेश क्रमांक / Commencement No.", data.commencementNo],
                ["कार्यप्रवेश दिनांक / Commencement Date", data.commencementDate],
                ["अंतिम मान्यता क्रमांक / Completion No.", data.completionNo],
                ["पूर्णता दिनांक / Completion Date", data.completionDate],
              ].map(([label, value], idx) => (
                <div key={idx} className="grid grid-cols-2 gap-2">
                  <span className="font-semibold">{label} :</span>
                  <span>{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3">
            <div className="bg-gray-100 -m-3 mb-2 p-2 border-b border-gray-800 text-sm font-bold">
              ५. बांधकामाची माहिती / BUILDING DETAILS
            </div>
            <div className="space-y-1 text-xs">
              {[
                ["बांधकामाचे वर्ष / Year of Construction", data.yearOfConstruction],
                ["मजल्यांची संख्या / No. of Floors", data.noOfFloors],
                ["एकूण बांधकाम क्षेत्र / Built-up Area", `${data.builtUpArea} Sq.ft.`],
                ["कार्पेट क्षेत्र / Carpet Area", `${data.carpetArea} Sq.ft.`],
                ["प्लॉट क्षेत्र / Plot Area", `${data.plotArea} Sq.ft.`],
                ["मोकळी जागा / Open Area", `${data.openArea} Sq.ft.`],
                ["भिंतीचा प्रकार / Wall Type", data.wallType],
                ["छताचा प्रकार / Roof Type", data.roofType],
                ["छायाचा प्रकार / Staircase", data.staircaseType],
                ["लिफ्ट सुविधा / Lift Facility", data.liftFacility],
                ["भूखंडाचा वापर / Land Use", data.landUse],
              ].map(([label, value], idx) => (
                <div key={idx} className="grid grid-cols-2 gap-2">
                  <span className="font-semibold">{label} :</span>
                  <span>{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section 5 & 6: Tax Assessment + Outstanding */}
        <div className="grid grid-cols-2 gap-0 border-t-2 border-gray-800">
          <div className="border-r border-gray-800 p-3">
            <div className="bg-gray-100 -m-3 mb-2 p-2 border-b border-gray-800 text-sm font-bold">
              ५. कर आकारणी विवरण / TAX ASSESSMENT DETAILS
            </div>
            <div className="space-y-1 text-xs">
              {[
                ["कर आकारणी दिनांक / Assessment Date", data.assessmentDate],
                ["वार्षिक मूल्य (AV) / Annual Value (AV)", formatCurrency(data.annualValue)],
                ["मूल्यनिश्चिती मूल्य (RV) / Rateable Value (RV)", formatCurrency(data.rateableValue)],
                ["मालमत्ता कर दर / Tax Rate", `${data.taxRate} %`],
                ["मालमत्ता कर / Property Tax", formatCurrency(data.propertyTax)],
                ["पाणी कर / Water Tax", formatCurrency(data.waterTax)],
                ["स्वच्छता कर / Sanitation Tax", formatCurrency(data.sanitationTax)],
                ["अनिशामक कर / Fire Tax", formatCurrency(data.fireTax)],
              ].map(([label, value], idx) => (
                <div key={idx} className="grid grid-cols-2 gap-2">
                  <span className="font-semibold">{label} :</span>
                  <span>{value}</span>
                </div>
              ))}
              <div className="grid grid-cols-2 gap-2 font-bold border-t border-gray-400 pt-1 mt-1">
                <span>एकूण कर / Total Tax :</span>
                <span>{formatCurrency(data.totalTax)}</span>
              </div>
            </div>
          </div>

          <div className="p-3">
            <div className="bg-gray-100 -m-3 mb-2 p-2 border-b border-gray-800 text-sm font-bold">
              ६. थकित कर विवरण / OUTSTANDING TAX DETAILS
            </div>
            <table className="w-full text-xs border border-gray-800">
              <thead className="bg-gray-50">
                <tr>
                  <th className="border border-gray-800 p-1">वर्ष / Year</th>
                  <th className="border border-gray-800 p-1">मालमत्ता कर<br />Property Tax</th>
                  <th className="border border-gray-800 p-1">पाणी कर<br />Water Tax</th>
                  <th className="border border-gray-800 p-1">एकूण थकित कर<br />Total Outstanding</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-800 p-1 text-center">{data.taxYear1}</td>
                  <td className="border border-gray-800 p-1 text-center">{formatCurrency(data.taxYear1Property)}</td>
                  <td className="border border-gray-800 p-1 text-center">{formatCurrency(data.taxYear1Water)}</td>
                  <td className="border border-gray-800 p-1 text-center">{formatCurrency(data.taxYear1Total)}</td>
                </tr>
                <tr>
                  <td className="border border-gray-800 p-1 text-center">{data.taxYear2}</td>
                  <td className="border border-gray-800 p-1 text-center">{formatCurrency(data.taxYear2Property)}</td>
                  <td className="border border-gray-800 p-1 text-center">{formatCurrency(data.taxYear2Water)}</td>
                  <td className="border border-gray-800 p-1 text-center">{formatCurrency(data.taxYear2Total)}</td>
                </tr>
                <tr>
                  <td className="border border-gray-800 p-1 text-center">{data.taxYear3}</td>
                  <td className="border border-gray-800 p-1 text-center">{formatCurrency(data.taxYear3Property)}</td>
                  <td className="border border-gray-800 p-1 text-center">{formatCurrency(data.taxYear3Water)}</td>
                  <td className="border border-gray-800 p-1 text-center">{formatCurrency(data.taxYear3Total)}</td>
                </tr>
              </tbody>
            </table>
            <div className="mt-2 text-xs">
              <span className="font-semibold">कर भरणा स्थिती / Tax Payment Status :</span>
              <span className={`ml-2 px-2 py-1 rounded ${data.taxPaymentStatus?.includes("Paid") ? "bg-green-100 text-green-700 border border-green-300" : "bg-red-100 text-red-700 border border-red-300"}`}>
                {data.taxPaymentStatus}
              </span>
            </div>
          </div>
        </div>

        {/* Section 7 & 8: Remarks + Docs */}
        <div className="grid grid-cols-2 gap-0 border-t-2 border-gray-800">
          <div className="border-r border-gray-800 p-3">
            <div className="bg-gray-100 -m-3 mb-2 p-2 border-b border-gray-800 text-sm font-bold">
              7. टिपणी / REMARKS
            </div>
            <div className="text-xs">
              <p>• {data.remarks}</p>
              <p className="mt-1">• All dues are cleared up to 31/03/{new Date().getFullYear()}.</p>
            </div>
          </div>

          <div className="p-3">
            <div className="bg-gray-100 -m-3 mb-2 p-2 border-b border-gray-800 text-sm font-bold">
              8. दस्तऐवज संदर्भ / DOCUMENT REFERENCES
            </div>
            <div className="space-y-1 text-xs">
              {[
                ["७/१२ उतारा क्रमांक / 7/12 Extract No.", data.satbaraRef],
                ["मालमत्ता नोंदणी / Property Registration No.", data.registrationNo],
                ["बांधकाम मान्यता / Building Approval No.", data.buildingApprovalRef],
                ["पूर्णता प्रमाणपत्र / Occupancy Certificate No.", data.occupancyCertNo],
                ["मालमत्ता कर पावती / Property Tax Receipt No.", data.taxReceiptNo],
              ].map(([label, value], idx) => (
                <div key={idx} className="grid grid-cols-2 gap-2">
                  <span className="font-semibold">{label} :</span>
                  <span>{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t-2 border-gray-800 p-4">
          <p className="text-xs italic text-center">
            ही मालमत्ता पत्रिका संगणकीय प्रणालीद्वारे तयार करण्यात आले आहे व यास सहीची आवश्यकता नाही.
          </p>
          <p className="text-xs italic text-center">
            This Property Card is computer generated and does not require any signature.
          </p>

          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="text-xs">
              <p><span className="font-semibold">दिनांक / Date :</span> {currentDate}</p>
              <p><span className="font-semibold">स्थळ / Place :</span> {data.village}</p>
            </div>

            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-full border-2 border-gray-800 flex items-center justify-center">
                <span className="text-xs text-center">Municipal<br />Seal</span>
              </div>
            </div>

            <div className="text-right text-xs">
              <div className="mt-6">
                <p className="font-bold italic">Commissioner Signature</p>
                <p className="font-semibold mt-1">आयुक्त</p>
                <p>Commissioner</p>
                <p>{data.corporationName}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

PropertyCardDocument.displayName = "PropertyCardDocument";
export default PropertyCardDocument;