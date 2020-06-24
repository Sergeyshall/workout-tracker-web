import React from "react";

const LoaderWrapper = (props) => {
  const { children, isLoading } = props;
  return isLoading ? <div>Loading...</div> : <>{children}</>
};

export default LoaderWrapper;
