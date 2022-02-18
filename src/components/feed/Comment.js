import { gql, useMutation } from "@apollo/client";
import React from "react";
//import sanitizeHtml from "sanitize-html";
import PropTypes from "prop-types";
import styled from "styled-components";
import { FatText } from "../shared";
import { Link } from "react-router-dom";

const CommentContainer = styled.div`
  margin-bottom: 7px;
  button {
    border: none;
    background-color: inherit;
    cursor: pointer;
    span {
      font-size: 7px;
    }
  }
`;

const CommentCaption = styled.span`
  margin-left: 10px;
  a {
    background-color: inherit;
    color: ${(props) => props.theme.accent};
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
  }
`;

const DELETE_COMMENT_MUTATION = gql`
  mutation deleteComment($id: Int!) {
    deleteComment(id: $id) {
      ok
    }
  }
`;

function Comment({ id, photoId, isMine, author, payload }) {
  /*const cleanedPayload = sanitizeHtml(
    payload?.replace(/#[ㄱ-ㅎ|ㅏ-ㅣ|가-힣|\w]+/g, "<mark>$&</mark>"), // payload에 #이 들어간 글자를 바꿔준다. $&는 일치하는 글자 그대로 삽입한다는 뜻이고, mark를 씌워 강조
    {
      allowedTags: ["mark"], // sanitizeHtml가 mark태그만 허용하고 나머지는 태그가 들어오면 지움
    }
  );*/

  const updateDeleteComment = (cache, result) => {
    const {
      data: {
        deleteComment: { ok },
      },
    } = result;
    if (ok) {
      cache.evict({ id: `Comment:${id}` }); // 해당 캐시 제거
      cache.modify({
        id: `Photo:${photoId}`,
        fields: {
          commentNumber(prev) {
            return prev - 1;
          },
        },
      });
    }
  };

  const [deleteCommentMutation] = useMutation(DELETE_COMMENT_MUTATION, {
    variables: {
      id,
    },
    update: updateDeleteComment,
  });

  const onDeleteClick = () => {
    deleteCommentMutation();
  };

  return (
    <CommentContainer>
      <Link to={`/users/${author}`}>
        <FatText>{author}</FatText>
      </Link>
      <CommentCaption>
        {/* 
        <CommentCaption
        dangerouslySetInnerHTML={{
          __html: cleanedPayload, // cleanedPayload가 텍스트로만 보지 않고 브라우저가 html로 해석하고 만들어준다.
        }} // dangerouslySetInnerHTML은 텍스트가 아니라 html로 해석될 수 있게 만들어준다. 모든 element는 이 prop를 가지고 있다. 주의할점은 유저가 임의로 html태그를 댓글에 달아서 이용가능
      /> 
      */}

        {/* payload를 공백별로 나눈다음 map으로 #이 들어가면 link 달기 */}
        {payload?.split(" ").map((word, index) =>
          // test는 정규표현식이 만족하는지 판별하고 맞으면 true 반환
          /#[ㄱ-ㅎ|ㅏ-ㅣ|가-힣|\w]+/.test(word) ? (
            <React.Fragment key={index}>
              <Link to={`/hashtags/${word}`}>{word}</Link>{" "}
            </React.Fragment>
          ) : (
            // <></>에 key를 사용해야할 시 React.Fragment사용
            <React.Fragment key={index}>{word} </React.Fragment>
          )
        )}
      </CommentCaption>
      {isMine ? (
        <button onClick={onDeleteClick}>
          <span>❌</span>
        </button>
      ) : null}
    </CommentContainer>
  );
}

Comment.propTypes = {
  isMine: PropTypes.bool,
  id: PropTypes.number,
  photoId: PropTypes.number,
  author: PropTypes.string.isRequired,
  payload: PropTypes.string.isRequired,
};

export default Comment;
