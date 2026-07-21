import Markdown from "react-markdown";

// @tailwindcss/typography (prose) суулгаагүй тул markdown-ий загварыг өөрсдөө өгнө.
const MarkdownBody = ({ children }: { children: string }) => {
  return (
    <div className="space-y-2 [&_h1]:text-lg [&_h1]:font-bold [&_h2]:mt-4 [&_h2]:font-semibold [&_li]:mt-1 [&_strong]:font-semibold [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5">
      <Markdown>{children}</Markdown>
    </div>
  );
};

export default MarkdownBody;
