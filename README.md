# 텃씨노트(TeotssiNote) v0.3 — Supabase 연동 버전

기존 v0.2 UI를 유지하면서 **Google 로그인 + 계정별 식물·숲 기록·사진 저장 + 기기 간 동기화**를 구현한 버전입니다.

> 프로젝트 구조와 업로드 방식은 기존 GitHub Pages 웹앱을 그대로 사용합니다. **클라우드 기능이 실제 계정에서 정상 동작하는지는 배포 후 직접 테스트해야 합니다.**

## 배포 전 확인 (중요)

1. Supabase `TeotssiNote` 프로젝트에서 기존 6개 테이블과 비공개 Storage 버킷 `teotssi-photos` 및 RLS 정책이 생성되어 있어야 합니다.
2. 별도 제공한 **`SUPABASE_추가설정.sql`** 전체를 **Supabase → SQL Editor → + → 붙여넣기 → Run**으로 한 번 실행해야 합니다. 이 SQL은 `forest_sites`에 두 컬럼을 추가하고 `reflections` 테이블을 생성합니다. 기존 관찰 기록을 삭제하지 않습니다.
3. Supabase **Authentication → URL Configuration**에서 다음 주소를 확인합니다.
   - Site URL: `https://stepaspreyg-blip.github.io/teotssinote/`
   - Redirect URLs에도 **동일한 정확한 주소를 추가**하면 OAuth 리디렉션 오류를 줄일 수 있습니다.
4. Supabase **Authentication → Sign In / Providers → Google**이 Enabled인지 확인합니다.
5. Google Cloud OAuth 동의 화면이 **Testing(테스트 중)** 상태라면 **Google Auth Platform → Audience → Test users**에 실제 로그인에 사용할 Google 계정을 추가합니다. 테스트 사용자로 등록되지 않은 계정은 인증에 실패할 수 있습니다.

## GitHub에 업로드할 파일

**압축을 풀고 이 README를 포함한 아래 7개 파일을 저장소 `stepaspreyg-blip/teotssinote`의 최상위에 업로드합니다.**

| 파일 | 역할 |
|---|---|
| `index.html` | 웹앱 시작 파일 및 Supabase JS 로딩 |
| `styles.css` | 기존 반응형 디자인 |
| `app.js` | 페이지·폼·로그인 상태 및 동기화 UI |
| `storage.js` | 로그인 전 기기 저장 방식 |
| `config.js` | Supabase 프로젝트 URL과 **공개용 Publishable key** |
| `cloud.js` | 인증·DB·비공개 사진 저장 연동 |
| `README.md` | 현재 문서 |

기존 GitHub 저장소에서 `Add file → Upload files`를 누르고 위 파일을 업로드한 뒤 `Commit changes`를 선택합니다. Pages 설정은 이미 되어 있으므로 새로 만들 필요가 없습니다.

`SUPABASE_추가설정.sql`은 **GitHub에 업로드하는 파일이 아니라 Supabase에서 실행하는 별도 설정 파일**입니다.

## 이용 흐름

1. 사용자가 GitHub Pages 웹앱을 열면 **로그인 전 체험 모드**로 시작합니다.
2. `Google 로그인`을 누르면 Supabase → Google OAuth → GitHub Pages로 돌아옵니다.
3. 로그인 성공 시 `클라우드 동기화` 상태가 나타나며 계정별 데이터를 불러옵니다.
4. 식물을 등록하고 성장관찰 기록을 추가하면 서버 DB에 저장합니다. 촬영 사진은 비공개 버킷에 업로드하고 만료되는 서명 URL로 표시합니다.
5. 다른 기기에서 **같은 Google 계정**으로 로그인하면 기록을 다시 불러옵니다.
6. 로그인 전 이 브라우저에 저장한 관찰 기록은 **자동 전송하지 않습니다.** `설정 및 안내 → 이 기기 기록 클라우드로 가져오기`로 직접 선택해 가져올 수 있습니다.
7. 로그아웃하면 기존 로그인 전 브라우저 체험 기록으로 돌아옵니다. 클라우드 기록은 남아 있습니다.

