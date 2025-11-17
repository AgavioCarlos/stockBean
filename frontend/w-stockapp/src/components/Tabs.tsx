import React from "react";

interface TabItem {
  key: string;
  label: string;
}

interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (key: string) => void;
}

const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onChange }) => {
  return (
    <div className="flex bg-gray-100 rounded-xl p-1 w-fit ml-10">
      {tabs.map((tab) => (
        <div
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={`px-4 py-2 font-semibold text-sm rounded-lg cursor-pointer transition-all duration-200
            ${
              activeTab === tab.key
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
        >
          {tab.label}
        </div>
      ))}
    </div>
  );
};

export default Tabs;
