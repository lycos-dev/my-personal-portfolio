"use client";

import { useEffect, useRef } from "react";
import { drawPortraitSignals } from "./portrait-signals";

const clamp = (n: number) => Math.max(0, Math.min(1, n));
const ease = (from: number, to: number, value: number) => {
  const t = clamp((value - from) / (to - from));
  return t * t * (3 - 2 * t);
};

/** Scroll-controlled LB assembly + event-driven portfolio motion. No intro timer. */
export function usePortfolioMotion(motionEnabled: boolean | null = null) {
  const heroRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    const stage = hero.querySelector<HTMLElement>(".hero-stage")!;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const pointer = window.matchMedia("(hover: hover) and (pointer: fine) and (min-width: 1024px)");
    let teardown = () => {};

    function configure() {
      teardown();
      if (motionEnabled === false || (motionEnabled !== true && reduced.matches)) return;
      let frame = 0;
      let measureNext = true;
      // The one-screen hero doubles as a scroll-controlled sketch board.
      // Consume scroll gestures until the LB line-art has FULLY resolved.
      // Only the *next* gesture proceeds to About; there is no timed autoplay.
      const root = document.documentElement;
      const runIntro = window.scrollY < 8 &&
        (!window.location.hash || window.location.hash === "#home") &&
        document.visibilityState === "visible";
      let introActive = runIntro;
      let introProgress = runIntro ? 0 : 1;
      let touchY: number | null = null;
      const ASSEMBLY_DISTANCE = 780; // normalized gesture pixels to resolve LB
      const hint = hero!.querySelector<HTMLElement>(".hero-scroll-text");
      const setHint = (ready: boolean) => {
        if (hint) hint.textContent = ready ? "SCROLL TO EXPLORE" : "SCROLL TO FORM LB";
      };
      setHint(!runIntro);
      root.dataset.heroLb = runIntro ? "forming" : "complete";

      function unblock() {
        introActive = false;
        delete root.dataset.heroIntro;
        root.dataset.heroLb = "complete";
        setHint(true);
        window.removeEventListener("wheel", handleWheel);
        window.removeEventListener("touchstart", handleTouchStart);
        window.removeEventListener("touchmove", handleTouchMove);
        window.removeEventListener("touchend", handleTouchEnd);
        window.removeEventListener("keydown", handleIntroKeydown, true);
        document.removeEventListener("click", handleIntroNavigation, true);
      }
      function setAssembly(value: number) {
        introProgress = clamp(value);
        if (introProgress >= 1) unblock();
        schedule();
      }
      function progressBy(pixels: number) {
        if (!introActive) return;
        setAssembly(introProgress + pixels / ASSEMBLY_DISTANCE);
      }
      function handleWheel(event: WheelEvent) {
        if (!introActive || event.ctrlKey) return;
        event.preventDefault();
        if (Math.abs(event.deltaY) < Math.abs(event.deltaX)) return;
        const factor = event.deltaMode === 1 ? 18 : event.deltaMode === 2 ? window.innerHeight : 1;
        progressBy(Math.max(-180, Math.min(180, event.deltaY * factor)));
      }
      function handleTouchStart(event: TouchEvent) {
        touchY = event.touches[0]?.clientY ?? null;
      }
      function handleTouchMove(event: TouchEvent) {
        if (!introActive) return;
        if (event.touches.length !== 1 || touchY === null) return;
        const next = event.touches[0].clientY;
        const delta = touchY - next;
        touchY = next;
        if (event.cancelable) event.preventDefault();
        progressBy(delta * 1.7);
      }
      function handleTouchEnd() { touchY = null; }
      function handleIntroKeydown(event: KeyboardEvent) {
        if (!introActive) return;
        if (event.key === "Escape") {
          event.preventDefault();
          setAssembly(1);
          return;
        }
        if (event.altKey || event.ctrlKey || event.metaKey) return;
        if ((event.target as HTMLElement | null)?.closest("input,textarea,select,[contenteditable=true]")) return;
        const keys: Record<string, number> = {
          ArrowDown: 125, ArrowUp: -125, PageDown: 300,
          PageUp: -300, " ": event.shiftKey ? -300 : 300,
          End: ASSEMBLY_DISTANCE, Home: -ASSEMBLY_DISTANCE,
        };
        const delta = keys[event.key];
        if (delta !== undefined) {
          event.preventDefault();
          progressBy(delta);
        }
      }
      function handleIntroNavigation(event: MouseEvent) {
        // Visitors can always skip with navigation, CTA, or the Motion toggle.
        if ((event.target as Element | null)?.closest?.('a[href^="#"], .motion-control button')) {
          setAssembly(1);
        }
      }
      if (runIntro) {
        root.dataset.heroIntro = "locked";
        window.addEventListener("wheel", handleWheel, { passive: false });
        window.addEventListener("touchstart", handleTouchStart, { passive: true });
        window.addEventListener("touchmove", handleTouchMove, { passive: false });
        window.addEventListener("touchend", handleTouchEnd, { passive: true });
        window.addEventListener("keydown", handleIntroKeydown, true);
        document.addEventListener("click", handleIntroNavigation, true);
      }
      let start = 0, travel = 1, viewport = 1, mobile = false;
      let bounds = { left: 0, width: 1, top: 0, height: 1 };
      let mouseX = 0, mouseY = 0;
      const canvas = hero!.querySelector<HTMLCanvasElement>(".portrait-signals");
      const context = canvas?.getContext("2d");
      let canvasWidth = 1, canvasHeight = 1;
      type ProjectBounds = { element: HTMLElement; top: number; height: number; left: number; width: number };
      let projects: ProjectBounds[] = [];
      let projectPointer: { element: HTMLElement; x: number; y: number } | null = null;
      const projectElements = [...document.querySelectorAll<HTMLElement>(".projects-grid .project-image")];
      const reveals = [...document.querySelectorAll<HTMLElement>(".about-grid, .projects-section .section-heading, .project-card, .skill-group, .journey-grid > h2, .timeline li")];
      const revealObserver = new IntersectionObserver(entries => {
        for (const entry of entries) if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      }, { threshold: 0.08 });
      for (const element of reveals) {
        if (element.getBoundingClientRect().top > window.innerHeight * .94) element.classList.add("reveal-ready");
        else element.classList.add("is-visible");
        revealObserver.observe(element);
      }
      hero!.dataset.motion = "enabled";
      function schedule() { if (!frame) frame = window.requestAnimationFrame(render); }
      function measure() {
        const scroll = window.scrollY;
        const rect = hero!.getBoundingClientRect();
        const stageRect = stage.getBoundingClientRect();
        viewport = window.innerHeight;
        mobile = window.innerWidth <= 760;
        const navHeight = document.querySelector<HTMLElement>(".nav-shell")?.offsetHeight ?? 83;
        start = rect.top + scroll;
        // No artificial scroll distance: progress changes as the one-screen hero exits.
        travel = Math.max(1, hero!.offsetHeight);
        bounds = { left: stageRect.left, width: stageRect.width, top: navHeight, height: stageRect.height };
        projects = projectElements.map(element => {
          const box = element.getBoundingClientRect();
          return { element, top: box.top + scroll, height: box.height, left: box.left, width: box.width };
        });
        if (canvas && context) {
          canvasWidth = canvas.clientWidth; canvasHeight = canvas.clientHeight;
          const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
          canvas.width = Math.round(canvasWidth * ratio); canvas.height = Math.round(canvasHeight * ratio);
          context.setTransform(ratio, 0, 0, ratio, 0, 0);
        }
        measureNext = false;
      }
      function render() {
        frame = 0;
        if (measureNext) measure();
        const scroll = window.scrollY;
        const p = clamp((scroll - start) / travel);
        const depth = ease(.05, .6, p);
        const exit = ease(.67, 1, p);
        const amount = mobile ? .17 : .55;
        const heroStyle = hero!.style;
        // All scroll-linked effects derive from the same reversible progress value.
        heroStyle.setProperty("--portrait-scale", String(1 + .04 * depth * amount));
        heroStyle.setProperty("--portrait-x", `${(10 * depth + 9 * exit) * amount}px`);
        heroStyle.setProperty("--portrait-y", `${-5 * depth * amount}px`);
        heroStyle.setProperty("--grid-y", `${(-16 * p + 12 * (1 - introProgress)) * amount}px`);
        heroStyle.setProperty("--particle-y", `${-24 * p * amount}px`);
        heroStyle.setProperty("--light-x", `${(20 * depth + 5 * exit) * amount}px`);
        heroStyle.setProperty("--light-y", `${-14 * depth * amount}px`);
        heroStyle.setProperty("--light-opacity", String(.24 + .12 * introProgress + .09 * depth - .19 * exit));
        heroStyle.setProperty("--rim-opacity", String(.025 + .06 * depth - .045 * exit));
        heroStyle.setProperty("--geometry-opacity", String(1 - .72 * exit));
        heroStyle.setProperty("--name-y", `${-4 * p * amount}px`);
        heroStyle.setProperty("--support-y", `${-13 * p * amount}px`);
        heroStyle.setProperty("--support-opacity", String(mobile ? 1 : 1 - .2 * exit));
        heroStyle.setProperty("--cta-opacity", "1");
        heroStyle.setProperty("--pointer-x", `${mouseX * 3}px`);
        heroStyle.setProperty("--pointer-y", `${mouseY * 2}px`);
        heroStyle.setProperty("--pointer-grid-x", `${mouseX * -6}px`);
        heroStyle.setProperty("--pointer-grid-y", `${mouseY * -4}px`);
        // A single scroll-driven sketch: 0 = unruly threads, 1 = recognizable LB.
        // Never fade the completed monogram back out.
        const signalProgress = introProgress;
        heroStyle.setProperty("--hero-progress", signalProgress.toFixed(4));
        heroStyle.setProperty("--lb-assembly", signalProgress.toFixed(4));
        heroStyle.setProperty("--idea-opacity", String(1 - .68 * ease(.15, .42, signalProgress)));
        heroStyle.setProperty("--structure-opacity", String(.32 + .68 * ease(.15,.42,signalProgress) - .68 * ease(.6,.82,signalProgress)));
        heroStyle.setProperty("--system-opacity", String(.32 + .68 * ease(.6,.82,signalProgress)));
        if (context && canvasWidth > 0 && canvasHeight > 0 && scroll < start + travel && scroll + viewport > start) {
          drawPortraitSignals(context, canvasWidth, canvasHeight, signalProgress, mouseX, mouseY, mobile);
        }
        for (const item of projects) {
          const active = projectPointer?.element === item.element;
          item.element.style.setProperty("--project-light-opacity", active ? "1" : "0");
          if (active && projectPointer) {
            item.element.style.setProperty("--project-light-x", `${projectPointer.x - item.left}px`);
            item.element.style.setProperty("--project-light-y", `${projectPointer.y + scroll - item.top}px`);
          }
          if (scroll + viewport < item.top || scroll > item.top + item.height) continue;
          const visible = clamp((scroll + viewport - item.top) / (viewport + item.height));
          item.element.style.setProperty("--media-y", `${(visible - .5) * (mobile ? 4 : 10)}px`);
          item.element.style.setProperty("--sensor-reveal", String(ease(.08, .42, visible)));
        }

      }
      function resize() { measureNext = true; schedule(); }
      function move(event: PointerEvent) {
        if (!pointer.matches || event.pointerType !== "mouse") return;
        mouseX = Math.max(-1, Math.min(1, ((event.clientX - bounds.left) / bounds.width - .5) * 2));
        mouseY = Math.max(-1, Math.min(1, ((event.clientY - bounds.top) / bounds.height - .5) * 2));
        schedule();
      }
      function leave() { mouseX = mouseY = 0; schedule(); }
      function projectMove(event: PointerEvent) {
        if (!pointer.matches || event.pointerType !== "mouse") return;
        projectPointer = { element: event.currentTarget as HTMLElement, x: event.clientX, y: event.clientY };
        schedule();
      }
      function projectLeave() { projectPointer = null; schedule(); }
      const resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(stage);
      window.addEventListener("scroll", schedule, { passive: true });
      window.addEventListener("resize", resize, { passive: true });
      stage.addEventListener("pointermove", move, { passive: true });
      stage.addEventListener("pointerleave", leave, { passive: true });
      pointer.addEventListener("change", leave);
      pointer.addEventListener("change", projectLeave);
      projectElements.forEach(element => {
        element.addEventListener("pointermove", projectMove, { passive: true });
        element.addEventListener("pointerleave", projectLeave, { passive: true });
      });
      schedule();
      teardown = () => {
        unblock();
        delete root.dataset.heroLb;
        cancelAnimationFrame(frame);
        resizeObserver.disconnect(); revealObserver.disconnect();
        window.removeEventListener("scroll", schedule);
        window.removeEventListener("resize", resize);
        stage.removeEventListener("pointermove", move);
        stage.removeEventListener("pointerleave", leave);
        pointer.removeEventListener("change", leave);
        pointer.removeEventListener("change", projectLeave);
        projectElements.forEach(element => {
          element.removeEventListener("pointermove", projectMove);
          element.removeEventListener("pointerleave", projectLeave);
          ["--project-light-opacity", "--project-light-x", "--project-light-y"].forEach(key => element.style.removeProperty(key));
        });
        context?.clearRect(0, 0, canvasWidth, canvasHeight);
        delete hero!.dataset.motion;
        hero!.removeAttribute("style");
        reveals.forEach(element => { element.classList.remove("reveal-ready", "is-visible"); });
        projects.forEach(({ element }) => { element.style.removeProperty("--media-y"); element.style.removeProperty("--sensor-reveal"); });
      };
    }
    configure();
    reduced.addEventListener("change", configure);
    return () => { reduced.removeEventListener("change", configure); teardown(); };
  }, [motionEnabled]);
  return heroRef;
}


