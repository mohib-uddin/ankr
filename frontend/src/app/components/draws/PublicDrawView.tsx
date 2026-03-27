import { useState, useEffect } from "react";
import { useParams } from "react-router";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import svgPaths from "../../../imports/svg-f8fnncugof";
import imgProperty from "@/assets/e9d78759a04046f1991fda88e44b64c28f7e866d.png";
import type { AppState } from "../../context/AppContext";

const STORAGE_KEY = "ankr_v2_state";

/* ═══════════════════════════════════════════════════════════════════ */
/*  Helper Functions                                                 */
/* ═══════════════════════════════════════════════════════════════════ */

export function getShareUrl(
  propertyId: string,
  drawId: string,
): string {
  // Generate a shareable URL for the draw
  // In production, this would be a secure token
  const token = btoa(`${propertyId}:${drawId}`); // Simple base64 encoding for demo
  return `${window.location.origin}/share/draw/${token}`;
}

/* ═══════════════════════════════════════════════════════════════════ */
/*  Main Component                                                   */
/* ═══════════════════════════════════════════════════════════════════ */

export function PublicDrawView() {
  const { token } = useParams<{ token: string }>();
  const [state, setState] = useState<AppState | null>(null);
  const [property, setProperty] = useState<any>(null);
  const [draw, setDraw] = useState<any>(null);

  useEffect(() => {
    // Load state from localStorage
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsedState = JSON.parse(stored) as AppState;
      setState(parsedState);

      // Find property and draw
      // In a real app, you'd decode the token to get property/draw IDs
      // For now, use the first property and first draw as a demo
      const prop = parsedState.properties[0];
      const drw = prop?.draws?.[0];

      if (prop && drw) {
        setProperty(prop);
        setDraw(drw);
      }
    }
  }, [token]);

  if (!property || !draw) {
    return (
      <div className="min-h-screen bg-[#F8F6F1] flex items-center justify-center">
        <p className="text-[#8C8780] text-[16px]">
          Loading draw information...
        </p>
      </div>
    );
  }

  // Calculate totals
  const lineItems = draw.lineItems || [];
  const totalAmount = lineItems.reduce(
    (sum: number, item: any) => sum + (item.amount || 0),
    0,
  );

  // Budget tracker data
  const budgetData = [
    { name: "Site Work", value: 430000, color: "#764D2F" },
    { name: "Financing", value: 800000, color: "#A67B5B" },
    { name: "Land", value: 865000, color: "#C7AF97" },
    { name: "Site Work", value: 261000, color: "#D9C4B0" },
    { name: "Soft Costs", value: 340000, color: "#E5D7C8" },
    {
      name: "Building Hard Costs",
      value: 8470000,
      color: "#EFE6DB",
    },
    { name: "Soft Costs", value: 2026000, color: "#F5EEE7" },
    { name: "Contingency", value: 75000, color: "#F9F5F0" },
  ];
  const totalBudget = budgetData.reduce(
    (sum, item) => sum + item.value,
    0,
  );

  return (
    <div className="min-h-screen bg-[#F8F6F1]">
      {/* Dark Brown Header */}
      <div className="bg-[#3e2d1d] content-stretch flex flex-col items-start pb-[80px] pt-[40px] px-4 sm:px-8 md:px-12 lg:px-[80px] w-full">
        <div className="content-stretch flex flex-col gap-[60px] items-center relative shrink-0 w-full max-w-[1352px] mx-auto">
          {/* Top Bar: Logo + Buttons */}
          <div className="content-stretch flex flex-col sm:flex-row items-start sm:items-center justify-between relative shrink-0 w-full gap-4">
            <p className="font-['Cormorant_Garamond',sans-serif] leading-[32.146px] not-italic relative shrink-0 text-[32.78px] text-center text-white tracking-[1.3112px] whitespace-nowrap">
              ANKR
            </p>
            <div className="content-stretch flex gap-[16px] items-center relative shrink-0">
              {/* Print Button */}
              <button
                className="content-stretch flex gap-[10px] h-[50px] items-center justify-center px-[28px] py-[10px] relative rounded-[8px] shrink-0 cursor-pointer hover:bg-[rgba(255,255,255,0.1)] transition-colors"
                onClick={() => window.print()}
              >
                <div
                  aria-hidden="true"
                  className="absolute border-[1.5px] border-solid border-white inset-0 pointer-events-none rounded-[8px]"
                />
                <div className="relative shrink-0 size-[24px]">
                  <svg
                    className="absolute block size-full"
                    fill="none"
                    preserveAspectRatio="none"
                    viewBox="0 0 24 24"
                  >
                    <path d={svgPaths.p3534d100} fill="white" />
                  </svg>
                </div>
                <p
                  className="font-['SF_Pro',sans-serif] font-[590] leading-[normal] relative shrink-0 text-[16px] text-white whitespace-nowrap hidden sm:block"
                  style={{
                    fontVariationSettings: "'wdth' 100",
                  }}
                >
                  Print
                </p>
              </button>
              {/* Read Only Badge */}
              <div className="bg-[rgba(255,239,223,0.4)] content-stretch flex gap-[10px] items-center justify-center px-[16px] py-[4px] relative rounded-[100px] shrink-0">
                <div className="overflow-clip relative shrink-0 size-[24px]">
                  <div className="absolute inset-[20.83%_8.33%]">
                    <div className="absolute inset-[-5.36%_-3.75%]">
                      <svg
                        className="block size-full"
                        fill="none"
                        preserveAspectRatio="none"
                        viewBox="0 0 21.5 15.5"
                      >
                        <path
                          d={svgPaths.p1de46000}
                          stroke="white"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                        />
                        <path
                          d={svgPaths.p32ffcf80}
                          stroke="white"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
                <p
                  className="font-['SF_Pro',sans-serif] font-[510] leading-[normal] relative shrink-0 text-[16px] text-white whitespace-nowrap hidden sm:block"
                  style={{
                    fontVariationSettings: "'wdth' 100",
                  }}
                >
                  Read Only
                </p>
              </div>
            </div>
          </div>

          {/* Property Info Section */}
          <div className="content-stretch flex flex-col lg:flex-row gap-[32px] items-start relative shrink-0 w-full">
            {/* Property Image */}
            <div className="h-[261.416px] relative shrink-0 w-full lg:w-[364.015px]">
              <div className="absolute h-[261.416px] left-0 rounded-[14.055px] top-0 w-full lg:w-[364.015px]">
                <div
                  aria-hidden="true"
                  className="absolute inset-0 pointer-events-none rounded-[14.055px]"
                >
                  <img
                    alt=""
                    className="absolute max-w-none object-cover rounded-[14.055px] size-full"
                    src={property.coverImage || imgProperty}
                  />
                  <div className="absolute bg-gradient-to-b from-1/2 from-[rgba(0,0,0,0)] inset-0 rounded-[14.055px] to-[83.871%] to-black" />
                </div>
              </div>
              <p className="absolute font-['Canela_Text_Trial',sans-serif] font-medium leading-[normal] left-[16.86px] not-italic text-[25.298px] text-white top-[188.33px] whitespace-nowrap">
                {property.name}
              </p>
            </div>

            {/* Middle: Draw Info */}
            <div className="flex-1 w-full min-w-0">
              <div className="content-stretch flex gap-[32px] items-start pl-0 lg:pl-[16px] pr-0 lg:pr-[32px] relative w-full">
                <div className="content-stretch flex flex-col gap-[32px] items-start relative shrink-0 w-full lg:w-[477px]">
                  {/* Draw # Badge */}
                  <div className="bg-[rgba(255,239,223,0.1)] content-stretch flex items-center justify-center px-[16px] py-[8px] relative rounded-[100px] shrink-0">
                    <div
                      aria-hidden="true"
                      className="absolute border border-[#ffbf7e] border-solid inset-0 pointer-events-none rounded-[100px]"
                    />
                    <p
                      className="font-['SF_Pro',sans-serif] font-[510] leading-[normal] relative shrink-0 text-[#ffbf7e] text-[14px] whitespace-nowrap"
                      style={{
                        fontVariationSettings: "'wdth' 100",
                      }}
                    >
                      {draw.title}
                    </p>
                  </div>

                  {/* Title + Address */}
                  <div className="content-stretch flex flex-col gap-[9px] items-start relative shrink-0 w-full">
                    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
                      <p className="font-['Canela_Text_Trial',sans-serif] font-medium leading-[50px] not-italic relative shrink-0 text-[36px] sm:text-[48px] text-white w-full">
                        {draw.category || "Draw Request"}
                      </p>
                      <div className="content-stretch flex gap-[6px] items-center relative shrink-0">
                        <div className="overflow-clip relative shrink-0 size-[20px]">
                          <div className="absolute inset-[8.33%_12.5%_9.64%_12.5%]">
                            <svg
                              className="absolute block size-full"
                              fill="none"
                              preserveAspectRatio="none"
                              viewBox="0 0 15 16.4049"
                            >
                              <path
                                clipRule="evenodd"
                                d={svgPaths.p36ed300}
                                fill="#FFB680"
                                fillRule="evenodd"
                              />
                              <path
                                clipRule="evenodd"
                                d={svgPaths.p12b38500}
                                fill="#FFB680"
                                fillRule="evenodd"
                              />
                            </svg>
                          </div>
                        </div>
                        <p
                          className="font-['SF_Pro',sans-serif] font-[510] leading-[normal] relative shrink-0 text-[#ffb680] text-[16px]"
                          style={{
                            fontVariationSettings: "'wdth' 100",
                          }}
                        >
                          {property.address}, {property.city},{" "}
                          {property.state}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Stepper */}
                  <div className="content-stretch flex items-start justify-center relative shrink-0 w-full overflow-x-auto">
                    <DrawStepper
                      status={draw.status}
                      requestDate={draw.requestDate}
                    />
                  </div>
                </div>

                {/* Right: Total Amount */}
                <div className="content-stretch hidden xl:flex flex-col items-end justify-center min-h-[186px] relative text-center whitespace-nowrap ml-auto">
                  <p
                    className="font-['SF_Pro',sans-serif] font-[510] leading-[normal] relative shrink-0 text-[#ffb680] text-[16px]"
                    style={{
                      fontVariationSettings: "'wdth' 100",
                    }}
                  >
                    Total Draw Amount
                  </p>
                  <p
                    className="font-['SF_Pro',sans-serif] font-bold leading-[61px] relative shrink-0 text-[48px] text-white"
                    style={{
                      fontVariationSettings: "'wdth' 100",
                    }}
                  >
                    $
                    {Math.round(
                      totalAmount / 1000,
                    ).toLocaleString()}
                    K
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Total Amount - Mobile */}
          <div className="xl:hidden content-stretch flex flex-col items-center justify-center relative text-center whitespace-nowrap w-full">
            <p
              className="font-['SF_Pro',sans-serif] font-[510] leading-[normal] relative shrink-0 text-[#ffb680] text-[16px]"
              style={{ fontVariationSettings: "'wdth' 100" }}
            >
              Total Draw Amount
            </p>
            <p
              className="font-['SF_Pro',sans-serif] font-bold leading-[61px] relative shrink-0 text-[48px] text-white"
              style={{ fontVariationSettings: "'wdth' 100" }}
            >
              ${Math.round(totalAmount / 1000).toLocaleString()}
              K
            </p>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="content-stretch flex flex-col items-center px-4 sm:px-8 md:px-12 lg:px-[80px] py-[40px] relative w-full">
        <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-full max-w-[1352px]">
          {/* Info Cards Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-[16px] w-full">
            <InfoCard
              icon="wallet"
              label="Request Date"
              value={new Date(
                draw.requestDate,
              ).toLocaleDateString()}
            />
            <InfoCard
              icon="bank"
              label="Lender"
              value={property.proforma?.lenderName || "N/A"}
            />
            <InfoCard
              icon="layers"
              label="Categories"
              value={`${lineItems.length} categories`}
            />
            <InfoCard
              icon="percent"
              label="Status"
              value={draw.status}
            />
          </div>

          {/* Draw Line Items */}
          <DrawLineItemsCard lineItems={lineItems} />

          {/* Standard Draw Package */}
          <StandardDrawPackageCard
            packageType={draw.documentPackage}
          />

          {/* Budget Tracker */}
          <BudgetTrackerCard
            data={budgetData}
            totalBudget={totalBudget}
          />

          {/* Notes */}
          {draw.notes && <NotesCard notes={draw.notes} />}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════ */
