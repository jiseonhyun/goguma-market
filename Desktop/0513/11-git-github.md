# Git과 GitHub.

> CHAPTER 11 / 27 · PART 3 고구마마켓 · 예상 시간 40분

---

## 왜 코드를 저장하는 것만으로는 부족한가?

여러분은 지금까지 코드를 내 PC에서만 작업했습니다.  
Ctrl+S로 파일을 저장하면 되는 거 아닌가?

왜 추가적인 도구가 필요할까요?

### 문제 1: 되돌리기가 안 됩니다
어제까지 잘 돌아가던 코드를 오늘 수정했는데 망가졌습니다.  
Ctrl+Z를 미친 듯이 눌러도 어제 상태로 돌아갈 수 없습니다.

### 문제 2: PC가 고장 나면 끝입니다
SSD가 갑자기 죽으면? 커피를 쏟으면? 코드가 내 PC에만 있으면 모든 게 사라집니다.

### 문제 3: 배포하려면 코드가 인터넷에 있어야 합니다
앞으로 만들 고구마마켓을 인터넷에 배포하려면, 코드를 클라우드에 올려야 합니다.

---

## Git과 GitHub — 게임의 세이브 포인트

RPG 게임을 해본 적 있나요?

- **Git** = 게임 내 세이브 포인트 기능. 언제든 저장하고, 원하는 시점으로 되돌릴 수 있습니다.
- **GitHub** = 세이브 데이터를 클라우드에 백업하는 것. PC가 망가져도 다른 기기에서 이어할 수 있습니다.

| | Git | GitHub |
|---|---|---|
| **역할** | 코드 변경 기록을 관리 | Git 기록을 인터넷에 저장 |
| **위치** | 내 PC에서 동작 | 웹사이트 (github.com) |
| **비유** | 게임 세이브 기능 | 클라우드 세이브 백업 |
| **필요성** | 되돌리기, 변경 추적 | 백업, 협업, 배포 |

> **핵심: Git으로 저장하고, GitHub에 백업한다.**

---

## Git 설치 확인

챕터 02에서 이미 Git을 설치했습니다.  
터미널(PowerShell)에서 아래 명령어로 확인합니다:

```
git --version
```

`git version 2.xx.x` 같은 결과가 나오면 설치된 것입니다.

### 안 나오면?

1. https://git-scm.com 에서 Download for Windows 클릭
2. 설치 시 모든 옵션 기본값으로 진행
3. PowerShell을 새로 열고 다시 확인

---

## Git 기본 설정

Git을 처음 사용하면 이름과 이메일을 등록해야 합니다.  
이 정보는 **누가 이 코드를 저장했는지** 기록하는 용도입니다.

```
git config --global user.name "홍길동"
git config --global user.email "hong@example.com"
```

이름과 이메일은 자유롭게 적으면 됩니다.  
나중에 GitHub에서 보이는 이름이니, 본인이 알아볼 수 있는 걸로 하세요.

### 확인

```
git config --global user.name
git config --global user.email
```

본인이 입력한 값이 나오면 성공입니다.

---

## Git의 핵심 개념 4가지

사실 클코가 Git 명령어를 전부 대신 쳐주지만, 의미는 알아두면 대화할 때 편합니다.

택배 보내기에 비유해볼게요:

| 단계 | Git 명령어 | 비유 | 설명 |
|---|---|---|---|
| 1 | `git init` | 택배 상자 준비 | 이 폴더를 Git으로 관리하겠다고 선언 |
| 2 | `git add .` | 물건 담기 | 변경된 파일들을 "보낼 준비" |
| 3 | `git commit` | 포장 + 송장 붙이기 | 변경 내용을 메시지와 함께 기록 |
| 4 | `git push` | 택배 발송 | GitHub에 업로드 |

```
작업 → add(담기) → commit(포장) → push(발송)
```

이 흐름을 외울 필요 없습니다. 클코가 알아서 해줍니다.  
다만 클코가 "커밋하겠습니다", "푸시하겠습니다" 할 때 무슨 뜻인지 알면 됩니다.

---

## GitHub 계정 만들기

이미 계정이 있으면 건너뛰세요.

### 1단계: 가입

1. https://github.com 에 접속합니다
2. Sign up 클릭
3. 이메일, 비밀번호, 사용자명 입력
4. 이메일 인증 완료

### 2단계: 사용자명 고르기

사용자명은 프로필 주소가 됩니다 (`github.com/사용자명`).  
짧고 기억하기 쉬운 영문으로 만드세요.

