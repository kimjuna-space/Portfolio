import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import "./figma-overrides.css";

const A = "/assets/";
const routes = {
  work: "#/portfolio-1",
  pv5: "#/portfolio-2",
  vr: "#/portfolio-3",
};
function useRoute() {
  const read = () => location.hash.replace("#/", "") || "portfolio-1";
  const [route, setRoute] = useState(read);
  useEffect(() => {
    const f = () => setRoute(read());
    addEventListener("hashchange", f);
    return () => removeEventListener("hashchange", f);
  }, []);
  return route;
}
function useInertialScroll() {
  useEffect(() => {
    if (matchMedia("(pointer: coarse)").matches) return undefined;
    let current = scrollY,
      target = current,
      frame = 0,
      programmatic = false;
    const limit = () =>
      Math.max(0, document.documentElement.scrollHeight - innerHeight);
    const tick = () => {
      current += (target - current) * 0.105;
      if (Math.abs(target - current) < 0.25) {
        current = target;
        scrollTo(0, current);
        frame = 0;
        return;
      }
      programmatic = true;
      scrollTo(0, current);
      programmatic = false;
      frame = requestAnimationFrame(tick);
    };
    const wheel = (event) => {
      if (event.ctrlKey) return;
      event.preventDefault();
      target = Math.min(limit(), Math.max(0, target + event.deltaY));
      if (!frame) frame = requestAnimationFrame(tick);
    };
    const sync = () => {
      if (!programmatic && !frame) current = target = scrollY;
    };
    addEventListener("wheel", wheel, { passive: false });
    addEventListener("scroll", sync, { passive: true });
    return () => {
      removeEventListener("wheel", wheel);
      removeEventListener("scroll", sync);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);
}
function Header() {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    let previous = scrollY,
      ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const current = scrollY,
          delta = current - previous;
        if (current < 24) setVisible(true);
        else if (Math.abs(delta) > 2) setVisible(delta < 0);
        previous = current;
        ticking = false;
      });
    };
    addEventListener("scroll", onScroll, { passive: true });
    return () => removeEventListener("scroll", onScroll);
  }, []);
  const go = (id) => (e) => {
    e.preventDefault();
    if (location.hash !== routes.work) {
      location.hash = routes.work;
      setTimeout(() => document.getElementById(id)?.scrollIntoView(), 20);
    } else document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <header className={`header ${visible ? "" : "header-hidden"}`}>
      <a href={routes.work}>KIM JUNA</a>
      <nav>
        <a href={routes.work}>Work</a>
        <a href="#archive" onClick={go("archive")}>
          Archive
        </a>
        <a href="#contact" onClick={go("contact")}>
          Contact
        </a>
      </nav>
    </header>
  );
}
function Program({ tone, children }) {
  return <span className={`program ${tone}`}>{children}</span>;
}
function Feature({ kind }) {
  const pv5 = kind === "pv5";
  return (
    <section className={`feature ${kind}`}>
      {pv5 && (
        <div className="identity">
          <span>입체적 발상으로 다채로운 공간 경험을 만듭니다.</span>
          <span>전시 · 팝업 공간디자인</span>
        </div>
      )}
      <div className="feature-grid">
        {pv5 && (
          <figure>
            <img src={A + "home-pv5-table.webp"} />
            <figcaption>
              01 / PLEV · KIA PV5 기반 소형 모빌리티 운송 서비스
            </figcaption>
          </figure>
        )}
        <div className="feature-copy">
          <p className="micro">
            {pv5
              ? "EXHIBITION / DIGITAL EXPERIENCE"
              : "VIRTUAL EXHIBITION / SPATIAL STUDY"}
          </p>
          <h1>{pv5 ? "PLEV" : "Layers of Light"}</h1>
          <b>
            {pv5
              ? "모빌리티 서비스의 디지털 접점과 전시 경험"
              : "VR 공간 콘셉트 전시"}
          </b>
          <p>
            {pv5 ? (
              "개인 담당 · 웹 구현 100% / 아이디어 논의 참여"
            ) : (
              <>
                빛·투과도·시점의 변화를 관찰하는 전시
                <br />
                공간 구성 · 재질 표현 · 탐색 흐름
              </>
            )}
          </p>
          <p className="tools">
            프로그램&nbsp;&nbsp;
            {pv5 ? (
              <Program tone="react">React</Program>
            ) : (
              <>
                <Program tone="blender">Blender</Program>{" "}
                <Program tone="unity">Unity 3D</Program>
              </>
            )}
          </p>
          {!pv5 && <small>사용 장비&nbsp;&nbsp;Meta Quest 3</small>}
          <a href={pv5 ? routes.pv5 : routes.vr}>프로젝트 보기 ↗</a>
        </div>
        {!pv5 && (
          <figure>
            <img src={A + "home-vr-architecture.webp"} />
            <figcaption>02 / Layers of Light · VR 공간 전시</figcaption>
          </figure>
        )}
      </div>
    </section>
  );
}
const studies = [
  [
    "01",
    "CNC Truck Prototype",
    "부품 도면부터 가공·조립까지 직접 검토하며 구조와 제작 가능성을 확인한 실물 제작 기록",
    <>
      <Program tone="solid">SolidWorks</Program>{" "}
      <Program tone="cad">AutoCAD</Program>
    </>,
    "CNC 밀링 · 선반",
    ["cnc-mockup-wide.webp", "cnc-process-wide.webp", "cnc-result-wide.webp"],
  ],
  [
    "02",
    "Product Reverse Engineering",
    "실제 제품을 분해·실측해 형태와 결합 관계를 3D 모델과 부품 도면으로 재구성한 작업",
    <>
      <Program tone="solid">SolidWorks</Program>{" "}
      <Program tone="cad">AutoCAD</Program>
    </>,
    "실측 · 3D 모델링 · 부품 도면",
    ["reverse-model-a-wide.webp", "reverse-model-b-wide.webp", "reverse-drawing-wide.webp"],
  ],
  [
    "03",
    "Sand Art Clock",
    "모래의 질감과 흐름을 재료·디테일의 언어로 해석한 공간 제품 콘셉트",
    <>
      <Program tone="rhino">Rhino</Program>{" "}
      <Program tone="keyshot">KeyShot</Program>
    </>,
    "제품 모델링 · 렌더링",
    ["clock-render.webp", "clock-detail.webp", "clock-board.webp"],
  ],
  [
    "04",
    "Blender Spatial Studies",
    "실내와 야외 장면을 모델링하며 빛·재질·시점에 따라 달라지는 공간 인지를 탐구",
    <Program tone="blender">Blender</Program>,
    "3D 모델링 · 재질 · 조명",
    ["blender-house.webp", "blender-outdoor.webp"],
  ],
];
function Archive() {
  return (
    <section id="archive" className="archive">
      <div className="label">
        <h2>STUDIES IN MAKING</h2>
        <p>구조 · 재료 · 제작의 기록</p>
      </div>
      {studies.map(([n, title, desc, tools, equipment, imgs]) => (
        <article key={title}>
          <div>
            <p className="micro">{n}</p>
            <h3>{title}</h3>
            <p>{desc}</p>
            <p className="tools">프로그램&nbsp;&nbsp;{tools}</p>
            <p className="equipment">사용 장비&nbsp;&nbsp;{equipment}</p>
          </div>
          <div className="study-images">
            {imgs.map((x) => (
              <figure className="study-frame" key={x}>
                <img src={A + x} />
              </figure>
            ))}
          </div>
        </article>
      ))}
    </section>
  );
}
function Footer() {
  return (
    <footer id="contact">
      <div>
        <h2>김준아 / KIM JUNA</h2>
        <p>
          다양한 경험을 바탕으로 유연하게 발상하고, 아이디어를 실체적인 공간으로
          구현합니다.
          <br />
          매체의 경계에 갇히지 않는 넓은 시선으로, 사람들의 기억에 오랫동안
          머무는 다채로운 공간 경험을 만들어가겠습니다.
        </p>
        <a href="mailto:wnsdk3222@gmail.com">wnsdk3222@gmail.com</a>
        <a href="tel:01087363221">010 8736 3221</a>
        <a
          href="https://github.com/kimjuna-space"
          target="_blank"
          rel="noreferrer"
        >
          github.com/kimjuna-space ↗
        </a>
      </div>
      <div>
        <b>Education</b>
        <p>
          KUAD DMD
          <br />
          디지털미디어디자인과 졸업 예정
        </p>
        <p>
          KOREATECH IDE
          <br />
          디자인공학과 수료
        </p>
        <p>상일여자고등학교 졸업</p>
      </div>
      <div>
        <b>Documents</b>
        <a href={`${A}resume.webp`} target="_blank" rel="noreferrer">
          이력서 바로가기 ↗
        </a>
        <a href={`${A}self-introduction.pdf`} target="_blank" rel="noreferrer">
          자기소개서 ↗
        </a>
      </div>
    </footer>
  );
}
function Intro({ vr = false }) {
  return (
    <section className="intro">
      <p className="micro">
        {vr
          ? "PROJECT 02 / VIRTUAL EXHIBITION · SPATIAL CONCEPT"
          : "PROJECT 01 / EXHIBITION · DIGITAL EXPERIENCE"}
      </p>
      <div className="intro-grid">
        <div>
          <h1>{vr ? "Layers of Light" : "PLEV"}</h1>
          <h2>
            {vr
              ? "빛의 경계를 따라 탐색하는 VR 공간 전시"
              : "KIA PV5 기반 소형 모빌리티 운송 서비스"}
          </h2>
          <p>
            {vr
              ? "빛·투과도·시점에 따른 공간 인지의 변화를 탐색하는 전시."
              : "사고·고장 접수부터 현장 대응과 정비소 인계까지 연결하는 서비스."}
          </p>
        </div>
        <div className="facts">
          {vr ? (
            <>
              <p>유형&nbsp;&nbsp;VR 공간 콘셉트</p>
              <p>구성&nbsp;&nbsp;공간 계획 · 재질 표현 · 탐색 흐름</p>
              <p>관찰 대상&nbsp;&nbsp;빛 · 투과도 · 시점</p>
            </>
          ) : (
            <>
              <p>
                팀 6명
                <br />
                UI 디자인 2 · 영상·모션 디자인 2<br />
                기획 1 · 프로그래밍 1
              </p>
              <p>개인 담당&nbsp;&nbsp;웹 구현 100%</p>
              <p>공동 참여&nbsp;&nbsp;아이디어 논의 · 전시 구성</p>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
function Split({ title, sub, children }) {
  return (
    <section className="split">
      <div>
        <h2>{title}</h2>
        <h3>{sub}</h3>
      </div>
      <div>{children}</div>
    </section>
  );
}
function PV5() {
  return (
    <>
      <Header />
      <main className="detail">
        <Intro />
        <figure className="hero">
          <img src={A + "pv5-hero.webp"} />
          <figcaption>01 / 전시 전경</figcaption>
        </figure>
        <Split
          title={
            <>
              L-shaped walls.
              <br />One clear sequence.
            </>
          }
          sub="제한된 전시 공간에서 서비스를 어떻게 순서대로 읽힐까?"
        >
          <p>
            정면 3000 × 2400mm와 측면 1000 × 2400mm의 ㄱ자 가벽, 1500 ×
            600mm 테이블을 하나의 정보 구조로 구성했습니다.
          </p>
          <p>
            보행 동선보다 시선의 흐름에 집중했습니다. 정면에서 브랜드와 서비스의
            맥락을 먼저 읽고, 테이블 위 디스플레이에서 서비스 단계를 이어서
            탐색하도록 설계했습니다.
          </p>
        </Split>
        <section className="composition">
          <h3>Spatial composition</h3>
          <div className="composition-grid">
            <div className="elevation">
              <p>
                FRONT / SIDE ELEVATION <span>3000W × 2400H + 1000W × 2400H</span>
              </p>
              <div className="wall">
                PLEV
                <i>
                  32” STANBYME
                  <br />
                  BRAND FILM
                </i>
                <strong>
                  30” iMAC
                  <br />
                  SERVICE WEB
                </strong>
              </div>
              <div className="table">
                <i>GOODS</i>
                <b>SERVICE FLOW</b>
                <em>
                  iPad
                  <br />
                  KIOSK
                </em>
                <em>
                  iPhone 17
                  <br />
                  MOBILE
                </em>
                <em>
                  27”
                  <br />
                  DESKTOP
                </em>
              </div>
              <p>01 / 브랜드 인지　　02 / 서비스 이해　　03 / 화면 탐색</p>
            </div>
            <div>
              <h3>역할별로 분리한 가벽과 테이블</h3>
              <p>
                정면 가벽은 멀리서 브랜드와 서비스 전체를 읽는 영역으로, 측면
                가벽은 서비스 흐름을 정리하는 영역으로 구분했습니다. 테이블 위
                화면은 관람객이 가까이에서 각 사용 장면을 비교하도록 배치했습니다.
              </p>
              <div className="display-specs">
                <p>
                  <b>01</b> 스탠바이미 32인치 · 브랜드 필름
                </p>
                <p>
                  <b>02</b> iMac 30인치 · 서비스 웹
                </p>
                <p>
                  <b>03</b> iPad · 키오스크 UI
                </p>
                <p>
                  <b>04</b> iPhone 17 · 모바일 UI
                </p>
                <p>
                  <b>05</b> 데스크톱 모니터 27인치 · 정비소 UI
                </p>
              </div>
            </div>
          </div>
        </section>
        <figure className="exhibition-visual">
          <img src={A + "pv5-exhibition-visual-compact.webp"} />
          <figcaption>
            02 / 전시 구성 시각화 · 정면 3000W × 2400H, 측면 1000W × 2400H의
            ㄱ자 가벽과 1500W × 600D 테이블
          </figcaption>
        </figure>
        <section className="sequence">
          <h3>브랜드에서 서비스 사용 장면까지</h3>
          <div>
            <ol>
              <li>
                <b>01 / 주목</b>
                <p>
                  브랜드 영상
                  <br />
                  스탠바이미 32인치의 브랜드 필름으로 전시의 주제와 분위기를
                  먼저 인지하는 진입점
                </p>
              </li>
              <li>
                <b>02 / 이해</b>
                <p>
                  서비스 웹<br />
                  iMac 30인치에서 서비스의 전체 흐름과 각 단계의 관계를 읽는
                  중심 화면
                </p>
              </li>
              <li>
                <b>03 / 탐색</b>
                <p>
                  모바일 · 키오스크 · 데스크톱 UI
                  <br />
                  iPhone 17, iPad, 27인치 모니터에서 접수부터 현장 대응, 정비
                  인계까지의 사용 장면을 이어서 확인하는 영역
                </p>
              </li>
            </ol>
            <figure className="sequence-image">
              <img src={A + "pv5-service-devices.webp"} />
            </figure>
          </div>
          <p className="sequence-caption">
            03 / 디지털 접점 구조 · 모바일 접수 → 키오스크 대응 → 정비소 관리
          </p>
        </section>
        <section className="web-build">
          <div>
            <p className="micro">WEB IMPLEMENTATION</p>
            <h2>Interaction without conflict.</h2>
            <p className="web-lead">
              PLEV의 서비스 웹에서는 사용자가 내용을 끊기지 않고 읽을 수 있도록,
              전체 페이지 이동과 이미지 탐색의 동작을 분리해 구현했습니다.
            </p>
            <a
              className="project-link"
              href="https://plev.info"
              target="_blank"
              rel="noreferrer"
            >
              PLEV 웹사이트 보기 ↗
            </a>
          </div>
          <ol>
            <li>
              <p className="micro">PROBLEM</p>
              <h3>페이지 이동과 이미지 탐색이 충돌</h3>
              <p>
                관성 스크롤과 섹션별 이미지 전환이 동시에 반응하면서, 화면을
                살펴보는 중에도 페이지가 움직여 탐색 흐름이 끊기는 문제가
                있었습니다.
              </p>
            </li>
            <li>
              <p className="micro">SOLUTION</p>
              <h3>뷰포트 안에서만 이미지 전환</h3>
              <p>
                이미지 섹션이 화면 안에 충분히 들어온 상태에서 마우스를 올린
                경우에만 이미지 전환을 작동시켰습니다. 그 외에는 전체 페이지
                스크롤이 자연스럽게 이어지도록 조건을 분리했습니다.
              </p>
            </li>
            <li>
              <p className="micro">RESULT</p>
              <h3>한 번에 하나의 탐색에 집중</h3>
              <p>
                사용자는 스크롤로 페이지를 이동하고, 필요한 순간에만 이미지
                전환으로 내용을 확인할 수 있게 됐습니다. 두 인터랙션이 서로
                간섭하지 않아 화면 탐색의 리듬이 안정됐습니다.
              </p>
            </li>
          </ol>
        </section>
      </main>
      <Footer />
    </>
  );
}
function VR() {
  return (
    <>
      <Header />
      <main className="detail vr-detail">
        <Intro vr />
        <figure className="hero">
          <img src={A + "vr-hero.webp"} />
          <figcaption>
            01 / 입구에서 중심 전시와 다음 공간을 함께 바라보는 장면
          </figcaption>
        </figure>
        <Split
          title={
            <>
              Reveal,
              <br />
              not all at once.
            </>
          }
          sub="한 번에 다 보여주지 않는 공간"
        >
          <p>
            빛과 경계에 따라 공간이 다르게 읽히는 과정을 관찰하는 VR 전시입니다.
            커튼, 중심 오브젝트와 원형 개구부가 세 가지 관찰 장면을 만듭니다.
          </p>
          <p>
            대상을 일부만 발견하고, 여러 방향에서 살펴본 뒤, 프레임 너머의 밝은
            공간으로 이동하는 순서로 전시를 탐색하도록 구성했습니다.
          </p>
        </Split>
        <section className="route">
          <h3>발견 → 집중 → 전환으로 이어지는 공간 구성</h3>
          <div>
            <div className="plan">
              <i>01 / 발견</i>
              <i>02 / 집중</i>
              <i>03 / 전환</i>
            </div>
            <div>
              <h4>01 / 발견</h4>
              <p>
                커튼 너머로 대상을 일부만 먼저 보게 해 다음 공간을 스스로
                찾아보도록 구성했습니다.
              </p>
              <h4>02 / 집중</h4>
              <p>
                중심 오브젝트 주변을 이동하며 시점에 따라 달라지는 형태와 재질을
                관찰합니다.
              </p>
              <h4>03 / 전환</h4>
              <p>
                원형 개구부 너머의 밝은 공간으로 이동하며 빛과 경계의 변화를
                비교하도록 구성했습니다.
              </p>
            </div>
          </div>
        </section>
        <figure className="wide">
          <img src={A + "vr-experience.webp"} />
          <figcaption>
            02 / 원형 개구부 너머로 다음 장면을 예고하는 시점
          </figcaption>
        </figure>
        <Split
          title={
            <>
              A frame for
              <br />
              the next scene.
            </>
          }
          sub="다음 장면을 인지하게 하는 프레임"
        >
          <p>
            원형 개구부를 단순한 장식이 아니라 다음 공간을 인지하게 하는
            프레임으로 사용했습니다. 입구에서 보였던 중심 오브젝트를 다른
            시점으로 다시 만나도록 구성했습니다.
          </p>
        </Split>
        <section className="material">
          <figure>
            <img src={A + "vr-detail.webp"} />
            <figcaption>03 / 커튼의 투과성과 단단한 개구부의 대비</figcaption>
          </figure>
          <div>
            <h2>
              Soft boundaries.
              <br />
              Clear focus.
            </h2>
            <h3>경계는 부드럽게, 시선은 명확하게</h3>
            <p>
              반투명한 그린 패브릭은 시야를 완전히 막지 않으면서 공간을
              나눕니다. 무채색 바닥과 벽은 배경으로 물러나 중심 오브젝트와 빛의
              변화가 먼저 읽히도록 했습니다.
            </p>
            <div className="swatches">
              <span>Fabric</span>
              <span>Concrete</span>
              <span>Off-white</span>
              <span>Metal</span>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
function Home() {
  return (
    <>
      <Header />
      <main>
        <Feature kind="pv5" />
        <Feature kind="vr" />
        <Archive />
      </main>
      <Footer />
    </>
  );
}
function App() {
  useInertialScroll();
  const r = useRoute();
  return r === "portfolio-2" ? (
    <PV5 />
  ) : r === "portfolio-3" ? (
    <VR />
  ) : (
    <Home />
  );
}
createRoot(document.getElementById("root")).render(<App />);
