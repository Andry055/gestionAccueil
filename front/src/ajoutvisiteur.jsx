import React from "react";

export default function AjoutVisiteur() {
  return (
    <>
      <head>
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com/"
          crossOrigin=""
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?display=swap&family=Noto+Sans:wght@400;500;700;900&family=Public+Sans:wght@400;500;700;900"
        />
        <title>Stitch Design</title>
        <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries" />
      </head>

      <div
        className="relative flex min-h-screen flex-col bg-slate-50 overflow-x-hidden group/design-root"
        style={{ fontFamily: '"Public Sans", "Noto Sans", sans-serif' }}
      >
        <div className="layout-container flex h-full grow flex-col">
          <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#e7edf3] px-10 py-3">
            <div className="flex items-center gap-4 text-[#0e141b]">
              <div className="size-4">
                <svg
                  viewBox="0 0 48 48"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4 4H17.3334V17.3334H30.6666V30.6666H44V44H4V4Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <h2 className="text-[#0e141b] text-lg font-bold leading-tight tracking-[-0.015em]">
                Visitor Management
              </h2>
            </div>
            <div className="flex flex-1 justify-end gap-8">
              <div className="flex items-center gap-9">
                <a
                  className="text-[#0e141b] text-sm font-medium leading-normal"
                  href="#"
                >
                  Dashboard
                </a>
                <a
                  className="text-[#0e141b] text-sm font-medium leading-normal"
                  href="#"
                >
                  Visitors
                </a>
                <a
                  className="text-[#0e141b] text-sm font-medium leading-normal"
                  href="#"
                >
                  Reports
                </a>
                <a
                  className="text-[#0e141b] text-sm font-medium leading-normal"
                  href="#"
                >
                  Settings
                </a>
              </div>
              <button className="flex h-10 max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-[#e7edf3] px-2.5 text-sm font-bold leading-normal tracking-[0.015em] text-[#0e141b] gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20px"
                  height="20px"
                  fill="currentColor"
                  viewBox="0 0 256 256"
                >
                  <path d="M221.8,175.94C216.25,166.38,208,139.33,208,104a80,80,0,1,0-160,0c0,35.34-8.26,62.38-13.81,71.94A16,16,0,0,0,48,200H88.81a40,40,0,0,0,78.38,0H208a16,16,0,0,0,13.8-24.06ZM128,216a24,24,0,0,1-22.62-16h45.24A24,24,0,0,1,128,216ZM48,184c7.7-13.24,16-43.92,16-80a64,64,0,1,1,128,0c0,36.05,8.28,66.73,16,80Z" />
                </svg>
              </button>
              <div
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
                style={{
                  backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuDFyJHW9fOHwMWTTI_2A2GJe4IW5StQmaoqxPp7quB8qp8xvxCZ2xVv9GciudfFLN0QrKew3mFWh7AJwgVldYzLFFSWgscIFQPEJQWJidIc-p3zEf3vA8CsscaWRzzE9UH8r7GNoDTehyKEktUPbrQSkhiBM5sLbLlT56_JSi96_iMew1iRZdFxdtldyMbQ83UNUuA5ted53LaJUu2h4HmTMs7Kx6YBwcXDBd1plfeUt_24m0q-dWNB8AvGYvM2m7m4_aSX5Wv3pJc")`,
                }}
              ></div>
            </div>
          </header>

          <div className="px-40 flex flex-1 justify-center py-5">
            <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
              <div className="flex flex-wrap justify-between gap-3 p-4">
                <p className="text-[#0e141b] tracking-light text-[32px] font-bold leading-tight min-w-72">
                  Dashboard
                </p>
              </div>

              <div className="flex flex-wrap gap-4 p-4">
                {[
                  ["Total Visitors Today", "125"],
                  ["Currently Active Visitors", "15"],
                  ["Average Visit Duration", "1 hour 30 minutes"],
                  ["Visits This Week", "750"],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-lg p-6 bg-[#e7edf3]"
                  >
                    <p className="text-[#0e141b] text-base font-medium leading-normal">
                      {label}
                    </p>
                    <p className="text-[#0e141b] tracking-light text-2xl font-bold leading-tight">
                      {value}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-4 px-4 py-6">
                <div className="flex min-w-72 flex-1 flex-col gap-2 rounded-lg border border-[#d0dbe7] p-6">
                  <p className="text-[#0e141b] text-base font-medium leading-normal">
                    Visits Over the Past Week
                  </p>
                  <div className="grid min-h-[180px] grid-flow-col gap-6 grid-rows-[1fr_auto] items-end justify-items-center px-3">
                    {[
                      ["Mon", "20%"],
                      ["Tue", "20%"],
                      ["Wed", "70%"],
                      ["Thu", "60%"],
                      ["Fri", "60%"],
                      ["Sat", "10%"],
                      ["Sun", "50%"],
                    ].map(([day, height]) => (
                      <React.Fragment key={day}>
                        <div
                          className="border-[#4e7397] bg-[#e7edf3] border-t-2 w-full"
                          style={{ height }}
                        ></div>
                        <p className="text-[#4e7397] text-[13px] font-bold leading-normal tracking-[0.015em]">
                          {day}
                        </p>
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
