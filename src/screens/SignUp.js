import { faInstagram } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import routes from "../routes";
import AuthLayout from "../components/auth/AuthLayout";
import Button from "../components/auth/Button";
import Input from "../components/auth/Input";
import FormBox from "../components/auth/FormBox";
import BottomBox from "../components/auth/BottomBox";
import styled from "styled-components";
import { FatLink } from "../components/shared";
import PageTitle from "../components/PageTitle";
import gql from "graphql-tag";
import { useForm } from "react-hook-form";
import { useMutation } from "@apollo/client";
import { useHistory } from "react-router-dom";

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Subtitle = styled(FatLink)`
  font-size: 16px;
  text-align: center;
  margin-top: 10px;
`;

const CREATE_ACCOUNT_MUTATION = gql`
  mutation createAccount(
    $firstName: String!
    $lastName: String
    $username: String!
    $email: String!
    $password: String!
  ) {
    createAccount(
      firstName: $firstName
      lastName: $lastName
      username: $username
      email: $email
      password: $password
    ) {
      ok
      error
    }
  }
`;

function SignUp() {
  const history = useHistory();

  const { register, handleSubmit, formState, getValues } = useForm({
    mode: "onChange",
  });

  const onCompleted = (data) => {
    const { username, password } = getValues();
    const {
      createAccount: { ok },
    } = data;
    if (!ok) {
      return;
    }
    history.push(routes.home, {
      message: "계정이 생성되었습니다. 로그인 해주세요.",
      username,
      password,
    }); // home 이동시 message와 username, password전송
  };

  const [createAccount, { loading }] = useMutation(CREATE_ACCOUNT_MUTATION, {
    onCompleted,
  });

  const onSubmitValid = (data) => {
    if (loading) {
      return;
    }
    // form이 유효하면 data가 보내진다
    createAccount({
      variables: {
        ...data,
      },
    });
  };

  return (
    <AuthLayout>
      <PageTitle title="회원가입" />
      <FormBox>
        <HeaderContainer>
          <FontAwesomeIcon icon={faInstagram} size="3x" />
          <Subtitle>회원가입하여 친구들과 공유해요</Subtitle>
        </HeaderContainer>
        <form onSubmit={handleSubmit(onSubmitValid)}>
          <Input
            {...register("firstName", {
              required: "이름 입력은 필수입니다.",
            })}
            type="text"
            placeholder="이름"
            autoFocus
          />
          <Input {...register("lastName")} type="text" placeholder="성씨" />
          <Input
            {...register("email", {
              required: "이메일 입력은 필수입니다.",
            })}
            type="text"
            placeholder="이메일"
          />
          <Input
            {...register("username", {
              required: "계정이름 입력은 필수입니다.",
              minLength: {
                value: 5,
                message: "계정이름이 5자 이상이어야 합니다.",
              },
            })}
            type="text"
            placeholder="계정명"
          />
          <Input
            {...register("password", {
              required: "비밀번호 입력은 필수입니다.",
            })}
            type="password"
            placeholder="비밀번호"
          />
          <Button
            type="submit"
            value={loading ? "가입 중..." : "가입하기"}
            disabled={!formState.isValid || loading}
          />
        </form>
      </FormBox>
      <BottomBox cta="계정이 있나요?" linkText="로그인" link={routes.home} />
    </AuthLayout>
  );
}

export default SignUp;

/*
계정명 입력시 5자 이하면 오류창 뜨기

같은 계정이면 오류창 뜨기

비밀번호 확인 만들기
*/
