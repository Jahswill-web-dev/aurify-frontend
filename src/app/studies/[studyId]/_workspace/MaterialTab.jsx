import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { FileText } from "lucide-react";
import { Card } from "@/components/ui";

export function createHeadingSlug(text, counts) {
  const baseSlug =
    text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "") || "section";

  const nextCount = (counts.get(baseSlug) || 0) + 1;
  counts.set(baseSlug, nextCount);

  return nextCount === 1 ? baseSlug : `${baseSlug}-${nextCount}`;
}

export function MaterialOutline({ items, activeHeadingId, onItemClick, mobile = false }) {
  if (!items.length) return null;

  return (
    <nav aria-label="Study material outline">
      <p className="text-h6 font-semibold uppercase text-grey-100 poppins-font">
        Outline
      </p>
      <div className={mobile ? "mt-3 grid gap-1" : "mt-3 max-h-[calc(100vh-190px)] overflow-y-auto pr-1"}>
        {items.map((item) => {
          const isActive = !item.isFallback && item.id === activeHeadingId;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onItemClick(item)}
              className={[
                "group w-full rounded-sm border-l-2 py-2 pr-2 text-left text-h6 leading-5 transition-colors duration-175 ease-smooth focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                item.level >= 3 ? "pl-5" : "pl-3",
                isActive
                  ? "border-primary bg-accent-25 text-primary-200"
                  : "border-transparent text-p-text hover:border-accent-200 hover:bg-off-white-50 hover:text-grey-200",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <span className={mobile ? "line-clamp-2" : "block truncate"}>
                {item.title}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

export function MaterialTab({ material }) {
  const markdownRef = useRef(null);
  const materialTopRef = useRef(null);
  const [outlineItems, setOutlineItems] = useState([]);
  const [activeHeadingId, setActiveHeadingId] = useState("");
  const [mobileOutlineOpen, setMobileOutlineOpen] = useState(false);

  const materialTopId = useMemo(() => {
    const counts = new Map();
    return `material-${createHeadingSlug(material?.id || material?.title || "study-material", counts)}-start`;
  }, [material?.id, material?.title]);

  useEffect(() => {
    setMobileOutlineOpen(false);
  }, [material?.content, material?.id]);

  useEffect(() => {
    const markdownNode = markdownRef.current;
    if (!markdownNode) return undefined;

    const slugCounts = new Map();
    const headings = Array.from(markdownNode.querySelectorAll("h2, h3"));
    const nextOutline = headings
      .map((heading) => {
        const title = heading.textContent?.trim();
        if (!title) return null;

        if (!heading.id) {
          heading.id = createHeadingSlug(title, slugCounts);
        } else {
          const existingId = heading.id;
          const existingCount = (slugCounts.get(existingId) || 0) + 1;
          slugCounts.set(existingId, existingCount);
        }

        return {
          id: heading.id,
          targetId: heading.id,
          title,
          level: Number(heading.tagName.replace("H", "")),
          isFallback: false,
        };
      })
      .filter(Boolean);

    if (!nextOutline.length && Array.isArray(material?.outline)) {
      const fallbackItems = material.outline
        .map((title, index) => {
          const cleanTitle = String(title || "").trim();
          if (!cleanTitle) return null;

          return {
            id: `fallback-outline-${index}`,
            targetId: materialTopId,
            title: cleanTitle,
            level: 2,
            isFallback: true,
          };
        })
        .filter(Boolean);

      setOutlineItems(fallbackItems);
      setActiveHeadingId("");
      return undefined;
    }

    setOutlineItems(nextOutline);
    setActiveHeadingId(nextOutline[0]?.id || "");

    if (!nextOutline.length || typeof IntersectionObserver === "undefined") {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visibleEntries[0]?.target?.id) {
          setActiveHeadingId(visibleEntries[0].target.id);
        }
      },
      {
        root: null,
        rootMargin: "-130px 0px -65% 0px",
        threshold: [0, 1],
      }
    );

    nextOutline.forEach((item) => {
      const heading = document.getElementById(item.targetId);
      if (heading) observer.observe(heading);
    });

    return () => observer.disconnect();
  }, [material?.content, material?.outline, materialTopId]);

  const handleOutlineClick = useCallback((item) => {
    const target = item.isFallback
      ? materialTopRef.current
      : document.getElementById(item.targetId);

    target?.scrollIntoView({ behavior: "smooth", block: "start" });
    if (!item.isFallback) setActiveHeadingId(item.id);
    setMobileOutlineOpen(false);
  }, []);

  if (!material) {
    return (
      <Card variant="default" className="mx-auto max-w-[720px] p-6 text-center">
        <FileText className="mx-auto h-9 w-9 text-primary" aria-hidden="true" />
        <h2 className="mt-3 text-h3 font-semibold text-grey-200 poppins-font">
          Material is not ready yet
        </h2>
        <p className="mt-2 text-h5 leading-7 text-p-text-darker inter-font">
          The backend is still generating this Study. This tab will fill in
          automatically when the Study reaches ready status.
        </p>
      </Card>
    );
  }

  return (
    <div className="mx-auto max-w-[1180px] lg:relative">
      <article className="mx-auto min-w-0 max-w-[980px] xl:max-w-[1020px]">
        <Card
          variant="default"
          className="scroll-mt-32 p-5 sm:p-7"
          id={materialTopId}
        >
          <div ref={materialTopRef} className="scroll-mt-32">
            <p className="text-h6 font-semibold uppercase text-primary poppins-font">
              Generated material
            </p>
            <h2 className="mt-2 text-h2 font-bold text-grey-200 poppins-font">
              {material.title || "Study Material"}
            </h2>
            {material.source_notes ? (
              <p className="mt-3 text-h5 leading-7 text-p-text-darker inter-font">
                {material.source_notes}
              </p>
            ) : null}
          </div>
          <div
            ref={markdownRef}
            className="prose prose-neutral mt-6 max-w-none text-grey-200 prose-headings:scroll-mt-32 prose-headings:font-bold prose-headings:text-grey-200 prose-p:leading-7 prose-a:text-primary"
          >
            <ReactMarkdown>{material.content || ""}</ReactMarkdown>
          </div>
        </Card>
      </article>

      {outlineItems.length ? (
        <aside className="group fixed right-3 top-[142px] z-30 lg:right-4 lg:top-[168px]">
          <div className="flex items-start justify-end">
            <button
              type="button"
              onClick={() => setMobileOutlineOpen((isOpen) => !isOpen)}
              aria-label="Show material outline"
              aria-expanded={mobileOutlineOpen}
              className="mt-3 flex h-28 w-9 items-center justify-center rounded-l-md border border-r-0 border-grey-25 bg-white text-primary shadow-card transition-colors duration-175 ease-smooth hover:border-primary hover:bg-accent-25 focus:border-primary focus:bg-accent-25 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 group-hover:border-primary group-hover:bg-accent-25 group-focus-within:border-primary group-focus-within:bg-accent-25 dark:border-dark-border dark:bg-dark-surface dark:text-primary-25 dark:shadow-none dark:hover:border-primary-25 dark:hover:bg-dark-surface-soft dark:focus:ring-primary-25 dark:focus:ring-offset-dark-bg dark:group-hover:border-primary-25 dark:group-hover:bg-dark-surface-soft"
            >
              <span className="-rotate-90 whitespace-nowrap text-h6 font-semibold uppercase poppins-font">
                Outline
              </span>
            </button>
            <div
              className={[
                "overflow-hidden transition-all duration-250 ease-smooth",
                mobileOutlineOpen
                  ? "pointer-events-auto w-[calc(100vw-64px)] max-w-[340px] translate-x-0 opacity-100"
                  : "pointer-events-none w-0 max-w-[340px] translate-x-3 opacity-0",
                "lg:pointer-events-none lg:w-0 lg:max-w-none lg:translate-x-3 lg:opacity-0 lg:group-hover:pointer-events-auto lg:group-hover:w-[340px] lg:group-hover:translate-x-0 lg:group-hover:opacity-100 lg:group-focus-within:pointer-events-auto lg:group-focus-within:w-[340px] lg:group-focus-within:translate-x-0 lg:group-focus-within:opacity-100 xl:group-hover:w-[380px] xl:group-focus-within:w-[380px]",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <div className="rounded-md border border-grey-25 bg-white p-4 shadow-modal dark:border-dark-border dark:bg-dark-surface dark:shadow-none">
                <MaterialOutline
                  items={outlineItems}
                  activeHeadingId={activeHeadingId}
                  onItemClick={handleOutlineClick}
                />
              </div>
            </div>
          </div>
        </aside>
      ) : null}
    </div>
  );
}
