import Shell from '../../components/Shell';
import KnowledgeBase from '../../components/KnowledgeBase';
const docs = [
  { id: 'PAY-02', title: 'PAY-02 Instant Payment in CHF (SIC5)', category: 'Prozess', owner: 'Payment Operations (PayOps)', version: '1.0 / 30.10.2026', active: true, source: 'repo', path: 'x', chunks: 11 },
  { id: 'IF-02', title: 'IF-02 Schnittstelle camt.054', category: 'Schnittstelle', owner: 'Beat Zimmermann', version: '1.0 / 30.10.2026', active: false, source: 'repo', path: 'x', chunks: 7 },
  { id: 'PAY-11', title: 'PAY-11 SEPA Instant', category: 'Prozess', owner: 'PayOps', version: '1.0 / 02.11.2026', active: true, source: 'upload', path: 'Upload: a.docx', chunks: 5 },
];
export default function T() { return <Shell><h1 className="page-title">Wissensbasis</h1><KnowledgeBase initialDocs={docs} /></Shell>; }
