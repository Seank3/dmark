import { useEffect, useRef, useState } from "react";
import { Link, NavLink, Navigate, Route, Routes, useLocation } from "react-router-dom";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  Copy,
  Menu,
  Play,
  X,
  Youtube,
} from "lucide-react";
import { earlyTracks, links, tracks, videos } from "./data.js";

const portrait = "/images/dmark-cutout.webp";
const navigation = [
  { label: "MY STORY", to: "/my-story" },
  { label: "MUSIC", to: "/music" },
  { label: "VIDEOS", to: "/videos" },
  { label: "SHOWS", to: "/shows" },
  { label: "HIRE ME TO SING", to: "/hire-me-to-sing" },
  { label: "NEWS", to: "/news" },
  { label: "STORE", to: "/store" },
];

function TikTokIcon({ size = 19 }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width={size} height={size} fill="currentColor">
      <path d="M16.65 2h-3.1v13.15a3.18 3.18 0 1 1-2.78-3.15V8.82a6.32 6.32 0 1 0 5.88 6.3V8.41A7.9 7.9 0 0 0 22 10V6.84A4.99 4.99 0 0 1 16.65 2Z" />
    </svg>
  );
}

function DeezerIcon({ size = 20 }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width={size} height={size} fill="currentColor">
      <path d="M2 17h4v4H2zm5 0h4v4H7zm5 0h4v4h-4zm5 0h5v4h-5zM7 12h4v4H7zm5 0h4v4h-4zm5 0h5v4h-5zm-5-5h4v4h-4zm5 0h5v4h-5zm0-5h5v4h-5z" />
    </svg>
  );
}

const socialLinks = [
  { label: "YouTube", href: links.youtube, Icon: Youtube },
  { label: "TikTok", href: links.tiktok, Icon: TikTokIcon },
  { label: "Deezer", href: links.deezer, Icon: DeezerIcon },
];

function External({ href, children, className = "", ...props }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className} {...props}>
      {children}
    </a>
  );
}

function SocialLinks({ showNames = false, className = "" }) {
  return (
    <div className={`social-links ${className}`} aria-label="D_Mark's music and social profiles">
      {socialLinks.map(({ label, href, Icon }) => (
        <External key={label} href={href} aria-label={`D_Mark on ${label}`} title={label}>
          <Icon size={19} strokeWidth={1.9} />
          {showNames && <span>{label}</span>}
        </External>
      ))}
    </div>
  );
}

