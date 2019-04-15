const validate = (params: string[], data: Obj): string => {
  for (let i = 0; i < params.length; i++) {
    const param = params[i];
    if (!(param in data)) {
      return param;
    }
  }

  return '';
};

export default validate;
