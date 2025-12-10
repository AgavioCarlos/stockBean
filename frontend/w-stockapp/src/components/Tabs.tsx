import React from "react";

export interface TabItem {
  key: string;
  label: string;
  icon?: React.ReactNode;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (key: string) => void;
  extraContent?: React.ReactNode;
}

const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  extraContent,
}) => {
  const activeContent = tabs.find((tab) => tab.key === activeTab)?.content;

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex items-end justify-between">
        {/* Tab Buttons Group */}
        <div className="flex space-x-1">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <div
                key={tab.key}
                onClick={() => onChange(tab.key)}
                className={`flex items-center gap-2 px-10 py-2 font-semibold text-sm rounded-t-xl cursor-pointer transition-all duration-200 border-t border-x
                  ${isActive
                    ? "bg-white text-blue-600 border-gray-200 border-b-white translate-y-[1px]"
                    : "bg-gray-50 text-gray-500 border-transparent hover:bg-gray-100"
                  }`}
                style={{
                  marginBottom: isActive ? -1 : 0,
                  zIndex: isActive ? 10 : 0,
                }}
              >
                {tab.icon}
                {tab.label}
              </div>
            );
          })}
        </div>

        {/* Extra Content (e.g., Add Button) */}
        <div className="mb-1">{extraContent}</div>
      </div>

      {/* Content Container (The "Div" / "Sheet") */}
      {/* Content Container (The "Div" / "Sheet") */}
      <div className="bg-white rounded-xl rounded-tl-none shadow-sm p-6 overflow-auto border border-gray-200">
        {activeContent}
      </div>
    </div>
  );
};

export default Tabs;
