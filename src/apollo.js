import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  makeVar,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import routes from "./routes";

const TOKEN = "token";
const DARK_MODE = "DARK_MODE";

// 모든 컴포넌트가 공통으로 사용가능하게 변수 설정
export const isLoggedInVar = makeVar(Boolean(localStorage.getItem(TOKEN))); // 로그인 여부 설정, localStorage로부터 token이 있으면 true 없으면 false
export const darkModeVar = makeVar(
  Boolean(localStorage.getItem(DARK_MODE) === "enabled")
);

export const enableDarkMode = () => {
  localStorage.setItem(DARK_MODE, "enabled");
  darkModeVar(true);
};

export const disableDarkMode = () => {
  localStorage.removeItem(DARK_MODE);
  darkModeVar(false);
};

export const logUserIn = (token) => {
  localStorage.setItem(TOKEN, token); // 브라우저의 localStorage에 저장
  isLoggedInVar(true);
};

export const logUserOut = (history) => {
  localStorage.removeItem(TOKEN); // 브라우저의 localStorage에서 삭제
  history?.replace(routes.home, null); // history.push와 같이 이동하는 기능이지만 히스토리에 쌓이는 스택이 다르다(자세한거는 자료나 넷참조), 로그아웃 후 뒤로가기해서 원래페이지 이동 방지
  window.location.reload(); // 새로고침 실행
};

const httpLink = createHttpLink({
  uri: "http://localhost:4000/graphql",
}); // http 링크 생성

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers, // 기존의 헤더정보
      token: localStorage.getItem(TOKEN), // headers에 LocalStrage에 있는 token을 가져와 token 객체를 추가한다
    },
  };
});

// 백엔드 연결
export const client = new ApolloClient({
  link: authLink.concat(httpLink), // Apollo 클라이언트가 데이터 소스와 소통한다. 백엔드 링크와 인증헤더 결합
  cache: new InMemoryCache({
    typePolicies: {
      User: {
        keyFields: (obj) => `User:${obj.username}`, // 키를 username으로 변경시킨다. ``에서 User파트는 명칭 아무거나 작성가능
      }, // 캐시에서 User 대상
    },
  }), // Apollo가 한번 가져온 정보를 기억해서 빠르게 처리
});
