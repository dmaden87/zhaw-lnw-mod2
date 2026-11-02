'use client';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { slug } from '../lib/slug';

const text = (children) => (Array.isArray(children) ? children.map(text).join('') : typeof children === 'object' && children ? text(children.props?.children) : String(children ?? ''));
const H = (Tag) => function Heading({ children }) { return <Tag id={slug(text(children))}>{children}</Tag>; };

export default function DocView({ markdown }) {
  return (
    <div className="doc prose">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={{ h1: H('h2'), h2: H('h3'), h3: H('h4'), table: ({ children }) => <div className="tw"><table>{children}</table></div> }}>
        {markdown}
      </ReactMarkdown>
    </div>
  );
}
