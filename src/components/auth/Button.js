import styled from "styled-components";

const Button = styled.input`
  border: none;
  margin-top: 12px;
  border-radius: 3px;
  background-color: ${(props) => props.theme.accent};
  color: white;
  text-align: center;
  padding: 8px 0px;
  font-weight: 600;
  width: 100%;
  opacity: ${(props) => (props.disabled ? "0.3" : "1")};
`;

// const Button = (props) => <SButton {...props} />; // type과 value 등 넘겨받는다

export default Button;
