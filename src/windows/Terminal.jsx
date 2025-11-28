import WindowControlls from "#components/WindowControls";
import { techStack } from "#constants";
import WindowWrapper from "#hoc/WindowWrapper";
import { Check, Flag } from "lucide-react";

const Terminal = () => {
  return (
    <>
      <div id="window-header">
    <WindowControlls target="terminal"/>
        <h2>Tech Stack</h2>
      </div>

      <div className="tech-stack text-[#1a1a1a]">
        {/* Command */}
        <p className="mb-4">
          <span className="font-bold">@husnain % </span>
          show tech stack
        </p>

        {/* Table Header */}
        <div className="flex items-center mb-2 font-medium text-gray-600 text-sm">
          <p className="w-32">Category</p>
          <p>Technologies</p>
        </div>

        {/* List */}
        <ul className="space-y-3">
          {techStack.map(({ category, items }) => (
            <li key={category} className="flex items-start gap-3 text-sm">
              <Check className="text-green-600 mt-0.5" size={18} />

              <div className="flex gap-6">
                {/* Category */}
                <h3 className="font-semibold text-green-700 w-32">
                  {category}
                </h3>

                {/* Items */}
                <p className="text-gray-800">{items.join(", ")}</p>
              </div>
            </li>
          ))}
        </ul>

        {/* Footer */}
        <div className="mt-5 text-sm">
          <p className="flex items-center gap-2 text-green-700">
            <Check size={18} />
            {techStack.length} of {techStack.length} stacks loaded successfully
            (100%)
          </p>

          <p className="flex items-center gap-1 text-gray-800 mt-1">
            <Flag size={14} color="black" />
            Render time: 6ms
          </p>
        </div>
      </div>
    </>
  );
};

const TerminalWindow = WindowWrapper(Terminal, "terminal");

export default TerminalWindow;
