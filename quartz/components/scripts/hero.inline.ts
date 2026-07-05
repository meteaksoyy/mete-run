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

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)")

  // Reveal-on-scroll: content rises + fades in as each section arrives.
  if (!reduceMotion.matches && "IntersectionObserver" in window) {
    hero.classList.add("reveal-ready")
    const items = Array.from(hero.querySelectorAll<HTMLElement>(".hero-reveal"))
    const io = new IntersectionObserver(
      (entries, obs) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in")
            obs.unobserve(entry.target)
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" },
    )
    items.forEach((el) => io.observe(el))
    window.addCleanup(() => io.disconnect())
  }

  // Hand off from the hero to normal vertical reading.
  const readBtn = hero.querySelector<HTMLElement>(".hero-cta--scroll")
  const scrollToRead = (e: Event) => {
    e.preventDefault()
    const y = hero.getBoundingClientRect().bottom + window.scrollY + 1
    window.scrollTo({ top: y, behavior: reduceMotion.matches ? "auto" : "smooth" })
  }
  readBtn?.addEventListener("click", scrollToRead)
  window.addCleanup(() => readBtn?.removeEventListener("click", scrollToRead))
}

document.addEventListener("nav", setupHero)
