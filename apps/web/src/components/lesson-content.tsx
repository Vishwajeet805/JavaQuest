import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function LessonContent({ content, language = "JAVA" }: { content: string; language?: "JAVA" | "PYTHON" }) {
  return (
    <div className="lesson-content min-w-0 max-w-3xl text-slate-300">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h3 className="mb-4 mt-6 text-2xl font-bold text-white">
              {children}
            </h3>
          ),
          table: ({ children }) => (
            <div
              className="my-6 max-w-full overflow-x-auto"
              role="region"
              aria-label="Lesson table"
              tabIndex={0}
            >
              <table className="w-full border-collapse text-left text-sm">
                {children}
              </table>
            </div>
          ),
          th: ({ children }) => (
            <th className="border border-slate-700 p-3 text-slate-100">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border border-slate-800 p-3">{children}</td>
          ),
          ol: ({ children }) => (
            <ol className="my-5 list-decimal space-y-2 pl-6">{children}</ol>
          ),
          h2: ({ children }) => (
            <h3 className="mb-4 mt-10 text-2xl font-black text-white">
              {children}
            </h3>
          ),

          h3: ({ children }) => (
            <h4 className="mb-3 mt-8 text-xl font-bold text-white">
              {children}
            </h4>
          ),

          p: ({ children }) => (
            <p className="my-5 text-base leading-8 text-slate-300">
              {children}
            </p>
          ),

          strong: ({ children }) => (
            <strong className="font-bold text-white">{children}</strong>
          ),

          ul: ({ children }) => (
            <ul className="my-5 list-disc space-y-3 pl-6">{children}</ul>
          ),

          li: ({ children }) => (
            <li className="leading-7 text-slate-300">{children}</li>
          ),

          blockquote: ({ children }) => (
            <blockquote className="my-7 rounded-2xl border border-amber-400/30 bg-amber-400/10 px-5 py-1">
              {children}
            </blockquote>
          ),

          code: ({ className, children, ...props }) => {
            const block = className?.includes("language-");

            if (!block) {
              return (
                <code
                  className="rounded bg-slate-950 px-1.5 py-1 font-mono text-sm text-amber-300"
                  {...props}
                >
                  {children}
                </code>
              );
            }

            return (
              <code
                className="font-mono text-sm leading-7 text-slate-100"
                {...props}
              >
                {children}
              </code>
            );
          },

          pre: ({ children }) => (
            <div className="my-7 overflow-hidden rounded-2xl border border-slate-700 bg-[#050914]">
              <div className="border-b border-slate-800 px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-400">
                {language === "PYTHON" ? "Python" : "Java"}
              </div>

              <pre
                tabIndex={0}
                aria-label="Code example"
                className="overflow-x-auto p-5"
              >
                {children}
              </pre>
            </div>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