> GitHub 계정은 Supabase 로그인에도 사용했을 겁니다. 같은 계정이면 됩니다.

---

## GitHub CLI (gh) 설치 및 로그인

클코가 GitHub에 코드를 올리려면 **gh CLI**라는 도구가 필요합니다.  
`gh`는 터미널에서 GitHub를 사용할 수 있게 해주는 프로그램입니다.

### 설치

```
winget install --id GitHub.cli
```

`winget`이 안 된다면? (Windows 10 구버전에서는 winget이 없을 수 있습니다)

1. https://cli.github.com 에 접속
2. Download for Windows 클릭
3. 설치 파일 실행 → Next → Install → Finish
4. PowerShell을 새로 열고 아래 명령어로 확인

**설치 확인:**

```
gh --version
```

### 로그인

```
gh auth login
```

아래처럼 물어봅니다. 하나씩 선택해주세요:

```
? What account do you want to log into?  →  GitHub.com
? What is your preferred protocol?       →  HTTPS
? Authenticate Git with your GitHub credentials?  →  Yes
? How would you like to authenticate?    →  Login with a web browser
```

마지막에 8자리 코드가 나옵니다. 브라우저가 열리면 그 코드를 입력하고 Authorize 버튼을 누르세요.

```
✓ Authentication complete.
```

이 메시지가 나오면 성공입니다!

---

## 클코에게 GitHub 올리기 시키기

여기가 이 챕터의 핵심입니다.  
위에서 배운 init, add, commit, push를 직접 칠 필요 없습니다.

### 프롬프트

```
이 프로젝트 GitHub에 올려줘.
저장소 이름은 goguma-market으로 해줘.
```

클코가 알아서 해주는 것들:

1. `git init` — 프로젝트를 Git으로 관리 시작
2. `.gitignore` 생성 — 올리면 안 되는 파일 자동 제외
3. `git add .` + `git commit` — 파일 담고 포장
4. GitHub에 새 저장소(repository) 생성
5. `git push` — 코드 업로드

### 결과 확인

클코가 완료하면 GitHub 주소를 알려줍니다:

```
https://github.com/내사용자명/goguma-market
```

이 주소를 브라우저에서 열어보세요. 내 코드가 인터넷에 올라가 있습니다!

---

## 이후 작업할 때 — 코드 변경 후 GitHub에 반영

프로젝트를 수정한 후에도 클코에게 한 마디면 됩니다:

```
지금까지 작업한 거 GitHub에 올려줘
```

또는 클코가 작업을 마치면 자동으로 "커밋하겠습니까?"라고 물어보기도 합니다.  
**Y(예)**를 선택하면 됩니다.

---

## 자주 발생하는 문제

| 증상 | 원인 | 해결 |
|---|---|---|
| `gh: command not found` | gh CLI 미설치 | `winget install --id GitHub.cli` 후 터미널 재시작 |
| gh auth login 시 브라우저 안 열림 | 기본 브라우저 문제 | 터미널에 나온 URL을 직접 복사해서 브라우저에 붙여넣기 |
| `git: command not found` | Git 미설치 | https://git-scm.com 에서 설치 |
| Permission denied | GitHub 로그인 안 됨 | `gh auth login` 다시 실행 |
| repository not found | 저장소 이름 오타 | 클코에게 "GitHub 저장소 다시 만들어줘" |
| Author identity unknown | Git 이름/이메일 미설정 | 위의 `git config` 명령어 실행 |

---

## 확인 체크리스트

- [ ] `git --version` 명령어가 정상 동작하는가?
- [ ] `git config --global user.name` 에 내 이름이 설정됐는가?
- [ ] `gh --version` 명령어가 정상 동작하는가?
- [ ] `gh auth status` 를 실행하면 "Logged in" 이 나오는가?
- [ ] 테스트로 아무 프로젝트나 GitHub에 올려보고, 브라우저에서 확인했는가?

---

## 핵심 정리

1. **Git** = 코드의 세이브 포인트 (내 PC에서 변경 기록 관리)
2. **GitHub** = 세이브 데이터의 클라우드 백업 (인터넷에 코드 저장)
3. **gh CLI** = 터미널에서 GitHub를 사용하게 해주는 도구
4. 클코에게 "GitHub에 올려줘" 한 마디면 init → add → commit → push를 전부 해줌
5. 배포(Vercel)할 때 GitHub에 코드가 올라가 있어야 하므로, 지금 익숙해지면 나중이 편함

---

> 다음 챕터: **CLAUDE.md** — 클코에게 주는 프로젝트 설명서를 만들어봅니다.
