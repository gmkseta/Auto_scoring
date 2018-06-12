# 개별연구 

## Node js 를 이용한 프로그래밍 실습 문제 자동 채점기

* ### 조원

  * 2013111999 김성준

  * 2014112062 양준현

  * 2014112032 최동혁



## Example Homepage

<a href="http://13.124.164.139:3000" >Example Homepage Link</a>
 



## Getting Started

### 1. Install Node js & mongodb

* `sudo apt-get update`
* `sudo apt-get install nodejs mongodb npm`

### 2. Install NPM module

*  `npm install`

### 4. Change compile-run module into custom module

* `cp -r compile-run/ node-modules/ `

### 5. Execute.

* `node index.js`



## Usage Example



#### <메인 홈 화면>
<img src="https://i.imgur.com/dxSYnbv.png" width="100%"></img>





* nav 바 쪽에 SIgn Up과 Login 창이 있다
*  현재 소스에서는 권한 설정이 구현되어있지 않으므로 관리자만 회원가입하여 로그인하는 구조이다.





#### <관리자의 프로그래밍 실습 문제 등록>
<img src="https://i.imgur.com/L5X7yWG.png" width="100%"></img>


* 관리자 계정으로 로그인 후, 게시판 - New 에서 문제를 제출한다.

  * Title  : 문제 제목 

  * Body : 문제에 관한 설명 및 Input 값의 형식 Output 값의 형식에 대한 설명

  * Input :  문제 정답 체크를 위한 input 값 입력

    * input 값을 넣을 때 만약 여러개의 input 값을 넣어야 한다면 '/' 을 통해 구분한다.

    * 문자열을 넣고싶다면 앞에 s를 붙인 뒤 입력한다

      * ex) input값 두개에 대한  합 코드를 짜는 실습 문제 

        ​	-> input : 34/73 

        ​	-> 34와 73이 들어간다.

      * ex) Text String 하나와 Pattern String 하나가 주워지고 이에대한 문자열 탐색 코드 실습문제

        ​	-> input: sThis is Text String Single Study /sSi 

        ​	-> "This is Text String Single Study", "Si" 가 들어간다.

  * 첨부파일 : 문제에 대한 정답 코드를 첨부

  * submit : 제출

  

  #### <학습자의 코드 제출>
<img src="https://i.imgur.com/U4GIWqL.png" width="100%"></img>


* 위와 같이 실습문제가 올라와 있을 때 제출 하고자 하는 문제의 게시판에 들어간다.


<img src="https://i.imgur.com/3ywKKmE.png" width="100%"></img>


* 첨부파일 에 자신이 검사받고자 하는 코드 파일 첨부 후 submit으로 제출한다.



#### <결과 화면 확인>
<img src="https://i.imgur.com/1Xug67T.png" width="100%"></img>


* 정답일 때의 화면이다.


<img src="https://i.imgur.com/VRUcYMe.png" width="100%"></img>


* 오답일 때의 화면이다







## 참고 문헌

[1] 윤인성. 2016. “모던 웹을 위한 Node.js 프로그래밍 3판”. 한빛 미디어.

[2] Node Package Model : compile-run https://www.npmjs.com/package/compile- run 

[3] <https://www.a-mean-blog.com/ko/blog/Node-JS-첫걸음/>게시판-만들기



