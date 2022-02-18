import styled from "styled-components";
import {
  faFacebookSquare,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import routes from "../routes";
import AuthLayout from "../components/auth/AuthLayout";
import Button from "../components/auth/Button";
import Separator from "../components/auth/Separator";
import Input from "../components/auth/Input";
import FormBox from "../components/auth/FormBox";
import BottomBox from "../components/auth/BottomBox";
import PageTitle from "../components/PageTitle";
import { useForm } from "react-hook-form";
import FormError from "../components/auth/FormError";
import gql from "graphql-tag";
import { useMutation } from "@apollo/client";
import { logUserIn } from "../apollo";
import { useLocation } from "react-router-dom";

const FacebookLogin = styled.div`
  color: #385285;
  span {
    margin-left: 10px;
    font-weight: 600;
  }
`;

const Notification = styled.div`
  margin-top: 10px;
  color: #2ecc71;
`;

const LOGIN_MUTATION = gql`
  mutation loginProcess($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      ok
      token
      error
    }
  }
`; // loginProcess 이름은 백엔드랑 연결안되기 때문에 아무거나 해도 된다. backend 설정에 맞춰서 이름과 변수 출력을 적는다

function Login() {
  const location = useLocation(); // signUp.js의 history.push로부터 message 사용. HashRouter는 적용 안됨

  const {
    register,
    watch,
    handleSubmit,
    formState,
    getValues,
    setError,
    clearErrors,
  } = useForm({
    mode: "onChange", //  mode:"onChange"는 input에서 바뀔 때마다 formState 동작, mode:"onBlur"는 input에서 벗어날 때 동작
    defaultValues: {
      username: location?.state?.username || "", // 오류날수 있으니 값이 없으면 빈값처리
      password: location?.state?.password || "",
    }, // SignUp.js로부터 값을 가져와 자동으로 세팅하여 로그인하기
  }); // form처리 쉽게 해줌,

  // console.log(watch()); // watch를 이용하여 register에 등록된 input의 입력값을 볼 수 있다

  const onCompleted = (data) => {
    const {
      login: { ok, error, token },
    } = data;

    if (!ok) {
      setError("result", {
        message: error,
      });
    }

    if (token) {
      logUserIn(token);
    }
  }; // useMutation의 콜백함수로서 실행된다

  const [login, { loading }] = useMutation(LOGIN_MUTATION, {
    onCompleted,
  }); // login함수가 실행되면 useMutation이 LOGIN_MUTATION 호출 , 두번째 인자는 여러가지 옵션이 있다. onCompleted는 mutation 결과를 받아 온 후 실행되는 콜백함수. variables는 변수 입력 등이 있다

  // 로그인 버튼 누를시 실행
  const onSubmitValid = () => {
    if (loading) {
      return;
    } // 더블클릭 방지 로딩중일 때 실행되면 리턴

    const { username, password } = getValues(); // 각 개체의 값 가져오기

    login({
      variables: {
        username,
        password,
      },
    }); // 변수(username, password)를 담은 login 함수가 실행되면 useMutation이 실행된다(variables입력 반드시 해야함). 변수는 useMutation 두번째 인자에도 넣을 수 있다
  };

  const clearLoginError = () => {
    clearErrors("result"); // 입력할 때마다 오류클리어해서 로그인버튼 disabled 해제
  };

  // const onSubmitInvalid = (data) => {
  //   console.log(data, "invalid");
  // }; // handleSubmit의 두번째 인자

  return (
    <AuthLayout>
      <PageTitle title="로그인" />
      <FormBox>
        <div>
          <FontAwesomeIcon icon={faInstagram} size="3x" />
        </div>
        <Notification>{location?.state?.message}</Notification>
        {/* handleSubmit은 submit을 받았을 때 form이 유효하면 첫번째 인자를 호출하고, 아니면 두번째 인자를 호출 */}
        <form onSubmit={handleSubmit(onSubmitValid)}>
          <Input
            {...register("username", {
              required: "계정을 입력해주세요.", // 필수 요소로 빠지면 form이 유효하지 않아 message가 handleSubmit의 onSubmitInvalid로 전송거나 formState.errors로 전송됨
              minLength: {
                value: 5,
                message: "계정이름이 5자 이상이어야 합니다.",
              },
              //validate: (currentValue) => currentValue.includes("pot"), // includes에 해당 글자가 안들어가면 return시 false여서 form이 유효하지 않음
            })} // react-hook-form이 7.0.0이상일 때 쓰는 표현 "username"은 input의 name을 가리킨다
            type="text"
            onFocus={clearLoginError} // onChange시 useForm의 onChange와 겹침
            placeholder="계정명"
            hasError={Boolean(formState.errors?.username?.message)}
            autoFocus
          />
          {/* 입력이 유효하지 않을 때 errors의 name에 message가 전송됨 */}
          <FormError message={formState.errors?.username?.message} />
          <Input
            {...register("password", { required: "비밀번호를 입력해주세요." })}
            type="password"
            placeholder="비밀번호"
            onFocus={clearLoginError}
            hasError={Boolean(formState.errors?.password?.message)}
          />
          <FormError message={formState.errors?.password?.message} />
          {/* formState의 isValid는 form의 입력이 유효하면 true 반환 */}
          <Button
            type="submit"
            value={loading ? "로그인 중..." : "로그인"}
            disabled={!formState.isValid || loading}
          />
          <FormError message={formState.errors?.result?.message} />
        </form>
        <Separator />
        <FacebookLogin>
          <FontAwesomeIcon icon={faFacebookSquare} />
          <span>페이스북으로 로그인</span>
        </FacebookLogin>
      </FormBox>
      <BottomBox
        cta="계정이 없나요?"
        linkText="회원가입"
        link={routes.signUp}
      />
    </AuthLayout>
  );
}

export default Login;
