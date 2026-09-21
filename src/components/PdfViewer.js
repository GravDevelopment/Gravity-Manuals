import { useCallback, useEffect, useRef, useState } from 'react';

// pdf.js is ESM-only and Create React App's webpack can't minify it, so it is
// copied out of node_modules into public/pdfjs/ (see the copy-pdf-worker
// script) and loaded straight from our own origin at runtime. webpackIgnore
// keeps the bundler out of it. Loaded once, on the first manual opened.
let pdfjsPromise = null;

function loadPdfjs() {
  if (!pdfjsPromise) {
    const base = `${process.env.PUBLIC_URL}/pdfjs`;
    pdfjsPromise = import(/* webpackIgnore: true */ `${base}/pdf.min.js`).then((lib) => {
      lib.GlobalWorkerOptions.workerSrc = `${base}/pdf.worker.min.js`;
      return lib;
    });
  }
  return pdfjsPromise;
}

/**
 * Draws the manual to a canvas, one page at a time.
 *
 * The point is that the browser's own PDF viewer never opens: no Download, no
 * Print, no Save as, and no text layer to select and copy. A canvas also keeps
 * memory bounded — every page of a long manual at once does not fit on a phone.
 */
export default function PdfViewer({ url, title, onClose }) {
  const canvasRef = useRef(null);
  const stageRef = useRef(null);
  const docRef = useRef(null);
  const [pageCount, setPageCount] = useState(0);
  const [page, setPage] = useState(1);
  const [stageWidth, setStageWidth] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    let task = null;

    loadPdfjs()
      .then((pdfjs) => {
        if (cancelled) return null;
        // isEvalSupported:false — a manual should never be able to run script.
        task = pdfjs.getDocument({ url, isEvalSupported: false });
        return task.promise;
      })
      .then((doc) => {
        if (!doc) return;
        if (cancelled) {
          doc.destroy();
          return;
        }
        docRef.current = doc;
        setPageCount(doc.numPages);
        setPage(1);
      })
      .catch(() => {
        if (!cancelled) {
          setError('This manual link has expired. Go back and search again for a fresh one.');
        }
      });

    return () => {
      cancelled = true;
      docRef.current = null;
      task?.destroy();
    };
  }, [url]);

  // Re-render on rotation or a window resize, so the page stays sharp instead
  // of being an upscaled bitmap from whatever width it first opened at.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return undefined;
    const observer = new ResizeObserver(([entry]) =>
      setStageWidth(Math.round(entry.contentRect.width))
    );
    observer.observe(stage);
    return () => observer.disconnect();
  }, [error]);

  useEffect(() => {
    const doc = docRef.current;
    const canvas = canvasRef.current;
    if (!doc || !canvas || !pageCount || !stageWidth) return undefined;

    let render = null;
    let cancelled = false;

    doc.getPage(page).then((pdfPage) => {
      if (cancelled) return;
      // Render at the CSS width times the device pixel ratio, so small print is
      // legible on a phone rather than an upscaled blur.
      const unscaled = pdfPage.getViewport({ scale: 1 });
      const viewport = pdfPage.getViewport({
        scale: (stageWidth / unscaled.width) * (window.devicePixelRatio || 1),
      });
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      render = pdfPage.render({ canvasContext: canvas.getContext('2d'), viewport });
      render.promise.catch(() => {});
    });

    return () => {
      cancelled = true;
      render?.cancel();
    };
  }, [page, pageCount, stageWidth]);

  const step = useCallback(
    (by) => setPage((current) => Math.min(Math.max(current + by, 1), pageCount || 1)),
    [pageCount]
  );

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' || e.key === 'PageDown') step(1);
      if (e.key === 'ArrowLeft' || e.key === 'PageUp') step(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, step]);

  return (
    <div className="pdf-viewer" onContextMenu={(e) => e.preventDefault()}>
      <header className="pdf-bar">
        <button className="pdf-close" onClick={onClose}>
          ← Back
        </button>
        <span className="pdf-title">{title}</span>
        <span className="pdf-count">{pageCount ? `Page ${page} of ${pageCount}` : ''}</span>
      </header>

      {error ? (
        <p className="pdf-error">{error}</p>
      ) : (
        <div className="pdf-stage" ref={stageRef}>
          <canvas ref={canvasRef} className="pdf-page" />
        </div>
      )}

      {!error && pageCount > 1 && (
        <nav className="pdf-nav">
          <button className="primary-button" onClick={() => step(-1)} disabled={page <= 1}>
            Previous
          </button>
          <button className="primary-button" onClick={() => step(1)} disabled={page >= pageCount}>
            Next
          </button>
        </nav>
      )}
    </div>
  );
}