/*  Draw Stepper Component                                           */
/* ═══════════════════════════════════════════════════════════════════ */

function DrawStepper({
  status,
  requestDate,
}: {
  status: string;
  requestDate: string;
}) {
  const steps = [
    { label: "Created", completed: true, date: requestDate },
    {
      label: "Submitted",
      completed: ["Submitted", "Approved", "Funded"].includes(
        status,
      ),
      date: requestDate,
    },
    {
      label: "Approved",
      completed: ["Approved", "Funded"].includes(status),
      date: requestDate,
    },
    {
      label: "Funded",
      completed: status === "Funded",
      date: requestDate,
    },
  ];

  return (
    <div className="content-stretch flex items-start justify-center relative shrink-0">
      {steps.map((step, idx) => (
        <div
          key={idx}
          className="content-stretch flex items-start relative shrink-0"
        >
          {/* Step */}
          <div className="content-stretch flex flex-col gap-[7.31px] items-center relative shrink-0">
            <div className="relative shrink-0 size-[40.204px]">
              <svg
                className="absolute block size-full"
                fill="none"
                preserveAspectRatio="none"
                viewBox="0 0 40.2048 40.2045"
              >
                <circle
                  cx="20.1027"
                  cy="20.1022"
                  r="19.1884"
                  stroke="white"
                  strokeWidth="1.82747"
                />
                {step.completed && (
                  <path
                    d="M13.3505 20.5444L17.548 24.7419L25.9429 15.7473"
                    stroke="white"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.97024"
                  />
                )}
              </svg>
            </div>
            <div className="content-stretch flex flex-col font-['Montserrat',sans-serif] font-medium gap-[5.318px] items-center leading-[normal] relative shrink-0 text-center">
              <p className="relative shrink-0 text-[14px] sm:text-[16px] text-white whitespace-nowrap">
                {step.label}
              </p>
              <p className="relative shrink-0 text-[#ffb680] text-[12px] sm:text-[14px] whitespace-nowrap">
                {step.date}
              </p>
            </div>
          </div>
          {/* Trail */}
          {idx < steps.length - 1 && (
            <div className="content-stretch flex flex-col items-start pb-[13.706px] pt-[18.275px] relative shrink-0 w-[40px] sm:w-[61.525px]">
              <div className="bg-[#d3b597] h-[1.827px] shrink-0 w-full" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════ */
/*  Info Card Component                                              */
/* ═══════════════════════════════════════════════════════════════════ */

function InfoCard({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  const getIcon = () => {
    switch (icon) {
      case "wallet":
        return (
          <svg
            className="absolute block size-full"
            fill="none"
            preserveAspectRatio="none"
            viewBox="0 0 17.5 15.75"
          >
            <path d={svgPaths.pc6b3970} fill="#764D2F" />
            <path d={svgPaths.p4011680} fill="#764D2F" />
            <path
              clipRule="evenodd"
              d={svgPaths.p112cca80}
              fill="#764D2F"
              fillRule="evenodd"
            />
            <path d={svgPaths.p2a67df0} fill="#764D2F" />
          </svg>
        );
      case "bank":
      case "layers":
        return (
          <svg
            className="absolute block size-full"
            fill="none"
            preserveAspectRatio="none"
            viewBox="0 0 14.8994 14.8984"
          >
            <path
              clipRule="evenodd"
              d={svgPaths.p74d3600}
              fill="#764D2F"
              fillRule="evenodd"
            />
            <path d={svgPaths.p292c4700} fill="#764D2F" />
            <path d={svgPaths.p72e8a00} fill="#764D2F" />
          </svg>
        );
      case "percent":
        return (
          <svg
            className="absolute block size-full"
            fill="none"
            preserveAspectRatio="none"
            viewBox="0 0 6.5625 14.9501"
          >
            <path d={svgPaths.p385cc600} fill="#764D2F" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white relative rounded-[16px] self-stretch">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-center px-[28px] py-[20px] relative size-full">
          <div className="content-stretch flex flex-col gap-[16px] items-start justify-center relative w-full">
            <div className="bg-[#fcf6f0] content-stretch flex items-center p-[8.5px] relative rounded-[6px] shrink-0">
              <div className="overflow-clip relative shrink-0 size-[21px]">
                <div className="absolute inset-[8.33%_8.33%_16.67%_8.33%]">
                  {getIcon()}
                </div>
              </div>
            </div>
            <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
              <p
                className="font-['SF_Pro',sans-serif] font-[510] leading-[normal] relative shrink-0 text-[#764d2f] text-[14px] w-full"
                style={{ fontVariationSettings: "'wdth' 100" }}
              >
                {label}
              </p>
              <div className="content-stretch flex items-center relative shrink-0 w-full">
                <p
                  className="font-['SF_Pro','Noto_Sans:Bold',sans-serif] font-bold leading-[normal] relative shrink-0 text-[#3e2d1d] text-[20px] truncate"
                  style={{
                    fontVariationSettings: "'wdth' 100",
                  }}
                >
                  {value}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        aria-hidden="true"
        className="absolute border border-[#d0d0d0] border-solid inset-0 pointer-events-none rounded-[16px] shadow-[0px_10px_40px_0px_rgba(243,219,188,0.45)]"
      />
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════ */
/*  Draw Line Items Card                                             */
/* ═══════════════════════════════════════════════════════════════════ */

function DrawLineItemsCard({
  lineItems,
}: {
  lineItems: any[];
}) {
  return (
    <div className="bg-white relative rounded-[20px] w-full">
      <div
        aria-hidden="true"
        className="absolute border border-[#d0d0d0] border-solid inset-0 pointer-events-none rounded-[20px] shadow-[0px_10px_40px_0px_rgba(243,219,188,0.45)]"
      />
      <div className="content-stretch flex flex-col gap-[24px] items-start p-[24px] sm:p-[32px] relative w-full">
        <p className="font-['Canela_Text_Trial',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[#3e2d1d] text-[24px] sm:text-[28px] whitespace-nowrap">
          Draw Line Items
        </p>

        {/* Table */}
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b border-[#E8E4DD]">
                <th
                  className="font-['SF_Pro',sans-serif] font-[510] text-[#8C8780] text-[12px] text-left pb-[16px] pr-[16px]"
                  style={{
                    fontVariationSettings: "'wdth' 100",
                  }}
                >
                  CATEGORY
                </th>
                <th
                  className="font-['SF_Pro',sans-serif] font-[510] text-[#8C8780] text-[12px] text-right pb-[16px]"
                  style={{
                    fontVariationSettings: "'wdth' 100",
                  }}
                >
                  AMOUNT
                </th>
              </tr>
            </thead>
            <tbody>
              {lineItems.map((item, idx) => (
                <tr
                  key={idx}
                  className="border-b border-[#F8F6F1] last:border-0"
                >
                  <td className="py-[20px] pr-[16px]">
                    <p
                      className="font-['SF_Pro',sans-serif] font-bold text-[#3E2D1D] text-[16px]"
                      style={{
                        fontVariationSettings: "'wdth' 100",
                      }}
                    >
                      {item.category}
                    </p>
                  </td>
                  <td className="py-[20px] text-right">
                    <p
                      className="font-['SF_Pro',sans-serif] font-bold text-[#3E2D1D] text-[16px]"
                      style={{
                        fontVariationSettings: "'wdth' 100",
                      }}
                    >
                      ${item.amount.toLocaleString()}
                    </p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════ */
/*  Standard Draw Package Card                                       */
/* ═══════════════════════════════════════════════════════════════════ */

function StandardDrawPackageCard({
  packageType,
}: {
  packageType?: string;
}) {
  return (
    <div className="bg-white relative rounded-[20px] w-full">
      <div
        aria-hidden="true"
        className="absolute border border-[#d0d0d0] border-solid inset-0 pointer-events-none rounded-[20px] shadow-[0px_10px_40px_0px_rgba(243,219,188,0.45)]"
      />
      <div className="content-stretch flex flex-col gap-[16px] items-start p-[24px] sm:p-[32px] relative w-full">
        <div className="content-stretch flex items-center gap-[12px] relative shrink-0">
          <div className="bg-[#fcf6f0] content-stretch flex items-center p-[8.5px] relative rounded-[6px] shrink-0">
            <div className="relative shrink-0 size-[21px]">
              <svg
                className="absolute block size-full"
                fill="none"
                preserveAspectRatio="none"
                viewBox="0 0 17.5 16.9297"
              >
                <path d={svgPaths.p270d0200} fill="#764D2F" />
              </svg>
            </div>
          </div>
          <p className="font-['Canela_Text_Trial',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[#3e2d1d] text-[18px] sm:text-[20px] whitespace-nowrap">
            {packageType || "Standard Draw Package"}
          </p>
        </div>
        <p
          className="font-['SF_Pro',sans-serif] leading-[21px] relative shrink-0 text-[#8C8780] text-[14px]"
          style={{ fontVariationSettings: "'wdth' 100" }}
        >
          Most common package for residential or multi-family
          projects
        </p>
        <div className="flex flex-wrap gap-[12px]">
          <div className="bg-[#fcf6f0] content-stretch flex items-center justify-center px-[16px] py-[8px] relative rounded-[100px] shrink-0">
            <p
              className="font-['SF_Pro',sans-serif] font-[510] leading-[normal] relative shrink-0 text-[#764d2f] text-[14px] whitespace-nowrap"
              style={{ fontVariationSettings: "'wdth' 100" }}
            >
              AIA G702 Cover Sheet
            </p>
          </div>
          <div className="bg-[#fcf6f0] content-stretch flex items-center justify-center px-[16px] py-[8px] relative rounded-[100px] shrink-0">
            <p
              className="font-['SF_Pro',sans-serif] font-[510] leading-[normal] relative shrink-0 text-[#764d2f] text-[14px] whitespace-nowrap"
              style={{ fontVariationSettings: "'wdth' 100" }}
            >
              Schedule of Values
            </p>
          </div>
          <div className="bg-[#FFB680] content-stretch flex items-center justify-center px-[16px] py-[8px] relative rounded-[100px] shrink-0">
            <p
              className="font-['SF_Pro',sans-serif] font-[510] leading-[normal] relative shrink-0 text-white text-[14px] whitespace-nowrap"
              style={{ fontVariationSettings: "'wdth' 100" }}
            >
              Contractor invoices
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════ */
/*  Budget Tracker Card                                              */
/* ═══════════════════════════════════════════════════════════════════ */

function BudgetTrackerCard({
  data,
  totalBudget,
}: {
  data: any[];
  totalBudget: number;
}) {
  return (
    <div className="bg-white relative rounded-[20px] w-full">
      <div
        aria-hidden="true"
        className="absolute border border-[#d0d0d0] border-solid inset-0 pointer-events-none rounded-[20px] shadow-[0px_10px_40px_0px_rgba(243,219,188,0.45)]"
      />
      <div className="content-stretch flex flex-col gap-[32px] items-start p-[24px] sm:p-[32px] relative w-full">
        <p className="font-['Canela_Text_Trial',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[#3e2d1d] text-[24px] sm:text-[28px] whitespace-nowrap">
          Budget Tracker
        </p>

        <div className="flex flex-col lg:flex-row gap-[32px] w-full items-center lg:items-start">
          {/* Donut Chart */}
          <div className="relative shrink-0 w-full max-w-[280px] lg:w-[280px] h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={90}
                  outerRadius={130}
                  paddingAngle={0}
                  dataKey="value"
                  stroke="none"
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            {/* Center text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <p
                className="font-['SF_Pro',sans-serif] font-[510] text-[#8C8780] text-[14px]"
                style={{ fontVariationSettings: "'wdth' 100" }}
              >
                Total Budget
              </p>
              <p
                className="font-['SF_Pro',sans-serif] font-bold text-[#3E2D1D] text-[32px]"
                style={{ fontVariationSettings: "'wdth' 100" }}
              >
                ${(totalBudget / 1000000).toFixed(1)}M
              </p>
            </div>
          </div>

          {/* Legend */}
          <div className="flex-1 w-full min-w-0">
            <div className="flex flex-col gap-[16px] w-full">
              {data.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-[12px] w-full"
                >
                  <div
                    className="w-[12px] h-[12px] rounded-full shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <div className="flex items-center justify-between flex-1 min-w-0">
                    <p
                      className="font-['SF_Pro',sans-serif] font-bold text-[#3E2D1D] text-[14px] truncate"
                      style={{
                        fontVariationSettings: "'wdth' 100",
                      }}
                    >
                      {item.name}
                    </p>
                    <p
                      className="font-['SF_Pro',sans-serif] font-bold text-[#3E2D1D] text-[14px] ml-2 shrink-0"
                      style={{
                        fontVariationSettings: "'wdth' 100",
                      }}
                    >
                      ${item.value.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════ */
/*  Notes Card                                                       */
/* ═══════════════════════════════════════════════════════════════════ */

function NotesCard({ notes }: { notes: string }) {
  return (
    <div className="bg-white relative rounded-[20px] w-full">
      <div
        aria-hidden="true"
        className="absolute border border-[#d0d0d0] border-solid inset-0 pointer-events-none rounded-[20px] shadow-[0px_10px_40px_0px_rgba(243,219,188,0.45)]"
      />
      <div className="content-stretch flex flex-col gap-[16px] items-start p-[24px] sm:p-[32px] relative w-full">
        <p className="font-['Canela_Text_Trial',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[#3e2d1d] text-[24px] sm:text-[28px] whitespace-nowrap">
          Notes
        </p>
        <p
          className="font-['SF_Pro',sans-serif] leading-[21px] relative text-[#3E2D1D] text-[14px]"
          style={{ fontVariationSettings: "'wdth' 100" }}
        >
          {notes}
        </p>
      </div>
    </div>
  );
}