const WIDE_QUERY = "(min-width: 1200px)"

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v))
}

function setupHero() {
  const hero = document.querySelector<HTMLElement>(".hero")
  if (!hero) return // not the homepage

  // Assemble the (deliberately un-scraped) contact email at runtime.
  const emailLink = hero.querySelector<HTMLAnchorElement>(".hero-email")
  if (emailLink) {
    const addr = ["meteaksoy531", "gmail.com"].join("@")
    emailLink.href = "mailto:" + addr
    emailLink.setAttribute("title", addr)
  }

  const track = hero.querySelector<HTMLElement>(".hero-track")
  const stage = hero.querySelector<HTMLElement>(".hero-stage")
  const rail = hero.querySelector<HTMLElement>(".hero-rail")
  const bar = hero.querySelector<HTMLElement>(".hero-progress-bar")
  const dots = Array.from(hero.querySelectorAll<HTMLElement>(".hero-dot"))
  if (!track || !stage || !rail) return

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)")
  const wide = window.matchMedia(WIDE_QUERY)

  const panelCount = rail.children.length
  let rafId = 0
  let active = false
  let maxShift = 0

  const measure = () => {
    maxShift = Math.max(rail.scrollWidth - stage.clientWidth, 0)
    // scroll distance to traverse the rail == the horizontal overflow (1 : 1 feel)
    track.style.height = `${window.innerHeight + maxShift}px`
    update()
  }

  const update = () => {
    const scrollable = track.offsetHeight - window.innerHeight
    const progress =
      scrollable > 0 ? clamp(-track.getBoundingClientRect().top / scrollable, 0, 1) : 0
    rail.style.transform = `translate3d(${(-progress * maxShift).toFixed(2)}px,0,0)`
    if (bar) bar.style.transform = `scaleX(${progress.toFixed(4)})`
    if (dots.length) {
      const idx = Math.round(progress * (panelCount - 1))
      dots.forEach((d, i) => d.classList.toggle("is-active", i === idx))
    }
  }

  const onScroll = () => {
    if (rafId) return
    rafId = requestAnimationFrame(() => {
      rafId = 0
      update()
    })
  }

  const activate = () => {
    if (active) return
    active = true
    hero.classList.add("hero--pinned")
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", measure)
    measure()
  }

  const deactivate = () => {
    if (!active) return
    active = false
    hero.classList.remove("hero--pinned")
    window.removeEventListener("scroll", onScroll)
    window.removeEventListener("resize", measure)
    track.style.height = ""
    rail.style.transform = ""
    if (bar) bar.style.transform = ""
    dots.forEach((d, i) => d.classList.toggle("is-active", i === 0))
  }

  const evaluate = () => {
    if (wide.matches && !reduceMotion.matches) activate()
    else deactivate()
  }

  // Hand off from the hero to normal vertical reading.
  const readBtn = hero.querySelector<HTMLElement>(".hero-cta--scroll")
  const scrollToRead = (e: Event) => {
    e.preventDefault()
    const y = track.getBoundingClientRect().bottom + window.scrollY + 1
    window.scrollTo({ top: y, behavior: reduceMotion.matches ? "auto" : "smooth" })
  }
  readBtn?.addEventListener("click", scrollToRead)

  evaluate()
  wide.addEventListener("change", evaluate)
  reduceMotion.addEventListener("change", evaluate)

  window.addCleanup(() => {
    deactivate()
    wide.removeEventListener("change", evaluate)
    reduceMotion.removeEventListener("change", evaluate)
    readBtn?.removeEventListener("click", scrollToRead)
    if (rafId) cancelAnimationFrame(rafId)
  })
}

document.addEventListener("nav", setupHero)
