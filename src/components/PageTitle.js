import { PropTypes } from "prop-types";
import { Helmet } from "react-helmet-async";

function PageTitle({ title }) {
  return (
    <Helmet>
      <title>{title} | 인스타그램</title>
    </Helmet>
  ); // Helmet은 html의 head부분을 다룬다
}

PageTitle.propTypes = {
  title: PropTypes.string.isRequired,
};

export default PageTitle;
