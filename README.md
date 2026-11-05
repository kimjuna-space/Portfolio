# Kim Juna React Portfolio

VMD / Exhibition / Popup Experience Design 방향의 React 포트폴리오 페이지입니다.

## 실행 방법

가장 쉬운 방법:

```bash
open-portfolio.bat 더블클릭
```

직접 개발 서버로 실행하려면:

```bash
npm install
npm run dev
```

브라우저에서 Vite가 안내하는 주소로 접속하면 됩니다.

## 구성

- React + Vite
- Framer Motion
- SUIT 웹폰트 적용
- 이미지 영역은 실제 이미지 삽입 전용 플레이스홀더로 구성

## 이미지 교체 위치

현재 페이지 안의 `IMAGE`, `MAIN VISUAL` 영역은 실제 포트폴리오 사진을 넣기 전의 자리입니다.
사진을 넣을 때는 `src/main.jsx`의 각 프로젝트 `image` 텍스트와 `image-placeholder` 영역을 실제 `<img />` 태그로 교체하면 됩니다.
