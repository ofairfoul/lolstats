export default (originalPath, params = {}) => {
  let path = originalPath;
  Object.keys(params).forEach(k => {
    const re = new RegExp(`:${k}`);
    if (re.test(path)) {
      path = path.replace(
        re,
        encodeURIComponent(params[k]),
      );
    }
  });
  return path;
};

