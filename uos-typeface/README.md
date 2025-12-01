# 서울시립대학교 서체 웹사이트

서울시립대학교 문제해결프로젝트 - 서체 프로젝트 웹사이트

## 프로젝트 구조

```
uos-typeface/
├── index.html          # 메인 HTML 파일
├── css/
│   └── style.css      # 스타일시트
├── js/
│   └── script.js      # 자바스크립트 (타이핑 인터랙션)
├── fonts/             # 서체 파일 폴더 (준비 후 추가)
└── images/            # 목업 이미지 폴더 (준비 후 추가)
```

## 설치 및 실행

1. Visual Studio Code에서 프로젝트 폴더 열기
2. Live Server 확장 프로그램 설치 (권장)
3. `index.html` 파일에서 우클릭 → "Open with Live Server"

## 서체 파일 추가하기

1. `fonts/` 폴더 생성
2. 서체 파일(.otf, .woff, .woff2) 추가
3. `css/style.css` 파일에서 다음 부분의 주석 해제:

```css
@font-face {
    font-family: 'UOS Typeface';
    src: url('../fonts/UOSTypeface.otf') format('opentype'),
         url('../fonts/UOSTypeface.woff2') format('woff2'),
         url('../fonts/UOSTypeface.woff') format('woff');
    font-weight: normal;
    font-style: normal;
}
```

4. `.typing-input` 스타일에서 font-family 주석 해제:

```css
.typing-input {
    /* ... */
    font-family: 'UOS Typeface', sans-serif;
}
```

## 목업 이미지 추가하기

1. `images/` 폴더 생성
2. 목업 이미지 파일 추가
3. `index.html`의 Gallery 섹션에서 placeholder를 실제 이미지로 교체:

```html
<div class="gallery-item">
    <img src="images/mockup-01.jpg" alt="목업 이미지 1">
</div>
```

## 다운로드 기능 활성화하기

`js/script.js` 파일에서 다운로드 버튼 관련 주석을 해제하고 파일 경로를 수정하세요.

## 주요 기능

- **타이핑 인터랙션**: 메인 화면에서 직접 타이핑 가능
- **원형 모티브 인터랙션**: 마우스를 텍스트 영역에 올리면 각 글자에 원이 나타남
- **반응형 디자인**: 모바일, 태블릿, 데스크톱 모두 지원
- **미니멀한 UI**: 깔끔하고 현대적인 디자인

## GitHub Pages 배포

1. GitHub 저장소 생성
2. 프로젝트 파일 업로드
3. Settings → Pages → Branch: main 선택
4. 배포 완료!

## 발표 팁

- 메인 화면에서 직접 타이핑하며 서체의 특징 시연
- 마우스 호버로 원형 모티브 인터랙션 보여주기
- 스크롤하며 각 섹션 설명

## 라이선스

© 2024 서울시립대학교 문제해결프로젝트
