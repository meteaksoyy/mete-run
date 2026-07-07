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

type Topic = { n: string; slug: string; title: string; blurb: string; fx: string }

const TOPICS: Topic[] = [
  {
    n: "01",
    slug: "1-Projects/",
    title: "Projects",
    blurb: "Things I've built and shipped.",
    fx: "ship",
  },
  { n: "02", slug: "2-AI/", title: "AI", blurb: "Agents, papers & the frontier.", fx: "cursor" },
  {
    n: "03",
    slug: "3-Distributed-Systems/",
    title: "Distributed Systems",
    blurb: "Consensus, replication, failure.",
    fx: "ping",
  },
  { n: "04", slug: "4-Math/", title: "Math", blurb: "Foundations worth revisiting.", fx: "math" },
  {
    n: "05",
    slug: "5-Security/",
    title: "Security",
    blurb: "Exploits, evasion & defense.",
    fx: "scramble",
  },
  { n: "06", slug: "7-Finance/", title: "Finance", blurb: "Markets, risk & money.", fx: "ticker" },
  {
    n: "07",
    slug: "6-Miscellaneous/",
    title: "Miscellaneous",
    blurb: "Everything that didn't fit.",
    fx: "glitch",
  },
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

    return (
      <section class="hero" aria-label="Introduction">
        {/* Panel 1 — intro */}
        <div class="hero-panel hero-panel--intro" role="group" aria-label="Welcome">
          <div class="hero-intro">
            <p class="hero-eyebrow hero-reveal" style="--ri:0">
              <span class="hero-mark" aria-hidden="true"></span>
              Personal wiki &amp; notebook — Delft, NL
            </p>
            <h1 class="hero-wordmark hero-reveal" style="--ri:1">
              Mete<span class="hero-accent">.</span>run
            </h1>
            <p class="hero-lede hero-reveal" style="--ri:2">
              Field notes from a software engineer —{" "}
              <span class="hero-hl">AI</span>, <span class="hero-hl">distributed systems</span>,{" "}
              <span class="hero-hl">security</span> &amp; the occasional 2&thinsp;a.m.{" "}
              <span class="hero-hl">rabbit hole</span>.
            </p>
            <div class="hero-term hero-reveal" style="--ri:3" aria-hidden="true">
              <div class="hero-term-bar">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <div class="hero-term-body">
                <p>
                  <span class="tok-cmd">whoami</span> software engineer, does things with computers
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
            <p class="hero-scrollcue hero-reveal" style="--ri:4" aria-hidden="true">
              Scroll
              <span class="hero-scrollcue-arrow">↓</span>
            </p>
          </div>
        </div>

        {/* Panel 2 — what I write about */}
        <div class="hero-panel hero-panel--topics" role="group" aria-label="Topics">
          <div class="hero-panel-inner">
            <p class="hero-kicker hero-reveal" style="--ri:0">
              <span class="hero-kicker-no">01 / 03</span> What I write about
            </p>
            <ul class="hero-index">
              {TOPICS.map((t, i) => (
                <li class="hero-reveal" style={`--ri:${i + 1}`}>
                  <a
                    class="hero-index-row internal"
                    href={`./${t.slug}`}
                    data-no-popover
                    data-fx={t.fx}
                  >
                    <span class="hero-index-no">N0.{t.n}</span>
                    <span class="hero-index-title">
                      <span class="hero-index-word" data-text={t.title}>
                        {t.title}
                      </span>
                      <span class="hero-fx" aria-hidden="true">
                        {t.fx === "ping" && (
                          <>
                            <i></i>
                            <i></i>
                            <i></i>
                          </>
                        )}
                      </span>
                    </span>
                    <span class="hero-index-blurb">{t.blurb}</span>
                    <span class="hero-index-arrow" aria-hidden="true">
                      →
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Panel 3 — featured notes */}
        <div class="hero-panel hero-panel--featured" role="group" aria-label="Recent notes">
          <div class="hero-panel-inner">
            <p class="hero-kicker hero-reveal" style="--ri:0">
              <span class="hero-kicker-no">02 / 03</span> From the notebook
            </p>
            <div class="hero-notes">
              {featured.map((page, i) => {
                const title = page.frontmatter?.title
                const tags = (page.frontmatter?.tags ?? []).slice(0, 3)
                const href = resolveRelative(fileData.slug!, page.slug!)
                return (
                  <a class="hero-note internal hero-reveal" style={`--ri:${i + 1}`} href={href}>
                    <span class="hero-note-top">
                      <span class="hero-note-no">{String(i + 1).padStart(2, "0")}</span>
                      <span class="hero-note-meta">
                        {page.dates && <Date date={getDate(cfg, page)!} locale={cfg.locale} />}
                      </span>
                    </span>
                    <span class="hero-note-title">{title}</span>
                    {page.description && <span class="hero-note-desc">{page.description}</span>}
                    <span class="hero-note-tags">
                      {tags.map((tag) => (
                        <span class="hero-note-tag">{tag}</span>
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
            <p class="hero-kicker hero-reveal" style="--ri:0">
              <span class="hero-kicker-no">03 / 03</span> Say hello
            </p>
            <h2 class="hero-contact-title hero-reveal" style="--ri:1">
              Let's talk<span class="hero-accent">.</span>
            </h2>
            <div class="hero-links hero-reveal" style="--ri:2">
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
            <a class="hero-cta hero-cta--scroll hero-reveal" style="--ri:3" href="#read">
              Start reading
              <span class="hero-cta-arrow" aria-hidden="true">
                ↓
              </span>
            </a>
          </div>
        </div>
      </section>
    )
  }

  Hero.afterDOMLoaded = heroScript
  return Hero
}) satisfies QuartzComponentConstructor
