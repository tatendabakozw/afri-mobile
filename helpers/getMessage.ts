const getMessage = (err: any) => {
    return err.response && err.response.data && err.response.data.message
      ? err.response.data.message
      : err.message;
  };
  
  export { getMessage };