## 구현 상태

**실제 연동 코드 작성됨**
- Google OAuth 리디렉션 및 로그인/로그아웃
- 사용자별 식물 정보 및 관찰일지 CRUD
- 사용자별 숲 관찰 장소와 사진·메모 CRUD
- 비교·탐구 메모 저장
- 업로드 사진 자동 압축 및 최대 2MB 제한 확인
- 비공개 사진 경로 `사용자UID/카테고리/파일명` 및 서명 URL
- JSON 기록 백업/불러오기, 기존 브라우저 데이터 선택적 클라우드 이관
- 기존 화면과 산림학습 콘텐츠 유지

**아직 미구현 또는 미검증**
- 친구별 실제 성장일지 열람: 프로필의 고유 친구 코드 표시는 가능하지만, 친구 요청·수락 UI와 타인 기록 접근 허용 정책은 미구현. 시연 친구는 실제 이용자 데이터가 아닙니다.
- 기관 고정카메라 연계: 실제 사진이 아닌 **가상 삽화** 시연만 제공.
- Supabase 실서버에 연결한 Google OAuth·사진 업로드·두 기기 동기화: 사용자 계정에서 최종 테스트 필요.
- 다른 기기에서 같은 계정으로 동시에 수정할 경우 충돌 병합: 현재는 마지막으로 저장한 결과가 우선할 수 있습니다.

## 보안·비용

- `config.js`의 Publishable key는 **브라우저에서 공개 사용하도록 설계된 키**입니다. DB·Storage 접근 범위는 Supabase의 사용자 인증과 RLS 정책으로 제한됩니다.
- **Google Client Secret, `sb_secret_...`, `service_role` 키, DB 비밀번호는 절대 소스코드나 GitHub에 넣지 않습니다.**
- Storage 버킷은 `Public OFF`를 유지하며 공개 사진 URL을 사용하지 않습니다.
- 텃씨노트는 현재 개인 기록을 저장하며, 친구에게 실제 기록을 노출하지 않습니다.
- Supabase Free 저장 공간 및 트래픽 한도가 있으므로 사진을 압축합니다. 초과 시 기능이 제한되거나 별도 조치가 필요할 수 있습니다.

## 문제 해결

- **Google 로그인 후 `403 access_blocked`**: Google OAuth 테스트 사용자 목록을 점검합니다.
- **로그인 후 로컬호스트로 이동**: Supabase `Site URL`, `Redirect URLs`, Google Cloud `Authorized redirect URI`를 각각 확인합니다.
- **`reflections` 또는 `started_on` 컬럼 오류**: 별도 SQL 추가 설정 파일을 실행했는지 확인합니다.
- **사진 업로드 권한 오류**: `teotssi-photos`가 비공개인지, Storage RLS 정책에서 사용자 UID 폴더로 접근을 허용했는지 확인합니다.
- **로그인해도 기록이 없음**: 예전 브라우저 체험 모드 기록은 자동 이동하지 않습니다. 같은 기기라면 설정에서 가져오기, 다른 출처(다운로드 HTML 등)에서 작성했다면 JSON 백업→가져오기를 사용합니다.
- **앱이 계속 기기 모드로 동작**: 외부 `supabase-js@2` 스크립트가 차단되지 않았는지 확인합니다. GitHub Pages에서 인터넷에 연결되어야 합니다.

## 참고

Supabase 공식 문서: https://supabase.com/docs/reference/javascript/installing
OAuth 리디렉션: https://supabase.com/docs/guides/auth/redirect-urls
Storage 권한: https://supabase.com/docs/guides/storage/security/access-control
API 키 구분: https://supabase.com/docs/guides/getting-started/api-keys
