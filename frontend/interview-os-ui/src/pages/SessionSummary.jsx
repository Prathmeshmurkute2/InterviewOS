import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import { sessionApi } from '../api/client';

export default function SessionSummary() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    sessionApi.get(`/sessions/${sessionId}/detail`)
      .then((res) => setDetail(res.data))
      .catch((err) => setError(err.response?.data || 'Could not load session summary.'))
      .finally(() => setLoading(false));
  }, [sessionId]);

  const downloadPdf = () => {
    if (!detail) return;

    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 48;
    const maxWidth = pageWidth - margin * 2;
    let y = margin;

    const ensureSpace = (needed) => {
      if (y + needed > pageHeight - margin) {
        doc.addPage();
        y = margin;
      }
    };

    // Header
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text('InterviewOS — Session Transcript', margin, y);
    y += 26;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    const roleLine = `${detail.jdTitle}${detail.company ? ' — ' + detail.company : ''}`;
    doc.text(roleLine, margin, y);
    y += 16;

    if (detail.overallScore !== null && detail.overallScore !== undefined) {
      doc.text(`Overall score: ${detail.overallScore.toFixed(1)} / 10`, margin, y);
      y += 16;
    }
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, margin, y);
    y += 24;

    doc.setDrawColor(200);
    doc.line(margin, y, pageWidth - margin, y);
    y += 24;

    // Questions
    detail.questions.forEach((q, i) => {
      ensureSpace(60);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      const qLines = doc.splitTextToSize(`Q${i + 1}. ${q.questionText}`, maxWidth);
      ensureSpace(qLines.length * 14 + 10);
      doc.text(qLines, margin, y);
      y += qLines.length * 14 + 8;

      if (q.userAnswer) {
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(10);
        const aLines = doc.splitTextToSize(`Answer: ${q.userAnswer}`, maxWidth);
        ensureSpace(aLines.length * 12 + 8);
        doc.text(aLines, margin, y);
        y += aLines.length * 12 + 8;
      }

      if (q.evaluatorScore !== null && q.evaluatorScore !== undefined) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        ensureSpace(14);
        doc.text(`Score: ${q.evaluatorScore} / 10`, margin, y);
        y += 14;
      }

      if (q.evaluatorFeedback) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        const fLines = doc.splitTextToSize(`Feedback: ${q.evaluatorFeedback}`, maxWidth);
        ensureSpace(fLines.length * 12 + 8);
        doc.text(fLines, margin, y);
        y += fLines.length * 12 + 8;
      }

      y += 12;
      ensureSpace(1);
      doc.setDrawColor(230);
      doc.line(margin, y, pageWidth - margin, y);
      y += 20;
    });

    const filename = `interviewos-${detail.jdTitle.replace(/\s+/g, '-').toLowerCase()}-${sessionId.slice(0, 8)}.pdf`;
    doc.save(filename);
  };

  if (loading) return <div className="min-h-screen bg-ink text-paper-text p-8">Loading…</div>;
  if (error) return <div className="min-h-screen bg-ink text-clay p-8">{String(error)}</div>;

  return (
    <div className="min-h-screen bg-ink px-6 py-12">
      <div className="max-w-xl mx-auto">
        <p className="font-sans text-xs text-lamp tracking-wide mb-2">Session complete</p>
        <h1 className="font-serif text-2xl text-paper-text mb-1">
          {detail.jdTitle}{detail.company ? ` — ${detail.company}` : ''}
        </h1>
        {detail.overallScore !== null && (
          <p className="text-paper-text/60 text-sm mb-6">
            Overall score: <span className="text-lamp font-medium">{detail.overallScore.toFixed(1)} / 10</span>
          </p>
        )}

        <div className="flex gap-3 mb-8">
          <button
            onClick={downloadPdf}
            className="bg-ink text-paper-text border border-paper-text/30 rounded-sm px-5 py-2.5 text-sm font-medium hover:bg-lamp hover:text-ink hover:border-lamp transition-colors"
          >
            Download PDF
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="text-paper-text/50 hover:text-paper-text/80 text-sm px-2 transition-colors"
          >
            Back to dashboard
          </button>
        </div>

        <div className="space-y-4">
          {detail.questions.map((q, i) => (
            <div key={q.id} className="bg-paper rounded-sm p-6 shadow-[0_1px_0_rgba(0,0,0,0.15)]">
              <p className="text-xs text-ink-text/40 mb-2">Question {i + 1}</p>
              <p className="font-serif text-ink-text mb-3">{q.questionText}</p>
              {q.userAnswer && (
                <p className="text-sm text-ink-text/70 italic mb-3">{q.userAnswer}</p>
              )}
              {q.evaluatorScore !== null && q.evaluatorScore !== undefined && (
                <div className="flex items-baseline gap-2 mb-2 border-t border-ink-text/10 pt-3">
                  <span className="font-serif text-2xl text-ink-text">{q.evaluatorScore}</span>
                  <span className="text-ink-text/40 text-xs">/ 10</span>
                </div>
              )}
              {q.evaluatorFeedback && (
                <p className="text-sm text-ink-text/70">{q.evaluatorFeedback}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
