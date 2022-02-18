import { ApolloProvider, useReactiveVar } from "@apollo/client";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { client, darkModeVar, isLoggedInVar } from "./apollo";
import routes from "./routes";
import Home from "./screens/Home";
import Login from "./screens/Login";
import NotFound from "./screens/NotFound";
import SignUp from "./screens/SignUp";
import { darkTheme, GlobalStyles, lightTheme } from "./styles";
import Layout from "./components/Layout";
import Profile from "./screens/Profile";

function App() {
  const isLoggedIn = useReactiveVar(isLoggedInVar); // 공통변수 사용
  const darkMode = useReactiveVar(darkModeVar);

  return (
    <>
      {/* 백엔드 연결하기위해 설정 */}
      <ApolloProvider client={client}>
        {/* HelmetProvider이용하여 하위 컴포넌트의 <Helmet>을 사용할 수 있다 */}
        <HelmetProvider>
          {/* ThemeProvider를 이용하면 하위 컴포넌트의 styled에 props.theme이용하여 객체값을 줄 수 있다 */}
          <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
            <GlobalStyles />
            <Router>
              <Switch>
                <Route path={routes.home} exact>
                  {isLoggedIn ? (
                    <Layout>
                      <Home />
                    </Layout>
                  ) : (
                    <Login />
                  )}
                </Route>
                {!isLoggedIn ? (
                  <Route path={routes.signUp}>
                    <SignUp />
                  </Route>
                ) : null}
                <Route path={`/users/:username`}>
                  <Layout>
                    <Profile />
                  </Layout>
                </Route>
                <Route>
                  <NotFound />
                </Route>
              </Switch>
            </Router>
          </ThemeProvider>
        </HelmetProvider>
      </ApolloProvider>
    </>
  );
}

export default App;
