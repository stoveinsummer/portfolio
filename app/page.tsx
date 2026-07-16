const projects = [
  {
    index: "01",
    title: "Frame Index",
    type: "Personal archive · 2026",
    description:
      "사진을 장소보다 빛과 온도로 다시 찾을 수 있게 만든 개인 이미지 아카이브.",
    stack: "Next.js · TypeScript · Cloudflare R2",
    image:
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1800&q=88",
  },
  {
    index: "02",
    title: "Night Bus",
    type: "Photo series · Seoul",
    description:
      "늦은 귀가길, 창문과 간판 사이에 잠깐 생겼다가 사라지는 색을 기록합니다.",
    stack: "35mm · Digital · Ongoing",
    image:
      "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1800&q=88",
  },
  {
    index: "03",
    title: "Quiet Deploy",
    type: "Developer tool · 2025",
    description:
      "작은 팀을 위한 배포 상태 보드. 중요한 변화만 조용하고 명확하게 전달합니다.",
    stack: "React · Workers · WebSockets",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1800&q=88",
  },
];

export default function Home() {
  return (
    <main>
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="홈으로 이동">
          YOUR NAME<span className="wordmark-dot">.</span>
        </a>
        <nav aria-label="주요 메뉴">
          <a href="#work">Work</a>
          <a href="#notes">Notes</a>
          <a href="#about">About</a>
          <a href="https://github.com/" target="_blank" rel="noreferrer">GitHub ↗</a>
        </nav>
      </header>

      <section className="hero" id="top">
        <div className="hero-kicker">Developer &amp; photographer · Seoul</div>
        <h1>
          I build useful things
          <span>and notice quiet ones.</span>
        </h1>
        <div className="hero-bottom">
          <p>
            코드로 도구와 경험을 만들고, 카메라로 그 사이의 장면을 기록합니다.
            이곳은 완성된 결과보다 계속 진행 중인 관심사를 모아두는 작업실입니다.
          </p>
          <a className="circle-link" href="#work" aria-label="선택 작업 보기">↓</a>
        </div>
      </section>

      <section className="feature-image" aria-label="대표 사진">
        <div className="image-caption">
          <span>Field note 024</span>
          <span>37.5665° N, 126.9780° E</span>
        </div>
      </section>

      <section className="work" id="work">
        <div className="section-head">
          <h2>Selected work</h2>
          <span>2024—2026</span>
        </div>
        {projects.map((project) => (
          <article className="project" key={project.index}>
            <div className="project-image" style={{ backgroundImage: `url(${project.image})` }}>
              <span>{project.index}</span>
            </div>
            <div className="project-copy">
              <div>
                <p className="eyebrow">{project.type}</p>
                <h3>{project.title}</h3>
              </div>
              <div className="project-detail">
                <p>{project.description}</p>
                <span>{project.stack}</span>
                <a href="https://github.com/" target="_blank" rel="noreferrer">View project ↗</a>
              </div>
            </div>
          </article>
        ))}
      </section>

      <section className="notes" id="notes">
        <div className="section-head light">
          <h2>Recent notes</h2>
          <span>생각, 기록, 시행착오</span>
        </div>
        <a className="note" href="#note-1">
          <span>2026.06.18</span><h3>좋은 도구는 조용하다</h3><em>4 min read ↗</em>
        </a>
        <a className="note" href="#note-2">
          <span>2026.05.02</span><h3>비 오는 밤을 찍는 방법</h3><em>Photo note ↗</em>
        </a>
        <a className="note" href="#note-3">
          <span>2026.03.27</span><h3>작은 서비스를 오래 운영하며 배운 것</h3><em>7 min read ↗</em>
        </a>
      </section>

      <section className="about" id="about">
        <p className="eyebrow">About this place</p>
        <div>
          <h2>만들고, 관찰하고,<br />기록합니다.</h2>
          <div className="about-copy">
            <p>
              낮에는 제품과 시스템을 만드는 개발자입니다. 화면 너머의 세계를 더 잘
              이해하고 싶어 사진을 찍기 시작했습니다. 기술과 시각 언어가 만나는 지점을
              오래 탐구하고 있습니다.
            </p>
            <p>
              새로운 프로젝트, 협업, 사진 산책에 열려 있습니다.
              <a href="mailto:hello@example.com">hello@example.com ↗</a>
            </p>
          </div>
        </div>
      </section>

      <footer>
        <span>© 2026 YOUR NAME</span>
        <span>Built with care in Seoul</span>
        <a href="#top">Back to top ↑</a>
      </footer>
    </main>
  );
}
