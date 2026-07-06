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

  // Per-topic hover micro-interactions (text-changing ones; the purely
  // visual effects are handled in CSS). Each runs only while hovered.
  if (!reduceMotion.matches) {
    setupTopicEffects(hero)
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

function setupTopicEffects(hero: HTMLElement) {
  const SPIN = ["[-]", "[\\]", "[|]", "[/]"]
  const GLYPHS = "!<>-_\\/[]{}=+*^?#§$%01ﾊﾐﾋ"
  const FORMULAS = ["Ax = λx", "e^iπ + 1 = 0", "∑ 1/n² = π²/6", "∇·E = ρ/ε₀", "∂u/∂t = α∇²u"]

  const rand = (s: string) => s[Math.floor(Math.random() * s.length)]

  for (const row of Array.from(hero.querySelectorAll<HTMLElement>(".hero-index-row[data-fx]"))) {
    const fx = row.dataset.fx
    const slot = row.querySelector<HTMLElement>(".hero-fx")
    const word = row.querySelector<HTMLElement>(".hero-index-word")
    let raf = 0
    let timer = 0
    const stop = () => {
      if (raf) cancelAnimationFrame(raf)
      if (timer) clearInterval(timer)
      raf = timer = 0
    }

    let enter: () => void
    let leave: () => void

    if (fx === "ship" && slot) {
      enter = () => {
        stop()
        let i = 0
        slot.classList.remove("fx-done")
        timer = window.setInterval(() => {
          slot.textContent = SPIN[i % SPIN.length]
          if (++i > 11) {
            clearInterval(timer)
            timer = 0
            slot.textContent = "[✔]"
            slot.classList.add("fx-done")
          }
        }, 110)
      }
      leave = () => {
        stop()
        slot.textContent = ""
        slot.classList.remove("fx-done")
      }
    } else if (fx === "math" && slot) {
      let idx = 0
      enter = () => {
        slot.textContent = FORMULAS[idx++ % FORMULAS.length]
        slot.classList.add("fx-in")
      }
      leave = () => slot.classList.remove("fx-in")
    } else if (fx === "scramble" && word) {
      const original = (word.textContent ?? "").trim()
      enter = () => {
        stop()
        const start = performance.now()
        const dur = 2480
        const tick = (now: number) => {
          const p = Math.min((now - start) / dur, 1)
          const reveal = p * original.length
          let out = ""
          for (let k = 0; k < original.length; k++) {
            out += original[k] === " " ? " " : k < reveal ? original[k] : rand(GLYPHS)
          }
          word.textContent = out
          if (p < 1) raf = requestAnimationFrame(tick)
          else word.textContent = original
        }
        raf = requestAnimationFrame(tick)
      }
      leave = () => {
        stop()
        word.textContent = original
      }
    } else if (fx === "ticker" && slot) {
      enter = () => {
        stop()
        const up = Math.random() > 0.42
        const target = Math.random() * 0.9 + 0.08
        slot.classList.toggle("fx-up", up)
        slot.classList.toggle("fx-down", !up)
        const start = performance.now()
        const dur = 2080
        const tick = (now: number) => {
          const p = Math.min((now - start) / dur, 1)
          const val = (target * p).toFixed(2)
          slot.textContent = `${up ? "▲" : "▼"} ${up ? "+" : "−"}${val}%`
          if (p < 1) raf = requestAnimationFrame(tick)
        }
        raf = requestAnimationFrame(tick)
      }
      leave = () => {
        stop()
        slot.textContent = ""
        slot.classList.remove("fx-up", "fx-down")
      }
    } else {
      continue // cursor / ping / glitch are pure CSS
    }

    row.addEventListener("mouseenter", enter)
    row.addEventListener("mouseleave", leave)
    window.addCleanup(() => {
      row.removeEventListener("mouseenter", enter)
      row.removeEventListener("mouseleave", leave)
      stop()
    })
  }
}

document.addEventListener("nav", setupHero)