function Header() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [musicOpen, setMusicOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
    setMusicOpen(false);
  }, [pathname]);
  useEffect(() => {
    if (!open) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, [open]);
  useEffect(() => {
    const onKey = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
        setMusicOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link to="/" className="brand" aria-label="D_Mark, homepage">D_MARK</Link>
        <nav className="desktop-nav" aria-label="Main navigation">
          {navigation.map(({ label, to }) => label === "MUSIC" ? (
            <div
              className="nav-music"
              key={to}
              onMouseEnter={() => setMusicOpen(true)}
              onMouseLeave={() => setMusicOpen(false)}
              onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget)) setMusicOpen(false);
              }}
            >
              <NavLink to={to} className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                {label}
              </NavLink>
              <button
                type="button"
                className="nav-chevron"
                aria-label="Music submenu"
                aria-expanded={musicOpen}
                onClick={() => setMusicOpen(true)}
              >
                <ChevronDown size={14} />
              </button>
              {musicOpen && (
                <div className="nav-submenu">
                  <Link to="/music" onClick={() => setMusicOpen(false)}>ALL MUSIC</Link>
                  <Link to="/music#singles" onClick={() => setMusicOpen(false)}>SINGLES</Link>
                </div>
              )}
            </div>
          ) : (
            <NavLink key={to} to={to} className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
              {label}
            </NavLink>
          ))}
        </nav>
        <button
          className="menu-toggle"
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X size={24} /> : <Menu size={23} />}
        </button>
      </div>
      {open && (
        <nav id="mobile-menu" className="mobile-menu" aria-label="Mobile navigation">
          <div className="mobile-menu-content">
            {navigation.map(({ label, to }, index) => (
              <NavLink key={to} to={to} onClick={() => setOpen(false)}>
                <span className="mobile-menu-index">0{index + 1}</span>
                <span>{label}</span>
                <ArrowUpRight size={18} />
              </NavLink>
            ))}
            <div className="mobile-menu-bottom">
              <span>BUSIA, UGANDA</span>
              <SocialLinks />
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}

function Pill({ to, href, children, className = "", arrow = false }) {
  const contents = <>{children}{arrow && <ArrowUpRight size={15} strokeWidth={1.8} />}</>;
  return href ? (
    <External href={href} className={`pill ${className}`}>{contents}</External>
  ) : (
    <Link to={to} className={`pill ${className}`}>{contents}</Link>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-title-row">
          <Link className="footer-brand" to="/">D_MARK</Link>
          <SocialLinks showNames />
        </div>
        <div className="footer-detail-row">
          <span>INDEPENDENT MUSIC FROM BUSIA, UGANDA.</span>
          <nav aria-label="Footer navigation">
            <Link to="/music">MUSIC</Link>
            <Link to="/my-story">MY STORY</Link>
            <Link to="/hire-me-to-sing">BOOKINGS</Link>
          </nav>
        </div>
        <div className="footer-credit-row">
          <span>© {new Date().getFullYear()} D_MARK</span>
          <span>MADE FOR THE MUSIC.</span>
        </div>
      </div>
    </footer>
  );
}

function VideoPlayer({ video }) {
  const [playing, setPlaying] = useState(false);
  const offline = Boolean(window.__DMARK_STANDALONE__);
  useEffect(() => setPlaying(false), [video.id]);
  return (
    <div className={`video-player ${playing ? "is-playing" : ""}`}>
      {playing && !offline ? (
        <iframe
          title={`${video.title} by D-Mak`}
          src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0`}
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      ) : playing ? (
        <div className="video-offline">
          <img src={video.image} alt="" />
          <div className="video-offline-message">
            <p>Video playback requires the online website.</p>
            <External href={`https://www.youtube.com/watch?v=${video.id}`} className="pill">WATCH ON YOUTUBE <ArrowUpRight size={14} /></External>
            <button type="button" onClick={() => setPlaying(false)}>BACK TO PREVIEW</button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          className="video-poster"
          onClick={() => setPlaying(true)}
          aria-label={`Play ${video.title} ${video.kind}`}
        >
          <img src={video.image} alt="" />
          <span className="poster-shade" />
          <span className="poster-top"><span className="poster-avatar">D</span><span>D-Mak — {video.title}<small>D mak music</small></span></span>
          <span className="poster-play"><Play fill="white" size={30} strokeWidth={0} /></span>
          <span className="poster-bottom">WATCH ON <Youtube size={18} fill="white" /> YOUTUBE</span>
        </button>
      )}
    </div>
  );
}

function Home() {
  const [slide, setSlide] = useState(0);
  const heroRef = useRef(null);
  const featured = tracks.slice(0, 3);
  const track = featured[slide];
  const next = () => setSlide((index) => (index + 1) % featured.length);
  const previous = () => setSlide((index) => (index + featured.length - 1) % featured.length);
  const moveHero = (event) => {
    if (!heroRef.current || window.matchMedia("(max-width: 600px), (prefers-reduced-motion: reduce)").matches) return;
    const rect = heroRef.current.getBoundingClientRect();
    heroRef.current.style.setProperty("--hero-x", `${((event.clientX - rect.left) / rect.width - 0.5) * 14}px`);
    heroRef.current.style.setProperty("--hero-y", `${((event.clientY - rect.top) / rect.height - 0.5) * 10}px`);
  };
  const resetHero = () => {
    heroRef.current?.style.setProperty("--hero-x", "0px");
    heroRef.current?.style.setProperty("--hero-y", "0px");
  };

  return (
    <main>
      <section className="hero" ref={heroRef} onPointerMove={moveHero} onPointerLeave={resetHero}>
        <div className="hero-copy">
          <h1>D_MARK</h1>
          <Pill to="/music">LISTEN TO THE MUSIC</Pill>
          <p>INDEPENDENT SOUND FROM BUSIA, UGANDA.</p>
        </div>
        <img className="hero-portrait" src={portrait} alt="D_Mark seated in an orange chair" fetchPriority="high" />
        <a className="hero-scroll" href="#latest">SCROLL TO EXPLORE <ArrowDown size={14} /></a>
        <span className="hero-side-label" aria-hidden="true">D_MARK&nbsp; / &nbsp;BUSIA, UGANDA</span>
      </section>
      <div className="home-social-strip"><SocialLinks /></div>

      <section className="home-latest content-width" id="latest">
        <div className="section-topline"><span>01 / THE SOUND</span><span>EXPLORE THE MUSIC</span></div>
        <div className="home-heading-row">
          <div><span className="small-kicker">LATEST RELEASES</span><h2>THE MUSIC.</h2></div>
          <p>A sound that starts in Busia and keeps moving. Find the latest releases from D_Mark.</p>
        </div>
        <div className="latest-feature" aria-live="polite">
          <div className="latest-cover"><img src={track.image} alt={`${track.title} cover artwork`} /></div>
          <div className="latest-information">
            <span className="small-kicker">FEATURED RELEASE &nbsp; / &nbsp; {track.date}</span>
            <h3>{track.title}</h3>
            <p>{track.type} · {track.platform}</p>
            <Pill href={track.url} arrow>LISTEN NOW</Pill>
            <div className="feature-controls">
              <button onClick={previous} type="button" aria-label="Previous release"><ArrowLeft size={21} /></button>
              <span>0{slide + 1} <span>/</span> 0{featured.length}</span>
              <button onClick={next} type="button" aria-label="Next release"><ArrowRight size={21} /></button>
            </div>
          </div>
        </div>
        <div className="latest-selector" aria-label="Choose a featured release">
          {featured.map((item, index) => (
            <button
              key={item.id}
              type="button"
              className={slide === index ? "selected" : ""}
              onClick={() => setSlide(index)}
              aria-pressed={slide === index}
            >
              <span>0{index + 1}</span>{item.title}<ArrowUpRight size={16} />
            </button>
          ))}
        </div>
        <div className="section-end-link"><Pill to="/music" arrow>ALL MUSIC</Pill></div>
      </section>

      <section className="home-videos-section" id="watch">
        <div className="content-width">
          <div className="section-topline"><span>02 / THE VISUALS</span><span>WATCH & LISTEN</span></div>
          <div className="home-heading-row"><div><span className="small-kicker">ON SCREEN</span><h2>IN MOTION.</h2></div><Pill to="/videos" arrow>ALL VIDEOS</Pill></div>
          <VideoPlayer video={videos[0]} />
          <p className="video-caption">{videos[0].title.toUpperCase()} &nbsp; / &nbsp; {videos[0].kind.toUpperCase()}</p>
        </div>
      </section>

      <section className="home-story-section content-width">
        <div className="section-topline"><span>03 / THE PERSON</span><span>FROM BUSIA, UGANDA</span></div>
        <div className="home-story-layout">
          <div className="home-story-photo"><img src={portrait} alt="D_Mark" loading="lazy" /></div>
          <div className="home-story-copy">
            <span className="small-kicker">BEHIND THE MUSIC</span>
            <h2>ROOTED HERE.<br />HEARD EVERYWHERE.</h2>
            <p>From the first songs in school to a growing catalogue of music, the story of D_Mark begins in Busia, Uganda.</p>
            <Pill to="/my-story" arrow>READ MY STORY</Pill>
          </div>
        </div>
      </section>
    </main>
  );
}

function Story() {
  return (
    <main className="story-page inner-page">
      <div className="story-wrap">
        <h1 className="page-title">MY STORY</h1>
        <div className="story-intro">
          <figure className="story-image"><img src={portrait} alt="D_Mark seated for an artist portrait" /></figure>
          <div className="story-prose">
            <p>Wandera David Musamya, known here as D_Mark and on music releases as D-Mak, is a recording artist from Busia town, Uganda. His public artist biography traces the beginning of his music to his school years in 2016.</p>
            <p>Those early recordings are part of the story. Songs including “Iye” and “Tubikole” appear in his public catalogue, and “Nkulina” has its own official lyrics video. They mark the start of a growing collection rather than a finished chapter.</p>
            <p>“Ogonda Nnyo” arrived in 2023. In 2024, the catalogue grew with “Bitandike,” “Ffe Tuliko,” and “Only You,” a collaboration credited to D-Mak and Sera Biebe. Each release is another point along a path that started at home.</p>
            <p>In 2025 came “Wadala,” “Bwotyo,” and “Naawe.” Official uploads brought some of the songs to the screen, alongside the recordings. The release artwork and videos offer another way into the music.</p>
            <p>The 2026 songs “Tombawala” and “Jimpe” continue that journey. A visualizer, official audio, and other videos can be watched on the artist’s YouTube channel, while the singles can be explored on the music page.</p>
            <p>Busia is where the story begins. The songs keep carrying it outward. This space brings together the music, the visuals, and the next updates as they happen.</p>
          </div>
        </div>
        <div className="story-prose story-more">
          <p>Explore the catalogue from the earliest listed recordings through the newest songs. Some releases are credited as D-Mak on streaming platforms, while this website uses the D_Mark name chosen for the artist.</p>
          <p>Follow the linked music and video profiles to hear the songs directly. For upcoming performances, check the shows page; confirmed dates will appear there as they are announced.</p>
        </div>
        <div className="story-actions"><Pill to="/music" arrow>EXPLORE THE MUSIC</Pill><Pill href={links.howweBusia} arrow>ARTIST PROFILE</Pill></div>
        <div className="story-early">
          <span className="small-kicker">FROM THE EARLY CATALOGUE</span>
          {earlyTracks.map((item) => <External key={item.title} href={item.url}><span>{item.title}</span><span>{item.description}</span><ArrowUpRight size={17} /></External>)}
        </div>
      </div>
    </main>
  );
}

function Music() {
  const [year, setYear] = useState("ALL");
  const { hash } = useLocation();
  useEffect(() => {
    if (hash === "#singles") document.getElementById("singles")?.scrollIntoView({ behavior: "smooth" });
  }, [hash]);
  const visible = year === "ALL" ? tracks : tracks.filter((track) => String(track.year) === year);
  return (
    <main className="music-page">
      <section className="music-lead" aria-labelledby="music-heading">
        <img src={tracks[0].image} alt="Jimpe by D-Mak official release artwork" />
        <div className="music-lead-details">
          <h1 id="music-heading">{tracks[0].title.toUpperCase()}</h1>
          <span>{tracks[0].year} &nbsp; / &nbsp; LATEST SINGLE</span>
          <Pill href={tracks[0].url}>SEE MORE</Pill>
        </div>
      </section>
      <section className="music-catalog content-width" id="singles">
        <div className="section-topline"><span>THE CATALOGUE</span><span>D-MAK / D_MARK</span></div>
        <h2 className="page-title">SINGLES & RELEASES</h2>
        <div className="music-filters" role="group" aria-label="Filter music by year">
          {["ALL", "2026", "2025", "2024", "2023"].map((item) => (
            <button type="button" key={item} className={year === item ? "selected" : ""} onClick={() => setYear(item)} aria-pressed={year === item}>{item}</button>
          ))}
        </div>
        <div className="release-grid" aria-live="polite">
          {visible.map((item) => (
            <article className="release-card" key={item.id}>
              <External href={item.url} className="release-cover"><img src={item.image} alt={`${item.title} cover artwork`} loading="lazy" /></External>
              <h3>{item.title.toUpperCase()}</h3>
              <span className="release-date">{item.year} &nbsp; / &nbsp; {item.type}</span>
              <Pill href={item.url}>SEE MORE</Pill>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

function Videos() {
  const [selected, setSelected] = useState(0);
  const featureRef = useRef(null);
  const selectVideo = (index) => {
    setSelected(index);
    featureRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  return (
    <main className="videos-page">
      <h1 className="sr-only">VIDEOS</h1>
      <section className="video-feature" ref={featureRef} aria-label="Featured video">
        <VideoPlayer key={videos[selected].id} video={videos[selected]} />
      </section>
      <section className="videos-catalog content-width">
        <div className="section-topline"><span>OFFICIAL VIDEOS</span><span>D-MAK / D_MARK</span></div>
        <h2 className="page-title">MORE VIDEOS</h2>
        <div className="video-grid">
          {videos.map((video, index) => (
            <button type="button" className={`video-item ${selected === index ? "selected" : ""}`} key={video.id} onClick={() => selectVideo(index)} aria-label={`Watch ${video.title}`} aria-pressed={selected === index}>
              <span className="video-item-image"><img src={video.image} alt="" loading="lazy" /><span className="mini-play"><Play size={18} fill="white" strokeWidth={0} /></span></span>
              <span className="video-item-bottom"><strong>{video.title}</strong><span>{video.kind} / {video.year}</span></span>
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}

function Shows() {
  return (
    <main className="shows-page inner-page">
      <div className="content-width">
        <h1 className="page-title">UPCOMING EVENTS</h1>
        <div className="shows-main">
          <div className="shows-art"><img src={portrait} alt="D_Mark" /></div>
          <div className="shows-message"><span className="small-kicker">LIVE WITH D_MARK</span><h2>SEE YOU<br />SOON.</h2><p>There are no confirmed upcoming dates to announce right now. When there’s a show, you’ll find it here first.</p><Pill to="/hire-me-to-sing" arrow>BOOK AN ENQUIRY</Pill></div>
        </div>
        <div className="past-performances"><h2 className="page-title">PAST PERFORMANCES</h2><p>We’ll add a show archive when confirmed performance details are available.</p></div>
      </div>
    </main>
  );
}

function Booking() {
  const [draft, setDraft] = useState("");
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const draftRef = useRef(null);
  const formRef = useRef(null);
  const prepare = (element) => {
    if (!element?.reportValidity()) return;
    const form = new FormData(element);
    const message = `Booking enquiry for D_Mark\n\nName: ${String(form.get("name")).trim()}\nEmail: ${String(form.get("email")).trim()}\n\nMessage:\n${String(form.get("message")).trim()}`;
    setDraft(message);
    setCopied(false);
    setCopyError(false);
    window.setTimeout(() => draftRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }), 50);
  };
  const submit = (event) => { event.preventDefault(); prepare(event.currentTarget); };
  const copy = async () => {
    try {
      if (!navigator.clipboard?.writeText) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(draft);
      setCopied(true);
      setCopyError(false);
    } catch {
      setCopyError(true);
      draftRef.current?.select();
    }
  };
  return (
    <main className="booking-page">
      <div className="booking-grid">
        <aside className="booking-info">
          <h1>HIRE ME TO SING</h1>
          <p>For bookings and inquiries, tell us about your event.</p>
          <div className="booking-info-bottom"><span>01 &nbsp; / &nbsp; LIVE MUSIC</span><span>02 &nbsp; / &nbsp; SPECIAL EVENTS</span><span>03 &nbsp; / &nbsp; COLLABORATIONS</span></div>
          <p className="booking-location">BASED IN BUSIA, UGANDA</p>
        </aside>
        <div className="booking-form-wrap">
          <img className="booking-watermark" src={portrait} alt="" aria-hidden="true" />
          <form
            ref={formRef}
            className="booking-form"
            onSubmit={submit}
            onKeyDown={(event) => {
              if (window.__DMARK_STANDALONE__ && event.key === "Enter" && event.target.tagName !== "TEXTAREA") {
                event.preventDefault();
                prepare(event.currentTarget);
              }
            }}
          >
            <label htmlFor="booking-name">Name</label><input id="booking-name" name="name" placeholder="Name" autoComplete="name" required />
            <label htmlFor="booking-email">Email</label><input id="booking-email" name="email" type="email" placeholder="Email" autoComplete="email" required />
            <label htmlFor="booking-message">Message</label><textarea id="booking-message" name="message" placeholder="Tell us about your event" required rows="5" />
            <button type="button" className="pill booking-submit" onClick={() => prepare(formRef.current)}>PREPARE MESSAGE <ArrowRight size={15} /></button>
            <p className="booking-disclaimer">This prepares a message for you to copy. It does not send an enquiry; a verified booking address has not been provided.</p>
          </form>
          {draft && <div className="draft-panel"><h2>YOUR ENQUIRY IS READY</h2><p>Copy and save this text. No message has been sent.</p><textarea readOnly ref={draftRef} value={draft} aria-label="Prepared booking enquiry" rows={7} /><button type="button" className="pill" onClick={copy}>{copied ? <Check size={16} /> : <Copy size={16} />}{copied ? "COPIED" : "COPY MESSAGE"}</button>{copyError && <p>Select and copy the text above manually.</p>}</div>}
        </div>
      </div>
    </main>
  );
}

const updates = [
  { title: "JIMPE — OFFICIAL AUDIO", date: "5 NOVEMBER 2026", image: "/images/cover-jimpe.jpg", href: tracks[0].url, description: "Listen to the newest release." },
  { title: "TOMBAWALA — VISUALIZER", date: "SEPTEMBER 2026", image: "/images/cover-tombawala.jpg", href: "https://www.youtube.com/watch?v=_n7Tj7DuiAY", description: "Watch the official visualizer." },
  { title: "NAAWE — SINGLE", date: "27 NOVEMBER 2025", image: "/images/cover-naawe.jpg", href: tracks[2].url, description: "Hear the single on Deezer." },
];

function News() {
  return (
    <main className="news-page inner-page">
      <div className="content-width"><h1 className="page-title">NEWS</h1><p className="news-intro">Releases and updates from the music. Each story below links to the original release.</p>
        <div className="news-grid">{updates.map((item) => <article className="news-card" key={item.title}><External href={item.href}><img src={item.image} alt="" loading="lazy" /><h2>{item.title}</h2></External><time>{item.date}</time><p>{item.description}</p><External className="news-more" href={item.href}>EXPLORE RELEASE <ArrowUpRight size={16} /></External></article>)}</div>
      </div>
    </main>
  );
}

function Store() {
  return (
    <main className="store-page"><div><span className="small-kicker">D_MARK / OFFICIAL</span><h1>OFFICIAL STORE</h1><p>COMING SOON.</p><span className="store-note">Nothing for sale just yet. Stay close to the music.</span><Pill to="/music" arrow>LISTEN WHILE YOU WAIT</Pill></div></main>
  );
}

function NotFound() {
  return <main className="store-page"><div><h1>PAGE NOT FOUND</h1><p>LET'S FIND THE MUSIC.</p><Pill to="/">BACK HOME</Pill></div></main>;
}

export default function App() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    const page = navigation.find((item) => item.to === pathname);
    document.title = `${page ? `${page.label} | ` : ""}D_Mark — Music from Busia, Uganda`;
  }, [pathname]);
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/my-story" element={<Story />} />
        <Route path="/story" element={<Navigate to="/my-story" replace />} />
        <Route path="/music" element={<Music />} />
        <Route path="/videos" element={<Videos />} />
        <Route path="/shows" element={<Shows />} />
        <Route path="/hire-me-to-sing" element={<Booking />} />
        <Route path="/contact" element={<Navigate to="/hire-me-to-sing" replace />} />
        <Route path="/news" element={<News />} />
        <Route path="/store" element={<Store />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </>
  );
}
