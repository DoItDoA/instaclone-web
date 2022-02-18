import { createGlobalStyle } from "styled-components";
import reset from "styled-reset";

export const lightTheme = {
  accent: "#0095f6",
  bgColor: "#FAFAFA",
  fontColor: "rgb(38, 38, 38)",
  borderColor: "rgb(219, 219, 219)",
};

export const darkTheme = {
  fontColor: "white",
  bgColor: "#000",
};

export const GlobalStyles = createGlobalStyle`
    ${reset} // css 리셋
    input {
      all:unset;
    }
    * {
      box-sizing:border-box;
    }
    body {
        background-color:${(props) => props.theme.bgColor};
        font-size:14px;
        font-family:'Open Sans', sans-serif;
        color:${(props) => props.theme.fontColor};
    } // 글로벌 스타일은 그냥 css쓰는게 아니라 body안에 넣어줘야 적용이 된다. 만약 form 전체에 적용하고 싶으면 form{} 만들어 적용시킨다
    a {
      text-decoration: none;
      color:inherit;
    }
`;
