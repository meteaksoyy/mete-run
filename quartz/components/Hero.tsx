import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { resolveRelative } from "../util/path"
import { QuartzPluginData } from "../plugins/vfile"
import { Date, getDate } from "./Date"
import { byDateAndAlphabetical } from "./PageList"
// @ts-ignore
import heroScript from "./scripts/hero.inline"

interface HeroOptions {
  featuredLimit: number
}

const defaultOptions: HeroOptions = {
  featuredLimit: 3,
}

type Topic = { n: string; slug: string; title: string; blurb: string }

const TOPICS: Topic[] = [
  { n: "01", slug: "1-Projects/", title: "Projects", blurb: "Things I've built and shipped." },
  { n: "02", slug: "2-AI/", title: "AI", blurb: "Agents, papers & the frontier." },
  {
    n: "03",
    slug: "3-Distributed-Systems/",
    title: "Distributed Systems",
    blurb: "Consensus, replication, failure.",
  },
  { n: "04", slug: "4-Math/", title: "Math", blurb: "Foundations worth revisiting." },
  { n: "05", slug: "5-Security/", title: "Security", blurb: "Exploits, evasion & defense." },
  {
    n: "06",
    slug: "6-Miscellaneous/",
    title: "Miscellaneous",
    blurb: "Everything that didn't fit.",
  },
  { n: "07", slug: "7-Finance/", title: "Finance", blurb: "Markets, risk & money." },
]

function isRealNote(f: QuartzPluginData): boolean {
  const slug = f.slug ?? ""
  if (slug === "index") return false
  if (slug.endsWith("/index")) return false
  if (slug.startsWith("tags/")) return false
  return Boolean(f.frontmatter?.title) && Boolean(f.dates)
}

export default ((userOpts?: Partial<HeroOptions>) => {
  const opts = { ...defaultOptions, ...userOpts }

  const Hero: QuartzComponent = ({ allFiles, fileData, cfg }: QuartzComponentProps) => {
    const featured = allFiles
      .filter(isRealNote)
      .sort(byDateAndAlphabetical(cfg))
      .slice(0, opts.featuredLimit)

    const dots = ["intro", "topics", "notes", "contact"]

    return (
      <section class="hero" aria-label="Introduction">
        <div class="hero-track">
          <div class="hero-stage">
            <div class="hero-rail">
              {/* Panel 1 — intro */}
              <div class="hero-panel hero-panel--intro" role="group" aria-label="Welcome">
                <div class="hero-intro">
                  <p class="hero-eyebrow">
                    <span class="hero-dot-live" aria-hidden="true"></span>
                    Personal wiki &amp; notebook
                  </p>
                  <h1 class="hero-wordmark">
                    Mete<span class="hero-accent">.</span>run
                  </h1>
                  <p class="hero-lede">
                    Final-year CS student in Delft, dumping notes on{" "}
                    <span class="hero-hl">distributed systems</span>,{" "}
                    <span class="hero-hl">security</span> &amp; <span class="hero-hl">finance</span>{" "}
                    — mostly so I can find them later.
                  </p>
                  <div class="hero-term" aria-hidden="true">
                    <div class="hero-term-bar">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                    <div class="hero-term-body">
                      <p>
                        <span class="tok-cmd">whoami</span> does things with computers
                      </p>
                      <p>
                        <span class="tok-cmd">pwd</span> Delft, The Netherlands
                      </p>
                      <p>
                        <span class="tok-cmd">ps&nbsp;-a</span> too many open tabs
                      </p>
                      <p>
                        <span class="tok-cmd">uname&nbsp;-a</span>{" "}
                        <a class="hero-inline-link" href="static/Mete_Aksoy_CV.pdf">
                          resume.pdf
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Panel 2 — what I write about */}
              <div class="hero-panel hero-panel--topics" role="group" aria-label="Topics">
                <div class="hero-panel-inner">
                  <p class="hero-kicker">
                    <span class="hero-index">02</span> What I write about
                  </p>
                  <div class="hero-topics">
                    {TOPICS.map((t) => (
                      <a class="hero-topic internal" href={`./${t.slug}`} data-no-popover>
                        <span class="hero-topic-n">{t.n}</span>
                        <span class="hero-topic-body">
                          <span class="hero-topic-title">{t.title}</span>
                          <span class="hero-topic-blurb">{t.blurb}</span>
                        </span>
                        <span class="hero-topic-arrow" aria-hidden="true">
                          →
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* Panel 3 — featured notes */}
              <div class="hero-panel hero-panel--featured" role="group" aria-label="Recent notes">
                <div class="hero-panel-inner">
                  <p class="hero-kicker">
                    <span class="hero-index">03</span> Latest from the notebook
                  </p>
                  <div class="hero-notes">
                    {featured.map((page) => {
                      const title = page.frontmatter?.title
                      const tags = (page.frontmatter?.tags ?? []).slice(0, 3)
                      const href = resolveRelative(fileData.slug!, page.slug!)
                      return (
                        <a class="hero-note internal" href={href}>
                          <span class="hero-note-meta">
                            {page.dates && <Date date={getDate(cfg, page)!} locale={cfg.locale} />}
                          </span>
                          <span class="hero-note-title">{title}</span>
                          {page.description && (
                            <span class="hero-note-desc">{page.description}</span>
                          )}
                          <span class="hero-note-tags">
                            {tags.map((tag) => (
                              <span class="hero-note-tag">#{tag}</span>
                            ))}
                          </span>
                        </a>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Panel 4 — contact */}
              <div class="hero-panel hero-panel--contact" role="group" aria-label="Contact">
                <div class="hero-panel-inner hero-contact">
                  <p class="hero-kicker">
                    <span class="hero-index">04</span> Say hello
                  </p>
                  <h2 class="hero-contact-title">Let's talk.</h2>
                  <div class="hero-links">
                    <a class="hero-link hero-email" href="#" rel="nofollow">
                      Email
                    </a>
                    <a class="hero-link" href="https://www.linkedin.com/in/mete-aksoy/">
                      LinkedIn
                    </a>
                    <a class="hero-link" href="https://github.com/meteaksoyy">
                      GitHub
                    </a>
                    <a class="hero-link" href="static/Mete_Aksoy_CV.pdf">
                      Résumé
                    </a>
                  </div>
                  <a class="hero-cta hero-cta--scroll" href="#read">
                    Start reading
                    <span class="hero-cta-arrow" aria-hidden="true">
                      ↓
                    </span>
                  </a>
                </div>
              </div>
            </div>

            <div class="hero-chrome" aria-hidden="true">
              <div class="hero-dots">
                {dots.map((_, i) => (
                  <span class={`hero-dot${i === 0 ? " is-active" : ""}`}></span>
                ))}
              </div>
              <div class="hero-progress">
                <span class="hero-progress-bar"></span>
              </div>
              <div class="hero-hint">
                <span class="hero-hint-label">scroll</span>
                <span class="hero-hint-line"></span>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  Hero.afterDOMLoaded = heroScript
  return Hero
}) satisfies QuartzComponentConstructor
