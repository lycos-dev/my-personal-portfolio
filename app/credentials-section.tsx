"use client";

import { useCallback, useEffect, useRef, useState, type TouchEvent } from "react";
import { ArrowDownRight, ArrowLeft, ArrowRight, ExternalLink, FileText, Pause, Play } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { credentials, featuredCredentials, type Credential, type CredentialCategory } from "./credentials";

const AUTO_ADVANCE_MS = 6000;
const filters: Array<"All" | CredentialCategory> = ["All", "Courses", "Seminars & Events", "Recognition"];

function CredentialImage({ entry, className = "", eager = false }: { entry: Credential; className?: string; eager?: boolean }) {
  return <img className={className} src={entry.image} alt={`Original certificate: ${entry.title}`} loading={eager ? "eager" : "lazy"} decoding="async" />;
}

export function CredentialsSection({ motionEnabled }: { motionEnabled: boolean | null }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focusWithin, setFocusWithin] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const [filter, setFilter] = useState<"All" | CredentialCategory>("All");
  const [selected, setSelected] = useState<Credential | null>(null);
  const [reduced, setReduced] = useState(false);
  const [isSectionVisible, setSectionVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const touchX = useRef<number | null>(null);
  const active = featuredCredentials[activeIndex];
  const canAutoPlay = motionEnabled !== false && !reduced && !paused && !hovered && !focusWithin && pageVisible && !selected && isSectionVisible;

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const sync = () => setPageVisible(!document.hidden);
    document.addEventListener("visibilitychange", sync);
    return () => document.removeEventListener("visibilitychange", sync);
  }, []);

  useEffect(() => {
    if (!sectionRef.current) return;
    const observer = new IntersectionObserver(([entry]) => setSectionVisible(entry.isIntersecting), { threshold: 0.08 });
    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!canAutoPlay) return;
    const interval = window.setInterval(() => setActiveIndex(index => (index + 1) % featuredCredentials.length), AUTO_ADVANCE_MS);
    return () => window.clearInterval(interval);
  }, [canAutoPlay, activeIndex]);

  const changeSlide = useCallback((index: number) => {
    setActiveIndex((index + featuredCredentials.length) % featuredCredentials.length);
  }, []);

  const onTouchStart = (event: TouchEvent) => { touchX.current = event.touches[0]?.clientX ?? null; };
  const onTouchEnd = (event: TouchEvent) => {
    if (touchX.current === null) return;
    const delta = event.changedTouches[0]?.clientX - touchX.current;
    touchX.current = null;
    if (delta === undefined || Math.abs(delta) < 45) return;
    changeSlide(activeIndex + (delta < 0 ? 1 : -1));
  };

  const shown = filter === "All" ? credentials : credentials.filter(item => item.category === filter);
  return <>
    <section id="credentials" ref={sectionRef} className="section credentials-section wrap" aria-labelledby="credentials-title">
      <p className="eyebrow section-label">04 / CREDENTIALS</p>
      <div className="credentials-heading">
        <div>
          <h2 id="credentials-title">Learning. Building. Achieving<span className="muted-period">.</span></h2>
          <p>A record of hands-on learning, innovation, and academic recognition.</p>
        </div>
        <span className="credentials-heading-count">{String(credentials.length).padStart(2, "0")} DOCUMENTED RECORDS</span>
      </div>

      <div className="featured-gallery" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onFocusCapture={() => setFocusWithin(true)} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocusWithin(false); }} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd} aria-roledescription="carousel" aria-label="Featured credentials">
        <div className="featured-gallery-topline"><span>SELECTED / HIGHLIGHTS</span><span>FEATURED CREDENTIALS</span></div>
        <div className="featured-gallery-content">
          <button className="featured-certificate-visual" type="button" onClick={() => setSelected(active)} aria-label={`View original ${active.title} certificate`}>
            {featuredCredentials.map((entry, index) => <CredentialImage key={entry.id} entry={entry} eager={index === 0} className={`featured-layer ${activeIndex === index ? "is-active" : ""}`} />)}
            <span className="certificate-view-hint">VIEW ORIGINAL <ExternalLink size={14} strokeWidth={1.8} /></span>
          </button>
          <div className="featured-gallery-copy" key={active.id}>
            <div className="featured-gallery-kicker"><span>{active.category.toUpperCase()}</span><span>{active.date}</span></div>
            <div>
              <h3>{active.title}</h3>
              <p className="featured-gallery-summary">{active.description}</p>
              <p className="featured-gallery-issuer">{active.issuer}</p>
            </div>
            <button type="button" className="featured-view-link" onClick={() => setSelected(active)}>Explore credential <ExternalLink size={15} strokeWidth={1.7} /></button>
          </div>
        </div>
        <div className="featured-gallery-bottom">
          <div className="featured-slides" aria-label="Select featured credential">
            {featuredCredentials.map((entry,index) => <button key={entry.id} type="button" className={`featured-slide-indicator ${activeIndex===index ? "is-active" : ""}`} onClick={() => changeSlide(index)} aria-current={activeIndex===index ? "true" : undefined} aria-label={`Show slide ${index+1}: ${entry.title}`}><span className="slide-progress" style={{ animationDuration: `${AUTO_ADVANCE_MS}ms`, animationPlayState: canAutoPlay ? "running" : "paused" }} /></button>)}
          </div>
          <div className="featured-gallery-controls"><span className="featured-counter">{String(activeIndex+1).padStart(2,"0")} / {String(featuredCredentials.length).padStart(2,"0")}</span>
            <button type="button" onClick={() => setPaused(value=>!value)} className="gallery-icon-btn" aria-label={paused ? "Resume slideshow" : "Pause slideshow"} title={paused ? "Resume slideshow" : "Pause slideshow"}>{paused ? <Play size={16}/> : <Pause size={16}/>}</button>
            <button type="button" onClick={() => changeSlide(activeIndex - 1)} className="gallery-icon-btn" aria-label="Previous featured certificate"><ArrowLeft size={17}/></button>
            <button type="button" onClick={() => changeSlide(activeIndex + 1)} className="gallery-icon-btn" aria-label="Next featured certificate"><ArrowRight size={17}/></button>
          </div>
        </div>
      </div>

      <div className="credentials-gallery-heading"><div><p className="eyebrow">COMPLETE ARCHIVE</p><h3>All credentials<span className="muted-period">.</span></h3></div><span>SELECT A CARD TO VIEW THE ORIGINAL CERTIFICATE</span></div>
      <div className="credential-filters" role="group" aria-label="Filter certificates">
        {filters.map(option => <button type="button" key={option} onClick={() => setFilter(option)} aria-pressed={filter===option} className={filter===option ? "credential-filter is-active" : "credential-filter"}>{option}{option==="All" ? ` (${credentials.length})` : ""}</button>)}
      </div>
      <div className="credential-cards" aria-live="polite">
        {shown.map(entry => <article key={entry.id} className="credential-card">
          <button type="button" className="credential-card-image" onClick={() => setSelected(entry)} aria-label={`View ${entry.title} certificate`}><CredentialImage entry={entry}/><span className="credential-card-open"><ExternalLink size={18} strokeWidth={1.6}/></span></button>
          <div className="credential-card-body"><div className="credential-card-meta"><span>{entry.category}</span><span>{entry.date}</span></div><h4>{entry.title}</h4><p>{entry.description}</p><span className="credential-card-issuer">{entry.issuer}</span><button type="button" className="credential-card-view" onClick={() => setSelected(entry)}>View Certificate <ArrowDownRight size={15} strokeWidth={1.7}/></button></div>
        </article>)}
      </div>
    </section>

    <Dialog open={selected !== null} onOpenChange={open => { if (!open) setSelected(null); }}>
      <DialogContent className="credential-dialog">
        {selected && <>
          <div className="credential-dialog-header"><span className="eyebrow">{selected.category.toUpperCase()} / {selected.issuer}</span><DialogTitle className="credential-dialog-title">{selected.title}</DialogTitle><DialogDescription className="credential-dialog-date">{selected.date}</DialogDescription></div>
          <div className="credential-dialog-image"><CredentialImage entry={selected} eager /></div>
          <p className="credential-dialog-description">{selected.description}</p>
          {selected.eventImage && <figure className="credential-event-photo"><img src={selected.eventImage} alt="Group photograph of CaLaBaRZon Young Innovators’ Challenge participants at De La Salle Lipa" loading="lazy"/><figcaption>Event photograph: De La Salle Lipa. <a href={selected.eventSource} target="_blank" rel="noopener noreferrer">View official event coverage <ExternalLink size={12}/></a></figcaption></figure>}
          <div className="credential-dialog-actions">
            {selected.verification && <a href={selected.verification} target="_blank" rel="noopener noreferrer" className="credential-action primary">Verify Credential <ExternalLink size={15}/></a>}
            <a href={selected.pdf} target="_blank" rel="noopener noreferrer" className="credential-action secondary"><FileText size={16}/> Open Original PDF <ExternalLink size={14}/></a>
          </div>
          <p className="credential-dialog-note">Certificate image shown is a direct rendering of the original document.</p>
        </>}
      </DialogContent>
    </Dialog>
  </>;
}
