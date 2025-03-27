import { useState, useEffect } from "react";

export default function Accordion() {
  const [summaries, setSummaries] = useState([]);
  const [openSlug, setOpenSlug] = useState(null);

  useEffect(() => {
    fetch("/summaries")
      .then(res => res.json())
      .then(async metaList => {
        const allSummaries = await Promise.all(
          metaList.map(async ({ slug, title }) => {
            const text = await fetch(`/summary/${slug}`).then(res => res.text());
            return { slug, title, text };
          })
        );
        setSummaries(allSummaries);
      });
  }, []);

  const toggle = (slug) => {
    setOpenSlug(prev => (prev === slug ? null : slug));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">🕵️ PolicyPal</h1>
      {summaries.map(({ slug, title, text }) => (
        <div key={slug} className="mb-4 border rounded-lg shadow">
          <button
            onClick={() => toggle(slug)}
            className="w-full text-left px-4 py-3 bg-gray-100 hover:bg-gray-200 font-semibold transition"
          >
            {openSlug === slug ? `▼ ${title}` : `▶ ${title}`}
          </button>
          {openSlug === slug && (
            <div className="bg-white px-4 py-3 whitespace-pre-wrap border-t">
              {text}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
